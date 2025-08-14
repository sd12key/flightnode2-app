import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddAirline from "../components/AddAirline";
import * as airlineService from "../api/airlineService";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("AddAirline", () => {
  const mockStart = vi.fn();
  const mockStop = vi.fn();
  const mockAfterCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form correctly", () => {
    render(
      <MemoryRouter>
        <AddAirline
          onStartWorking={mockStart}
          onStopWorking={mockStop}
          onAfterCreate={mockAfterCreate}
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Airline Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it("shows validation error on empty name", async () => {
    render(
      <MemoryRouter>
        <AddAirline />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Airline name cannot be empty/i)
      ).toBeInTheDocument();
    });
  });

  it("calls createAirline and shows success", async () => {
    const mockResponse = { id: 1, name: "Test Airline" };
    vi.spyOn(airlineService, "createAirline").mockResolvedValueOnce(
      mockResponse
    );

    render(
      <MemoryRouter>
        <AddAirline onAfterCreate={mockAfterCreate} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Airline Name/i), {
      target: { value: "Test Airline" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Airline created successfully/i)
      ).toBeInTheDocument();
      expect(mockAfterCreate).toHaveBeenCalled();
    });
  });

  it("shows server error on failure", async () => {
    const error = {
      status: 409,
      message: "Airline 'Test Airline' already exists.",
    };

    vi.spyOn(airlineService, "createAirline").mockRejectedValueOnce(error);

    render(
      <MemoryRouter>
        <AddAirline />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Airline Name/i), {
      target: { value: "Test Airline" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(
        screen.getByText(/\(409\) Error creating airline/i)
      ).toBeInTheDocument();
    });
  });
});
