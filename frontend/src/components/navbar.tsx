import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/context/theme-provider";

export function Navbar() {
  const { theme } = useTheme();
  const location = useLocation();
  const isDark = theme === "dark";
  const baseClass = "pb-1 transition-colors";
  const activeBorder = isDark ? "border-white" : "border-black";
  const linkClass = (path: string) =>
    location.pathname === path
      ? `${baseClass} border-b-2 ${activeBorder} font-semibold`
      : `${baseClass} border-transparent`;

  return (
    <nav>
      <div className="mr-10 flex items-center gap-6 font-medium">
        <Link to="/" className={linkClass("/")}>
          Home
        </Link>
        <Link to="/data" className={linkClass("/data")}>
          Data
        </Link>
        <Link to="/prediction" className={linkClass("/prediction")}>
          Prediction
        </Link>
        <Link to="/about-us" className={linkClass("/about-us")}>
          About
        </Link>
      </div>
    </nav>
  );
}
