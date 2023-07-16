import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Route } from "react-router-dom";
import { useAuth } from "../../context/Authentication/AuthContext";
import Navbar from "./Navbar";
import "@testing-library/jest-dom";

jest.mock("../../context/Authentication/AuthContext");

describe("Navbar component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      logout: jest.fn(),
      isLoggedIn: true,
    });
  });
  it("calls the signup function with correct arguments on form submission", async () => {
    render(
      <Route>
        <Navbar />
      </Route>
    );

    // Click on logout button
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    // Assert that the signup function is called with the correct arguments

    await waitFor(() => {
      expect(useAuth().logout).toHaveBeenCalled();
    });
  });
});
