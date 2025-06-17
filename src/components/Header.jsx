import React, { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { roleConfigs, getMenuLabel, menuRoutes } from '../utils';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ userRole }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'Nouveau rendez-vous confirmé', time: '5 min' },
    { id: 2, message: 'Résultat d\'examen disponible', time: '1h' },
    { id: 3, message: 'Rappel: Consultation à 14h', time: '2h' }
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  const roleConfig = roleConfigs[userRole];
  const IconComponent = roleConfig?.icon || User;

  // Trouve le menu actif selon l'URL
  const activeMenu = roleConfig?.menus.find(menu =>
    location.pathname.startsWith(menuRoutes[menu])
  );

  return (
    <header className="fixed bg-white shadow-sm border-b w-full">
      <div className="px-6 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${roleConfig?.color} text-black`}>
              <IconComponent size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {roleConfig?.name || 'Utilisateur'}
              </h1>
              <p className="text-sm text-gray-500">Système Hospitalier</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-1">
              {roleConfig?.menus.map((menu) => (
                <button
                  key={menu}
                  onClick={() => navigate(menuRoutes[menu])}
                  className={`px-4 py-4 rounded-md text-sm font-medium transition-colors ${
                    activeMenu === menu
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {getMenuLabel(menu)}
                </button>
              ))}
            </nav>

            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'Utilisateur'}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => navigate('/compte')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} className="inline mr-2" />
                    Mon compte
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} className="inline mr-2" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;