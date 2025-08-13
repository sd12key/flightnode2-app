import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DatePicker from "../components/DatePicker";

test("renders with a label", () => {
  render(<DatePicker label="Start Date" value="" onChange={() => {}} />);
  expect(screen.getByText("Start Date")).toBeInTheDocument();
});

test("shows controlled value", () => {
  render(
    <DatePicker label="End Date" value="2025-08-12" onChange={() => {}} />
  );
  const input = screen.getByLabelText("End Date");
  expect(input).toHaveValue("2025-08-12");
});

test("calls onChange when user picks a date", () => {
  const handle = vi.fn();
  render(<DatePicker label="Pick a date" value="" onChange={handle} />);
  const input = screen.getByLabelText("Pick a date");
  fireEvent.change(input, { target: { value: "2025-08-12" } });
  expect(handle).toHaveBeenCalledWith("2025-08-12");
});
