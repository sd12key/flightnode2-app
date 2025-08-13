import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Button from "../components/Button";

test("renders button", () => {
  render(
    <MemoryRouter>
      <Button>Test</Button>
    </MemoryRouter>
  );
  expect(screen.getByRole("button")).toBeInTheDocument();
});

test("navigates on click", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Button to="/test-route">Navigate</Button>} />
        <Route path="/test-route" element={<div>On test route</div>} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByText("Navigate"));

  expect(screen.getByText("On test route")).toBeInTheDocument();
});
