import { APP_NAME } from "@constants/constants";
import { Instructions } from "@components/ui/Instructions";
import About from "@components/ui/About";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        
        {/* Top section */}
        <div className="footer-top">
          <div className="footer-card footer-card--about">
            <About />
          </div>

          <div className="footer-card footer-card--instructions">
            <Instructions />
          </div>
        </div>

        {/* Bottom section */}
        <div className="footer-bottom">
          <p className="footer-brand">{APP_NAME}</p>
          <p className="footer-meta">
            &copy; {new Date().getFullYear()} - leila-digh
          </p>
        </div>

      </div>
    </footer>
  );
}