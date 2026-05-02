const TYPE_COLORS = {
  fire: "#ff6b35",
  water: "#4fc3f7",
  grass: "#66bb6a",
  electric: "#ffee58",
  psychic: "#f06292",
  ice: "#80deea",
  dragon: "#7e57c2",
  dark: "#546e7a",
  fairy: "#f48fb1",
  normal: "#bcaaa4",
  fighting: "#ef5350",
  flying: "#90caf9",
  poison: "#ab47bc",
  ground: "#ffca28",
  rock: "#8d6e63",
  bug: "#aed581",
  ghost: "#5c6bc0",
  steel: "#78909c",
};

export function PokemonCard({ pokemon, price, isPurchased, onClick, onBuy }) {
  const types = pokemon.types.map((t) => t.type.name);
  const mainColor = TYPE_COLORS[types[0]] || "#bcaaa4";
  const sprite =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <div
      className={`pokemon-card${isPurchased ? " purchased" : ""}`}
      style={{ "--card-color": mainColor }}
      onClick={onClick}
    >
      {isPurchased && <div className="owned-badge">✓ Adquirida</div>}
      <span className="pokemon-id">#{String(pokemon.id).padStart(3, "0")}</span>
      <img src={sprite} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>

      <div className="types">
        {types.map((type) => (
          <span
            key={type}
            className="type-badge"
            style={{ backgroundColor: TYPE_COLORS[type] }}
          >
            {type}
          </span>
        ))}
      </div>

      <div className="stats">
        <span>HP {pokemon.stats[0].base_stat}</span>
        <span>ATK {pokemon.stats[1].base_stat}</span>
        <span>DEF {pokemon.stats[2].base_stat}</span>
      </div>

      <div className="card-price">
        <span className="price-tag">${price} USD</span>
      </div>

      {isPurchased ? (
        <div className="purchased-label">✅ En tu colección</div>
      ) : (
        <button
          className="buy-btn"
          onClick={(e) => {
            e.stopPropagation();
            onBuy(pokemon);
          }}
        >
           Comprar
        </button>
      )}
    </div>
  );
}
