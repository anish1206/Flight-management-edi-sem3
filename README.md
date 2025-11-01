# Flight Management Model Training

A machine learning project for predicting Remaining Useful Life (RUL) of aircraft engines using LSTM neural networks.

## 📋 Project Overview

This project implements a deep learning solution for predictive maintenance of aircraft engines. It uses the NASA Turbofan Engine Degradation Simulation Dataset (C-MAPSS) to train an LSTM model that predicts the remaining useful life of engines based on sensor readings.

## 🗂️ Project Structure

```
Flight_management_model_training/
├── data/                          # Dataset files
│   ├── train_FD001.txt           # Training data for different operating conditions
│   ├── test_FD001.txt            # Test data
│   ├── RUL_FD001.txt             # Ground truth RUL values
│   └── readme.txt                # Dataset documentation
├── model_artifacts/               # Trained model and preprocessing artifacts
│   ├── lstm_model.h5             # Trained LSTM model
│   ├── input_scaler.joblib       # Feature scaler
│   └── output_scaler.joblib      # Target scaler
├── rul-prediction-hf-space/      # Hugging Face Space deployment
│   ├── app.py                    # Flask API for model serving
│   ├── requirements.txt          # Dependencies for deployment
│   └── model_artifacts/          # Model files for deployment
├── 1-data-exploration.ipynb      # Data exploration and analysis
├── 1-data-exploration copy.ipynb # Model training notebook
├── generate_payload.py           # Utility to generate test payloads
├── test_payload.json             # Sample API test payload
└── requirements.txt              # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Flight_management_model_training
   ```

2. **Create a virtual environment**
   ```bash
   # Windows
   python -m venv ml_env
   ml_env\Scripts\activate

   # Linux/Mac
   python -m venv ml_env
   source ml_env/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## 📊 Dataset

This project uses the **NASA C-MAPSS (Commercial Modular Aero-Propulsion System Simulation)** dataset:
- Multiple operating conditions and fault modes
- 21 sensor measurements per time step
- Time series data for training and test sets
- Ground truth RUL values for evaluation

Dataset source: [NASA Prognostics Data Repository](https://ti.arc.nasa.gov/tech/dash/groups/pcoe/prognostic-data-repository/)

## 🔬 Model Architecture

The project implements an **LSTM (Long Short-Term Memory)** neural network:
- Input: Sequence of 50 time steps with 18 sensor features
- LSTM layers for temporal pattern recognition
- Dense output layer for RUL prediction
- Preprocessing: Feature scaling using StandardScaler

## 📓 Usage

### Training the Model

1. Open the Jupyter notebook:
   ```bash
   jupyter notebook 1-data-exploration.ipynb
   ```

2. Run all cells to:
   - Load and explore the data
   - Preprocess sensor readings
   - Train the LSTM model
   - Evaluate model performance
   - Save model artifacts

### Making Predictions

Use the trained model with the Flask API:

```python
import requests
import json

# Load test payload
with open('test_payload.json', 'r') as f:
    payload = json.load(f)

# Make prediction request
response = requests.post('http://localhost:5000/predict', json=payload)
print(response.json())
```

### Generating Test Payloads

```bash
python generate_payload.py
```

## 🌐 Deployment

The `rul-prediction-hf-space/` directory contains files for deploying the model as a Flask API on Hugging Face Spaces or other platforms.

### Deploy to Hugging Face Spaces

1. Create a new Space on Hugging Face
2. Upload the contents of `rul-prediction-hf-space/`
3. The Space will automatically start the Flask API

## 📈 Model Performance

- **Evaluation Metric**: Root Mean Square Error (RMSE), Mean Absolute Error (MAE)
- **Performance**: [Add your model's performance metrics here]
- **Dataset Split**: [Add train/validation/test split information]

## 🛠️ Technologies Used

- **TensorFlow/Keras**: Deep learning framework
- **NumPy & Pandas**: Data manipulation
- **Scikit-learn**: Preprocessing and evaluation
- **Matplotlib & Seaborn**: Data visualization
- **Flask**: Model serving API
- **Jupyter**: Interactive development

## 📝 Key Features

- ✅ Time series preprocessing and feature engineering
- ✅ LSTM-based sequence modeling
- ✅ Scalable preprocessing pipeline
- ✅ Model serialization for deployment
- ✅ REST API for inference
- ✅ Comprehensive data exploration

## 🔍 Future Improvements

- [ ] Implement attention mechanisms
- [ ] Add model explainability (SHAP, LIME)
- [ ] Hyperparameter tuning with Optuna/Ray Tune
- [ ] Multi-model ensemble
- [ ] Real-time streaming predictions
- [ ] Docker containerization

## 📄 License

[Add your license here - e.g., MIT, Apache 2.0]

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

[Add your contact information or links to your profiles]

## 🙏 Acknowledgments

- NASA for providing the C-MAPSS dataset
- [Add any other acknowledgments]

---

**Note**: This is a research/educational project for predictive maintenance using deep learning.
