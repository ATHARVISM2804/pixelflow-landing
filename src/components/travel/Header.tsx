import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          
          <span className="text-2xl font-bold text-foreground">ID Card Maker</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Services</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Contact</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Blog</a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;