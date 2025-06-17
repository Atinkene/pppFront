import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import api from '../services/api';
import { formatDate } from '../utils';

const RendezVous = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'patient';

  const [rendezVous, setRendezVous] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [idDossierPatient, setIdDossierPatient] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', motif: '', type: '', id_etablissement: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger les établissements au montage
  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const data = await api.getEtablissements();
        setEtablissements(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Erreur lors du chargement des établissements');
        setEtablissements([]);
      }
    };
    fetchEtablissements();
  }, []);

  // Charger l'id du dossier patient automatiquement
  useEffect(() => {
    const fetchDossier = async () => {
      try {
        // Remplace par la bonne méthode pour récupérer le dossier actif du patient connecté
        // Exemple : api.getDossierActifPatient(user.id)
        console.log('Fetching dossier for user:', user.id); // Debug
        if (user && user.id) {
          const dossier = await api.getDossierActifPatient(user.id);
          console.log(dossier); // Debug
          setIdDossierPatient(dossier?.id || '');
        }
      } catch (e) {
        setError("Impossible de récupérer le dossier patient.");
        setIdDossierPatient('');
      }
    };
    if (userRole === 'patient') {
      fetchDossier();
    }
  }, [user, userRole]);

  // Charger les rendez-vous
  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        let data = [];
        if (userRole === 'patient' || userRole === 'infirmier') {
          data = await api.getRendezVous();
        } else if (userRole === 'assistant_medical') {
          data = await api.getRendezVousPlanifies();
        } else {
          data = [];
        }
        setRendezVous(Array.isArray(data) ? data : []);
      } catch (error) {
        setError('Erreur lors du chargement des rendez-vous');
        setRendezVous([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRendezVous();
  }, [userRole]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.id_etablissement || !idDossierPatient) {
      setError("Établissement ou dossier patient manquant.");
      return;
    }
    try {
      let nouveau;
      const data = { ...form, id_dossier_patient: idDossierPatient };
      if (userRole === 'patient') {
        nouveau = await api.prendreRendezVous(data);
      } else if (userRole === 'assistant_medical') {
        nouveau = await api.planifierRendezVous(data);
      } else {
        setError("Action non autorisée");
        return;
      }
      setRendezVous(prev => [...prev, nouveau]);
      setForm({ date: '', motif: '', type: '', id_etablissement: '' });
      setSuccess('Rendez-vous créé avec succès');
    } catch (err) {
      setError("Erreur lors de la création du rendez-vous");
    }
  };

  const handleAnnuler = async (idRendezVous) => {
    setError('');
    setSuccess('');
    try {
      await api.annulerRendezVous(idRendezVous);
      setRendezVous(prev => prev.filter(rdv => rdv.id !== idRendezVous));
      setSuccess('Rendez-vous annulé avec succès');
    } catch (error) {
      setError('Erreur lors de l\'annulation');
    }
  };

  const handleUpdate = async (idRendezVous, currentDate) => {
    const newDate = prompt("Nouvelle date (YYYY-MM-DDTHH:mm:ss) :", currentDate);
    if (!newDate) return;
    try {
      await api.mettreAJourRendezVous(idRendezVous, { date: newDate });
      setRendezVous(prev =>
        prev.map(rdv =>
          rdv.id === idRendezVous ? { ...rdv, date: newDate } : rdv
        )
      );
    } catch (error) {
      setError("Erreur lors de la mise à jour");
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'confirmé': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'programmé': return 'bg-blue-100 text-blue-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rendez-vous</h2>
          <p className="text-gray-600">Gérez vos rendez-vous à venir</p>
        </div>
      </div>

      {(userRole === 'patient' || userRole === 'assistant_medical') && (
        <form onSubmit={handleCreate} className="mb-4 flex flex-col md:flex-row gap-2 items-end">
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="border p-2 rounded"
            min={new Date().toISOString().slice(0,16)}
          />
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Type (Consultation, Examen...)"
            required
            className="border p-2 rounded"
          />
          <select
            name="id_etablissement"
            value={form.id_etablissement}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          >
            <option value="">Sélectionner un établissement</option>
            {etablissements.map(etab => (
              <option key={etab.id} value={etab.id}>{etab.nom}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Prendre rendez-vous
          </button>
          {error && <span className="text-red-500 ml-4">{error}</span>}
          {success && <span className="text-green-500 ml-4">{success}</span>}
        </form>
      )}

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {userRole === 'patient' ? 'Praticien' : 'Patient'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date et heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rendezVous.map((rdv) => (
                <tr key={rdv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rdv.patient || rdv.praticien || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(rdv.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rdv.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(rdv.statut)}`}>
                      {rdv.statut}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-4">
                    {rdv.statut !== 'annulé' && (
                      <>
                        <button
                          onClick={() => handleAnnuler(rdv.id)}
                          className="text-red-600 hover:text-red-900 mr-2"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleUpdate(rdv.id, rdv.date)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Mettre à jour
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;