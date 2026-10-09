import React from "react";

export function FallbackLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Contenedor principal de la tarjeta de carga */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 60px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          border: "1px solid #edf2f7",
        }}
      >
        {/* Spinner animado con el verde/turquesa de la clínica */}
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #00b4d8",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: "20px",
          }}
        />

        {/* Texto de carga institucional */}
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#0b132b",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "-0.3px",
          }}
        >
          Cargando...
        </h3>

        <p
          style={{
            margin: 0,
            color: "#718096",
            fontSize: "14px",
          }}
        >
          Por favor, espere un momento...
        </p>
      </div>





























































XC      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  );
}
