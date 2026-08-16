import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { CARDS } from "../constants";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function AdminDashboard() {
  const [cardId, setCardId] = useState(CARDS[0].id);
  const [time, setTime] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(todayStr());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [entries, setEntries] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editTime, setEditTime] = useState("");
  const [editNumber, setEditNumber] = useState("");

  async function loadEntries() {
    try {
      const res = await api.get(`/${cardId}/all`, { params: { date } });
      setEntries(res.data.entries || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadEntries();
  }, [cardId, date]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post(`/${cardId}`, { time, number: Number(number), date });
      setMessage(`Added ${time} : ${number} to ${cardId} for ${date}.`);
      setTime("");
      setNumber("");
      loadEntries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save entry.");
    }
  }

  function startEdit(entry) {
    setEditingId(entry._id);
    setEditTime(entry.time);
    setEditNumber(String(entry.number));
    setError("");
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTime("");
    setEditNumber("");
  }

  async function saveEdit(id) {
    setError("");
    setMessage("");
    try {
      await api.patch(`/${cardId}/${id}`, { time: editTime, number: Number(editNumber) });
      setMessage("Entry updated.");
      cancelEdit();
      loadEntries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update entry.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Permanently delete this entry? This cannot be undone.")) return;
    setError("");
    setMessage("");
    try {
      await api.delete(`/${cardId}/${id}`);
      setMessage("Entry deleted.");
      loadEntries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete entry.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="admin-grid">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>Feed New Data</h2>

            <label>Card</label>
            <select value={cardId} onChange={(e) => setCardId(e.target.value)}>
              {CARDS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <label>Time (when it should start showing)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />

            <label>Number</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />

            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            {error && <p className="error-msg">{error}</p>}
            {message && <p className="success-msg">{message}</p>}

            <button className="primary" type="submit">Save Entry</button>
          </form>

          <div>
            <h2>
              {CARDS.find((c) => c.id === cardId)?.label} — data for {date}
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>
              This admin view shows everything you've fed for the day, including entries
              whose time hasn't arrived yet on the public board.
            </p>
            {entries.length === 0 ? (
              <p className="empty-msg">No entries yet for this date.</p>
            ) : (
              <div className="big-list">
                {entries.map((e) =>
                  editingId === e._id ? (
                    <div className="big-list-row editing-row" key={e._id}>
                      <input
                        type="time"
                        value={editTime}
                        onChange={(ev) => setEditTime(ev.target.value)}
                      />
                      <input
                        type="number"
                        value={editNumber}
                        onChange={(ev) => setEditNumber(ev.target.value)}
                      />
                      <div className="row-actions">
                        <button className="primary small" onClick={() => saveEdit(e._id)}>
                          Save
                        </button>
                        <button className="secondary small" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="big-list-row" key={e._id}>
                      <span className="time">{e.time}</span>
                      <span className="number">{e.number}</span>
                      <div className="row-actions">
                        <button className="secondary small" onClick={() => startEdit(e)}>
                          Edit
                        </button>
                        <button className="danger small" onClick={() => handleDelete(e._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
