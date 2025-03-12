import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleTheme } from "@/components/ToggleTheme";
import { useTheme } from "next-themes";

describe("ToggleTheme component", () => {
  it("renders the toggle button", () => {
    render(<ToggleTheme />);
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("opens the dropdown when button is clicked", async () => {
    render(<ToggleTheme />);
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(button);
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("calls setTheme with the correct value when an option is clicked", async () => {
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: setThemeMock,
      themes: ["light", "dark", "system"],
    });

    render(<ToggleTheme />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    await user.click(screen.getByText("Dark"));

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});
