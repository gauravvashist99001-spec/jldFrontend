import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { CARDS } from "../constants";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function CardDetail() {
  const { cardId } = useParams();
  const label = CARDS.find((c) => c.id === cardId)?.label || cardId;

  const [date, setDate] = useState(todayStr());
  const [entries, setEntries] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadEntries(selectedDate) {
    setLoading(true);
    try {
      const res = await api.get(`/${cardId}`, { params: { date: selectedDate } });
      setEntries(res.data.entries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDates() {
    try {
      const res = await api.get(`/${cardId}/dates`);
      setAvailableDates(res.data.dates || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadDates();
  }, [cardId]);

  useEffect(() => {
    loadEntries(date);
    // auto-refresh only makes sense while viewing today's live data
    if (date === todayStr()) {
      const interval = setInterval(() => loadEntries(date), 15000);
      return () => clearInterval(interval);
    }
  }, [cardId, date]);

  return (
    <>
      <Navbar />
      <div className="container">
        <Link className="back-link" to="/">&larr; Back to all cards</Link>
        <div className="page-header">
          <h2>{label} — full day data</h2>
          <div className="date-controls">
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
            />
            {availableDates.length > 0 && (
              <select value={date} onChange={(e) => setDate(e.target.value)}>
                {!availableDates.includes(todayStr()) && (
                  <option value={todayStr()}>{todayStr()} (today)</option>
                )}
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                    {d === todayStr() ? " (today)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <p className="empty-msg">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="empty-msg">No data to show for this date yet.</p>
        ) : (
          <div className="big-list">
            {entries.map((e) => (
              <div className="big-list-row" key={e._id}>
                <span className="time">Scheduled: {e.time}</span>
                <span className="number">{e.number}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
