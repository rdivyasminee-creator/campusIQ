# CampusIQ - MongoDB Atlas Backend Integration

This backend is built with **Node.js, Express, and Mongoose** to persist telemetry from ESP32 Wokwi simulations and synchronize smart facility controls.

## How to Connect Your Own MongoDB Atlas Cluster

1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** and sign in to your free account.
2. In your Cluster dashboard, click **"Connect"** → **"Drivers"** (Node.js).
3. Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campusiq?retryWrites=true&w=majority
   ```
4. Open the `backend/.env` file in this directory and paste your connection string:
   ```env
   PORT=5000
   MONGODB_URI=your_copied_connection_string_here
   ```
5. Save the file. The server will automatically connect to your live Atlas database!

## Collections Created in MongoDB Atlas

| Collection | Schema | Purpose |
| :--- | :--- | :--- |
| `telemetries` | `Telemetry` | Ingests live sensor readings from ESP32 Wokwi (Waste level, Water, Energy, AQI, Distance, Status) |
| `facilitycontrols` | `FacilityControl` | Persists classroom switches across floors (Ground, 1st, 2nd, Top) |
| `auditlogs` | `AuditLog` | Audit trail of every ON/OFF toggle with timestamps |

## API Endpoints

- `GET /` - Live server status, MongoDB connection health, and API directory
- `GET /api/campus-info` - Verified institutional profile
- `POST /api/iot-data` - Ingests ESP32 telemetry readings into Atlas
- `GET /api/iot-data` - Fetches the latest telemetry record
- `GET /api/telemetry/history` - Fetches historical telemetry records
- `GET /api/controls` - Fetches stored switch states
- `POST /api/controls` - Updates switch states and records an audit log
