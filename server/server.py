from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(_name_)

locations = []

location_buffer = []

# test route
@app.route('/dj', methods=['POST'])
def handle_dj_route():
    print("Yessss...")
    return jsonify({'message': 'DJ route received'}), 200

@app.route('/location', methods=['POST'])
def receive_location():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    if latitude is None or longitude is None:
        return jsonify({'error': 'Invalid data'}), 400
    
    location_entry = {
        'latitude': latitude,
        'longitude': longitude,
        'timestamp': datetime.now().isoformat()
    }
    locations.append(location_entry)
    
    print(f"Received location: {location_entry}")
    return jsonify({'message': 'Location received successfully'}), 200

@app.route('/test', methods=['POST'])
def handle_human_detected():
    print("Oops.....")
    if not locations:
        return jsonify({'error': 'No recent location data available'}), 404
    
    latest_location = locations[-1]
    location_buffer.append(latest_location)
    
    print(f"Human detected, buffered location: {latest_location}")
    return jsonify({'message': 'Location buffered successfully'}), 200

@app.route('/locations/buffer', methods=['GET'])
def get_buffered_locations():
    if not location_buffer:
        return jsonify({'error': 'No buffered location data available'}), 404 
    return jsonify(location_buffer), 200

if _name_ == '_main_':
    app.run(debug=True)