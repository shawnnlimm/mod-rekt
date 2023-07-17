import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseDisplay from "./CourseDisplay";
import { useAuth } from "../../context/Authentication/AuthContext";
import { useModuleContext } from "../../context/UserModules/UserModuleContext";
import "@testing-library/jest-dom";

// Mock the isCourseAdded function since it's not part of the component file

jest.mock("../../context/Authentication/AuthContext");
jest.mock("../../context/UserModules/UserModuleContext");

describe("Course Display test", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      currentUserId: "123456",
    });
    useModuleContext.mockReturnValue({
      fetchUserModules: jest.fn(),
      userModules: [],
    });
  });

  it("renders the course table headers correctly", () => {
    render(<CourseDisplay />);

    // Assert on the rendered content
    expect(screen.getByText("Course Code")).toBeInTheDocument();
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(screen.getByText("Timeslot")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Class")).toBeInTheDocument();
    expect(screen.getByText("Students Selected")).toBeInTheDocument();
  });

  it("course display correctly displays filtered courses", () => {
    const currentItems = [
      ["CS1101S", "4", "Monday", "0900", "1000", "Lecture", "10D", "2"],
      ["MA1521", "4", "Tuesday", "1300", "1500", "Lab", "12B", "1"],
    ];
    const search = "cs1101s";

    const isCourseAdded = jest.fn(() => false);
    const handleAdd = jest.fn(() => {
      isCourseAdded.mockReturnValue(true);
    });
    const handleRemove = jest.fn(() => {
      isCourseAdded.mockReturnValue(false);
    });

    // Render the component with the test data
    render(
      <table>
        <tbody className="text-center">
          {currentItems
            .filter((course) => {
              const searchLower = search.toLowerCase();
              const courseIdLower = course[0].toLowerCase();
              return searchLower === ""
                ? course
                : courseIdLower.includes(searchLower);
            })
            .map((course) => (
              <tr>
                <td>{course[0]}</td>
                <td>{course[2]}</td>
                <td>{course[3] + " - " + course[4]}</td>
                <td>{course[5]}</td>
                <td>{course[6]}</td>
                <td>{course[7]}</td>
                <td>
                  {isCourseAdded(course) ? (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleRemove(course)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleAdd(course)}
                    >
                      Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );

    // You can add more assertions here based on your table content
    expect(screen.getByText("CS1101S")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("0900 - 1000")).toBeInTheDocument();
    expect(screen.getByText("Lecture")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.queryByText("MA1521")).not.toBeInTheDocument();
  });

  it("users are able to add courses", async () => {
    // Prepare your test data here
    const currentItems = [
      ["CS1101S", "4", "Monday", "0900", "1000", "Lecture", "10D", "2"],
      ["MA1521", "4", "Tuesday", "1300", "1500", "Lab", "12B", "1"],
    ];
    const search = "cs1101s";

    const isCourseAdded = jest.fn(() => false);
    const handleAdd = jest.fn(() => {
      isCourseAdded.mockReturnValue(true);
    });
    const handleRemove = jest.fn(() => {
      isCourseAdded.mockReturnValue(false);
    });

    // Render the component with the test data
    render(
      <table>
        <tbody className="text-center">
          {currentItems
            .filter((course) => {
              const searchLower = search.toLowerCase();
              const courseIdLower = course[0].toLowerCase();
              return searchLower === ""
                ? course
                : courseIdLower.includes(searchLower);
            })
            .map((course) => (
              <tr>
                <td>{course[0]}</td>
                <td>{course[2]}</td>
                <td>{course[3] + " - " + course[4]}</td>
                <td>{course[5]}</td>
                <td>{course[6]}</td>
                <td>{course[7]}</td>
                <td>
                  {isCourseAdded(course) ? (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleRemove(course)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
                      type="button"
                      onClick={() => handleAdd(course)}
                    >
                      Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );

    expect(screen.getByText("Add")).toBeInTheDocument();

    // Click the "Add" button
    fireEvent.click(screen.getByText("Add"));

    // Assert that handleAdd is called when clicking "Add" button
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it("users are able to remove courses", () => {
    const currentItems = [
      ["CS1101S", "4", "Monday", "0900", "1000", "Lecture", "10D", "2"],
    ];

    const isCourseAdded = jest.fn(() => true);
    const handleAdd = jest.fn(() => {
      isCourseAdded.mockReturnValue(true);
    });
    const handleRemove = jest.fn(() => {
      isCourseAdded.mockReturnValue(false);
    });

    render(
      <table>
        <tbody className="text-center">
          {currentItems.map((course) => (
            <tr>
              <td>{course[0]}</td>
              <td>{course[2]}</td>
              <td>{course[3] + " - " + course[4]}</td>
              <td>{course[5]}</td>
              <td>{course[6]}</td>
              <td>{course[7]}</td>
              <td>
                {isCourseAdded(course) ? (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
                    type="button"
                    onClick={() => handleRemove(course)}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded"
                    type="button"
                    onClick={() => handleAdd(course)}
                  >
                    Add
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    expect(screen.getByText("Remove")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Remove"));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });
});
