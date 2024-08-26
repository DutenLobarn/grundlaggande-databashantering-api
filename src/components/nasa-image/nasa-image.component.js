import React, { useState, useEffect } from 'react';

const NasaImage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { 
                    // method: 'GET' är inkluderat för att vara extra tydlig, men det är inte nödvändigt eftersom GET är standardmetoden för fetch.
                    method: 'GET'
                });
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div id="output">
            {data ? (
                <div>
                    <img src={data.url} alt="NASA" />
                    <p>{data.explanation}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default NasaImage;
