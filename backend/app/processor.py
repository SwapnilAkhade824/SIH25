from app.extractor import ExtractorService
import os

class AnalysisProcessor:
    def __init__(self):
        self.extractor_service = ExtractorService()

        self.upload_folder = os.path.join(os.getcwd(), 'uploads')
        if not os.path.exists(self.upload_folder):
            os.makedirs(self.upload_folder)

    def process(self, image_path):
        """
        Orchestrates the full analysis pipeline.
        Can be extended for caching, logging, or further processing.
        """
        # Step 1: Run the extractor on the image
        features = self.extractor_service.analyze_image(image_path)

        # Step 2: Potentially add analytics or supplementary information here
        # For example, compute summary statistics, timestamps, or IDs

        # Step 3: Return the feature dict as JSON-serializable object
        return features

    def save_visualization(self, image_path):
        """
        Uses the extractor to generate and save the visualization image.
        Returns the filename (not full path) of the saved image.
        """
        # Derive output filename
        basename = os.path.splitext(os.path.basename(image_path))[0]
        viz_filename = f"visualization.png"
        viz_path = os.path.join(self.upload_folder, viz_filename)

        # Call extractor’s visualization method
        self.extractor_service.extractor.visualize_features(viz_path)

        return viz_filename
