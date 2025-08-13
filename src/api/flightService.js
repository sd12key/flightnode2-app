import { API_BASE_URL } from "./config";

export async function searchFlights(params, signal) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/flight-search?${query}`;

  console.log("GET", url);

  const res = await fetch(url, { signal });
  console.log("Response status:", res.status);

  if (!res.ok) throw new Error(`Error ${res.status}`);

  const data = await res.json();
  console.log("Received flights data:", data);
  return data;
}
