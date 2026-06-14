from flask import Flask, request, jsonify, render_template
import numpy as np
from PIL import Image
import io
import base64
import tensorflow as tf

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model('model/skin_disease_model.h5')

# Class names
class_names = {
    0: {'name': 'Actinic Keratosis', 'short': 'akiec', 'risk': 'High'},
    1: {'name': 'Basal Cell Carcinoma', 'short': 'bcc', 'risk': 'High'},
    2: {'name': 'Benign Keratosis', 'short': 'bkl', 'risk': 'Low'},
    3: {'name': 'Dermatofibroma', 'short': 'df', 'risk': 'Low'},
    4: {'name': 'Melanoma', 'short': 'mel', 'risk': 'Very High'},
    5: {'name': 'Melanocytic Nevi', 'short': 'nv', 'risk': 'Low'},
    6: {'name': 'Vascular Lesion', 'short': 'vasc', 'risk': 'Medium'},
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['image']
        img = Image.open(io.BytesIO(file.read())).convert('RGB')
        img = img.resize((64, 64))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        pred_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))

        result = class_names[pred_index]

        return jsonify({
            'success': True,
            'disease': result['name'],
            'short': result['short'],
            'risk': result['risk'],
            'confidence': round(confidence * 100, 2),
            'all_predictions': [
                {
                    'name': class_names[i]['name'],
                    'confidence': round(float(predictions[0][i]) * 100, 2)
                }
                for i in range(7)
            ]
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)