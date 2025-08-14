import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AirportSelection from "../components/AirportSelection";

const airports = [
  {
    id: 1,
    city: "New York",
    state: "NY",
    name: "John F. Kennedy International Airport",
    code: "JFK",
    label: "New York, NY, John F. Kennedy International Airport, JFK",
  },
  {
    id: 2,
    city: "Los Angeles",
    state: "CA",
    name: "Los Angeles International Airport",
    code: "LAX",
    label: "Los Angeles, CA, Los Angeles International Airport, LAX",
  },
];

function renderComp(extraProps = {}) {
  const on_change = vi.fn();
  render(
    <MemoryRouter>
      <AirportSelection
        airports={airports}
        on_change={on_change}
        airportsLoading={false}
        reload={() => {}}
        {...extraProps}
      />
    </MemoryRouter>
  );
  return { on_change };
}

test("renders the four labeled inputs", () => {
  renderComp();

  expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Airport code/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Airport name/i)).toBeInTheDocument();
});

test("prefills inputs when selecting an airport from dropdown", () => {
  renderComp();

  const select = screen.getByRole("combobox");
  fireEvent.change(select, { target: { value: "1" } });

  expect(screen.getByLabelText(/City/i)).toHaveValue("New York");
  expect(screen.getByLabelText(/State/i)).toHaveValue("NY");
  expect(screen.getByLabelText(/Airport code/i)).toHaveValue("JFK");
  expect(screen.getByLabelText(/Airport name/i)).toHaveValue(
    "John F. Kennedy International Airport"
  );
});

test("reload button is disabled when airportsLoading is true", () => {
  renderComp({ airportsLoading: true });
  const buttons = screen.getAllByRole("button");
  const reloadBtn = buttons.find((b) =>
    b.getAttribute("class")?.includes("reload-btn")
  );
  expect(reloadBtn).toBeDisabled();
});
