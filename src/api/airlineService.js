import { API_BASE_URL } from "./config";

export async function getAirlinesWithAircrafts(signal) {
  const url = `${API_BASE_URL}/api/airlines?show-aircrafts=true`;
  const res = await fetch(url, { signal });
  if (!res.ok)
    throw new Error(`Database error when loading airlines: ${res.status}`);
  return res.json();
}

export async function createAirline(name, signal) {
  const res = await fetch(`${API_BASE_URL}/api/airline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    let errorBody = "";
    try {
      const data = await res.json();
      errorBody = data?.error || JSON.stringify(data);
    } catch {
      errorBody = await res.text();
    }

    throw {
      status: res.status,
      message: errorBody,
    };
  }

  return res.json();
}
