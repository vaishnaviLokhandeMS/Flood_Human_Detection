import folium
import cv2
import requests
from ultralytics import YOLO
import os

os.environ['QT_QPA_PLATFORM'] = 'xcb'

model = YOLO('yolov8m.pt')
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error opening webcam")
    exit()

coco_labels = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light",
    "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
    "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", 
    "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", 
    "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch", "potted plant", "bed", 
    "dining table", "toilet", "TV", "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave", "oven", 
    "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
]

server_alert_url = "https://e87f-123-252-204-198.ngrok-free.app/test"
person_locations = []

ret = True

while ret:
    ret, frame = cap.read()
    
    if not ret:
        break

    results = model.track(frame, persist=True, tracker="botsort.yaml")
    
    for result in results[0].boxes:
        if hasattr(result, 'id') and result.id is not None:
            tracking_id = result.id
            bbox = result.xyxy[0].cpu().numpy()
            cls = int(result.cls.cpu().numpy()[0])
            object_name = coco_labels[cls]

            confidence = result.conf.cpu().numpy().item()

            print(f'Detected {object_name}, ID: {tracking_id}, Confidence: {confidence:.2f}, Bounding Box: {bbox}')

            label = f'{object_name} {tracking_id} {confidence:.2f}'
            (x1, y1, x2, y2) = bbox.astype(int)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            if object_name == "person":
                try:
                    latitude = 37.7749
                    longitude = -122.4194

                    data = {
                        'latitude': latitude,
                        'longitude': longitude
                    }
                    
                    response = requests.post(server_alert_url, json=data)
                    
                    if response.status_code == 200:
                        print("Human detected, location buffered.")
                    else:
                        print(f"Failed to alert server: {response.text}")
                
                except Exception as e:
                    print(f"Error sending alert to server: {e}")
    
    cv2.imshow('frame', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
