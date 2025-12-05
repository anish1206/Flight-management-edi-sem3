"""Streamlit app for comparing ANN, LSTM, and XGBoost RUL predictions.

The app expects the following artifacts inside `model_artifacts/`:
- ann_model.h5           (Keras Sequential model trained on tabular features)
- lstm_model.h5          (Keras Sequential model trained on sequence data)
- xgboost_model.json     (XGBRegressor model saved via `xgb_model.save_model`)
- input_scaler.joblib    (MinMaxScaler fitted on operational settings + sensors)
- output_scaler.joblib   (MinMaxScaler fitted on target RUL values)

Upload a sensor dataset (same schema as the NASA C-MAPSS files). Optionally, upload
the corresponding `RUL_FD00X.txt` file to compute ground-truth RUL for evaluation.
"""

from __future__ import annotations

import io
from pathlib import Path
from typing import Dict, Optional, Tuple

import numpy as np
import pandas as pd
import streamlit as st
import xgboost as xgb
from joblib import load as joblib_load
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from tensorflow.keras.models import load_model

# --- Static configuration ----------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
ARTIFACT_DIR = BASE_DIR / "model_artifacts"

OPER_SETTINGS = ["setting_1", "setting_2", "setting_3"]
SENSOR_COLUMNS = [
    "sensor_2",
    "sensor_3",
    "sensor_4",
    "sensor_7",
    "sensor_8",
    "sensor_9",
    "sensor_11",
    "sensor_12",
    "sensor_13",
    "sensor_14",
    "sensor_15",
    "sensor_17",
    "sensor_20",
    "sensor_21",
]
FEATURE_COLUMNS = ["time_cycle"] + OPER_SETTINGS + SENSOR_COLUMNS
SEQUENCE_FEATURES = OPER_SETTINGS + SENSOR_COLUMNS
SEQUENCE_LENGTH = 50

COLUMN_NAMES = [
    "unit_nr",
    "time_cycle",
    *OPER_SETTINGS,
    *[f"sensor_{i}" for i in range(1, 22)],
]

# --- Streamlit page setup ----------------------------------------------------
st.set_page_config(
    page_title="Aircraft Engine RUL Model Comparison",
    page_icon="✈️",
    layout="wide",
)

st.title("✈️ Remaining Useful Life Model Comparison Dashboard")
st.write(
    "Upload a sensor dataset to compare predictions from the ANN, LSTM, and "
    "XGBoost models. Optionally include a ground-truth RUL file to evaluate "
    "model accuracy."
)

# --- Artifact loading helpers -------------------------------------------------

def safe_load_model(path: Path):
    if not path.exists():
        st.error(f"Missing model artifact: `{path.name}`. Please add it to `model_artifacts/`.")
        st.stop()
    return load_model(path)


def safe_load_xgb(path: Path) -> xgb.XGBRegressor:
    if not path.exists():
        st.error(f"Missing XGBoost artifact: `{path.name}`. Please add it to `model_artifacts/`.")
        st.stop()
    model = xgb.XGBRegressor()
    model.load_model(str(path))
    return model


@st.cache_resource(show_spinner=False)
def load_artifacts() -> Tuple:
    ann_path = ARTIFACT_DIR / "ann_model.h5"
    lstm_path = ARTIFACT_DIR / "lstm_model.h5"
    xgb_path = ARTIFACT_DIR / "xgboost_model.json"
    input_scaler_path = ARTIFACT_DIR / "input_scaler.joblib"
    output_scaler_path = ARTIFACT_DIR / "output_scaler.joblib"

    ann_model = safe_load_model(ann_path)
    lstm_model = safe_load_model(lstm_path)
    xgb_model = safe_load_xgb(xgb_path)

    if not input_scaler_path.exists() or not output_scaler_path.exists():
        st.error("Missing scaler artifacts. Please ensure `input_scaler.joblib` and `output_scaler.joblib` exist.")
        st.stop()

    input_scaler = joblib_load(input_scaler_path)
    output_scaler = joblib_load(output_scaler_path)

    return ann_model, lstm_model, xgb_model, input_scaler, output_scaler


