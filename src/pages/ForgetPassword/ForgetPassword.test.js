import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Route } from "react-router-dom";
import { useAuth } from "../../context/Authentication/AuthContext";
import ForgetPassword from "./ForgetPassword";
import "@testing-library/jest-dom";

jest.mock("../../context/Authentication/AuthContext");

describe("Forget Password component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      forgetPassword: jest.fn(),
    });
  });

  it("calls the forgetPassword function with correct arguments on form submission", async () => {
    render(
      <Route>
        <ForgetPassword />
      </Route>
    );

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "user1@gmail.com" },
    });

    // Click on logout button
    fireEvent.click(
      screen.getByRole("button", { name: "Send Password Reset Email" })
    );

    // Assert that the signup function is called with the correct arguments

    expect(useAuth().forgetPassword).toHaveBeenCalledWith("user1@gmail.com");
  });
});
