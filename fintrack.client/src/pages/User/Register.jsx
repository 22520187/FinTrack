import { motion } from "framer-motion";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import LeftPanel from "../../components/Auth/LeftPanel";
import RightPanel from "../../components/Auth/RightPanel";
import authService from "../../services/auth.service";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.name
      };

      const response = await authService.signUp(requestData);

      if (response.status !== 200) {
        toast({
          variant: "destructive",
          title: "Failed to register account",
          description: "Please make sure your information is correct.",
        });
        return;
      }

      toast({
        title: "Registration successful",
        description: "Welcome to FinTrack! Please log in with your new account.",
      });

      window.location.href = '/login';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      value: formData.name,
      delay: 0.3
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "your@email.com",
      value: formData.email,
      delay: 0.4
    },
    {
      id: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "••••••••",
      value: formData.password,
      delay: 0.5,
      hasToggle: true,
      showValue: showPassword,
      toggleAction: () => setShowPassword(!showPassword)
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "••••••••",
      value: formData.confirmPassword,
      delay: 0.6,
      hasToggle: true,
      showValue: showConfirmPassword,
      toggleAction: () => setShowConfirmPassword(!showConfirmPassword)
    }
  ];

  const renderFormField = (field) => (
    <motion.div
      key={field.id}
      className="mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: field.delay }}
    >
      <label htmlFor={field.id} className="block text-sm mb-2 text-left">
        {field.label}
      </label>
      <div className="relative">
        <input
          id={field.id}
          name={field.id}
          type={field.type}
          value={field.value}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          placeholder={field.placeholder}
          required
        />
        {field.hasToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={field.toggleAction}
            aria-label={field.showValue ? "Hide password" : "Show password"}
          >
            {field.showValue ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen w-full flex relative">
      {/* Left Panel */}
      <motion.div
        className="w-1/2 bg-primary-100 flex items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <LeftPanel />
      </motion.div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white h-full relative flex items-center justify-center">
        <RightPanel />
      </div>

      {/* Registration Form */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl shadow-xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative w-full max-w-xl min-h-[580px] mx-auto border border-gray-300 shadow-xl rounded-3xl p-10 bg-white">
          <div className="absolute top-4 right-4 md:top-8 md:right-8 text-sm">
            <span className="text-gray-500">Already have an account?</span>
            <br />
            <Link
              to="/login"
              className="text-primary-600 font-medium hover:underline transition-all"
            >
              Sign in
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
              Create an Account
            </motion.h1>

            <form onSubmit={handleRegister}>
              {formFields.map(renderFormField)}

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-br from-primary-500 to-primary-600 text-white py-3 rounded-md hover:bg-gradient-to-br hover:from-primary-600 hover:to-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
