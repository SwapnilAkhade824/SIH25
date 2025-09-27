#!/usr/bin/env python3
"""
Kolam Feature Extractor - OpenCV Implementation (Fixed Version)
SIH 2025 Problem Statement ID 25107

Fixed version that handles Unicode encoding issues properly.
"""

import cv2
import numpy as np
import json
import math
from collections import defaultdict
import argparse

class KolamFeatureExtractor:
    """
    Main class for extracting features from Kolam patterns using OpenCV
    """
    
    def __init__(self):
        self.image = None
        self.gray = None
        self.binary = None
        self.features = {}
        
    def load_image(self, image_path):
        """Load and validate the input image"""
        try:
            self.image = cv2.imread(image_path)
            if self.image is None:
                raise ValueError(f"Could not load image: {image_path}")
            
            self.gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
            print(f"Image loaded successfully: {self.gray.shape}")
            return True
            
        except Exception as e:
            print(f"Error loading image: {e}")
            return False
    
    def preprocess_image(self):
        """Preprocess image for optimal feature extraction"""
        # Step 1: Reduce noise
        blurred = cv2.GaussianBlur(self.gray, (5, 5), 0)
        
        # Step 2: Adaptive thresholding for varying lighting conditions
        self.binary = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Step 3: Morphological operations to clean up
        kernel = np.ones((3, 3), np.uint8)
        self.binary = cv2.morphologyEx(self.binary, cv2.MORPH_CLOSE, kernel)
        self.binary = cv2.morphologyEx(self.binary, cv2.MORPH_OPEN, kernel)
        
        print("Image preprocessing completed")
        return self.binary
    
    def detect_dots(self):
        """Detect dots (pulli) in Kolam patterns using HoughCircles"""
        circles = cv2.HoughCircles(
            self.gray,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,
            param1=50,
            param2=30,
            minRadius=3,
            maxRadius=30
        )
        
        dots = []
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")
            for (x, y, r) in circles:
                dots.append({
                    'center': (int(x), int(y)),
                    'radius': int(r),
                    'area': math.pi * r * r
                })
        
        self.features['dots'] = dots
        print(f"Detected {len(dots)} dots")
        return dots
    
    def detect_lines(self):
        """Detect straight lines using Hough Transform"""
        edges = cv2.Canny(self.binary, 50, 150, apertureSize=3)
        
        lines = cv2.HoughLinesP(
            edges,
            rho=1,
            theta=np.pi/180,
            threshold=30,
            minLineLength=20,
            maxLineGap=10
        )
        
        line_segments = []
        if lines is not None:
            for line in lines:
                x1, y1, x2, y2 = line[0]
                length = np.sqrt((x2-x1)**2 + (y2-y1)**2)
                angle = np.degrees(np.arctan2(y2-y1, x2-x1))
                
                line_segments.append({
                    'start': (int(x1), int(y1)),
                    'end': (int(x2), int(y2)),
                    'length': float(length),
                    'angle': float(angle)
                })
        
        self.features['lines'] = line_segments
        print(f"Detected {len(line_segments)} line segments")
        return line_segments
    
    def detect_contours(self):
        """Detect and analyze contours for shape recognition"""
        contours, hierarchy = cv2.findContours(
            self.binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        
        shapes = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area < 50:  # Filter out small noise
                continue
            
            # Approximate contour to polygon
            perimeter = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
            
            # Calculate centroid
            M = cv2.moments(contour)
            if M['m00'] != 0:
                cx = int(M['m10'] / M['m00'])
                cy = int(M['m01'] / M['m00'])
            else:
                cx = cy = 0
            
            # Classify shape based on vertices
            vertices = len(approx)
            if vertices == 3:
                shape_type = "triangle"
            elif vertices == 4:
                shape_type = "quadrilateral"
            elif vertices > 8:
                shape_type = "circle"
            else:
                shape_type = f"{vertices}-sided polygon"
            
            shapes.append({
                'vertices': vertices,
                'area': float(area),
                'perimeter': float(perimeter),
                'centroid': (cx, cy),
                'shape_type': shape_type
            })
        
        self.features['shapes'] = shapes
        print(f"Detected {len(shapes)} shapes")
        return shapes
    
    def analyze_symmetry(self):
        """Analyze pattern symmetry"""
        if self.binary is None:
            return {}
        
        height, width = self.binary.shape
        
        # Horizontal symmetry (top-bottom)
        top_half = self.binary[:height//2, :]
        bottom_half = self.binary[height//2:, :]
        bottom_flipped = np.flipud(bottom_half)
        
        min_h = min(top_half.shape[0], bottom_flipped.shape[0])
        horizontal_sim = np.mean(top_half[:min_h, :] == bottom_flipped[:min_h, :])
        
        # Vertical symmetry (left-right)
        left_half = self.binary[:, :width//2]
        right_half = self.binary[:, width//2:]
        right_flipped = np.fliplr(right_half)
        
        min_w = min(left_half.shape[1], right_flipped.shape[1])
        vertical_sim = np.mean(left_half[:, :min_w] == right_flipped[:, :min_w])
        
        # Rotational symmetry check (180 degrees)
        rotated_180 = np.rot90(self.binary, 2)
        rotational_sim = np.mean(self.binary == rotated_180)
        
        symmetry = {
            'horizontal_symmetry': float(horizontal_sim),
            'vertical_symmetry': float(vertical_sim),
            'rotational_180': float(rotational_sim),
            'is_symmetric': max(horizontal_sim, vertical_sim) > 0.75,
            'symmetry_type': self._classify_symmetry_type(horizontal_sim, vertical_sim, rotational_sim)
        }
        
        self.features['symmetry'] = symmetry
        print(f"Symmetry analysis: {symmetry['symmetry_type']}")
        return symmetry
    
    def _classify_symmetry_type(self, h_sym, v_sym, r_sym):
        """Classify the type of symmetry present"""
        threshold = 0.75
        
        if h_sym > threshold and v_sym > threshold:
            return "bilateral (both axes)"
        elif h_sym > threshold:
            return "horizontal reflection"
        elif v_sym > threshold:
            return "vertical reflection"
        elif r_sym > threshold:
            return "rotational (180 degrees)"
        else:
            return "asymmetric"
    
    def analyze_geometric_patterns(self):
        """Analyze geometric patterns and relationships"""
        patterns = {
            'dominant_angles': [],
            'parallel_lines': 0,
            'perpendicular_lines': 0,
            'grid_structure': False
        }
        
        if 'lines' in self.features and self.features['lines']:
            angles = [line['angle'] for line in self.features['lines']]
            
            # Find dominant angles (group similar angles)
            angle_groups = defaultdict(list)
            for angle in angles:
                # Normalize angle to 0-90 range
                normalized = abs(angle) % 90
                if normalized > 45:
                    normalized = 90 - normalized
                
                # Group angles within 10-degree tolerance
                key = round(normalized / 10) * 10
                angle_groups[key].append(angle)
            
            # Get dominant angles
            dominant = [(angle, len(group)) for angle, group in angle_groups.items() if len(group) >= 2]
            patterns['dominant_angles'] = sorted(dominant, key=lambda x: x[1], reverse=True)[:3]
            
            # Count parallel and perpendicular relationships
            tolerance = 10  # degrees
            lines = self.features['lines']
            for i in range(len(lines)):
                for j in range(i+1, len(lines)):
                    angle_diff = abs(lines[i]['angle'] - lines[j]['angle'])
                    
                    if angle_diff <= tolerance or angle_diff >= (180 - tolerance):
                        patterns['parallel_lines'] += 1
                    elif abs(angle_diff - 90) <= tolerance:
                        patterns['perpendicular_lines'] += 1
        
        # Check for grid structure
        if 'dots' in self.features and len(self.features['dots']) >= 9:
            patterns['grid_structure'] = self._detect_grid_structure()
        
        self.features['geometric_patterns'] = patterns
        print("Geometric analysis completed")
        return patterns
    
    def _detect_grid_structure(self):
        """Detect if dots form a regular grid structure"""
        if len(self.features['dots']) < 9:
            return False
        
        # Extract dot centers
        centers = [dot['center'] for dot in self.features['dots']]
        x_coords = [center[0] for center in centers]
        y_coords = [center[1] for center in centers]
        
        # Check for regular spacing
        x_coords.sort()
        y_coords.sort()
        
        # Calculate spacing differences
        x_diffs = [x_coords[i+1] - x_coords[i] for i in range(len(x_coords)-1)]
        y_diffs = [y_coords[i+1] - y_coords[i] for i in range(len(y_coords)-1)]
        
        # Check if spacing is reasonably regular (coefficient of variation < 0.3)
        if x_diffs and y_diffs:
            x_cv = np.std(x_diffs) / np.mean(x_diffs) if np.mean(x_diffs) > 0 else 1
            y_cv = np.std(y_diffs) / np.mean(y_diffs) if np.mean(y_diffs) > 0 else 1
            return x_cv < 0.3 and y_cv < 0.3
        
        return False
    
    def classify_pattern(self):
        """Classify the Kolam pattern type"""
        dots_count = len(self.features.get('dots', []))
        lines_count = len(self.features.get('lines', []))
        shapes_count = len(self.features.get('shapes', []))
        
        # Classification logic based on element counts and relationships
        if dots_count > 10 and lines_count > dots_count:
            pattern_type = "pulli_kolam"  # Dot-based Kolam
        elif lines_count > 20:
            pattern_type = "kambi_kolam"  # Line-based Kolam
        elif shapes_count > 5:
            pattern_type = "geometric_kolam"  # Shape-based
        else:
            pattern_type = "simple_kolam"
        
        # Determine complexity
        total_elements = dots_count + lines_count + shapes_count
        if total_elements < 10:
            complexity = "simple"
        elif total_elements > 30:
            complexity = "complex"
        else:
            complexity = "moderate"
        
        classification = {
            'pattern_type': pattern_type,
            'complexity_level': complexity,
            'element_count': total_elements,
            'has_dots': dots_count > 0,
            'has_lines': lines_count > 0,
            'has_shapes': shapes_count > 0
        }
        
        self.features['classification'] = classification
        print(f"Pattern classified as: {pattern_type} ({complexity})")
        return classification
    
    def extract_all_features(self, image_path):
        """Main method to extract all features from a Kolam image"""
        print("KOLAM FEATURE EXTRACTION STARTED")
        print("=" * 50)
        
        # Load and preprocess
        if not self.load_image(image_path):
            return None
        
        self.preprocess_image()
        
        # Extract all features
        self.detect_dots()
        self.detect_lines()
        self.detect_contours()
        self.analyze_symmetry()
        self.analyze_geometric_patterns()
        self.classify_pattern()
        
        print("=" * 50)
        print("FEATURE EXTRACTION COMPLETED!")
        
        return self.features
    
    def generate_report(self):
        """Generate a comprehensive analysis report without emojis"""
        if not self.features:
            return "No features extracted. Please run extract_all_features() first."
        
        report = []
        report.append("KOLAM PATTERN ANALYSIS REPORT")
        report.append("=" * 45)
        
        # Classification
        if 'classification' in self.features:
            cls = self.features['classification']
            report.append(f"\nPATTERN CLASSIFICATION:")
            report.append(f"  Type: {cls['pattern_type']}")
            report.append(f"  Complexity: {cls['complexity_level']}")
            report.append(f"  Total Elements: {cls['element_count']}")
        
        # Element counts
        dots = len(self.features.get('dots', []))
        lines = len(self.features.get('lines', []))
        shapes = len(self.features.get('shapes', []))
        
        report.append(f"\nDETECTED ELEMENTS:")
        report.append(f"  Dots (Pulli): {dots}")
        report.append(f"  Lines: {lines}")
        report.append(f"  Shapes: {shapes}")
        
        # Symmetry
        if 'symmetry' in self.features:
            sym = self.features['symmetry']
            report.append(f"\nSYMMETRY ANALYSIS:")
            report.append(f"  Type: {sym['symmetry_type']}")
            report.append(f"  Horizontal: {sym['horizontal_symmetry']:.3f}")
            report.append(f"  Vertical: {sym['vertical_symmetry']:.3f}")
            report.append(f"  Symmetric: {sym['is_symmetric']}")
        
        # Geometric patterns
        if 'geometric_patterns' in self.features:
            geom = self.features['geometric_patterns']
            report.append(f"\nGEOMETRIC PROPERTIES:")
            if geom['dominant_angles']:
                angles_str = ", ".join([f"{angle}° ({count} lines)" for angle, count in geom['dominant_angles'][:2]])
                report.append(f"  Dominant Angles: {angles_str}")
            report.append(f"  Parallel Lines: {geom['parallel_lines']}")
            report.append(f"  Grid Structure: {geom['grid_structure']}")
        
        report.append(f"\n" + "=" * 45)
        report.append("Analysis completed using OpenCV Feature Extractor")
        
        return "\n".join(report)
    
    def save_results(self, output_path, include_report=True):
        """Save analysis results to files with proper UTF-8 encoding"""
        try:
            # Save features as JSON with UTF-8 encoding
            json_path = output_path.replace('.txt', '.json')
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(self.features, f, indent=2, default=str, ensure_ascii=False)
            
            if include_report:
                # Save report as text with UTF-8 encoding
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(self.generate_report())
            
            print(f"Results saved to {output_path} and {json_path}")
            return True
            
        except Exception as e:
            print(f"Error saving results: {e}")
            return False
    
    def visualize_features(self, output_path=None):
        """Create visualization of detected features"""
        if self.image is None:
            print("No image loaded for visualization")
            return None
        
        # Create visualization
        vis_image = self.image.copy()
        
        # Draw dots
        for dot in self.features.get('dots', []):
            center = dot['center']
            radius = dot['radius']
            cv2.circle(vis_image, center, radius, (0, 255, 0), 2)
            cv2.circle(vis_image, center, 2, (0, 255, 0), -1)
        
        # Draw lines
        for line in self.features.get('lines', []):
            start = line['start']
            end = line['end']
            cv2.line(vis_image, start, end, (255, 0, 0), 2)
        
        # Draw shape contours
        for shape in self.features.get('shapes', []):
            centroid = shape['centroid']
            cv2.circle(vis_image, centroid, 3, (0, 0, 255), -1)
        
        if output_path:
            cv2.imwrite(output_path, vis_image)
            print(f"Visualization saved to {output_path}")
        
        return vis_image
    
    def visualize_dots(self, out_path="dots.png"):
        """Overlay only detected dots on the original image."""
        vis = self.image.copy()
        for d in self.features.get("dots", []):
            cv2.circle(vis, d["center"], d["radius"], (0, 255, 0), 2)
        cv2.imwrite(out_path, vis)

    def visualize_lines(self, out_path="lines.png"):
        """Overlay only detected lines on the original image."""
        vis = self.image.copy()
        for l in self.features.get("lines", []):
            cv2.line(vis, l["start"], l["end"], (255, 0, 0), 2)
        cv2.imwrite(out_path, vis)

    def visualize_shapes(self, out_path="shapes.png"):
        """Overlay only detected shape centroids on the original image."""
        vis = self.image.copy()
        for s in self.features.get("shapes", []):
            cv2.circle(vis, s["centroid"], 3, (0, 0, 255), -1)
        cv2.imwrite(out_path, vis)


def main():
    """Main function for command-line usage"""
    parser = argparse.ArgumentParser(description='Kolam Feature Extractor')
    parser.add_argument('image_path', help='Path to the Kolam image')
    parser.add_argument('--output', '-o', default='kolam_analysis.txt',
                       help='Output file path for results')
    parser.add_argument('--visualize', '-v', 
                       help='Save visualization to specified path')
    
    args = parser.parse_args()
    
    # Create extractor and analyze image
    extractor = KolamFeatureExtractor()
    features = extractor.extract_all_features(args.image_path)
    
    if features:
        # Print report
        print("\n" + extractor.generate_report())
        
        # Save results
        extractor.save_results(args.output)
        
        # Create visualization if requested
        if args.visualize:
            extractor.visualize_features(args.visualize)
    
    else:
        print("Failed to extract features from the image")

if __name__ == "__main__":
    main()