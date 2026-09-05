import { useEffect, useState } from "react";

interface Prediction {
  id: string;
  risk_level: string;
  probability_high: number;
  probability_medium: number;
  probability_low: number;
  timestamp: string;
}

export default function PredictionHistory() {
  const [history, setHistory] = useState<Prediction[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/prediction-history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Prediction History
      </h1>

      {history.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-5 mb-4 shadow"
        >
          <h2 className="text-xl font-semibold">
            Risk: {item.risk_level}
          </h2>

          <p>High: {item.probability_high}%</p>
          <p>Medium: {item.probability_medium}%</p>
          <p>Low: {item.probability_low}%</p>

          <p className="text-gray-500 mt-2">
            {item.timestamp}
          </p>
        </div>
      ))}
    </div>
  );
}