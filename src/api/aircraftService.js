import { API_BASE_URL } from "./config";

export async function createAircraft(payload, signal) {
  const res = await fetch(`${API_BASE_URL}/api/aircraft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
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
