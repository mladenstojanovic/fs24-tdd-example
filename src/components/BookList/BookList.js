import React, { useEffect, useState } from "react";

const BookList = () => {
  const [displayBooks, setDisplayBooks] = useState([]);
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [searchTitle, handleSearchTitle] = useState("");
  const [hasError, setError] = useState(false);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await fetch("/books");
        const parsedBooks = await books.json();
        setFetchedBooks(parsedBooks);
        setDisplayBooks(parsedBooks);
      } catch {
        setError(true);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTitle.length < 3) {
      setDisplayBooks(fetchedBooks);
      return;
    }
    const filteredBooks = displayBooks.filter(
      (book) => book.name.toLowerCase().indexOf(searchTitle) > -1
    );
    setDisplayBooks(filteredBooks);
  }, [searchTitle]);
  return (
    <div data-testid="bookList">
      <input
        type="text"
        onChange={(e) => {
          handleSearchTitle(e.target.value);
        }}
        value={searchTitle}
        data-testid="search-input"
      ></input>
      {hasError && (
        <h1 data-testid="bookList-error">
          Error loading books, please try again
        </h1>
      )}
      {displayBooks.length
        ? displayBooks.map((book) => (
            <div data-testid="book-single" key={`${book.isbn}`}>
              <h1>{book.name}</h1>
              <p>{book.isbn}</p>
            </div>
          ))
        : null}
    </div>
  );
};

export default BookList;
