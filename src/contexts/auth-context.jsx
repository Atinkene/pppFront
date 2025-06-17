import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    console.log('Initial auth check - Token:', !!token, 'UserData:', userData); // Debug
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser || { name: 'Utilisateur Anonyme', role: 'patient' }); // Fallback
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      console.log('Login response in AuthProvider:', response); // Debug
      if (!response.token) {
        throw new Error('Réponse de connexion invalide : jeton manquant');
      }
      const userData = response.user || { name: 'Utilisateur Anonyme', role: 'patient' }; // Fallback
      setUser(userData);
      return response;
    } catch (error) {
      console.error('Login error in AuthProvider:', error.message); // Debug
      throw new Error(error.message || 'Échec de la connexion');
    }
  };

   const register = async (userData) => {
    try {
      const response = await api.register(userData); // response contient déjà le JSON
      const { message, utilisateur, token, type_jeton } = response;
    
      return {
        success: true,
        message,
        utilisateur,
        token,
        tokenType: type_jeton
      };
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error.message);
      throw new Error(error.message || 'Échec de l\'inscription');
    }
  };
  

  const logout = async () => {
    try {
      await api.logout();
      console.log('Logout successful'); // Debug
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };