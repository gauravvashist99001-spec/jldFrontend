import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

/**
 * One of the 4 homepage cards. Polls its own route every 20s so
 * new entries "appear" automatically once their scheduled time passes -
 * no login needed to view.
 */
export default function CardWidget({ cardId, label }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    try {
      const res = await api.get(`/${cardId}`);
      setEntries(res.data.entries || []);
    } catch (err) {
      console.error(`Failed to load ${cardId}`, err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 20000); // refresh every 20s
    return () => clearInterval(interval);
  }, [cardId]);

  return (
    <div className="card" onClick={() => navigate(`/board/${cardId}`)}>
      <h2>{label}</h2>
      {loading ? (
        <p className="empty-msg">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="empty-msg">No data revealed yet today.</p>
      ) : (
        <ul className="entry-list">
          {entries.map((e) => (
            <li key={e._id}>
              <span className="time">{e.time}</span>
              <span className="number">{e.number}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
