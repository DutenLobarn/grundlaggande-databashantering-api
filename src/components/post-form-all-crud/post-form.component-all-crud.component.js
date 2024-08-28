import React, { useState, useEffect } from 'react';

const PostFormAllCRUD = () => {
    const [name, setName] = useState('');
    const [result, setResult] = useState(null);
    const [posts, setPosts] = useState([]);
    const [editId, setEditId] = useState(null);

    // Hämta alla poster när komponenten laddas - GET
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                const data = await response.json();
                setPosts(data.slice(0, 5)); // Begränsar till de 5 första posterna för överskådlighet
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    // Skapa en ny post eller uppdatera en befintlig - POST, PUT
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { name: name };

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts${editId ? `/${editId}` : ''}`, {
                method: editId ? 'PUT' : 'POST', // Använd PUT för att uppdatera, annars POST för att skapa ny data
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (editId) {
                // Uppdatera i listan efter redigering
                setPosts(posts.map(post => post.id === editId ? result : post));
                setEditId(null);
            } else {
                // Lägg till ny post i listan
                setPosts([...posts, result]);
            }

            setResult(result);
            setName(''); // Återställ inputfältet
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    // Ladda uppgiften i formuläret för redigering
    const handleEdit = (id, name) => {
        setEditId(id);
        setName(name);
    };

    // Ta bort en post -  DELETE
    const handleDelete = async (id) => {
        try {
            await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
                method: 'DELETE',
            });
            setPosts(posts.filter(post => post.id !== id)); // Ta bort från listan
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                />
                <button type="submit">{editId ? 'Update' : 'Submit'}</button>
            </form>
            {result && <p>{editId ? 'Updated' : 'Posted'}: {result.name}</p>}

            <h2>Posts</h2>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        {post.name || post.title} 
                        <button onClick={() => handleEdit(post.id, post.name || post.title)}>Edit</button>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostFormAllCRUD;
