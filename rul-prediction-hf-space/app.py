# app.py

import os
import joblib
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify

# --- Initialize our Flask app ---
# This is the web server that will receive requests and send back responses.
app = Flask(__name__)


# --- Load Model Artifacts ---
# We load the model and scalers once when the application starts.
# This is much more efficient than loading them for every single request.
try:
    # Construct paths to the artifact files
    # The current directory will be the root of our Space
    base_dir = os.path.dirname(os.path.realpath(__file__))
    model_path = os.path.join(base_dir, 'model_artifacts', 'lstm_model.h5')
    scaler_path = os.path.join(base_dir, 'model_artifacts', 'input_scaler.joblib')
    y_scaler_path = os.path.join(base_dir, 'model_artifacts', 'output_scaler.joblib')
    
    # Load the files
    MODEL = tf.keras.models.load_model(model_path)
    INPUT_SCALER = joblib.load(scaler_path)
    OUTPUT_SCALER = joblib.load(y_scaler_path)
    print("--- Model and scalers loaded successfully ---")

except Exception as e:
    print(f"--- Error loading model artifacts: {e} ---")
    MODEL = None # Set to None if loading fails


# --- Define the Prediction Route ---
# This is the function that will run when your web app calls your API.
# The route is '/predict' and it only accepts POST requests.
@app.route("/predict", methods=["POST"])
def predict_rul():
    # Make sure the model loaded correctly
    if MODEL is None:
        return jsonify({"error": "Model could not be loaded at startup."}), 500

    # Get the JSON data sent from the client (your web app)
    json_data = request.get_json()
    if 'data' not in json_data:
        return jsonify({"error": "Request body must contain a 'data' key."}), 400
    
    sequence = json_data['data']

    # --- Data Preparation ---
    try:
        # The input data should be a list of 50 sequences, each with 17 features
        sequence_np = np.array(sequence, dtype=np.float32)
        if sequence_np.shape != (50, 18):
            return jsonify({"error": f"Invalid input shape. Expected (50, 17), but got {sequence_np.shape}."}), 400
        
        # Scale the input data using the loaded scaler
        sequence_scaled = INPUT_SCALER.transform(sequence_np)
        
        # Reshape to (1, 50, 17) to add the batch dimension for the LSTM model
        sequence_final = np.expand_dims(sequence_scaled, axis=0)
    except Exception as e:
        return jsonify({"error": f"Error processing input data: {e}"}), 400
    
    # --- Make Prediction ---
    prediction_scaled = MODEL.predict(sequence_final)

    # --- Inverse Transform and Return ---
    prediction = OUTPUT_SCALER.inverse_transform(prediction_scaled)

    # Return the result as a JSON object
    response = {'predicted_rul': float(prediction[0][0])}
    
    return jsonify(response)


# This allows the app to be run directly for local testing
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))