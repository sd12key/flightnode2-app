// AddAircraft.test.jsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddAircraft from "../components/AddAircraft";
import * as aircraftService from "../api/aircraftService";
import "@testing-library/jest-dom";

describe("AddAircraft", () => {
  const mockStart = vi.fn();
  const mockStop = vi.fn();
  const mockAfterCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <MemoryRouter>
        <AddAircraft
          onStartWorking={mockStart}
          onStopWorking={mockStop}
          onAfterCreate={mockAfterCreate}
          airlines={props.airlines || []}
          loadingAirlines={props.loadingAirlines || false}
        />
      </MemoryRouter>
    );
  };

  it("renders all input fields and submit button", () => {
    renderComponent();

    expect(screen.getByLabelText("Aircraft Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Capacity")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Airline")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("shows error when submitting with missing fields", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("All fields are required.")).toBeInTheDocument();
    });
  });

  it("creates aircraft successfully and shows success message", async () => {
    const mockResponse = {
      id: 1,
      type: "A320",
      capacity: 150,
      airline: { id: 1, name: "Test Airline" },
    };

    const mockAirlines = [{ id: 1, name: "Test Airline" }];
    vi.spyOn(aircraftService, "createAircraft").mockResolvedValueOnce(
      mockResponse
    );

    renderComponent({ airlines: mockAirlines });

    fireEvent.change(screen.getByLabelText("Aircraft Type"), {
      target: { value: "A320" },
    });

    fireEvent.change(screen.getByLabelText("Capacity"), {
      target: { value: "150" },
    });

    fireEvent.change(screen.getByLabelText("Select Airline"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(
        screen.getByText("Aircraft created successfully.")
      ).toBeInTheDocument();
      expect(mockAfterCreate).toHaveBeenCalled();
    });
  });

  it("displays server-side error message", async () => {
    vi.spyOn(aircraftService, "createAircraft").mockRejectedValueOnce({
      status: 400,
      message: "Invalid aircraft type or capacity",
    });

    renderComponent({ airlines: [{ id: 1, name: "Airline A" }] });

    fireEvent.change(screen.getByLabelText("Aircraft Type"), {
      target: { value: "!" },
    });

    fireEvent.change(screen.getByLabelText("Capacity"), {
      target: { value: "-100" },
    });

    fireEvent.change(screen.getByLabelText("Select Airline"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(
        screen.getByText("(400) Error creating aircraft.")
      ).toBeInTheDocument();
    });
  });
});
