import { render, screen, waitFor } from "@testing-library/react";
import { redirect } from "next/navigation";
import AdminDashboard from "@/app/admin/page";
import { useAuth } from "@/lib/auth-context";

// Mock the DashboardHeader component
jest.mock("@/components/DashboardHeader", () => ({
  DashboardHeader: () => <div data-testid="mock-dashboard-header">Header</div>,
}));

describe("AdminDashboard", () => {
  const mockUsers = [
    {
      username: "user1",
      email: "user1@example.com",
      createdAt: "2025-01-15T12:00:00Z",
    },
    {
      username: "user2",
      email: "user2@example.com",
      createdAt: "2025-02-20T14:30:00Z",
    },
  ];

  const mockGetAllUsers = jest.fn().mockReturnValue(mockUsers);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects to home if user is not logged in", async () => {
    // Mock auth context with no user
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      getAllUsers: mockGetAllUsers,
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  test("redirects to profile if user is not admin", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: "regular-user" },
      getAllUsers: mockGetAllUsers,
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/profile");
    });
  });

  test("renders admin dashboard with user data for admin users", async () => {
    // Mock auth context with admin user
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: "admin" },
      getAllUsers: mockGetAllUsers,
    });

    render(<AdminDashboard />);

    expect(screen.getByTestId("mock-dashboard-header")).toBeInTheDocument();

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Registered Users")).toBeInTheDocument();

    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();

    expect(screen.getByText("user2")).toBeInTheDocument();
    expect(screen.getByText("user2@example.com")).toBeInTheDocument();

    expect(mockGetAllUsers).toHaveBeenCalled();
  });

  test("displays message when no users are found", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: "admin" },
      getAllUsers: jest.fn().mockReturnValue([]),
    });

    render(<AdminDashboard />);

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });
});
