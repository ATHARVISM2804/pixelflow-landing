import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-travel-orange-light to-background">
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-travel-coral opacity-60"></div>
      <div className="absolute bottom-40 right-20 w-12 h-12 rounded-full bg-travel-orange opacity-40"></div>
      
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input placeholder="First name" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input placeholder="Last name" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="Enter your email" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Create password" className="mt-1" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
