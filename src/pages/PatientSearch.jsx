import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import api from '../services/api';

function PatientSearch() {
  const [formData, setFormData] = useState({
    numero: '',
    nom: '',
    prenom: '',
    date_naissance: '',
  });
  const [patients, setPatients] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    nom: '', prenom: '', email: '', sexe: '', date_naissance: '',
    cin: '', lieu_naissance: '', nationalite: '', adresse_postale: '',
    numero_telephone: '', login: '', password: '', groupe_sanguin: '', id_etablissement: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'personnel_administratif') {
      api.getEtablissements().then(data => setEtablissements(Array.isArray(data) ? data : []));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.searchPatient(formData);
      setPatients(data);
      setError('');
    } catch (err) {
      setError('Erreur lors de la recherche');
      setPatients([]);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/patients/${id}`);
  };

  // Création patient complet
  const handleCreateChange = e => setCreateForm({ ...createForm, [e.target.name]: e.target.value });

  const handleCreatePatient = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.creerPatientComplet(createForm);
      setSuccess("Patient et dossier créés avec succès !");
      setCreateForm({
        nom: '', prenom: '', email: '', sexe: '', date_naissance: '',
        cin: '', lieu_naissance: '', nationalite: '', adresse_postale: '',
        numero_telephone: '', login: '', password: '', groupe_sanguin: '', id_etablissement: ''
      });
      setShowCreateForm(false);
    } catch (err) {
      setError("Erreur lors de la création du patient et du dossier");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
      {user?.role === 'personnel_administratif' && (
        <div className="mb-6 flex justify-end flex space-x-4 justify-between items-center">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showCreateForm ? "Annuler" : "Créer un nouveau patient"}
          </button>
        </div>
      )}
      {showCreateForm && (
        <form onSubmit={handleCreatePatient} className="bg-white p-4 rounded shadow border space-y-3 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg">
            <input name="nom" value={createForm.nom} onChange={handleCreateChange} placeholder="Nom" className="border border p-2 rounded-lg" required />
            <input name="prenom" value={createForm.prenom} onChange={handleCreateChange} placeholder="Prénom" className="border border p-2 rounded-lg" required />
            <input name="email" value={createForm.email} onChange={handleCreateChange} placeholder="Email" className="border border p-2 rounded-lg" required />
            <input name="login" value={createForm.login} onChange={handleCreateChange} placeholder="Login" className="border border p-2 rounded-lg" required />
            <input name="password" type="password" value={createForm.password} onChange={handleCreateChange} placeholder="Mot de passe" className="border border p-2 rounded-lg" required />
            <input name="sexe" value={createForm.sexe} onChange={handleCreateChange} placeholder="Sexe" className="border border p-2 rounded-lg" />
            <input name="date_naissance" type="date" value={createForm.date_naissance} onChange={handleCreateChange} className="border border p-2 rounded-lg" />
            <input name="cin" value={createForm.cin} onChange={handleCreateChange} placeholder="CIN" className="border border p-2 rounded-lg" />
            <input name="lieu_naissance" value={createForm.lieu_naissance} onChange={handleCreateChange} placeholder="Lieu de naissance" className="border border p-2 rounded-lg" />
            <input name="nationalite" value={createForm.nationalite} onChange={handleCreateChange} placeholder="Nationalité" className="border border p-2 rounded-lg" />
            <input name="adresse_postale" value={createForm.adresse_postale} onChange={handleCreateChange} placeholder="Adresse" className="border border p-2 rounded-lg" />
            <input name="numero_telephone" value={createForm.numero_telephone} onChange={handleCreateChange} placeholder="Téléphone" className="border border p-2 rounded-lg" />
            <input name="groupe_sanguin" value={createForm.groupe_sanguin} onChange={handleCreateChange} placeholder="Groupe sanguin" className="border border p-2 rounded-lg" />
            <select
              name="id_etablissement"
              value={createForm.id_etablissement}
              onChange={handleCreateChange}
              className="border border p-2 rounded-lg"
            >
              <option value="">Sélectionner un établissement</option>
              {etablissements.map(etab => (
                <option key={etab.id} value={etab.id}>{etab.nom}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Créer le patient
            </button>
          </div>
        </form>
      )}
      <h1 className="text-2xl font-bold mb-4">Recherche de Patients</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white border p-4 rounded shadow rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            placeholder="Numéro du patient"
            className="border border p-2 rounded-lg w-full"
          />
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom"
            className="border border p-2 rounded-lg w-full"
          />
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            className="border border p-2 rounded-lg w-full"
          />
          <input
            type="date"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
            className="border border p-2 rounded-lg w-full"
          />
        </div>
        <div className="flex justify-center mt-4">
            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-600">
              Rechercher
            </button>
        </div>
        


        {patients.length > 0 && (
          <div className="overflow-x-auto mb-8 rounded-lg shadow-sm mt-8">
            <table className="min-w-full bg-white rounded-lg border">
              <thead className='bg-blue-100 text-blue-600'>
                <tr>
                  <th className="border border-blue-100 p-2">Numéro</th>
                  <th className="border border-blue-100 p-2">Nom</th>
                  <th className="border border-blue-100 p-2">Prénom</th>
                  <th className="border border-blue-100 p-2">Email</th>
                  <th className="border border-blue-100 p-2">Date de Naissance</th>
                  <th className="border border-blue-100 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="border border-blue-100 p-2">{patient.numero}</td>
                    <td className="border border-blue-100 p-2">{patient.nom}</td>
                    <td className="border border-blue-100 p-2">{patient.prenom}</td>
                    <td className="border border-blue-100 p-2">{patient.email}</td>
                    <td className="border border-blue-100 p-2">{patient.date_naissance}</td>
                    <td className="border border-blue-100 p-2">
                      <button
                        onClick={() => handleViewDetails(patient.id)}
                        className="bg-blue-500 text-white p-1 rounded hover:bg-white  hover:text-blue-600 m-auto "
                      >
                        Voir Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </form>

      
    </div>
  );
}

export default PatientSearch;