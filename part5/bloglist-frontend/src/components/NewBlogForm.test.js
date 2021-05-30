import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import NewBlogForm from "./NewBlogForm";

describe("new blog form tests", () => {
  test("new blog form submits correct information", () => {
    const createBlog = jest.fn();

    const component = render(<NewBlogForm addBlog={createBlog} />);
    const form = component.container.querySelector("form");
    const title = component.container.querySelector("#title");
    const author = component.container.querySelector("#author");
    const url = component.container.querySelector("#url");

    fireEvent.change(title, {
      target: { value: "test blog title" },
    });
    fireEvent.change(author, {
      target: { value: "test author" },
    });
    fireEvent.change(url, {
      target: { value: "www.test.com" },
    });

    fireEvent.submit(form);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("test blog title");
    expect(createBlog.mock.calls[0][0].author).toBe("test author");
    expect(createBlog.mock.calls[0][0].url).toBe("www.test.com");
  });
});
