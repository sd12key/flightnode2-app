import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import AirportFlightDisplay from "../components/AirportFlightDisplay";

const makeFlights = () => ({
  arrivals: [
    {
      id: 1,
      flightNumber: "DL202",
      arrivalTime: "2024-01-22T14:20:00",
      arrivalGate: { id: 120, name: "A1" },
      arrivalAirport: {
        id: 19,
        name: "Hartsfield-Jackson Atlanta International Airport",
        code: "ATL",
        cityName: "Atlanta",
        cityState: "GA",
      },
      aircraft: {
        id: 11,
        type: "Airbus A321neo",
        airlineName: "American Airlines",
        capacity: 196,
      },
      departureAirport: {
        id: 4,
        name: "Los Angeles International Airport",
        code: "LAX",
        cityName: "Los Angeles",
        cityState: "CA",
      },
      departureGate: { id: 36, name: "T1-1" },
    },
  ],
  departures: [
    {
      id: 10,
      flightNumber: "UA101",
      departureTime: "2024-01-23T09:15:00",
      departureGate: { id: 42, name: "B5" },
      departureAirport: {
        id: 19,
        name: "Hartsfield-Jackson Atlanta International Airport",
        code: "ATL",
        cityName: "Atlanta",
        cityState: "GA",
      },
      aircraft: {
        id: 21,
        type: "Boeing 737",
        airlineName: "United Airlines",
        capacity: 174,
      },
      arrivalAirport: {
        id: 25,
        name: "Miami International Airport",
        code: "MIA",
        cityName: "Miami",
        cityState: "FL",
      },
      arrivalGate: { id: 55, name: "E3" },
    },
  ],
});

test("renders flight numbers when flights provided", () => {
  const flights = makeFlights();
  render(<AirportFlightDisplay flights={flights} />);

  expect(screen.getByText("DL202")).toBeInTheDocument();
  expect(screen.getByText("UA101")).toBeInTheDocument();
});

test("renders nothing flight-related when arrays are empty", () => {
  const flights = { arrivals: [], departures: [] };
  render(<AirportFlightDisplay flights={flights} />);
  expect(screen.queryByText("DL202")).not.toBeInTheDocument();
  expect(screen.queryByText("UA101")).not.toBeInTheDocument();
});

test("shows grouped airport info (basic smoke: city or code present)", () => {
  const flights = makeFlights();
  render(<AirportFlightDisplay flights={flights} />);
  expect(screen.getAllByText(/ATL|Atlanta/i).length).toBeGreaterThan(0);
});
