import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-travel-orange to-travel-coral"></div>
          <span className="text-2xl font-bold text-foreground">Traver</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">Home</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Services</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Contact</a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">Blog</a>
        </nav>
        
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Book Trip
        </Button>
      </div>
    </header>
  );
};

export default Header;