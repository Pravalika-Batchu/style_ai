from flask import Flask, request, jsonify
from flask_cors import CORS
from color_analyzer import analyzer
from styling_engine import generate_styling
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    
    result = analyzer.analyze(img_bytes)
    return jsonify(result)

@app.route('/style', methods=['POST'])
def get_styling():
    try:
        data = request.json
        recommendations = generate_styling(data)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/refine', methods=['POST'])
def refine_styling():
    try:
        data = request.json
        new_outfit = refine_outfit(data)
        return jsonify(new_outfit)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
