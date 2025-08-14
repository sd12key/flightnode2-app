import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddFlight from "../components/AddFlight";
import * as flightService from "../api/flightService";
import "@testing-library/jest-dom";

describe("AddFlight", () => {
  const mockStart = vi.fn();
  const mockStop = vi.fn();
  const mockAfterCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithRouter(ui) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  }

  it("renders all input fields and create button", () => {
    renderWithRouter(
      <AddFlight
        onStartWorking={mockStart}
        onStopWorking={mockStop}
        onAfterCreate={mockAfterCreate}
        airlines={[]}
        airports={[]}
      />
    );

    expect(screen.getByLabelText(/Flight Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Airline and Aircraft Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Departure City, State/i)).toBeInTheDocument();
    expect(screen.getByText(/Arrival City, State/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("shows validation error when required fields are missing", async () => {
    renderWithRouter(<AddFlight airlines={[]} airports={[]} />);
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
    });
  });
});
