# PolyMatic API Specifications

## WebSocket Protocol

### Connection
`ws://<host>:<port>/stream`

### Messages

#### Server to Client

**1. Entity Update**
```json
{
  "type": "ENTITY_UPDATE",
  "layer": "aircraft",
  "data": [
    {
      "id": "flight-123",
      "lat": 34.05,
      "lng": -118.24,
      "alt": 10000,
      "heading": 45,
      "metadata": {
        "callsign": "AAL123",
        "speed": 450
      }
    }
  ]
}
```

**2. Event Alert**
```json
{
  "type": "EVENT_ALERT",
  "data": {
    "id": "evt-456",
    "timestamp": "2026-03-09T19:21:36Z",
    "title": "GPS INTERFERENCE ACTIVE",
    "location": "Eastern Europe",
    "severity": "high"
  }
}
```
