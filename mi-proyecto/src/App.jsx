import { useState, useEffect } from "react";

export default function App() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then(res => res.json())
      .then(data => setCharacters(data.results));
  }, []);

  return (
    <div>
      <h1>Hola Mundo</h1>
      <ul>
        {characters.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}