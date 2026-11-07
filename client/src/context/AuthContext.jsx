// context/AuthContext.jsx - Central user authentication and live persona switching
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cb_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cb_token'));
  const [wishlist, setWishlist] = useState(() => {
    const savedUser = localStorage.getItem('cb_user');
    return savedUser && JSON.parse(savedUser).wishlist ? JSON.parse(savedUser).wishlist : [];
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load current user profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cb_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            setWishlist(res.data.user.wishlist || []);
            localStorage.setItem('cb_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session restore failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setWishlist([]);
      showToast('Session expired. Please log in again.', 'error');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [showToast]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('cb_token', receivedToken);
      localStorage.setItem('cb_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setWishlist(receivedUser.wishlist || []);

      showToast(`Logged in as ${receivedUser.name}!`, 'success');
      return { success: true, user: receivedUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token: receivedToken, user: receivedUser } = res.data;

      localStorage.setItem('cb_token', receivedToken);
      localStorage.setItem('cb_user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      setWishlist([]);

      showToast(`Account created! Welcome to CampusBazar.`, 'success');
      return { success: true, user: receivedUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Is the backend server running?';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // 1-Click Persona Switcher (For simultaneous Seller and Buyer testing)
  const switchPersona = async (personaRole) => {
    const credentials = {
      seller: { email: 'rahul@campusbazar.com', name: 'Rahul Sharma (Seller)' },
      buyer: { email: 'priya@campusbazar.com', name: 'Priya Patel (Buyer)' },
      school: { email: 'aman@campusbazar.com', name: 'Aman Verma (School Student)' },
    };

    const target = credentials[personaRole];
    if (!target) return;

    try {
      // Try logging in with demo password
      const res = await api.post('/auth/login', {
        email: target.email,
        password: 'password123',
      });
      if (res.data.success) {
        localStorage.setItem('cb_token', res.data.token);
        localStorage.setItem('cb_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        setWishlist(res.data.user.wishlist || []);
        showToast(`Switched mode to: ${target.name}`, 'info');
        return true;
      }
    } catch (err) {
      // If user doesn't exist yet, auto-register them
      try {
        const regRes = await api.post('/auth/register', {
          name: target.name,
          email: target.email,
          password: 'password123',
          phone: personaRole === 'seller' ? '9876543210' : '9812345678',
          city: personaRole === 'seller' ? 'IIT Delhi Campus' : 'DTU Delhi',
          role: personaRole === 'school' ? 'school student' : 'college student',
        });
        if (regRes.data.success) {
          localStorage.setItem('cb_token', regRes.data.token);
          localStorage.setItem('cb_user', JSON.stringify(regRes.data.user));
          setToken(regRes.data.token);
          setUser(regRes.data.user);
          setWishlist([]);
          showToast(`Switched mode to: ${target.name}`, 'info');
          return true;
        }
      } catch (regErr) {
        showToast('Could not switch persona. Check backend connection.', 'error');
      }
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('cb_token');
    localStorage.removeItem('cb_user');
    setUser(null);
    setToken(null);
    setWishlist([]);
    showToast('Logged out (Guest Mode)', 'info');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('cb_user', JSON.stringify(updatedUserData));
  };

  const isInWishlist = (listingId) => {
    if (!listingId) return false;
    return wishlist.some(
      (id) => (typeof id === 'object' ? id._id : id) === listingId
    );
  };

  const toggleWishlist = async (listingId) => {
    if (!user) {
      showToast('Please log in to save items to your wishlist', 'info');
      return false;
    }

    try {
      const res = await api.post(`/wishlist/${listingId}`);
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        showToast(res.data.message, res.data.isAdded ? 'success' : 'info');
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not update wishlist', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        switchPersona,
        logout,
        updateUser,
        wishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
