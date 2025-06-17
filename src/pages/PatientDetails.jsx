import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import api from '../services/api';
import { Plus } from 'lucide-react';

const PatientDetails = () => {
  const { idPatient } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Restrict access to specific roles
  const allowedRoles = ['personnel_administratif', 'medecin', 'chirurgien', 'anesthesiste','radiologue'];
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getPatientDetails(idPatient);
        setPatientData(response);
        setFormData(response.personal_info);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des données');
      }
    };
    fetchData();
  }, [idPatient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updatePersonalInfo(idPatient, formData);
      setSuccess('Données mises à jour');
      setIsEditing(false);
      const response = await api.getPatientDetails(idPatient);
      setPatientData(response);
      setError('');
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDossierClick = (idDossier) => {
    navigate(`/dossiers/${idDossier}`);
  };

  if (!patientData) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  const canEdit = user?.role === 'personnel_administratif';

  return (
    <div className="container mx-auto p-4">
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}

      <h1 className="text-2xl font-bold mb-4">Dossier Patient</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Fiche patient façon classeur */}
        <div
          className="bg-white border rounded-lg shadow-md p-6 w-full md:w-1/2 relative dossier-classeur"
          style={{
            borderLeft: '12px solid #2563eb',
            boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
            minHeight: '320px'
          }}
        >
          {/* Onglet classeur */}
          <div
            className="absolute -left-8 top-1 bg-blue-600 text-white px-4 py-2 rounded-r-lg font-semibold shadow"
            style={{ transform: 'rotate(-8deg)' }}
          >
            Patient
          </div>
          <div className="mt-6"></div>
          <h2 className="text-xl font-bold text-blue-700 mb-2">
            {patientData.personal_info.nom} {patientData.personal_info.prenom}
            <span className="ml-2 text-gray-500">#{patientData.personal_info.numero}</span>
          </h2>
          <div className="mb-4 text-gray-700">
            <span className="font-semibold">Date de naissance :</span> {patientData.personal_info.date_naissance} &nbsp;|&nbsp;
            <span className="font-semibold">Sexe :</span> {patientData.personal_info.sexe} &nbsp;|&nbsp;
            <span className="font-semibold">CIN :</span> {patientData.personal_info.cin}
          </div>
          <div className="mb-4 text-gray-700">
            <span className="font-semibold">Nationalité :</span> {patientData.personal_info.nationalite} &nbsp;|&nbsp;
            <span className="font-semibold">Téléphone :</span> {patientData.personal_info.numero_telephone}
          </div>
          <div className="mb-4 text-gray-700">
            <span className="font-semibold">Adresse :</span> {patientData.personal_info.adresse_postale}
          </div>
          <div className="mb-4 text-gray-700">
            <span className="font-semibold">Groupe sanguin :</span> {patientData.personal_info.groupe_sanguin}
          </div>
          <div className="mb-4 text-gray-700">
            <span className="font-semibold">Email :</span> {patientData.personal_info.email}
          </div>
          {isEditing && canEdit ? (
            <form onSubmit={handleSubmit} className="space-y-2 mt-4">
              <input name="nom" value={formData.nom || ''} onChange={handleChange} placeholder="Nom" className="border p-2 rounded w-full" />
              <input name="prenom" value={formData.prenom || ''} onChange={handleChange} placeholder="Prénom" className="border p-2 rounded w-full" />
              <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />
              <input name="sexe" value={formData.sexe || ''} onChange={handleChange} placeholder="Sexe" className="border p-2 rounded w-full" />
              <input name="date_naissance" type="date" value={formData.date_naissance || ''} onChange={handleChange} className="border p-2 rounded w-full" />
              <input name="cin" value={formData.cin || ''} onChange={handleChange} placeholder="CIN" className="border p-2 rounded w-full" />
              <input name="lieu_naissance" value={formData.lieu_naissance || ''} onChange={handleChange} placeholder="Lieu de naissance" className="border p-2 rounded w-full" />
              <input name="nationalite" value={formData.nationalite || ''} onChange={handleChange} placeholder="Nationalité" className="border p-2 rounded w-full" />
              <input name="adresse_postale" value={formData.adresse_postale || ''} onChange={handleChange} placeholder="Adresse" className="border p-2 rounded w-full" />
              <input name="numero_telephone" value={formData.numero_telephone || ''} onChange={handleChange} placeholder="Téléphone" className="border p-2 rounded w-full" />
              <input name="groupe_sanguin" value={formData.groupe_sanguin || ''} onChange={handleChange} placeholder="Groupe sanguin" className="border p-2 rounded w-full" />
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Enregistrer</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Annuler</button>
              </div>
            </form>
          ) : (
            canEdit && (
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2">Modifier</button>
            )
          )}
        </div>

        {/* Dossiers façon classeur */}
        <div
          className="bg-white border rounded-lg shadow-md p-6 w-full md:w-1/2 relative dossier-classeur"
          style={{
            borderLeft: '12px solid #059669',
            boxShadow: '0 4px 12px rgba(5,150,105,0.08)',
            minHeight: '320px'
          }}
        >
          <div
            className="absolute -left-8 top-1 bg-green-600 text-white px-4 py-2 rounded-r-lg font-semibold shadow"
            style={{ transform: 'rotate(-8deg)' }}
          >
            Dossiers
          </div>
          <div className="flex justify-between items-center mb-4 mt-8">
            <h2 className="text-xl font-semibold text-green-700">Dossier médical</h2>
            
          </div>
          {patientData.dossiers.length > 0 ? (
            <ul className="space-y-2">
              {patientData.dossiers.map((dossier) => (
                <li
                  key={dossier.id}
                  onClick={() => handleDossierClick(dossier.id)}
                  className="p-3 rounded-md cursor-pointer hover:bg-green-50 border border-green-100 flex items-center justify-between"
                >
                  <span>
                    <span className="font-semibold text-green-700">Dossier #{dossier.id.slice(0, 8)}</span>
                    <span className="ml-2 text-gray-500 text-sm">(Créé le {dossier.created_at?.slice(0, 10)})</span>
                  </span>
                  <span className="text-green-600 hover:underline">Voir</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Aucun dossier disponible</p>
          )}
        </div>
      </div>
      <style>{`
        .dossier-classeur {
          position: relative;
          transition: box-shadow 0.2s;
        }
        .dossier-classeur:hover {
          box-shadow: 0 8px 24px rgba(37,99,235,0.18);
        }
      `}</style>
    </div>
  );
};

export default PatientDetails;