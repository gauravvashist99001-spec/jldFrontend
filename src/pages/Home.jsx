import Navbar from "../components/Navbar";
import CardWidget from "../components/CardWidget";
import { CARDS } from "../constants";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container">
        <p style={{ color: "#3486f8" }}>
          Data appears automatically once its scheduled time arrives. No login needed to view.
          Click any card to see full-day history and browse older days.
        </p>
        <div className="grid-4">
          {CARDS.map((c) => (
            <CardWidget key={c.id} cardId={c.id} label={c.label} />
          ))}
        </div>
      </div>
    </>
  );
}
