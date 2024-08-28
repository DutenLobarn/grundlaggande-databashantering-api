import React, { useState, useCallback } from 'react';

const BookList = ({ books, updateBook, deleteBook }) => {
    const [editingBook, setEditingBook] = useState(null);
    const [tempEditBook, setTempEditBook] = useState(null);

    const startEditing = useCallback((book) => {
        setEditingBook(book.id);
        setTempEditBook({...book});
    }, []);

    const cancelEditing = useCallback(() => {
        setEditingBook(null);
        setTempEditBook(null);
    }, []);

    const handleUpdate = useCallback((id) => {
        updateBook(id, tempEditBook);
        setEditingBook(null);
        setTempEditBook(null);
    }, [tempEditBook, updateBook]);

    return (
        <ul>
            {books.map(book => (
                <li key={book.id}>
                    {editingBook === book.id ? (
                        <>
                            <input
                                value={tempEditBook.title}
                                onChange={(e) => setTempEditBook(prev => ({...prev, title: e.target.value}))}
                                placeholder="Ange boktitel"
                            />
                            <input
                                value={tempEditBook.author}
                                onChange={(e) => setTempEditBook(prev => ({...prev, author: e.target.value}))}
                                placeholder="Ange författare"
                            />
                            <button onClick={() => handleUpdate(book.id)}>Spara</button>
                            <button onClick={cancelEditing}>Avbryt</button>
                        </>
                    ) : (
                        <>
                            {book.title} av {book.author}
                            <button onClick={() => startEditing(book)}>Redigera</button>
                            <button onClick={() => deleteBook(book.id)}>Ta bort</button>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default React.memo(BookList);