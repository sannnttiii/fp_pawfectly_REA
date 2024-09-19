import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Profile from "../pages/Profile";

describe("Profile Component", () => {
  beforeEach(() => {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userID", "1");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            petType: "dog",
            petBreeds: "Golden Retriever",
            gender: "male",
            name: "Buddy",
            age: "3",
            city: "New York",
            bio: "Friendly and loves to play",
            image: null,
          }),
      })
    );
  });

  test("updates profile successfully", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    render(
      <Router>
        <Profile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Updated Name" },
    });
    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "Updated City" },
    });

    fireEvent.click(screen.getByText(/save/i));
  });

  test("deletes profile successfully", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    fireEvent.click(screen.getByText(/delete profile/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8082/api/deleteProfile?id=1`,
        expect.anything()
      );
    });
  });
});
