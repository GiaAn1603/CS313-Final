from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from flask_cors import CORS
import joblib
import math

app = Flask(__name__)
CORS(app)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class StormTransformer(nn.Module):
    def __init__(self, input_dim, d_model=24, nhead=2, num_layers=2, max_len=200):
        super(StormTransformer, self).__init__()
        self.input_proj = nn.Linear(input_dim, d_model)
        self.pos_encoder = nn.Parameter(torch.randn(1, max_len + 50, d_model)) 
        
        encoder_layer = nn.TransformerEncoderLayer(d_model=d_model, nhead=nhead, batch_first=True)
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        
        self.output_proj = nn.Linear(d_model, input_dim)

    def forward(self, src, src_key_padding_mask=None):
        x = self.input_proj(src)
        x = x + self.pos_encoder[:, :x.size(1), :]
        output = self.transformer_encoder(x, src_key_padding_mask=src_key_padding_mask)
        prediction = self.output_proj(output)
        return prediction

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    lat1_rad = np.radians(lat1)
    lon1_rad = np.radians(lon1)
    lat2_rad = np.radians(lat2)
    lon2_rad = np.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = np.sin(dlat / 2)**2 + np.cos(lat1_rad) * np.cos(lat2_rad) * np.sin(dlon / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    
    return R * c

MODEL_PATH = 'storm_model_weights.pth'
SCALER_PATH = 'storm_scaler.pkl'

try:
    # Load Config và Weights
    checkpoint = torch.load(MODEL_PATH, map_location=device)
    config = checkpoint['model_config']
    feature_cols = checkpoint['feature_cols']
    saved_max_len = checkpoint['max_len']
    
    print("Feature columns used:", feature_cols)

    # Khởi tạo Model
    model = StormTransformer(
        input_dim=config['input_dim'],
        d_model=config['d_model'],
        nhead=config['nhead'],
        num_layers=config['num_layers'],
        max_len=saved_max_len
    )
    
    # Load state dict
    model.load_state_dict(checkpoint['model_state_dict'])
    model.to(device)
    model.eval()
    print("Load Model thành công!")

    # Load Scaler
    scaler = joblib.load(SCALER_PATH)
    print("Load Scaler thành công!")
    
except FileNotFoundError as e:
    print(f"Lỗi: Không tìm thấy file. Hãy chắc chắn bạn đã upload file {MODEL_PATH} và {SCALER_PATH}")
    raise e

DATA_PATH = 'storms_data_2025.csv'
df = pd.read_csv(DATA_PATH)
print(f"Data loaded: {df.shape}")

def prepare_storm_data(storm_id):
    storm_data = df[df['STORM ID'] == storm_id]
    if storm_data.empty:
        return None

    storm_data = storm_data.head(7)

    input_data = []
    for _, row in storm_data.head(3).iterrows():
        point = []
        for col in feature_cols:
            if col != 'ISO TIME':
                point.append(row[col])
        input_data.append(point)
    
    actual_data = []
    if len(storm_data) >= 7:
        for _, row in storm_data.iloc[3:7].iterrows():
            point = []
            for col in feature_cols:
                if col != 'ISO TIME':
                    point.append(row[col])
            actual_data.append(point)
    
    return {
        'storm_id': storm_id,
        'input_data': input_data,
        'actual_data': actual_data,
        'input_count': len(input_data),
        'actual_count': len(actual_data)
    }

@app.route('/storm/<storm_id>', methods=['GET'])
def get_storm(storm_id):
    try:
        storm_data = df[df['STORM ID'] == storm_id]
        if storm_data.empty:
            return jsonify({
                'error': f"Storm with ID {storm_id} not found"
            }), 404
        
        storm_data = storm_data.head(7)
        lat_idx = feature_cols.index('LAT')
        lon_idx = feature_cols.index('LON')
        
        if 'ISO TIME' in df.columns:
            time_col = 'ISO TIME'
        else:
            time_col = None
        
        input_data = []
        input_times = []
        for _, row in storm_data.head(3).iterrows():
            lat_col_name = feature_cols[lat_idx]
            lon_col_name = feature_cols[lon_idx]
            
            point = [
                float(row[lat_col_name]), 
                float(row[lon_col_name])
            ]
            input_data.append(point)
            
            if time_col:
                input_times.append(str(row[time_col]))
            else:
                input_times.append("N/A")
        
        actual_data = []
        actual_times = []
        if len(storm_data) >= 7:
            for _, row in storm_data.iloc[3:7].iterrows():
                lat_col_name = feature_cols[lat_idx]
                lon_col_name = feature_cols[lon_idx]
                
                point = [
                    float(row[lat_col_name]), 
                    float(row[lon_col_name])
                ]
                actual_data.append(point)
                
                if time_col:
                    actual_times.append(str(row[time_col]))
                else:
                    actual_times.append("N/A")
        
        return jsonify({
            'storm_id': storm_id,
            'input_count': len(input_data),
            'input_data': input_data,
            'input_times': input_times,
            'actual_count': len(actual_data),
            'actual_data': actual_data,
            'actual_times': actual_times
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        storm_id = data.get('storm_id')
        if not storm_id:
            return jsonify({'error': 'No storm_id provided'}), 400

        context_len = data.get('context_len', 3)
        forecast_len = data.get('forecast_len', 4)
      
        storm_info = prepare_storm_data(storm_id)
        if storm_info is None:
            return jsonify({'error': f"Storm with ID {storm_id} not found"}), 404
        
        raw_data = storm_info['input_data']
        
        if len(raw_data) < context_len:
            return jsonify({
                'error': f"Not enough input data for storm {storm_id}. Need {context_len} points, got {len(raw_data)}"
            }), 400
        
        raw_array = np.array(raw_data)
        data_scaled = scaler.transform(raw_array)
        
        input_seq_scaled = data_scaled[:context_len]
        input_tensor = torch.FloatTensor(input_seq_scaled).unsqueeze(0).to(device)
        
        prediction_seq_scaled = []
        
        with torch.no_grad():
            current_input = input_tensor
            
            for _ in range(forecast_len):
                out = model(current_input)
                next_step_pred = out[:, -1, :]
                prediction_seq_scaled.append(next_step_pred.cpu().numpy()[0])
                
                next_step_tensor = next_step_pred.unsqueeze(1)
                current_input = torch.cat((current_input[:, 1:, :], next_step_tensor), dim=1)
        
        prediction_matrix = np.array(prediction_seq_scaled)
        prediction_real = scaler.inverse_transform(prediction_matrix)
        lat_idx = feature_cols.index('LAT')
        lon_idx = feature_cols.index('LON')
        
        predictions = []
        for i in range(forecast_len):
            pred_lat = prediction_real[i, lat_idx]
            pred_lon = prediction_real[i, lon_idx]
            predictions.append({
                'lat': float(pred_lat),
                'lon': float(pred_lon),
                'point_index': i + 1
            })
        
        return jsonify({
            'predictions': predictions
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'device': str(device),
        'model_loaded': True
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
