export function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>

        <h2>{pokemon.name}</h2>
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
        />

        <p><strong>ID:</strong> #{pokemon.id}</p>
        <p><strong>Altura:</strong> {pokemon.height}</p>
        <p><strong>Peso:</strong> {pokemon.weight}</p>
        <p><strong>Experiencia base:</strong> {pokemon.base_experience}</p>

        <div>
          <strong>Tipos:</strong>
          {pokemon.types.map((t) => (
            <span key={t.slot}> {t.type.name} </span>
          ))}
        </div>

        <div>
          <strong>Habilidades:</strong>
          {pokemon.abilities.map((a) => (
            <span key={a.ability.name}> {a.ability.name} </span>
          ))}
        </div>
      </div>
    </div>
  );
}