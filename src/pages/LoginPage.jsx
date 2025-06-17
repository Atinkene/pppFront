import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { roleConfigs } from '../utils';
import { Heart } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    nom: '',
    prenom: '',
    sexe: 'M',
    date_naissance: '',
    cin: '',
    lieu_naissance: '',
    nationalite: '',
    adresse_postale: '',
    numero_telephone: '',
    login: '',
    role: 'patient',
    groupe_sanguin: '',
    numero_rpps: '',
    specialite: '',
    numero_adeli: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.mot_de_passe);
      } else {
        await register(formData);
        setIsLogin(true);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(`Échec : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderRegistrationFields = () => (
    <>
      <Input label="Nom" name="nom" value={formData.nom} onChange={handleChange} />
      <Input label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} />
      <Input label="Sexe" name="sexe" value={formData.sexe} onChange={handleChange} />
      <Input label="Date de naissance" name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} />
      <Input label="CIN" name="cin" value={formData.cin} onChange={handleChange} />
      <Input label="Lieu de naissance" name="lieu_naissance" value={formData.lieu_naissance} onChange={handleChange} />
      <Input label="Nationalité" name="nationalite" value={formData.nationalite} onChange={handleChange} />
      <Input label="Adresse postale" name="adresse_postale" value={formData.adresse_postale} onChange={handleChange} />
      <Input label="Numéro de téléphone" name="numero_telephone" value={formData.numero_telephone} onChange={handleChange} />
      <Input label="Login" name="login" value={formData.login} onChange={handleChange} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {Object.entries(roleConfigs).map(([key, config]) => (
            <option key={key} value={key}>{config.name}</option>
          ))}
        </select>
      </div>

      {formData.role === 'patient' && (
        <Input label="Groupe sanguin" name="groupe_sanguin" value={formData.groupe_sanguin} onChange={handleChange} />
      )}

      {['chirurgien', 'anesthesiste', 'radiologue', 'biologiste', 'medecin', 'infirmier', 'kinesitherapeute', 'psychologue'].includes(formData.role) && (
        <>
          <Input label="Numéro RPPS" name="numero_rpps" value={formData.numero_rpps} onChange={handleChange} />
          <Input label="Spécialité" name="specialite" value={formData.specialite} onChange={handleChange} />
        </>
      )}

      {formData.role === 'personnel_administratif' && (
        <Input label="Numéro ADELI" name="numero_adeli" value={formData.numero_adeli} onChange={handleChange} />
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Système Hospitalier</h1>
          <p className="text-gray-600">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && renderRegistrationFields()}

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Mot de passe"
            name="mot_de_passe"
            type="password"
            value={formData.mot_de_passe}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <span>{isLogin ? 'Se connecter' : 'S\'inscrire'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isLogin ? 'Pas encore de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default LoginPage;
