# Kolam Feature Extraction with OpenCV - Complete Implementation Guide

## Project Overview
Build an OpenCV-based system to analyze traditional Indian Kolam patterns for SIH 2025 Problem Statement ID 25107.

## Installation Requirements

```bash
# Install required packages
pip install opencv-python
pip install numpy
pip install matplotlib
pip install scikit-image
```

## Project Structure

```
kolam_analyzer/
├── src/
│   ├── kolam_extractor.py      # Main feature extraction class
│   ├── image_preprocessor.py   # Image preprocessing utilities
│   ├── pattern_analyzer.py     # Pattern analysis algorithms
│   └── visualizer.py          # Results visualization
├── data/
│   ├── sample_images/         # Test Kolam images
│   └── output/               # Analysis results
├── notebooks/
│   └── kolam_analysis.ipynb  # Jupyter notebook for testing
└── requirements.txt
```

## Core Features to Implement

### 1. Image Preprocessing
- **Noise Reduction**: Gaussian blur, median filtering
- **Thresholding**: Adaptive thresholding for varying lighting
- **Morphological Operations**: Opening, closing to clean patterns

### 2. Geometric Feature Detection
- **Dot Detection**: HoughCircles for detecting pulli (dots)
- **Line Detection**: HoughLines for straight line segments
- **Curve Detection**: Contour analysis for curved patterns
- **Corner Detection**: Harris corners, goodFeaturesToTrack

### 3. Pattern Analysis
- **Symmetry Detection**: Horizontal, vertical, rotational symmetry
- **Shape Recognition**: Triangles, squares, circles, complex polygons
- **Connectivity Analysis**: How elements connect to form patterns
- **Grid Structure**: Detect underlying dot grid patterns

### 4. Design Principle Extraction
- **Pattern Classification**: Pulli kolam, kambi kolam, etc.
- **Complexity Metrics**: Element count, coverage ratio, density
- **Mathematical Properties**: Angles, ratios, proportions
- **Traditional Rules**: Loop closure, continuous lines

## Implementation Steps

### Step 1: Basic Setup
```python
import cv2
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

class KolamAnalyzer:
    def __init__(self):
        self.image = None
        self.processed = None
        self.features = {}
```

### Step 2: Image Loading and Preprocessing
```python
def load_and_preprocess(self, image_path):
    # Load image
    self.image = cv2.imread(image_path)
    gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
    
    # Preprocessing pipeline
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    self.processed = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # Morphological cleanup
    kernel = np.ones((3, 3), np.uint8)
    self.processed = cv2.morphologyEx(self.processed, cv2.MORPH_CLOSE, kernel)
```

### Step 3: Dot Detection (Pulli Detection)
```python
def detect_dots(self):
    circles = cv2.HoughCircles(
        cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY),
        cv2.HOUGH_GRADIENT, dp=1, minDist=20,
        param1=50, param2=30, minRadius=3, maxRadius=25
    )
    
    dots = []
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            dots.append({'center': (x, y), 'radius': r})
    
    return dots
```

### Step 4: Line and Curve Detection
```python
def detect_lines(self):
    edges = cv2.Canny(self.processed, 50, 150)
    lines = cv2.HoughLinesP(
        edges, rho=1, theta=np.pi/180, threshold=30,
        minLineLength=20, maxLineGap=10
    )
    
    line_segments = []
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            length = np.sqrt((x2-x1)**2 + (y2-y1)**2)
            angle = np.degrees(np.arctan2(y2-y1, x2-x1))
            line_segments.append({
                'start': (x1, y1), 'end': (x2, y2),
                'length': length, 'angle': angle
            })
    
    return line_segments
```

### Step 5: Symmetry Analysis
```python
def analyze_symmetry(self):
    h, w = self.processed.shape
    
    # Check horizontal symmetry
    top_half = self.processed[:h//2, :]
    bottom_half = np.flipud(self.processed[h//2:, :])
    h_similarity = np.mean(top_half == bottom_half[:top_half.shape[0], :])
    
    # Check vertical symmetry  
    left_half = self.processed[:, :w//2]
    right_half = np.fliplr(self.processed[:, w//2:])
    v_similarity = np.mean(left_half == right_half[:, :left_half.shape[1]])
    
    return {
        'horizontal': h_similarity,
        'vertical': v_similarity,
        'is_symmetric': max(h_similarity, v_similarity) > 0.75
    }
```

