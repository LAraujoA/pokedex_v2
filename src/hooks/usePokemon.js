import { useState, useEffect } from "react";

const BASE_URL = "https://pokeapi.co/api/v2";

export function usePokemon(limit = 20) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        // 1. Obtenemos la lista básica (nombre + url)
        const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=0`);
        const data = await res.json();

        // 2. Por cada pokemon, pedimos sus detalles en paralelo
        const details = await Promise.all(
          data.results.map((p) => fetch(p.url).then((r) => r.json()))
        );

        setPokemonList(details);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [limit]);

  return { pokemonList, loading, error };
}