import { useState, useRef, useCallback } from "react";
import { Plus, X, RefreshCw } from "lucide-react";

const TIMEFRAMES = [
  { key: "D", label: "Day", interval: "D" },
  { key: "W", label: "Week", interval: "W" },
  { key: "M", label: "Month", interval: "M" },
];

function TVChart({ symbol, timeframe, exchange }) {
  const [loaded, setLoaded] = useState(false);

  const src = `https://s.tradingview.com/widgetembed/?symbol=${exchange}%3A${symbol}&interval=${timeframe}&hidesidetoolbar=0&symboledit=0&saveimage=0&toolbarbg=11161C&theme=dark&style=1&timezone=Asia%2FKolkata&withdateranges=1&locale=in`;

  return (
    <div className="w-full h-full relative" style={{ minHeight: "360px" }}>
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: "#6B7280", fontSize: "0.8rem" }}
        >
          Loading chart…
        </div>
      )}
      <iframe
        title={`${symbol} chart`}
        src={src}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        onLoad={() => setLoaded(true)}
        allowFullScreen
      />
    </div>
  );
}

function StockCard({ stock, onRemove, onTimeframeChange }) {
  return (
    <div
      className="flex flex-col rounded-sm overflow-hidden"
      style={{
        backgroundColor: "#171D25",
        border: "1px solid #27313C",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #27313C" }}
      >
        <div className="flex items-baseline gap-2">
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.15rem",
              fontWeight: 600,
              color: "#F7F5F0",
              letterSpacing: "0.01em",
            }}
          >
            {stock.symbol}
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.7rem",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {stock.exchange}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="flex rounded-sm overflow-hidden"
            style={{ border: "1px solid #27313C" }}
          >
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                onClick={() => onTimeframeChange(stock.id, tf.interval)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                  padding: "5px 10px",
                  backgroundColor:
                    stock.timeframe === tf.interval ? "#2E7D5B" : "transparent",
                  color: stock.timeframe === tf.interval ? "#F7F5F0" : "#9CA3AF",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                aria-pressed={stock.timeframe === tf.interval}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onRemove(stock.id)}
            aria-label={`Remove ${stock.symbol}`}
            style={{
              color: "#6B7280",
              padding: "4px",
              marginLeft: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#B5482A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            <X size={15} />
          </button>
        </div>
      </div>
      <div style={{ height: "380px" }}>
        <TVChart
          symbol={stock.symbol}
          timeframe={stock.timeframe}
          exchange={stock.exchange}
        />
      </div>
    </div>
  );
}

export default function WatchlistCharts() {
  const [stocks, setStocks] = useState([
    { id: 1, symbol: "NACLIND", exchange: "NSE", timeframe: "D" },
    { id: 2, symbol: "TARIL", exchange: "NSE", timeframe: "D" },
    { id: 3, symbol: "EBGNG", exchange: "NSE", timeframe: "D" },
    { id: 4, symbol: "AEQUS", exchange: "NSE", timeframe: "D" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const nextId = useRef(5);

  const addSymbols = useCallback(() => {
    const raw = inputValue
      .split(/[,\n]/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    if (raw.length === 0) return;

    setStocks((prev) => {
      const existingSymbols = new Set(prev.map((s) => s.symbol));
      const additions = raw
        .filter((sym) => !existingSymbols.has(sym))
        .map((sym) => ({
          id: nextId.current++,
          symbol: sym,
          exchange: "NSE",
          timeframe: "D",
        }));
      return [...prev, ...additions];
    });
    setInputValue("");
  }, [inputValue]);

  const removeStock = useCallback((id) => {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const setTimeframe = useCallback((id, interval) => {
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, timeframe: interval } : s))
    );
  }, []);

  const setAllTimeframes = useCallback((interval) => {
    setStocks((prev) => prev.map((s) => ({ ...s, timeframe: interval })));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#11161C",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
      className="p-5 sm:p-8"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="mb-7">
          <div className="flex items-baseline gap-3 mb-1">
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: "1.9rem",
                color: "#F7F5F0",
                letterSpacing: "-0.01em",
              }}
            >
              Watchlist Charts
            </h1>
            <span
              style={{
                fontSize: "0.72rem",
                color: "#6B7280",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {stocks.length} stock{stocks.length !== 1 ? "s" : ""} tracked
            </span>
          </div>
          <p style={{ color: "#6B7280", fontSize: "0.82rem", maxWidth: "560px" }}>
            Daily, weekly, and monthly structure for every name on the screener —
            side by side, no tab-switching.
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 mb-7 p-4 rounded-sm"
          style={{ backgroundColor: "#171D25", border: "1px solid #27313C" }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addSymbols();
            }}
            placeholder="Add symbols — e.g. BHARATGEAR, KISSHT, BERGEPAINT"
            style={{
              flex: 1,
              backgroundColor: "#11161C",
              border: "1px solid #27313C",
              color: "#F7F5F0",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.85rem",
              padding: "9px 12px",
              borderRadius: "2px",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2E7D5B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#27313C")}
          />
          <button
            onClick={addSymbols}
            style={{
              backgroundColor: "#2E7D5B",
              color: "#F7F5F0",
              border: "none",
              padding: "9px 18px",
              borderRadius: "2px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.82rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={15} /> Add to grid
          </button>
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setAllTimeframes(tf.interval)}
                title={`Set all to ${tf.label}`}
                style={{
                  backgroundColor: "transparent",
                  color: "#9CA3AF",
                  border: "1px solid #27313C",
                  padding: "9px 12px",
                  borderRadius: "2px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2E7D5B";
                  e.currentTarget.style.color = "#F7F5F0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#27313C";
                  e.currentTarget.style.color = "#9CA3AF";
                }}
              >
                All {tf.label}
              </button>
            ))}
          </div>
        </div>

        {stocks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-sm"
            style={{ border: "1px dashed #27313C", color: "#6B7280" }}
          >
            <RefreshCw size={22} style={{ marginBottom: "10px", opacity: 0.5 }} />
            <p style={{ fontSize: "0.85rem" }}>
              No symbols yet. Add your screener list above to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onRemove={removeStock}
                onTimeframeChange={setTimeframe}
              />
            ))}
          </div>
        )}

        <p
          style={{
            color: "#3F4751",
            fontSize: "0.7rem",
            marginTop: "28px",
            textAlign: "center",
          }}
        >
          Charts powered by TradingView · NSE symbols only
        </p>
      </div>
    </div>
  );
}  const containerRef = useRef(null);
  const widgetIdRef = useRef(
    `tv_${symbol}_${Math.random().toString(36).slice(2)}`
  );

  useEffect(() => {
    let cancelled = false;
    loadTradingViewScript().then(() => {
      if (cancelled || !containerRef.current || !window.TradingView) return;
      containerRef.current.innerHTML = "";
      const widgetDiv = document.createElement("div");
      widgetDiv.id = widgetIdRef.current;
      widgetDiv.style.height = "100%";
      widgetDiv.style.width = "100%";
      containerRef.current.appendChild(widgetDiv);

      new window.TradingView.widget({
        autosize: true,
        symbol: `${exchange}:${symbol}`,
        interval: timeframe,
        timezone: "Asia/Kolkata",
        theme: "dark",
        style: "1",
        locale: "in",
        toolbar_bg: "#11161C",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: widgetIdRef.current,
        backgroundColor: "#11161C",
        gridColor: "rgba(107, 114, 128, 0.12)",
        studies: ["STD;SMA"],
      });
    });
    return () => {
      cancelled = true;
    };
  }, [symbol, timeframe, exchange]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "360px" }}
    />
  );
}

