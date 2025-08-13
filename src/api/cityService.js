import { API_BASE_URL } from "./config";

export async function getCitiesWithAirports(signal) {
  const url = `${API_BASE_URL}/api/cities?show-airports=true`;

  console.log("API_BASE_URL =", API_BASE_URL);
  console.log("GET", `${API_BASE_URL}/api/cities?show-airports=true`);

  const res = await fetch(url, { signal });
  if (!res.ok)
    throw new Error(`Database error when loading airports: ${res.status}`);

  return res.json();
}
