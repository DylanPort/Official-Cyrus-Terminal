import { X, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-16 px-4 border-t border-primary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-6 text-primary animate-neon-pulse">CYRUS-TERMINAL</h2>
          </div>

          <div className="col-span-1">
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <nav className="space-y-4">
              <h3 className="font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col-span-1">
            <div className="space-y-4">
              <h3 className="font-semibold mb-4 text-foreground">Get in touch</h3>
              <p className="text-muted-foreground mb-4">
                For any inquiries, reach us at
                <a href="mailto:contact@cyrus-terminal.fun" className="text-primary block mt-2 hover:text-accent transition-colors">
                  contact@cyrus-terminal.fun
                </a>
              </p>
              <div className="flex gap-4">
                <a href="https://x.com/niotheniner" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </a>
                <a href="https://t.me/cyrusterminal" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;