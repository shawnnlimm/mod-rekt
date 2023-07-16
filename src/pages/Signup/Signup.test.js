import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../context/Authentication/AuthContext";
import Signup from "./Signup";
import "@testing-library/jest-dom";

jest.mock("../../context/Authentication/AuthContext");

describe("Signup component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      signup: jest.fn(),
    });
  });
  it("calls the signup function with correct arguments on form submission", async () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "user1@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByTestId("password-confirm-input"), {
      target: { value: "Password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Assert that the signup function is called with the correct arguments

    await waitFor(() => {
      expect(useAuth().signup).toHaveBeenCalledWith(
        "user1",
        "user1@gmail.com",
        "Password123"
      );
    });
  });

  it("users are unable to signup with existing email", async () => {
    useAuth.mockReturnValue({
      signup: jest.fn().mockReturnValue(false),
    });
    useAuth().signup.mockRejectedValue({ code: "Failed to create an account" });

    const { getByText } = render(
      <Router>
        <Signup />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "user1@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByTestId("password-confirm-input"), {
      target: { value: "Password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    // Assert that the signup function is called with the correct arguments

    await waitFor(() => {
      expect(getByText("Failed to create an account")).toBeInTheDocument();
    });
  });
});
