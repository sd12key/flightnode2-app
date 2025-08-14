// src/api/airportService.js
import { API_BASE_URL } from "./config";

export async function getAirportsWithCities(signal) {
  const url = `${API_BASE_URL}/api/airports?show-gates=true`;
  const res = await fetch(url, { signal });
  if (!res.ok)
    throw new Error(`Database error when loading airports: ${res.status}`);

  return res.json();
}