# Load once when the app starts
ANN_MODEL, LSTM_MODEL, XGB_MODEL, INPUT_SCALER, OUTPUT_SCALER = load_artifacts()

# --- Utility functions -------------------------------------------------------

def read_sensor_dataframe(upload: io.BytesIO) -> pd.DataFrame:
    """Parse the uploaded sensor dataset into a DataFrame."""
    df = pd.read_csv(upload, sep="\s+", header=None)
    if df.shape[1] > len(COLUMN_NAMES):
        df = df.iloc[:, : len(COLUMN_NAMES)]
    df.columns = COLUMN_NAMES
    return df


def read_truth_dataframe(upload: io.BytesIO) -> pd.DataFrame:
    truth = pd.read_csv(upload, sep="\s+", header=None)
    truth = truth.iloc[:, :1]
    truth.columns = ["true_RUL"]
    truth["unit_nr"] = truth.index + 1
    return truth


def compute_test_rul(sensor_df: pd.DataFrame, truth_df: Optional[pd.DataFrame]) -> pd.DataFrame:
    df = sensor_df.copy()
    max_cycles = df.groupby("unit_nr")["time_cycle"].max().reset_index(name="last_cycle")
    df = df.merge(max_cycles, on="unit_nr", how="left")

    if truth_df is not None:
        df = df.merge(truth_df, on="unit_nr", how="left")
        df["RUL"] = df["true_RUL"] + (df["last_cycle"] - df["time_cycle"])
    elif "RUL" in df.columns:
        pass
    else:
        df["RUL"] = df["last_cycle"] - df["time_cycle"]

    df.drop(columns=["last_cycle"], inplace=True)
    df["RUL"] = df["RUL"].clip(upper=125)
    return df


def scale_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df[OPER_SETTINGS + SENSOR_COLUMNS] = INPUT_SCALER.transform(df[OPER_SETTINGS + SENSOR_COLUMNS])
    return df


def build_lstm_sequences(df: pd.DataFrame) -> np.ndarray:
    sequences = []
    for _, group in df.groupby("unit_nr"):
        group_sorted = group.sort_values("time_cycle")
        feature_block = group_sorted[SEQUENCE_FEATURES].to_numpy(dtype=np.float32)
        if feature_block.shape[0] < SEQUENCE_LENGTH:
            pad_len = SEQUENCE_LENGTH - feature_block.shape[0]
            pad_block = np.zeros((pad_len, feature_block.shape[1]), dtype=np.float32)
            feature_block = np.vstack([pad_block, feature_block])
        else:
            feature_block = feature_block[-SEQUENCE_LENGTH:]
        sequences.append(feature_block)
    return np.array(sequences, dtype=np.float32)


def make_predictions(df: pd.DataFrame) -> Dict[str, np.ndarray]:
    last_cycles = df.sort_values("time_cycle").groupby("unit_nr").tail(1)

    ann_inputs = last_cycles[FEATURE_COLUMNS]
    ann_pred_scaled = ANN_MODEL.predict(ann_inputs, verbose=0)
    ann_pred = OUTPUT_SCALER.inverse_transform(ann_pred_scaled)

    xgb_pred_scaled = XGB_MODEL.predict(ann_inputs)
    xgb_pred = OUTPUT_SCALER.inverse_transform(xgb_pred_scaled.reshape(-1, 1))

    lstm_inputs = build_lstm_sequences(df)
    lstm_pred_scaled = LSTM_MODEL.predict(lstm_inputs, verbose=0)
    lstm_pred = OUTPUT_SCALER.inverse_transform(lstm_pred_scaled)

    return {
        "ANN": ann_pred.flatten(),
        "LSTM": lstm_pred.flatten(),
        "XGBoost": xgb_pred.flatten(),
        "Actual": last_cycles["RUL"].to_numpy() if "RUL" in last_cycles else None,
        "Units": last_cycles.index.to_numpy(),
    }


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    return {
        "RMSE": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "MAE": float(mean_absolute_error(y_true, y_pred)),
        "R²": float(r2_score(y_true, y_pred)),
    }


