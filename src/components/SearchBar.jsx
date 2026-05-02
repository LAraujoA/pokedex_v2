export function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}