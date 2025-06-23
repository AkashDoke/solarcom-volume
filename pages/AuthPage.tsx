
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Alert, SectionWrapper } from '../components/CommonUI';
import { User } from '../types';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [confirmPassword, setConfirmPassword] = useState(''); // For registration
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLogin) {
      // Simulate login
      if (email === 'user@example.com' && password === 'password123') {
        const userData: User = { id: '1', email, name: 'Test User', role: 'user' };
        login(userData);
        navigate('/');
      } else if (email === 'admin@example.com' && password === 'adminpass') {
        const userData: User = { id: '2', email, name: 'Admin User', role: 'admin' };
        login(userData);
        navigate('/'); // Or navigate to an admin dashboard: navigate('/admin');
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // Simulate registration
      if (email && name && password) {
        const newUser: User = { id: Date.now().toString(), email, name, role: 'user' };
        console.log('Registered new user:', newUser);
        // Typically, you'd log the user in automatically after registration
        login(newUser);
        navigate('/');
      } else {
         setError('Please fill in all fields for registration.');
      }
    }
    setIsLoading(false);
  };

  return (
    <SectionWrapper title={isLogin ? 'Login to Your Account' : 'Create an Account'}>
      <div className="max-w-md mx-auto">
        <Card className="p-6 md:p-8">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Input
                label="Full Name"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            )}
            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            {!isLogin && (
              <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            )}
            <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
              {isLoading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Create Account')}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null); // Clear errors when switching forms
                // setEmail(''); setPassword(''); setName(''); setConfirmPassword(''); // Optionally clear fields
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
           <div className="mt-4 text-xs text-center text-gray-500">
            <p>Demo Login: user@example.com / password123</p>
            <p>Demo Admin: admin@example.com / adminpass</p>
          </div>
        </Card>
      </div>
    </SectionWrapper>
  );
};

export default AuthPage;
