import "@testing-library/jest-dom";
import { render, screen } from "@/test-utils";
import HomePage from "../app/page";

describe("Home Page", () => {
  it("renders welcome heading", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Welcome");
  });
});
