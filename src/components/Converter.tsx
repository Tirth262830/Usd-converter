import { useEffect, useMemo, useState } from "react";

interface CurrencyResponse {
  date: string;
  usd: Record<string, number>;
}

const Converter = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState<number>(1);
  const [target, setTarget] = useState("inr");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
        );
        const data: CurrencyResponse = await res.json();
        setRates(data.usd);
        setDate(data.date);
        setLoading(false);
      } catch {
        setError("Failed to load currency rates. Please try again later.");
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const sortedCurrencies = useMemo(
    () => Object.keys(rates).sort(),
    [rates]
  );

  const handleConvert = () => {
    setError("");

    if (!amount || amount <= 0) {
      setError("Please enter an amount greater than 0.");
      setResult(null);
      return;
    }

    const rate = rates[target];
    if (!rate) {
      setError("Selected currency is not available.");
      setResult(null);
      return;
    }

    setResult(amount * rate);
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg rounded-3xl bg-slate-950/70 text-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.9)] border border-slate-700/70 backdrop-blur-xl p-8">
        <p className="text-center text-sm text-slate-300">
          Loading live USD rates…
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-3xl bg-slate-950/80 text-slate-50 shadow-[0_20px_60px_rgba(15,23,42,0.9)] border border-slate-700/70 backdrop-blur-xl p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            USD Converter
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live FX rates powered by public currency API.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-yellow-400/10 text-yellow-300 border border-yellow-400/40">
          Live • USD
        </span>
      </div>

      {/* Error (top-level) */}
      {error && (
        <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-4">
        {/* Amount */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-200 tracking-wide">
            AMOUNT (USD)
          </label>
          <input
            type="number"
            min={0}
            value={isNaN(amount) ? "" : amount}
            onChange={(e) => {
              
                       let value = e.target.value;

                       // Allow clearing input
                      if (value === "") {
                      setAmount(NaN);
                      return;
                      }

                      // Remove leading zeros (e.g., 05 → 5)
                      value = value.replace(/^0+(?=\d)/, "");

                         setAmount(Number(value));
                        }}
            className="w-full rounded-xl bg-slate-900/70 border border-slate-600/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            placeholder="Enter amount, e.g. 100"
          />
        </div>

        {/* Currency */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-200 tracking-wide">
            CONVERT TO
          </label>
          <div className="relative">
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-600/70 px-3 py-2.5 text-sm text-slate-50 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            >
              {sortedCurrencies.map((code) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-amber-300 text-slate-900 font-semibold text-sm py-2.5 mt-1 shadow-md hover:shadow-lg hover:from-yellow-300 hover:to-amber-200 transition transform hover:-translate-y-[1px] active:translate-y-[1px]"
      >
        Convert
      </button>

      {/* Result section */}
      <div className="grid gap-4 md:grid-cols-2 mt-2">
        {/* Converted amount */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-700/70 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
            Converted Amount
          </p>
          {result !== null ? (
            <p className="text-xl font-semibold text-yellow-300">
              {result.toFixed(2)}{" "}
              <span className="text-xs text-slate-300">
                {target.toUpperCase()}
              </span>
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              Enter an amount and click <span className="font-semibold">Convert</span>.
            </p>
          )}
        </div>

        {/* Meta info */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-700/70 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
            Rate Info
          </p>
          <p className="text-sm text-slate-200">
            1 USD ={" "}
            <span className="font-semibold text-yellow-300">
              {rates[target]?.toFixed(4)} {target.toUpperCase()}
            </span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Last updated on{" "}
            <span className="text-slate-300 font-medium">{date}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Converter;
