import unittest
from models.kolam_extractor import KolamFeatureExtractor  # Adjust import if needed

class TestKolamExtractor(unittest.TestCase):
    def setUp(self):
        self.extractor = KolamFeatureExtractor()
        # Provide a sample image path here or use test assets folder
        self.sample_image = 'tests/sample_images/sample10.png'

    def test_image_loading(self):
        loaded = self.extractor.load_image(self.sample_image)
        self.assertTrue(loaded)
        self.assertIsNotNone(self.extractor.gray)
    
    def test_preprocessing(self):
        self.extractor.load_image(self.sample_image)
        binary = self.extractor.preprocess_image()
        self.assertIsNotNone(binary)
        self.assertEqual(binary.ndim, 2)  # Grayscale binary image

    def test_dot_detection(self):
        self.extractor.load_image(self.sample_image)
        self.extractor.preprocess_image()
        dots = self.extractor.detect_dots()
        self.assertIsInstance(dots, list)
        self.assertGreater(len(dots), 0)

    def test_line_detection(self):
        self.extractor.load_image(self.sample_image)
        self.extractor.preprocess_image()
        self.extractor.detect_dots()  # Optional, depending on your pipeline
        lines = self.extractor.detect_lines()
        self.assertIsInstance(lines, list)
        self.assertGreater(len(lines), 0)

    def test_contour_detection(self):
        self.extractor.load_image(self.sample_image)
        self.extractor.preprocess_image()
        contours = self.extractor.detect_contours()
        self.assertIsInstance(contours, list)
        self.assertGreater(len(contours), 0)

    def test_full_pipeline(self):
        features = self.extractor.extract_all_features(self.sample_image)
        self.assertIn('dots', features)
        self.assertIn('lines', features)
        self.assertIn('shapes', features)
        self.assertIn('symmetry', features)

if __name__ == '__main__':
    unittest.main()
