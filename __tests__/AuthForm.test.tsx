import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

describe("AuthForm", () => {
  let loginMock: jest.Mock;
  let registerMock: jest.Mock;
  let pushMock: jest.Mock;

  beforeEach(() => {
    const authContext = useAuth();
    loginMock = authContext.login as jest.Mock;
    registerMock = authContext.register as jest.Mock;
    (useAuth as jest.Mock).mockReturnValue({
      login: loginMock, 
      register: registerMock,
    });
    const router = useRouter();
    (useRouter as jest.Mock).mockReturnValue(router);
    pushMock = router.push as jest.Mock;
  });

  it("renders login form by default", () => {
    render(<AuthForm />);

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("allows user to login successfully", async () => {
    loginMock.mockResolvedValue(true);
    render(<AuthForm />);
    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    const loginButton = screen.getByRole("button", { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("testuser", "password123");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error toast on failed login", async () => {
    loginMock.mockResolvedValue(false);
    render(<AuthForm />);

    await userEvent.type(screen.getByLabelText(/username/i), "wronguser");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("wronguser", "wrongpass");
      expect(toast.error).toHaveBeenCalledWith("Login failed");
    });
  });

  it("switches to register tab and allows user to register", async () => {
    registerMock.mockResolvedValue(true);
    render(<AuthForm />);

    await userEvent.click(screen.getByText(/register/i));
    await userEvent.type(screen.getByLabelText(/username/i), "newuser");
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "newuser@example.com"
    );
    await userEvent.type(screen.getByLabelText(/password/i), "newpassword");
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith(
        "newuser",
        "newuser@example.com",
        "newpassword"
      );
      expect(toast.success).toHaveBeenCalledWith("Registration successful");
    });
  });
});
