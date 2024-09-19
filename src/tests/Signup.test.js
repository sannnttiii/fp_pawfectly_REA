import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Signup from "../pages/Signup";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows error if passwords do not match", async () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    expect(signUpButton).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password124" },
    });

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /❌ Password and confirm password should be the same./i
        )
      ).toBeInTheDocument();
    });
  });

  test("submits form and redirects on successful signup", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user_id: "12345" }),
      })
    );

    render(
      <Router>
        <Signup />
      </Router>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });
    expect(signUpButton).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8082/api/signup",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/preprofile");
      expect(localStorage.getItem("isLogin")).toBe("true");
      expect(localStorage.getItem("userID")).toBe("12345");
    });
  });
});