function StockCard({ stock, onRemove, onTimeframeChange }) {
  return (
    <div
      className="flex flex-col rounded-sm overflow-hidden"
      style={{
        backgroundColor: "#171D25",
        border: "1px solid #27313C",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #27313C" }}
      >
        <div className="flex items-baseline gap-2">
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.15rem",
              fontWeight: 600,
              color: "#F7F5F0",
              letterSpacing: "0.01em",
            }}
          >
            {stock.symbol}
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.7rem",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {stock.exchange}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="flex rounded-sm overflow-hidden"
            style={{ border: "1px solid #27313C" }}
          >
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                onClick={() => onTimeframeChange(stock.id, tf.interval)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                  padding: "5px 10px",
                  backgroundColor:
                    stock.timeframe === tf.interval ? "#2E7D5B" : "transparent",
                  color: stock.timeframe === tf.interval ? "#F7F5F0" : "#9CA3AF",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                aria-pressed={stock.timeframe === tf.interval}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => onRemove(stock.id)}
            aria-label={`Remove ${stock.symbol}`}
            style={{
              color: "#6B7280",
              padding: "4px",
              marginLeft: "4px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#B5482A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            <X size={15} />
          </button>
        </div>
      </div>
      <div style={{ height: "380px" }}>
        <TVChart
          symbol={stock.symbol}
          timeframe={stock.timeframe}
          exchange={stock.exchange}
        />
      </div>
    </div>
  );
}

export default function WatchlistCharts() {
  const [stocks, setStocks] = useState([
    { id: 1, symbol: "NACLIND", exchange: "NSE", timeframe: "D" },
    { id: 2, symbol: "TARIL", exchange: "NSE", timeframe: "D" },
    { id: 3, symbol: "EBGNG", exchange: "NSE", timeframe: "D" },
    { id: 4, symbol: "AEQUS", exchange: "NSE", timeframe: "D" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const nextId = useRef(5);

  const addSymbols = useCallback(() => {
    const raw = inputValue
      .split(/[,\n]/)
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    if (raw.length === 0) return;

    setStocks((prev) => {
      const existingSymbols = new Set(prev.map((s) => s.symbol));
      const additions = raw
        .filter((sym) => !existingSymbols.has(sym))
        .map((sym) => ({
          id: nextId.current++,
          symbol: sym,
          exchange: "NSE",
          timeframe: "D",
        }));
      return [...prev, ...additions];
    });
    setInputValue("");
  }, [inputValue]);

  const removeStock = useCallback((id) => {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const setTimeframe = useCallback((id, interval) => {
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, timeframe: interval } : s))
    );
  }, []);

  const setAllTimeframes = useCallback((interval) => {
    setStocks((prev) => prev.map((s) => ({ ...s, timeframe: interval })));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#11161C",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
      className="p-5 sm:p-8"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-7">
          <div className="flex items-baseline gap-3 mb-1">
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: "1.9rem",
                color: "#F7F5F0",
                letterSpacing: "-0.01em",
              }}
            >
              Watchlist Charts
            </h1>
            <span
              style={{
                fontSize: "0.72rem",
                color: "#6B7280",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {stocks.length} stock{stocks.length !== 1 ? "s" : ""} tracked
            </span>
          </div>
          <p style={{ color: "#6B7280", fontSize: "0.82rem", maxWidth: "560px" }}>
            Daily, weekly, and monthly structure for every name on the screener —
            side by side, no tab-switching.
          </p>
        </div>

        {/* Controls */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-7 p-4 rounded-sm"
          style={{ backgroundColor: "#171D25", border: "1px solid #27313C" }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addSymbols();
            }}
            placeholder="Add symbols — e.g. BHARATGEAR, KISSHT, BERGEPAINT"
            style={{
              flex: 1,
              backgroundColor: "#11161C",
              border: "1px solid #27313C",
              color: "#F7F5F0",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.85rem",
              padding: "9px 12px",
              borderRadius: "2px",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2E7D5B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#27313C")}
          />
          <button
            onClick={addSymbols}
            style={{
              backgroundColor: "#2E7D5B",
              color: "#F7F5F0",
              border: "none",
              padding: "9px 18px",
              borderRadius: "2px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.82rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={15} /> Add to grid
          </button>
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setAllTimeframes(tf.interval)}
                title={`Set all to ${tf.label}`}
                style={{
                  backgroundColor: "transparent",
                  color: "#9CA3AF",
                  border: "1px solid #27313C",
                  padding: "9px 12px",
                  borderRadius: "2px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2E7D5B";
                  e.currentTarget.style.color = "#F7F5F0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#27313C";
                  e.currentTarget.style.color = "#9CA3AF";
                }}
              >
                All {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {stocks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-sm"
            style={{ border: "1px dashed #27313C", color: "#6B7280" }}
          >
            <RefreshCw size={22} style={{ marginBottom: "10px", opacity: 0.5 }} />
            <p style={{ fontSize: "0.85rem" }}>
              No symbols yet. Add your screener list above to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onRemove={removeStock}
                onTimeframeChange={setTimeframe}
              />
            ))}
          </div>
        )}

        <p
          style={{
            color: "#3F4751",
            fontSize: "0.7rem",
            marginTop: "28px",
            textAlign: "center",
          }}
        >
          Charts powered by TradingView · NSE symbols only · Use the SMA overlay
          already on each chart to eyeball trend structure
        </p>
      </div>
    </div>
  );
}
