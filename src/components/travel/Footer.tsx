import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useTermsNCondition } from "@/components/TermsNCondition";

const Footer = () => {
  const { openModal, modal } = useTermsNCondition();

  return (
    <footer className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">ID Card Maker</h3>
            <p className="mb-4 text-gray-400">
              Professional ID card solutions for businesses, schools, and organizations of all sizes.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="hover:text-white">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-gray-400 transition hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} /> 123 Card Street, Design City
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={18} /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={18} /> support@idcardmaker.com
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Subscribe</h3>
            <p className="mb-4 text-gray-400">Stay updated with our latest news and offers</p>
            <div className="flex flex-col space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="text-lg">
            &copy; {new Date().getFullYear()} ID Card. All rights reserved. Made with ❤️ for ID Card Maker.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link href="/privacy" className="text-sm hover:text-white">Privacy Policy</Link>
            {/* Replace the Terms & Conditions link with a button */}
            <button
              type="button"
              className="text-sm hover:text-white underline bg-transparent border-none p-0 m-0"
              onClick={openModal}
            >
              Terms & Conditions
            </button>
            <Link href="/refund" className="text-sm hover:text-white">Refund Policy</Link>
          </div>
        </div>
      </div>
      {/* Render the modal */}
      {modal}
    </footer>
  );
};

export default Footer;
