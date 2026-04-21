import { Link, useLocation } from "react-router";
import { APP_NAME } from "@data/constants";

export default function Navbar() {
  const { pathname } = useLocation();
  const inQuiz = pathname === "/quiz";

  return (
    <header className="navbar">
        <Link to="/" className="navbar__logo">
            {APP_NAME}
        </Link>

        {inQuiz && (
            <Link to="/" className="navbar__quit">
            ← quitter
            </Link>
        )}
    </header>
  );
}