Skin Disease Classifier

An AI-powered web application that classifies skin lesion images into seven diagnostic categories using a Convolutional Neural Network trained on the HAM10000 dataset.

Live Demo

https://skin-disease-classifier-2-bz8g.onrender.com

Overview

This project uses deep learning to analyze dermatoscopic images and predict the likelihood of various skin conditions. The model was trained on the HAM10000 dataset, which contains over 10,000 labeled images across seven disease categories. The application provides a confidence score for each prediction along with a breakdown across all categories.

Disease Categories

The model classifies images into the following categories:


Actinic Keratosis (akiec)
Basal Cell Carcinoma (bcc)
Benign Keratosis (bkl)
Dermatofibroma (df)
Melanoma (mel)
Melanocytic Nevi (nv)
Vascular Lesion (vasc)


Features


Image upload via drag-and-drop or file browser
Real-time prediction with confidence scores
Breakdown of prediction probabilities across all seven categories
Risk level indication for each disease category
Responsive, modern user interface


Tech Stack


Python
TensorFlow / Keras
Flask
HTML, CSS, JavaScript


Model Details


Architecture: Custom Convolutional Neural Network with three convolutional blocks
Input size: 64x64 RGB images
Training data: HAM10000 dataset (10,015 images)
Validation accuracy: approximately 75 percent


Running Locally


Clone the repository


git clone https://github.com/hamza5849/skin-disease-classifier.git
cd skin-disease-classifier


Create and activate a virtual environment


python -m venv venv
venv\Scripts\activate


Install dependencies


pip install -r requirements.txt


Run the application


python app.py


Open a browser and go to


http://127.0.0.1:5000

Project Structure

skin-disease-classifier/
├── model/
│   └── skin_disease_model.h5
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── templates/
│   └── index.html
├── app.py
├── requirements.txt
└── runtime.txt

Dataset

This project uses the HAM10000 (Human Against Machine with 10000 training images) dataset, a collection of dermatoscopic images of common pigmented skin lesions.

Disclaimer

This application is intended for educational and demonstration purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified dermatologist or healthcare provider for any concerns regarding skin conditions.
