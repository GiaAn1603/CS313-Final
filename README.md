# Đồ án môn Khai thác dữ liệu và ứng dụng (CS313)

Một **ứng dụng web** giúp theo dõi và dự đoán đường đi của các cơn bão, tích hợp **mô hình AI dự đoán vị trí của bão sau các khoảng thời gian cố định** và trực quan hóa trên bản đồ.

## Technologies Used
### Frontend
- **React.js** – Library để xây dựng giao diện web
- **TypeScript** – Type-safe JavaScript
- **Shadcn UI** – Component UI sẵn có, đẹp và responsive
- **Leaflet / React-Leaflet** – Hiển thị bản đồ và các đường đi bão
- **OpenWeather API** – Lấy dữ liệu thời tiết và bão

### Backend
- **Go Fiber** – Framework web nhẹ, hiệu năng cao
- **MongoDB Atlas** – Cơ sở dữ liệu NoSQL lưu trữ dữ liệu bão

### Models
- **Flask API** - Dùng để viết API cho model dự đoán vị trí của bão sau các khoảng thời gian cố định
- **Model Transformer** - Dùng để học dữ liệu về vị trí của các cơn bão
- **Dataset** - Được crawl từ trang https://ncics.org/ibtracs/ gồm các cơn bão thuộc Tây Thái Bình Dương từ năm 1975-2025 hiện nay

## Cấu hình .env.frontend
```bash
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
VITE_BE_BASE_URL=YOUR_BE_BASE_URL
VITE_MODEL_API_URL=YOUR_MODEL_API_URL
```

## Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

## Cấu hình .env.backend
```bash
PORT=YOUR_PORT
MONGO_URI=YOUR_MONGO_URI
DB_NAME=YOUR_DB_NAME
FE_BASE_URL=YOUR_FE_BASE_URL
```

## Chạy Backend
```bash
cd backend
go mod tidy
go run main.go
```

## Chạy Model
```bash
cd model
python api.py
```