# --- Sidebar: data upload ----------------------------------------------------
st.sidebar.header("Upload Data")
sensor_upload = st.sidebar.file_uploader(
    "Sensor data (.txt) — same format as C-MAPSS test files",
    type=["txt", "csv"],
)
truth_upload = st.sidebar.file_uploader(
    "Optional ground-truth RUL file",
    type=["txt", "csv"],
)

if sensor_upload is None:
    st.info("Upload a sensor dataset to begin.")
    st.stop()

with st.spinner("Processing uploaded data..."):
    sensor_df = read_sensor_dataframe(sensor_upload)
    truth_df = read_truth_dataframe(truth_upload) if truth_upload else None
    prepared_df = compute_test_rul(sensor_df, truth_df)
    scaled_df = scale_features(prepared_df)

st.success("Sensor data processed successfully.")

st.subheader("Dataset Preview")
st.dataframe(prepared_df.head())

results = make_predictions(scaled_df)

# --- Display predictions -----------------------------------------------------
st.subheader("Model Predictions vs Actual")
last_cycles = (
    prepared_df.sort_values("time_cycle")
    .groupby("unit_nr")
    .tail(1)
    .set_index("unit_nr")
)

unit_index = last_cycles.index

if "RUL" in last_cycles:
    actual_series = last_cycles["RUL"].astype("Int64")
else:
    actual_series = pd.Series(pd.NA, index=unit_index, dtype="Int64")

summary_df = pd.DataFrame(
    {
        "Actual RUL": actual_series,
        "ANN": pd.Series(np.round(results["ANN"]).astype(int), index=unit_index),
        "LSTM": pd.Series(np.round(results["LSTM"]).astype(int), index=unit_index),
        "XGBoost": pd.Series(np.round(results["XGBoost"]).astype(int), index=unit_index),
    },
    index=unit_index,
)
summary_df.index.name = "unit_nr"

if "RUL" in last_cycles:
    summary_df["ANN Error"] = summary_df["ANN"] - summary_df["Actual RUL"]
    summary_df["LSTM Error"] = summary_df["LSTM"] - summary_df["Actual RUL"]
    summary_df["XGBoost Error"] = summary_df["XGBoost"] - summary_df["Actual RUL"]

st.dataframe(summary_df)

# --- Metrics section ---------------------------------------------------------
if "RUL" in last_cycles:
    st.subheader("Evaluation Metrics")
    metrics_columns = st.columns(3)
    true_values = last_cycles["RUL"].to_numpy()

    ann_metrics = calculate_metrics(true_values, results["ANN"])
    lstm_metrics = calculate_metrics(true_values, results["LSTM"])
    xgb_metrics = calculate_metrics(true_values, results["XGBoost"])

    for col, model_name, metrics in zip(
        metrics_columns, ["ANN", "LSTM", "XGBoost"], [ann_metrics, lstm_metrics, xgb_metrics]
    ):
        col.metric(label=f"{model_name} RMSE", value=f"{metrics['RMSE']:.2f}")
        col.write(
            pd.DataFrame(
                {
                    "Metric": list(metrics.keys()),
                    "Value": [metrics["RMSE"], metrics["MAE"], metrics["R²"]],
                }
            ).set_index("Metric")
        )
else:
    st.info(
        "Ground-truth RUL not provided. Upload the matching RUL file to see accuracy metrics "
        "and error analysis."
    )

# --- Visualization -----------------------------------------------------------
st.subheader("Prediction Comparison Chart")
chart_df = summary_df.reset_index().melt(
    id_vars="unit_nr",
    value_vars=["ANN", "LSTM", "XGBoost"] + (["Actual RUL"] if "RUL" in last_cycles else []),
    var_name="Model",
    value_name="RUL",
)
chart_df = chart_df.dropna(subset=["RUL"])

st.bar_chart(chart_df, x="unit_nr", y="RUL", color="Model")

st.caption(
    "Note: Models are trained on the FD001 subset with RUL values clipped at 125 cycles. "
    "Ensure uploaded data follows the same preprocessing conventions for meaningful comparisons."
)
