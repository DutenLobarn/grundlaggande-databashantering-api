import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BookList from './BookList'; // Ny komponent som vi skapar
import useErrorHandler from './useErrorHandler'; // Ny custom hook för felhantering

// Huvudkomponenten för bokhanteraren
const LocalStorageBookManager = () => {
    // State-hooks för att hantera olika aspekter av applikationen
    const [books, setBooks] = useState([]); // Lista över böcker
    const [newBook, setNewBook] = useState({ title: '', author: '' }); // Ny bok som ska läggas till
    const [isLoading, setIsLoading] = useState(true); // Laddningstillstånd
    const { error, setError, clearError } = useErrorHandler();

    // useEffect-hook för att hämta böcker när komponenten monteras
    const fetchBooksFromAPI = useCallback(async () => {
        try {
            const response = await fetch('http://openlibrary.org/search.json?q=the+lord+of+the+rings');
            const data = await response.json();
            return data.docs.slice(0, 10).map(book => ({
                id: book.key,
                title: book.title,
                author: book.author_name?.[0] ?? 'Okänd författare'
            }));
        } catch (error) {
            console.error('Fel vid hämtning av böcker från API:', error);
            setError('Kunde inte hämta böcker från API.');
            return null;
        }
    }, [setError]);

    const fetchBooks = useCallback(async () => {
        const storedBooks = JSON.parse(localStorage.getItem('books'));
        if (storedBooks && Array.isArray(storedBooks)) {
            setBooks(storedBooks);
            setIsLoading(false);
            return;
        }

        const fetchedBooks = await fetchBooksFromAPI();
        if (fetchedBooks) {
            setBooks(fetchedBooks);
            localStorage.setItem('books', JSON.stringify(fetchedBooks));
        }
        setIsLoading(false);
    }, [fetchBooksFromAPI]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // useEffect-hook för att uppdatera local storage när böckerna ändras
    useEffect(() => {
        localStorage.setItem('books', JSON.stringify(books));
    }, [books]);

    // Funktion för att hantera input-ändringar när en ny bok läggs till
    const handleInputChange = useCallback((e) => {
        setNewBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    // Funktion för att lägga till en ny bok (Create-operation)
    const addBook = useCallback(() => {
        if (!newBook.title.trim() || !newBook.author.trim()) {
            setError('Vänligen fyll i både titel och författare.');
            return;
        }
        clearError();
        const bookToAdd = { ...newBook, id: Date.now() };
        setBooks(prev => [...prev, bookToAdd]);
        setNewBook({ title: '', author: '' });
        console.log('Bok tillagd:', bookToAdd);
    }, [newBook, setError, clearError]);

    // Funktion för att uppdatera en befintlig bok (Update-operation)
    const updateBook = useCallback((id, updatedBook) => {
        setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
        console.log('Bok uppdaterad:', updatedBook);
    }, []);

    // Funktion för att ta bort en bok (Delete-operation)
    const deleteBook = useCallback((id) => {
        setBooks(prev => {
            const updatedBooks = prev.filter(book => book.id !== id);
            localStorage.setItem('books', JSON.stringify(updatedBooks));
            return updatedBooks;
        });
        clearError(); // Rensa eventuella felmeddelanden när en bok tas bort
        console.log('Bok borttagen, ID:', id);
    }, [clearError]);

    // Kombinerad funktion för att återställa eller fylla upp boklistan
    const resetOrFillUpBooks = useCallback(async () => {
        const currentBooks = JSON.parse(localStorage.getItem('books')) || [];
        
        if (currentBooks.length >= 10) {
            setError('Listan är redan full med 10 eller fler böcker.');
            return;
        }

        setIsLoading(true);
        const manuallyAddedBooks = currentBooks.filter(book => typeof book.id === 'number');

        const newBooks = await fetchBooksFromAPI();
        if (newBooks) {
            const existingIds = new Set(manuallyAddedBooks.map(book => book.id));
            const uniqueNewBooks = newBooks.filter(book => !existingIds.has(book.id));
            const booksToAdd = uniqueNewBooks.slice(0, 10 - manuallyAddedBooks.length);
            const updatedBooks = [...manuallyAddedBooks, ...booksToAdd];
            setBooks(updatedBooks);
            localStorage.setItem('books', JSON.stringify(updatedBooks));
            console.log(`Uppdaterade listan. Totalt antal böcker: ${updatedBooks.length}`);
            clearError();
        } else {
            setError('Kunde inte hämta böcker från API:et för att uppdatera listan.');
        }
        setIsLoading(false);
    }, [fetchBooksFromAPI, setError, clearError]);

    // Rendering av komponenten
    const memoizedBookList = useMemo(() => (
        <BookList
            books={books}
            updateBook={updateBook}
            deleteBook={deleteBook}
        />
    ), [books, updateBook, deleteBook]);

    if (isLoading) return <p>Laddar böcker...</p>;

    return (
        <div>
            <h1>Bokhanterare med Local Storage och API</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
            {memoizedBookList}
            <button onClick={resetOrFillUpBooks}>Återställ/Fyll upp lista</button>
        </div>
    );
};

export default LocalStorageBookManager;