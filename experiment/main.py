# from kolam_extractor import KolamFeatureExtractor

# extractor = KolamFeatureExtractor()
# features = extractor.extract_all_features('sample10.png')
# print(extractor.generate_report())


# Import the fixed version
from kolam_extractor_fixed import KolamFeatureExtractor

# Use normally - no more encoding errors
extractor = KolamFeatureExtractor()
features = extractor.extract_all_features('sample3.png')
extractor.save_results('output.txt')  # This will work now!
extractor.visualize_features('visualization.png')
extractor.visualize_dots('viz_dots.png')
extractor.visualize_lines('viz_lines.png')
extractor.visualize_shapes('viz_shapes.png')
