import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MesDonneesPersonnelles = () => {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getDonneesPersonnelles();
        setData(res);
        setForm(res);
      } catch (err) {
        setError("Erreur lors du chargement des données personnelles");
      }
    };
    fetchData();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { role, ...toUpdate } = form;
      await api.updateDonneesPersonnelles(toUpdate);
      setSuccess('Données mises à jour');
      setIsEditing(false);
      setData(form);
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes données personnelles</h1>
        <p className="text-gray-600 mb-4">Consultez et modifiez vos informations personnelles</p>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nom" value={form.nom || ''} onChange={handleChange} placeholder="Nom" className="border p-2 rounded w-full" />
              <input name="prenom" value={form.prenom || ''} onChange={handleChange} placeholder="Prénom" className="border p-2 rounded w-full" />
              <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />
              <input name="sexe" value={form.sexe || ''} onChange={handleChange} placeholder="Sexe" className="border p-2 rounded w-full" />
              <input name="date_naissance" type="date" value={form.date_naissance || ''} onChange={handleChange} className="border p-2 rounded w-full" />
              <input name="cin" value={form.cin || ''} onChange={handleChange} placeholder="CIN" className="border p-2 rounded w-full" />
              <input name="lieu_naissance" value={form.lieu_naissance || ''} onChange={handleChange} placeholder="Lieu de naissance" className="border p-2 rounded w-full" />
              <input name="nationalite" value={form.nationalite || ''} onChange={handleChange} placeholder="Nationalité" className="border p-2 rounded w-full" />
              <input name="adresse_postale" value={form.adresse_postale || ''} onChange={handleChange} placeholder="Adresse" className="border p-2 rounded w-full" />
              <input name="numero_telephone" value={form.numero_telephone || ''} onChange={handleChange} placeholder="Téléphone" className="border p-2 rounded w-full" />
              <input name="login" value={form.login || ''} onChange={handleChange} placeholder="Login" className="border p-2 rounded w-full" />
              <div>
                <label className="block text-gray-600 mb-1">Rôle</label>
                <input value={form.role || ''} disabled className="border p-2 rounded w-full bg-gray-100" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
              <button type="button" onClick={() => { setIsEditing(false); setForm(data); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Annuler</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Nom :</strong> {data.nom}</p>
            <p><strong>Prénom :</strong> {data.prenom}</p>
            <p><strong>Email :</strong> {data.email}</p>
            <p><strong>Sexe :</strong> {data.sexe}</p>
            <p><strong>Date de naissance :</strong> {data.date_naissance}</p>
            <p><strong>CIN :</strong> {data.cin}</p>
            <p><strong>Lieu de naissance :</strong> {data.lieu_naissance}</p>
            <p><strong>Nationalité :</strong> {data.nationalite}</p>
            <p><strong>Adresse :</strong> {data.adresse_postale}</p>
            <p><strong>Téléphone :</strong> {data.numero_telephone}</p>
            <p><strong>Login :</strong> {data.login}</p>
            <p><strong>Rôle :</strong> {data.role}</p>
          </div>
        )}
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-700">
            Modifier
          </button>
        )}
      </div>
    </div>
  );
};

export default MesDonneesPersonnelles;