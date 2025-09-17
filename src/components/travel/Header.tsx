import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <header className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">ID Card Maker</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-200 hover:text-indigo-400 transition-colors">Home</a>
          <a href="#" className="text-gray-200 hover:text-indigo-400 transition-colors">Services</a>
          <a href="#" className="text-gray-200 hover:text-indigo-400 transition-colors">About</a>
          <a href="#" className="text-gray-200 hover:text-indigo-400 transition-colors">Contact</a>
          <a href="#" className="text-gray-200 hover:text-indigo-400 transition-colors">Blog</a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-gray-200 hover:text-indigo-400"
            onClick={() => router.push('/login')}
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            onClick={() => router.push('/signup')}
          >
            <LogIn className="w-4 h-4" />
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
