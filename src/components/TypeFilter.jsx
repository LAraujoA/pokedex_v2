export function TypeFilter({ types, selectedType, onSelectType }) {
  return (
    <div className="type-filters">
      <button
        className={selectedType === "all" ? "active" : ""}
        onClick={() => onSelectType("all")}
      >
        Todos
      </button>

      {types.map((type) => (
        <button
          key={type}
          className={selectedType === type ? "active" : ""}
          onClick={() => onSelectType(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}