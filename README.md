# SkyPulse - Advanced Live Weather Dashboard

A frontend-only live weather dashboard built with HTML5, CSS3, and
JavaScript, using the public Open-Meteo REST API for geocoding and
forecast data and browser localStorage as its data store. No
traditional Node.js/PHP/MySQL backend is required.

## 1. Run Locally

Open `index.html` directly in a browser, or serve the folder with any
static file server (e.g. the VS Code "Live Server" extension) for the
best experience with relative paths.

## 2. Deploy the Frontend

Push this project to a GitHub repository and enable GitHub Pages
(Settings > Pages), or deploy the folder to any static host such as
Netlify. No server-side runtime is needed - only the files in this
project. The Open-Meteo REST API requires no API key.

## Project Structure

```
SkyPulse_Project/
|-- index.html         Home page - search and current conditions
|-- forecast.html      Forecast page with day tabs and auto-refresh
|-- compare.html       Saved-city comparison page
|-- manage.html        PIN-gated saved-city management
|-- css/
|   |-- style.css      Main styling
|   `-- manage.css     Manage dashboard styling
|-- js/
|   |-- config.js      API endpoints and constants
|   |-- app.js         Home page logic
|   |-- forecast.js    Forecast + auto-refresh timer logic
|   |-- compare.js     Comparison logic
|   `-- manage.js      Manage CRUD logic
`-- README.md
```

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | geocoding-api.open-meteo.com/v1/search | Resolve a city name to coordinates |
| GET | api.open-meteo.com/v1/forecast | Current conditions and forecast data |

## Security Note

The `manage.html` page has no real authentication built in - the PIN
check happens entirely in the browser. This is acceptable for an
internship/demo project, but do not use this as-is for a real
production system. Add server-side authentication/authorization
before any production use.
