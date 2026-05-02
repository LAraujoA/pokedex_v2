import { useState } from "react";
import { usePokemon } from "./hooks/usePokemon";
import { PokemonCard } from "./components/PokemonCard";
import { SearchBar } from "./components/SearchBar";
import { TypeFilter } from "./components/TypeFilter";
import { PokemonModal } from "./components/PokemonModal";
import { BuyModal } from "./components/BuyModal";
import { MyCollection } from "./components/MyCollection";
import "./App.css";

function calcPrice(pokemon) {
  const bst = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
  return (Math.round(bst * 0.01 * 100) / 100).toFixed(2);
}

function App() {
  const { pokemonList, loading, error } = usePokemon(150);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [activeTab, setActiveTab] = useState("market");
  const [buyingPokemon, setBuyingPokemon] = useState(null);
  const [notification, setNotification] = useState(null);

  const [purchasedIds, setPurchasedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("purchasedCards") || "[]");
    } catch {
      return [];
    }
  });

  const uniqueTypes = [
    ...new Set(
      pokemonList.flatMap((pokemon) => pokemon.types.map((t) => t.type.name))
    ),
  ];

  const filtered = pokemonList.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      selectedType === "all" ||
      pokemon.types.some((t) => t.type.name === selectedType);
    return matchesSearch && matchesType;
  });

  const purchasedPokemons = pokemonList.filter((p) =>
    purchasedIds.includes(p.id)
  );

  function showNotification(type, message) {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }

  function handlePurchaseSuccess(pokemon) {
    const updated = [...purchasedIds, pokemon.id];
    setPurchasedIds(updated);
    localStorage.setItem("purchasedCards", JSON.stringify(updated));
    showNotification("success", `¡${pokemon.name} desbloqueada con éxito!`);
  }

  function handlePurchaseError() {
    showNotification("error", "El pago no pudo procesarse. Intenta de nuevo.");
  }

  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="app">
      <header>
        <h1>PokéCards Market</h1>
        <p className="subtitle">Explora y colecciona cartas Pokémon únicas</p>

        <nav className="tabs">
          <button
            className={`tab${activeTab === "market" ? " active" : ""}`}
            onClick={() => setActiveTab("market")}
          >
             Explorar cartas
          </button>
          <button
            className={`tab${activeTab === "collection" ? " active" : ""}`}
            onClick={() => setActiveTab("collection")}
          >
             Mis compras ({purchasedIds.length})
          </button>
        </nav>

        {activeTab === "market" && (
          <>
            <SearchBar value={search} onChange={setSearch} />
            <TypeFilter
              types={uniqueTypes}
              selectedType={selectedType}
              onSelectType={setSelectedType}
            />
          </>
        )}
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" ? "✅" : "❌"} {notification.message}
        </div>
      )}

      {activeTab === "market" ? (
        loading ? (
          <div className="loading">Cargando cartas…</div>
        ) : (
          <main className="grid">
            {filtered.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                price={calcPrice(pokemon)}
                isPurchased={purchasedIds.includes(pokemon.id)}
                onClick={() => setSelectedPokemon(pokemon)}
                onBuy={(pokemon) => setBuyingPokemon(pokemon)}
              />
            ))}
          </main>
        )
      ) : (
        <MyCollection
          pokemons={purchasedPokemons}
          loading={loading}
          calcPrice={calcPrice}
        />
      )}

      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      {buyingPokemon && (
        <BuyModal
          pokemon={buyingPokemon}
          price={calcPrice(buyingPokemon)}
          onSuccess={handlePurchaseSuccess}
          onError={handlePurchaseError}
          onClose={() => setBuyingPokemon(null)}
        />
      )}
    </div>
  );
}

export default App;
