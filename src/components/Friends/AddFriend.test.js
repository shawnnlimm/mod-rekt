import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "../../context/Authentication/AuthContext";
import "@testing-library/jest-dom";
import AddFriend from "./AddFriend";

jest.mock("../../context/Authentication/AuthContext", () => ({
    useAuth: jest.fn(),
}));

describe("AddFriend component", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUsername: "123456",
      });
    });
  
    it("displays search bar correctly", async () => {
        render(<AddFriend />);
        expect(screen.getByPlaceholderText("Enter friend's username...")).toBeInTheDocument();
        expect(screen.getByText("Send Friend Request")).toBeInTheDocument();
    });

    it("send friend request function is able to be called", async () => {
        const handleSendFriendRequest = jest.fn();
        const handleInputChange = jest.fn();
        const friendUsername = "test";

        render(
            <div className="flex justify-center space-x-4 my-10">
            <input
                type="text"
                value={friendUsername}
                onChange={handleInputChange}
                placeholder="Enter friend's username..."
                className="w-1/4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
                onClick={handleSendFriendRequest}
                className="px-4 py-2 text-black bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring focus:border-yellow-500"
            >
                Send Friend Request
            </button>
            </div>
        );

        fireEvent.click(screen.getByRole("button", { name: "Send Friend Request" }));
        expect(handleSendFriendRequest).toHaveBeenCalledTimes(1);
      });
});
  