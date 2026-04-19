import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    await login();
    setIsLoggingIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="max-w-sm w-full bg-white border border-gray-200 rounded-3xl p-10 shadow-xl shadow-gray-200/50">
        <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-900/20">
                <Code2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Welcome to DevTools</h1>
            <p className="text-gray-500 text-sm">Your unified engineering workspace.</p>
        </div>

        <div className="space-y-4">
            <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
                {isLoggingIn ? 'Authenticating...' : (
                    <>
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                        Continue with Google
                    </>
                )}
            </button>
            
            <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/10"
            >
                Continue with Email
            </button>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
            By continuing, you agree to the <a href="#" className="underline hover:text-gray-900">Terms</a> and <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};