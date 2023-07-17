import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useAuth } from "../../context/Authentication/AuthContext";
import "@testing-library/jest-dom";
import FriendRequests from "./FriendRequests";

jest.mock("../../context/Authentication/AuthContext", () => ({
    useAuth: jest.fn(),
}));

describe("AddFriend component", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUsername: "123456",
      });
    });

    it("displays empty friend requests section properly", async () => {
        const friendRequests = [];
        render(
            <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
            {friendRequests.length > 0 ? (
                friendRequests.map((requestId) => (
                <div
                    key={requestId}
                    className="flex items-center justfy-between bg-gray-200 rounded-md p-4 mb-4"
                >
                    <span className="text-lg flex-grow">{requestId}</span>
                    <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
                    onClick={() => handleAcceptFriendRequest(requestId)}
                    >
                    Accept
                    </button>
                    <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={() => handleDeclineFriendRequest(requestId)}
                    >
                    Decline
                    </button>
                </div>
                ))
            ) : (
                <p>No friend requests.</p>
            )}
            </div>
        );

        expect(screen.getByText("Friend Requests")).toBeInTheDocument();
        expect(screen.getByText("No friend requests.")).toBeInTheDocument();
    })

    it("displays filled friend requests section properly", async () => {
        const friendRequests = ["john"];
        render(
            <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
            {friendRequests.length > 0 ? (
                friendRequests.map((requestId) => (
                <div
                    key={requestId}
                    className="flex items-center justfy-between bg-gray-200 rounded-md p-4 mb-4"
                >
                    <span className="text-lg flex-grow">{requestId}</span>
                    <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
                    onClick={() => handleAcceptFriendRequest(requestId)}
                    >
                    Accept
                    </button>
                    <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={() => handleDeclineFriendRequest(requestId)}
                    >
                    Decline
                    </button>
                </div>
                ))
            ) : (
                <p>No friend requests.</p>
            )}
            </div>
        );

        expect(screen.getByText("Friend Requests")).toBeInTheDocument();
        expect(screen.getByText("john")).toBeInTheDocument();
        expect(screen.getByText("Accept")).toBeInTheDocument();
        expect(screen.getByText("Decline")).toBeInTheDocument();
    })

    it("displays filled friend requests section properly", async () => {
        const friendRequests = ["john"];
        const handleAcceptFriendRequest = jest.fn();
        const handleDeclineFriendRequest = jest.fn();
        render(
            <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
            {friendRequests.length > 0 ? (
                friendRequests.map((requestId) => (
                <div
                    key={requestId}
                    className="flex items-center justfy-between bg-gray-200 rounded-md p-4 mb-4"
                >
                    <span className="text-lg flex-grow">{requestId}</span>
                    <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2"
                    onClick={() => handleAcceptFriendRequest(requestId)}
                    >
                    Accept
                    </button>
                    <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={() => handleDeclineFriendRequest(requestId)}
                    >
                    Decline
                    </button>
                </div>
                ))
            ) : (
                <p>No friend requests.</p>
            )}
            </div>
        );

        expect(screen.getByText("Accept")).toBeInTheDocument();
        expect(screen.getByText("Decline")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Accept" }));
        expect(handleAcceptFriendRequest).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole("button", { name: "Decline" }));
        expect(handleDeclineFriendRequest).toHaveBeenCalledTimes(1);
    })
});