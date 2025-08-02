import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load model
model = pickle.load(open('RandomForest', 'rb'))  # or ExtraTrees
symptoms = pickle.load(open('symptom_list.pkl', 'rb'))  # List of 222 symptoms
label_encoder = pickle.load(open('label_encoder.pkl', 'rb'))  # Fitted LabelEncoder

# Load description and precaution data
desc = pd.read_csv('symptom_Description.csv')
prec = pd.read_csv('symptom_precaution.csv')

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "Disease Prediction API is running."

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    input_symptoms = data.get("symptoms", [])

    # One-hot encode the input
    features = pd.Series([0]*len(symptoms), index=symptoms)
    for symptom in input_symptoms:
        if symptom in symptoms:
            features[symptom] = 1

    # Predict
    features = features.values.reshape(1, -1)
    probabilities = model.predict_proba(features)[0]
    top5_idx = np.argsort(probabilities)[-5:][::-1]
    top5_proba = np.sort(probabilities)[-5:][::-1]
    top5_diseases_encoded = [model.classes_[i] for i in top5_idx]
    top5_diseases = label_encoder.inverse_transform(top5_diseases_encoded)

    # Format response
    response = []
    for i in range(5):
        disease = top5_diseases[i]
        prob = round(float(top5_proba[i]), 4)

        # Description
        description = "No description available"
        if disease in desc['Disease'].values:
            description = desc[desc['Disease'] == disease].iloc[0, 1]

        # Precautions
        precautions = []
        if disease in prec['Disease'].values:
            row = prec[prec['Disease'] == disease].iloc[0].values[1:]
            precautions = [str(p) for p in row if pd.notna(p)]

        response.append({
            "disease": disease,
            "probability": prob,
            "description": description,
            "precautions": precautions
        })

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
