import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-gray-200">
      <div className="container mx-auto px-4 py-16">
        {/* ...existing code or add more dark footer content here if needed... */}
        <div className="border-gray-700 pt-6 text-center text-gray-400">
          <p className="text-lg">
            &copy; 2025 ID Card. All rights reserved. Made with ❤️ for ID Card Maker.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
