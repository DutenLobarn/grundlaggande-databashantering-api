import React, { useState } from 'react';

const PostForm = () => {
    const [name, setName] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { name: name };
        
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                // method: 'POST' används här för att skapa ny data på servern. Content-Type: 'application/json' används för att skicka JSON-data i POST-förfrågan.

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            setResult(result);
        } catch (error) {
            console.error('Error posting data:', error);
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
                <button type="submit">Submit</button>
            </form>
            {result && <p>Posted: {result.name}</p>}
        </div>
    );
};

export default PostForm;