### Step 6: Pattern Classification
```python
def classify_pattern(self):
    dots = len(self.features.get('dots', []))
    lines = len(self.features.get('lines', []))
    
    if dots > 10 and lines > dots:
        return 'pulli_kolam'  # Dot-based
    elif lines > 20:
        return 'kambi_kolam'  # Line-based
    else:
        return 'mixed_kolam'
```

## Advanced Features

### 1. Grid Detection
```python
def detect_grid_structure(self, dots):
    if len(dots) < 4:
        return None
    
    # Extract dot centers
    points = np.array([dot['center'] for dot in dots])
    
    # Use clustering to find grid structure
    kmeans_x = KMeans(n_clusters=min(5, len(set(points[:, 0]))))
    kmeans_y = KMeans(n_clusters=min(5, len(set(points[:, 1]))))
    
    # Analyze grid spacing and regularity
    return analyze_grid_spacing(points)
```

### 2. Loop Detection
```python
def detect_loops(self):
    contours, _ = cv2.findContours(
        self.processed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    
    loops = []
    for contour in contours:
        if cv2.contourArea(contour) > 100:
            # Check if contour forms a closed loop
            is_closed = cv2.isContourConvex(contour)
            loops.append({
                'contour': contour,
                'area': cv2.contourArea(contour),
                'perimeter': cv2.arcLength(contour, True),
                'is_closed': is_closed
            })
    
    return loops
```

### 3. Angle Analysis
```python
def analyze_angles(self, lines):
    angles = [line['angle'] for line in lines]
    
    # Find dominant angles
    angle_groups = {}
    for angle in angles:
        normalized = round(angle / 15) * 15  # Group by 15-degree intervals
        angle_groups[normalized] = angle_groups.get(normalized, 0) + 1
    
    dominant_angles = sorted(angle_groups.items(), key=lambda x: x[1], reverse=True)
    return dominant_angles[:3]  # Top 3 dominant angles
```

## Integration with Web Interface

### Flask API Setup
```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
analyzer = KolamAnalyzer()

@app.route('/analyze', methods=['POST'])
def analyze_kolam():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'})
    
    file = request.files['image']
    filename = secure_filename(file.filename)
    file.save(os.path.join('uploads', filename))
    
    # Analyze the image
    result = analyzer.extract_all_features(os.path.join('uploads', filename))
    
    return jsonify(result)
```

## Testing Strategy

### Unit Tests
- Test each feature extraction method independently
- Use sample images with known patterns
- Validate accuracy against manual annotations

### Integration Tests
- Test complete pipeline with various Kolam types
- Performance testing with large image datasets
- Cross-validation with traditional art experts

## Expected Outputs

### JSON Feature Report
```json
{
  "dots": [{"center": [100, 100], "radius": 5}],
  "lines": [{"start": [50, 50], "end": [150, 150], "angle": 45}],
  "symmetry": {"horizontal": 0.85, "vertical": 0.82, "type": "bilateral"},
  "pattern_type": "pulli_kolam",
  "complexity_score": 0.75,
  "design_principles": ["grid_based", "symmetric", "continuous_loops"]
}
```

### Visualization
- Original image with detected features overlaid
- Symmetry analysis visualization
- Pattern structure diagram
- Statistical charts

## Performance Optimization

1. **Image Preprocessing**: Optimize image size and quality
2. **Algorithm Selection**: Choose appropriate detection thresholds
3. **Parallel Processing**: Use multiprocessing for batch analysis
4. **Memory Management**: Efficient handling of large images

## Next Steps for Your Team

1. **Set up development environment** with OpenCV
2. **Collect Kolam image dataset** for training and testing
3. **Implement core feature extraction** methods
4. **Develop web interface** for image upload and analysis
5. **Test with real Kolam patterns** and refine algorithms
6. **Document traditional design rules** for validation
7. **Prepare demo and presentation** for SIH

This guide provides a comprehensive foundation for building your Kolam analysis system using OpenCV without requiring machine learning model training.