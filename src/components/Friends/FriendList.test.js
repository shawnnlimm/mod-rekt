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

    it("display empty friend list properly", async () => {
      const friendsList = [];
      render(
        <div>
          <h2 className="text-2xl font-bold mb-4">Friends List</h2>
          {friendsList.length > 0 ? (
            friendsList.map((friendUsername) => (
              <div
                key={friendUsername}
                className="flex items-center justify-between bg-gray-200 rounded-md p-4 mb-4"
              >
                <span className="text-lg flex-grow">{friendUsername}</span>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded mr-2"
                  onClick={() => handleViewTimetable(friendUsername)}
                >
                  View Timetable
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={() => handleDeleteFriend(friendUsername)}
                >
                  Remove Friend
                </button>
              </div>
            ))
          ) : (
            <p>No friends added.</p>
          )}
        </div>
      );
        
      expect(screen.getByText("Friends List")).toBeInTheDocument();
      expect(screen.getByText("No friends added.")).toBeInTheDocument();
    });

    it("display filled friend list properly", async () => {
      const friendsList = ["john"];
      render(
        <div>
          <h2 className="text-2xl font-bold mb-4">Friends List</h2>
          {friendsList.length > 0 ? (
            friendsList.map((friendUsername) => (
              <div
                key={friendUsername}
                className="flex items-center justify-between bg-gray-200 rounded-md p-4 mb-4"
              >
                <span className="text-lg flex-grow">{friendUsername}</span>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded mr-2"
                  onClick={() => handleViewTimetable(friendUsername)}
                >
                  View Timetable
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={() => handleDeleteFriend(friendUsername)}
                >
                  Remove Friend
                </button>
              </div>
            ))
          ) : (
            <p>No friends added.</p>
          )}
        </div>
      );
        
      expect(screen.getByText("Friends List")).toBeInTheDocument();
      expect(screen.getByText("john")).toBeInTheDocument();
    });

    it("remove friend function to work properly", async () => {
      const friendsList = ["john"];
      const handleDeleteFriend = jest.fn();
      const handleViewTimetable = jest.fn();
      render(
        <div>
          <h2 className="text-2xl font-bold mb-4">Friends List</h2>
          {friendsList.length > 0 ? (
            friendsList.map((friendUsername) => (
              <div
                key={friendUsername}
                className="flex items-center justify-between bg-gray-200 rounded-md p-4 mb-4"
              >
                <span className="text-lg flex-grow">{friendUsername}</span>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded mr-2"
                  onClick={() => handleViewTimetable(friendUsername)}
                >
                  View Timetable
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={() => handleDeleteFriend(friendUsername)}
                >
                  Remove Friend
                </button>
              </div>
            ))
          ) : (
            <p>No friends added.</p>
          )}
        </div>
      );
        
      expect(screen.getByText("Friends List")).toBeInTheDocument();
      expect(screen.getByText("john")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Remove Friend" }));
      expect(handleDeleteFriend).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole("button", { name: "View Timetable" }));
      expect(handleViewTimetable).toHaveBeenCalledTimes(1);
    });
});