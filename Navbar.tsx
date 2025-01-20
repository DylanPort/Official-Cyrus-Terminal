import { Search, User, BellDot, LayoutDashboard, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { SnubCubeLogo } from "@/components/SnubCubeLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <SnubCubeLogo className="w-8 h-8 md:w-10 md:h-10" />
            <span className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-mint animate-neon-pulse">
              CYRUS-TERMINAL
            </span>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] glass-effect">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/marketplace" className="nav-link font-medium">Smart Contracts</Link>
                <Link to="/marketplace" className="nav-link font-medium">Web Apps</Link>
                <Link to="/marketplace" className="nav-link font-medium">Scripts</Link>
                <Link to="/marketplace" className="nav-link font-medium">APIs</Link>
                <Link to="/marketplace?category=memes" className="nav-link font-medium">Memes</Link>
                <Link to="/creators-dashboard" className="nav-link font-medium">Dashboard</Link>
                <Link to="/profile/edit" className="nav-link font-medium">Profile</Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="nav-link font-medium">Smart Contracts</Link>
            <Link to="/marketplace" className="nav-link font-medium">Web Apps</Link>
            <Link to="/marketplace" className="nav-link font-medium">Scripts</Link>
            <Link to="/marketplace" className="nav-link font-medium">APIs</Link>
            <Link to="/marketplace?category=memes" className="nav-link font-medium">Memes</Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <button className="p-2 hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link 
              to="/creators-dashboard"
              className="hidden md:flex items-center gap-2 p-2 hover:text-primary transition-colors relative group"
              title="Creators Dashboard"
            >
              <LayoutDashboard className="h-5 w-5 animate-pulse text-mint" />
              <span className="hidden md:inline group-hover:text-mint transition-colors">Dashboard</span>
              <div className="absolute inset-0 bg-mint/10 rounded-lg filter blur-md animate-pulse -z-10"></div>
            </Link>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="p-2 hover:text-primary transition-colors group"
              title="Edit Profile"
            >
              <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className="relative p-2 hover:text-primary transition-colors group">
              <BellDot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-accent rounded-full group-hover:scale-110 transition-transform">
                0
              </span>
            </button>
            {connected ? (
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !transition-colors" />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90 text-white hidden md:flex"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;