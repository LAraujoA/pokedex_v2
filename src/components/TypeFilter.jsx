import { useState } from "react";

const TYPE_ICONS = {
  fire: "🔥", water: "💧", grass: "🌿", electric: "⚡",
  psychic: "🔮", ice: "❄️", dragon: "🐉", dark: "🌑",
  fairy: "✨", normal: "⭐", fighting: "🥊", flying: "🦅",
  poison: "☠️", ground: "🌍", rock: "🪨", bug: "🐛",
  ghost: "👻", steel: "⚙️",
};

const TYPE_COLORS = {
  fire: "#ff6b35", water: "#4fc3f7", grass: "#66bb6a", electric: "#ffee58",
  psychic: "#f06292", ice: "#80deea", dragon: "#7e57c2", dark: "#546e7a",
  fairy: "#f48fb1", normal: "#bcaaa4", fighting: "#ef5350", flying: "#90caf9",
  poison: "#ab47bc", ground: "#ffca28", rock: "#8d6e63", bug: "#aed581",
  ghost: "#5c6bc0", steel: "#78909c",
};

export function TypeFilter({ types, selectedType, onSelectType }) {
  const [open, setOpen] = useState(false);

  const selectedLabel = selectedType === "all"
    ? "Todos los tipos"
    : `${TYPE_ICONS[selectedType] ?? "•"} ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`;

  const selectedColor = selectedType !== "all" ? TYPE_COLORS[selectedType] : null;

  return (
    <div className="type-filter-wrapper">
      <button
        className="type-filter-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className="type-filter-toggle-label"
          style={selectedColor ? { color: selectedColor } : {}}
        >
          🎮 Filtrar: <strong>{selectedLabel}</strong>
        </span>
        <span className={`type-filter-chevron${open ? " open" : ""}`}>›</span>
      </button>

      <div className={`type-filter-panel${open ? " open" : ""}`}>
        <div className="type-filters">
          <button
            className={`type-btn${selectedType === "all" ? " active" : ""}`}
            onClick={() => { onSelectType("all"); setOpen(false); }}
          >
            🎮 Todos
          </button>

          {types.map((type) => (
            <button
              key={type}
              className={`type-btn${selectedType === type ? " active" : ""}`}
              style={{ "--type-color": TYPE_COLORS[type] ?? "#e63946" }}
              onClick={() => { onSelectType(type); setOpen(false); }}
            >
              {TYPE_ICONS[type] ?? "•"} {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
