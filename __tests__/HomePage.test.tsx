import "@testing-library/jest-dom";
import { render, screen } from "@/test.utils";
import Page from "../app/page";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);
    screen.debug();
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Welcome");
  });
});
