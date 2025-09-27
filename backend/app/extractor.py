from models.kolam_extractor import KolamFeatureExtractor

class ExtractorService:
    def __init__(self):
        self.extractor = KolamFeatureExtractor()

    def analyze_image(self, image_path):
        self.extractor.extract_all_features(image_path)
        # Return a serializable copy of feature data
        return self.extractor.features
