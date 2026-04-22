import { Link, useLocation } from "react-router";
import { APP_NAME } from "@constants/constants";
import { RiDoorOpenFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoIosBookmark } from "react-icons/io";

export default function Navbar() {
  const { pathname } = useLocation();
  const inQuiz = pathname === "/quiz";

  return (
    <header className="navbar">
  <div className="navbar__left" />

  <Link to="/" className="navbar__logo">
    {APP_NAME}
  </Link>

  <div className="navbar__right">
    <IoMdSettings size={48} />
<IoIosBookmark size={48} />

    {inQuiz && (
      <Link to="/" className="navbar__quit"><RiDoorOpenFill size={48} /></Link>
    )}
  </div>
</header>
  );
}