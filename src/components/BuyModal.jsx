import { useEffect, useRef, useState } from "react";
import { PAYPAL_CLIENT_ID } from "../config";

const TYPE_COLORS = {
  fire: "#ff6b35", water: "#4fc3f7", grass: "#66bb6a", electric: "#ffee58",
  psychic: "#f06292", ice: "#80deea", dragon: "#7e57c2", dark: "#546e7a",
  fairy: "#f48fb1", normal: "#bcaaa4", fighting: "#ef5350", flying: "#90caf9",
  poison: "#ab47bc", ground: "#ffca28", rock: "#8d6e63", bug: "#aed581",
  ghost: "#5c6bc0", steel: "#78909c",
};

export function BuyModal({ pokemon, price, onSuccess, onError, onClose }) {
  const paypalRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error' | 'cancelled'
  const [statusMessage, setStatusMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const buttonsRendered = useRef(false);

  const types = pokemon.types.map((t) => t.type.name);
  const sprite =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;
  const mainColor = TYPE_COLORS[types[0]] || "#bcaaa4";

  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const existing = document.getElementById("paypal-sdk");
    if (existing) {
      existing.addEventListener("load", () => setSdkReady(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () =>
      setStatusMessage(
        "No se pudo cargar PayPal. Verifica tu Client ID en src/config.js."
      );
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkReady || !paypalRef.current || status || buttonsRendered.current)
      return;
    buttonsRendered.current = true;

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "gold", shape: "pill", label: "pay" },
        createOrder: (_data, actions) =>
          actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: `PokéCarta: ${pokemon.name}`,
                amount: { value: price, currency_code: "USD" },
              },
            ],
          }),
        onApprove: (data) => {
          // El comprador aprobó el pago en el popup de PayPal.
          // La captura real requiere un backend; para sandbox usamos el orderID como confirmación.
          setTransactionId(data.orderID);
          setStatus("success");
          setStatusMessage(`¡${pokemon.name} ahora es parte de tu colección!`);
          onSuccess(pokemon);
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          setStatus("error");
          setStatusMessage("El pago no pudo procesarse. Intenta de nuevo.");
        },
        onCancel: () => {
          setStatus("cancelled");
          setStatusMessage("Pago cancelado. La carta sigue bloqueada.");
        },
      })
      .render(paypalRef.current);
  }, [sdkReady, status]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content buy-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h3 className="buy-modal-title">Comprar Carta</h3>

        <div
          className="buy-modal-card-preview"
          style={{ "--card-color": mainColor }}
        >
          <span className="pokemon-id">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
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
        </div>

        <div className="buy-modal-price">
          <span className="price-label">Precio de la carta</span>
          <span className="price-value">${price} USD</span>
        </div>

        {status === "success" && (
          <div className="payment-result success">
            <div className="result-icon">✅</div>
            <h3>¡Compra exitosa!</h3>
            <p>{statusMessage}</p>
            {transactionId && (
              <p className="transaction-id">ID: {transactionId}</p>
            )}
            <button className="btn-close-result" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="payment-result error">
            <div className="result-icon">❌</div>
            <h3>Pago fallido</h3>
            <p>{statusMessage}</p>
            <button className="btn-close-result" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}

        {status === "cancelled" && (
          <p className="cancelled-msg">⚠️ {statusMessage}</p>
        )}

        {!status && (
          <>
            <p className="pay-instruction">
              Completa el pago con PayPal para desbloquear esta carta
            </p>
            {!sdkReady && !statusMessage && (
              <p className="loading-paypal">Cargando PayPal…</p>
            )}
            {statusMessage && !sdkReady && (
              <p className="sdk-error">{statusMessage}</p>
            )}
            <div ref={paypalRef} className="paypal-buttons-container" />
          </>
        )}
      </div>
    </div>
  );
}
