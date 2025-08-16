import { organizeFlightsByAirport } from "../api/mappers";
import "./AirportFlightDisplay.css";

export default function AirportFlightDisplay({ flights }) {
  const airportData = organizeFlightsByAirport(flights);

  const formatDate = (dateString) => dateString.split("T")[0];
  const formatTime = (dateString) => dateString.split("T")[1].slice(0, 5);

  return (
    <div className="afd-main">
      {airportData.map(({ airportInfo, arrivals, departures }) => (
        <div key={airportInfo.id} className="afd-airport-section">
          <h2 className="aft-airport-name">
            {airportInfo.cityName}, {airportInfo.cityState}
            <span className="aft-airport-details">
              {" "}
              ({airportInfo.name}, {airportInfo.code})
            </span>
          </h2>

          {arrivals.length > 0 && (
            <div className="afd-arrivals">
              <h3 className="aft-arrivals">Arrivals</h3>
              <div className="aft-table-container">
                <table className="aft-table">
                  <thead>
                    <tr>
                      <th className="aft-col-date">Date</th>
                      <th className="aft-col-time">Time</th>
                      <th className="aft-col-gate">Gate</th>
                      <th className="aft-col-flight">Flight</th>
                      <th className="aft-col-airline">Airline</th>
                      <th className="aft-col-city">From City</th>
                      <th className="aft-col-airport">From Airport</th>
                      <th className="aft-col-aircraft">Aircraft</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrivals.map((flight) => (
                      <tr key={`arrival-${flight.id}`}>
                        <td className="aft-col-date">
                          {formatDate(flight.arrivalTime)}
                        </td>
                        <td className="aft-col-time">
                          {formatTime(flight.arrivalTime)}
                        </td>
                        <td className="aft-col-gate">
                          {flight.arrivalGate.name}
                        </td>
                        <td className="aft-col-flight">
                          {flight.flightNumber}
                        </td>
                        <td className="aft-col-airline">
                          {flight.aircraft.airlineName}
                        </td>
                        <td className="aft-col-city">
                          {flight.departureAirport.cityName},{" "}
                          {flight.departureAirport.cityState}
                        </td>
                        <td className="aft-col-airport">
                          {flight.departureAirport.name} (
                          {flight.departureAirport.code})
                        </td>
                        <td className="aft-col-aircraft">
                          {flight.aircraft.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {departures.length > 0 && (
            <div className="afd-departures">
              <h3 className="aft-departures">Departures</h3>
              <div className="aft-table-container">
                <table className="aft-table">
                  <thead>
                    <tr>
                      <th className="aft-col-date">Date</th>
                      <th className="aft-col-time">Time</th>
                      <th className="aft-col-gate">Gate</th>
                      <th className="aft-col-flight">Flight</th>
                      <th className="aft-col-airline">Airline</th>
                      <th className="aft-col-city">To City</th>
                      <th className="aft-col-airport">To Airport</th>
                      <th className="aft-col-aircraft">Aircraft</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departures.map((flight) => (
                      <tr key={`departure-${flight.id}`}>
                        <td className="aft-col-date">
                          {formatDate(flight.departureTime)}
                        </td>
                        <td className="aft-col-time">
                          {formatTime(flight.departureTime)}
                        </td>
                        <td className="aft-col-gate">
                          {flight.departureGate.name}
                        </td>
                        <td className="aft-col-flight">
                          {flight.flightNumber}
                        </td>
                        <td className="aft-col-airline">
                          {flight.aircraft.airlineName}
                        </td>
                        <td className="aft-col-city">
                          {flight.arrivalAirport.cityName},{" "}
                          {flight.arrivalAirport.cityState}
                        </td>
                        <td className="aft-col-airport">
                          {flight.arrivalAirport.name} (
                          {flight.arrivalAirport.code})
                        </td>
                        <td className="aft-col-aircraft">
                          {flight.aircraft.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
