import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "../../context/Authentication/AuthContext";
import "@testing-library/jest-dom";
import FriendList from "./FriendList"

jest.mock("../../context/Authentication/AuthContext", () => ({
    useAuth: jest.fn(),
}));

describe("FriendList component", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUsername: "123456",
      });
    });
});