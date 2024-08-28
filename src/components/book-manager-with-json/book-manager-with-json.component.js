import React, { useState, useEffect } from 'react';
import booksData from '../../JSON/booksData.json'; // Importera JSON-data

const BookManagerWithJSON = () => {
    const [books, setBooks] = useState([]);

    // Simulerar GET-förfrågan för att hämta alla böcker
    useEffect(() => {
        const fetchBooks = () => {
            setBooks(booksData); // Här hämtar vi böckerna från den importerade JSON-filen
        };
        fetchBooks();
    }, []);

    // Simulerar POST-förfrågan för att lägga till en ny bok
    const addBook = (newBook) => {
        newBook.id = books.length + 1; // Simulerar auto-increment för ID
        setBooks([...books, newBook]);
    };

    // Simulerar PUT-förfrågan för att uppdatera en existerande bok
    const updateBook = (id, updatedInfo) => {
        setBooks(books.map(book => book.id === id ? { ...book, ...updatedInfo } : book));
    };

    // Simulerar DELETE-förfrågan för att ta bort en bok
    const deleteBook = (id) => {
        setBooks(books.filter(book => book.id !== id));
    };

    return (
        <div>
            <h1>Book Manager</h1>
            {/* Formulär för att lägga till/uppdatera böcker */}
            <button onClick={() => addBook({ title: 'New Book', author: 'New Author', year: 2023 })}>
                Add Book
            </button>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        {book.title} - {book.author} ({book.year})
                        <button onClick={() => updateBook(book.id, { title: 'Updated Title' })}>
                            Update
                        </button>
                        <button onClick={() => deleteBook(book.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookManagerWithJSON;
