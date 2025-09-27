from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from app.processor import AnalysisProcessor
from app.utils.helpers import convert_types

app = Flask(__name__)
processor = AnalysisProcessor()

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def home():
    return "KolamAI Backend Working Successfully 🎉🎊👏"

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Run analysis
        result = processor.process(filepath)

        # For convenience, you can add URLs to visualization images here if saved
        # e.g., result['visualizations'] = {'combined': 'url/path/to/image.png', ...}
        result = processor.process(filepath)

        viz_filename = processor.save_visualization(filepath)
        result['visualization_url'] = f"/uploads/{viz_filename}"

        safe_result = convert_types(result)
        return jsonify(safe_result)

    return jsonify({'error': 'Invalid file type'}), 400


@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/health')
def health():
    return jsonify({'status': 'OK'})


if __name__ == '__main__':
    app.run(debug=True)
