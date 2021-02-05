import { rest } from "msw";

export const handlers = [
  rest.post("/books", (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/books", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { name: "Harry Potter", isbn: "123abc" },
        { name: "Lord of the rings", isbn: "321cba" },
      ])
    );
  }),
];
