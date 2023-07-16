import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../context/Authentication/AuthContext";
import Login from "./Login";
import "@testing-library/jest-dom";

jest.mock("../../context/Authentication/AuthContext");

describe("Login component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      login: jest.fn(),
    });
  });
  it("calls the login function with correct arguments on form submission", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "user1@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    // Assert that the signup function is called with the correct arguments

    await waitFor(() => {
      expect(useAuth().login).toHaveBeenCalledWith(
        "user1@gmail.com",
        "Password123"
      );
    });
  });
});
