import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import LeftPanel from "../../components/Auth/LeftPanel";
import RightPanel from "../../components/Auth/RightPanel";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would connect to authentication service
      // For now we just simulate a login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login successful",
        description: "Welcome back to FinTrack!",
      });
      
      // Redirect to dashboard
      window.location.href = '/';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex relative">
      
      {/* LeftPanel */}
      <motion.div
        className="w-1/2 bg-primary-100 flex items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <LeftPanel />
      </motion.div>

      {/* RightPanel */}
      <div className="w-1/2 bg-white h-full relative flex items-center justify-center">
        <RightPanel />
      </div>

      {/* LoginForm */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl shadow-xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative w-full max-w-xl min-h-[500px] mx-auto border border-gray-300 shadow-xl rounded-3xl p-10 bg-white">
          <div className="absolute top-4 right-4 md:top-8 md:right-8 text-sm">
            <span className="text-gray-500">No Account?</span>{" "}
            <br />
            <Link
              to="/register"
              className="text-primary-600 font-medium hover:underline transition-all"
            >
              Sign up
            </Link>
          </div>
          <motion.div
            className="w-full text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-sm font-normal mb-1 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Welcome to FinTrack
            </motion.h2>

            <motion.h1
              className="text-4xl font-bold mb-8 text-primary-600 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Sign in
            </motion.h1>

            <form onSubmit={handleSubmit}>
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="email" className="block text-sm mb-2 text-left">
                  Enter your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Email address"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm text-left">
                    Enter your Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary-500 hover:underline transition-all"
                  >
                    Forgot Password
                  </Link>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-br from-primary-500 to-primary-600 text-white py-3 rounded-md hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
