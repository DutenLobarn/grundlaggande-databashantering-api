import React, { useState, useEffect } from 'react';

const NasaMedia = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { 
                    // method: 'GET' är inkluderat för att vara extra tydlig, men det är inte nödvändigt eftersom GET är standardmetoden för fetch.
                    method: 'GET'
                });
                const result = await response.json();
                console.log("result", result); // Lägg till denna rad för att se vad som returneras

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
                    {data.media_type === "image" ? (
                        <img src={data.url} alt="NASA" />
                    ) : (
                        <iframe 
                            width="560" 
                            height="315" 
                            src={data.url} 
                            title={data.title} 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    )}
                    <p>{data.explanation}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default NasaMedia;
