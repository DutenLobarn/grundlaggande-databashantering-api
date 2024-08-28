// Fullständig CRUD-applikation med Fetch API

import React, { useState, useEffect, useRef } from 'react';

const BookManager = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '' });
    const [editingBook, setEditingBook] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isFirstRun = useRef(true);

    const generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (isFirstRun.current) {
                console.log('Börjar hämta böcker...');
                isFirstRun.current = false;
            }
            setIsLoading(true);
            try {
                const response = await fetch('http://openlibrary.org/search.json?q=the+lord+of+the+rings', {
                    method: 'GET'
                });
                const data = await response.json();
                if (isMounted) {
                    const fetchedBooks = data.docs.slice(0, 10).map(book => ({
                        id: book.key,
                        title: book.title,
                        author: book.author_name ? book.author_name[0] : 'Okänd författare'
                    }));
                    setBooks(fetchedBooks);
                    console.log('Böcker hämtade:', fetchedBooks);
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Fel vid hämtning av böcker:', error);
                    setErrorMessage('Kunde inte hämta böcker. Försök igen senare.');
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const updatedBook = { ...newBook, [e.target.name]: e.target.value };
        setNewBook(updatedBook);
        console.log('Input ändrad:', updatedBook);
    };

    const addBook = async () => {
        if (!newBook.title.trim() || !newBook.author.trim()) {
            setErrorMessage('Vänligen fyll i både titel och författare.');
            console.log('Försök att lägga till ofullständig bok:', newBook);
            return;
        }

        setErrorMessage('');

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newBook.title, body: `${newBook.author} är författaren` })
            });
            const data = await response.json();
            const addedBook = { id: generateUniqueId(), title: newBook.title, author: newBook.author };
            setBooks([...books, addedBook]);
            setNewBook({ title: '', author: '' });
            console.log('Bok tillagd:', addedBook);
        } catch (error) {
            console.error('Fel vid tillägg av bok:', error);
            setErrorMessage('Ett fel uppstod när boken skulle läggas till. Försök igen.');
        }
    };

    const updateBook = async (id, updatedBook) => {
        try {
            // Vi simulerar uppdateringen lokalt istället för att göra ett API-anrop
            console.log('Simulerar uppdatering av bok med ID:', id);
            // Utkommenterad API-anropskod:
            // await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ title: updatedBook.title, body: `${updatedBook.author} är författaren` })
            // });
            const updatedBooks = books.map(book => book.id === id ? updatedBook : book);
            setBooks(updatedBooks);
            setEditingBook(null);
            console.log('Bok uppdaterad:', updatedBook);
        } catch (error) {
            console.error('Fel vid uppdatering av bok:', error);
            setErrorMessage('Kunde inte uppdatera boken. Försök igen.');
        }
    };

    const deleteBook = async (id) => {
        try {
            // await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            //     method: 'DELETE'
            // });
            // Vi simulerar borttagningen lokalt istället för att göra ett API-anrop
            console.log('Simulerar borttagning av bok med ID:', id);
            const updatedBooks = books.filter(book => book.id !== id);
            setBooks(updatedBooks);
            console.log('Bok borttagen, ID:', id);
        } catch (error) {
            console.error('Fel vid borttagning av bok:', error);
            setErrorMessage('Kunde inte ta bort boken. Försök igen.');
        }
    };

    return (
        <div>
            <h1>Bokhanterare</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {isLoading ? (
                <p>Laddar böcker...</p>
            ) : (
                <>
                    <div>
                        <input
                            name="title"
                            value={newBook.title}
                            onChange={handleInputChange}
                            placeholder="Titel"
                        />
                        <input
                            name="author"
                            value={newBook.author}
                            onChange={handleInputChange}
                            placeholder="Författare"
                        />
                        <button onClick={addBook}>Lägg till bok</button>
                    </div>
                    <ul>
                        {books.map(book => (
                            <li key={book.id}>
                                {editingBook === book.id ? (
                                    <>
                                        <input
                                            value={book.title}
                                            onChange={(e) => setBooks(books.map(b => b.id === book.id ? {...b, title: e.target.value} : b))}
                                            placeholder="Ange boktitel"
                                        />
                                        <input
                                            value={book.author}
                                            onChange={(e) => setBooks(books.map(b => b.id === book.id ? {...b, author: e.target.value} : b))}
                                            placeholder="Ange författare"
                                        />
                                        <button onClick={() => updateBook(book.id, book)}>Spara</button>
                                        <button onClick={() => setEditingBook(null)}>Avbryt</button>
                                    </>
                                ) : (
                                    <>
                                        {book.title} av {book.author}
                                        <button onClick={() => setEditingBook(book.id)}>Redigera</button>
                                        <button onClick={() => deleteBook(book.id)}>Ta bort</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default BookManager;
