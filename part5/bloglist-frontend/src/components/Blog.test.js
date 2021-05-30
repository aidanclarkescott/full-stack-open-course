import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("blog component tests", () => {
  let blog;
  let user;

  beforeEach(() => {
    blog = {
      title: "Example blog title",
      author: "test author",
      url: "www.test.com",
      likes: 10,
      user: {
        name: "Test",
        username: "testusername",
      },
    };

    user = {
      username: "testusername",
    };
  });

  test("default blog has only title and author", () => {
    const component = render(<Blog blog={blog} user={user} />);

    expect(component.container).toHaveTextContent(
      "Example blog title test author"
    );
    expect(component.container).not.toHaveTextContent("www.test.com");
    expect(component.container).not.toHaveTextContent("likes: 10");
  });

  test("blogs url and likes shown after pressing view button", () => {
    const component = render(<Blog blog={blog} user={user} />);
    const button = component.getByText("view");

    fireEvent.click(button);

    expect(component.container).toHaveTextContent(
      "Example blog title test author"
    );
    expect(component.container).toHaveTextContent("www.test.com");
    expect(component.container).toHaveTextContent("likes: 10");
  });

  test("like button calls event handler correctly", () => {
    const mockHandler = jest.fn();
    const component = render(
      <Blog blog={blog} user={user} incrementLikes={mockHandler} />
    );

    const button = component.getByText("view");
    fireEvent.click(button);

    const likeButton = component.getByText("like");
    expect(likeButton).toBeDefined();

    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
