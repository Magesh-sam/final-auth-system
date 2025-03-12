import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "@/lib/auth-context";
import Profile from "@/app/profile/page";
import { redirect } from "next/navigation";



jest.mock("@/components/DashboardHeader", () => ({
  DashboardHeader: () => (
    <div data-testid="dashboard-header">Dashboard Header</div>
  ),
}));

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects to home page when user is not authenticated", async () => {
    // Provide all required properties for AuthContextType
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      login: jest.fn().mockResolvedValue(false),
      register: jest.fn().mockResolvedValue(false),
      logout: jest.fn(),
      getAllUsers: jest.fn().mockReturnValue([]),
    });

    render(<Profile />);

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  test("renders profile content when user is authenticated", async () => {
    // Mock authenticated user
    const mockUser = { username: "testuser" };
    const mockLogout = jest.fn();

    // Provide all required properties for AuthContextType
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      login: jest.fn().mockResolvedValue(true),
      register: jest.fn().mockResolvedValue(true),
      logout: mockLogout,
      getAllUsers: jest.fn().mockReturnValue([mockUser]),
    });

    render(<Profile />);

    expect(
      screen.getByText(`Welcome, ${mockUser.username}!`)
    ).toBeInTheDocument();

    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();

    expect(
      screen.getByText("You have successfully logged into your account.")
    ).toBeInTheDocument();

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
