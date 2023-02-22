export API_KEY=AIzaSyDfPajw8nVfx2xMgQOZU9wBv7E-4pD3naQ
curl https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions?key=$API_KEY \
  -H "Content-Type: application/json" -d \
  '{
    "flights": [
      {
        "origin": "ZRH",
        "destination": "CDG",
        "operating_carrier_code": "AF",
        "flight_number": 1115,
        "departure_date": {"year": 2023, "month": 11, "day": 1}
      },
      {
        "origin": "CDG",
        "destination": "BOS",
        "operating_carrier_code": "AF",
        "flight_number": 334,
        "departure_date": {"year": 2023, "month": 11, "day": 1}
      },
      {
        "origin": "ZRH",
        "destination": "BOS",
        "operating_carrier_code": "LX",
        "flight_number": 54,
        "departure_date": {"year": 2023, "month": 7, "day": 1}
      }
    ]
  }'