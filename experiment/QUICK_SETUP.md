# Quick Setup and Testing Guide

## Installation

1. **Install dependencies:**
```bash
pip install -r requirements_updated.txt
```

2. **Download the files:**
- `advanced_kolam_extractor.py` - Main extractor
- `test_kolam_extractor.py` - Test script  
- `requirements_updated.txt` - Dependencies

## Quick Test

### Option 1: Test with sample image (automatic)
```bash
python test_kolam_extractor.py
```

### Option 2: Test with your Kolam image
```bash
python test_kolam_extractor.py path/to/your/kolam_image.jpg
```

## Expected Output Files

After running the test, you'll get:

1. **`visualization.png`** - Main visualization showing all detected features
2. **`kolam_analysis_report_YYYYMMDD_HHMMSS.txt`** - Detailed text report
3. **`kolam_analysis_report_YYYYMMDD_HHMMSS_detailed.json`** - Complete JSON data
4. **`sample_kolam.jpg`** - Sample test image (if no image provided)

## Features in visualization.png

- 🟢 **Green circles**: Dots detected by HoughCircles
- 🔵 **Blue circles**: Dots detected by Blob Detection  
- 🟡 **Yellow circles**: Dots detected by Corner Detection
- 🔴 **Red lines**: Detected line segments (thickness = line length)
- 🔴 **Red dots**: Shape centroids
- **Text overlay**: Accuracy score

## Customizing Detection Parameters

Edit the test script to adjust parameters:

```python
# In test_kolam_extractor.py, modify these lines:
extractor.params['hough_circles']['param2'] = 20  # Lower = more sensitive
extractor.params['hough_circles']['minRadius'] = 2  # Smaller dots
extractor.params['hough_lines']['threshold'] = 20   # Lower = more lines
```

## Troubleshooting

### If you get import errors:
```bash
pip install opencv-python scikit-image scipy
```

### If detection accuracy is low:
1. Use higher resolution images (800x800+ pixels)
2. Ensure good contrast and lighting
3. Lower the detection thresholds in parameters
4. Try different preprocessing options

### If too many false positives:
1. Increase threshold values (param2, threshold)
2. Increase minimum size filters
3. Use more aggressive morphological operations

## Integration with Your SIH Project

The test script shows you how to:
1. Initialize the advanced extractor
2. Customize parameters for your Kolam types
3. Extract features and get accuracy scores
4. Generate visualizations and reports
5. Save results in multiple formats

Use this as a template for your web application integration!