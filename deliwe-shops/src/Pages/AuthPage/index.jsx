import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-28">  
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        {/* Toggle Between Login & Register */}
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>
        <p className="text-gray-500 text-center mt-2">
          {isLogin ? "Welcome back! Please enter your credentials." : "Join us and start shopping now!"}
        </p>

        {/* Form Fields */}
        <form className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input type="text" placeholder="Enter your full name" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-amber-300" />
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-medium">Email Address</label>
            <input type="email" placeholder="Enter your email" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-amber-300" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input type="password" placeholder="Enter your password" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-amber-300" />
          </div>
          
          {/* Action Button */}
          <Button className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2">
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        {/* Toggle Login/Register */}
        <p className="text-center text-gray-600 text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-amber-600 font-semibold hover:underline">
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
