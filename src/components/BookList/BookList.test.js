import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import BookList from "./BookList";

const server = setupServer(
  rest.get("/books", (_req, res, ctx) => {
    return res(
      ctx.json([
        { name: "Harry Potter", isbn: "123abc" },
        { name: "Lord of the rings", isbn: "321cba" },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders BookList component", async () => {
  render(<BookList />);
  const bookList = screen.getByTestId("bookList");

  await waitFor(() => screen.getAllByTestId("book-single"));

  expect(bookList).toBeInTheDocument();
});

test("loads and displays books", async () => {
  render(<BookList />);

  await waitFor(() => screen.getAllByTestId("book-single"));

  expect(screen.getByText("Harry Potter")).toBeInTheDocument();
  expect(screen.getByText("Lord of the rings")).toBeInTheDocument();
});

test("handles server error", async () => {
  server.use(
    rest.get("/books", (_req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<BookList />);

  await waitFor(() => screen.getByTestId("bookList-error"));

  expect(screen.getByTestId("bookList-error")).toHaveTextContent(
    "Error loading books, please try again"
  );
});

test("filters books", async () => {
  render(<BookList />);

  await waitFor(() => screen.getAllByTestId("book-single"));

  expect(screen.getByText("Harry Potter")).toBeInTheDocument();
  expect(screen.getByText("Lord of the rings")).toBeInTheDocument();

  const input = screen.getByTestId("search-input");

  fireEvent.change(input, { target: { value: "ha" } });

  expect(screen.queryByText("Lord of the rings")).toBeInTheDocument();
  expect(screen.queryByText("Harry Potter")).toBeInTheDocument();

  fireEvent.change(input, { target: { value: "harr" } });

  expect(screen.queryByText("Lord of the rings")).not.toBeInTheDocument();
  expect(screen.queryByText("Harry Potter")).toBeInTheDocument();

  fireEvent.change(input, { target: { value: "ha" } });

  expect(screen.queryByText("Lord of the rings")).toBeInTheDocument();
  expect(screen.queryByText("Harry Potter")).toBeInTheDocument();
});
