import React, { useState } from 'react';
import api from '../services/api';
import { formatDate } from '../utils';

const AdminTasks = ({ activeMenu }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminData, setAdminData] = useState(null);

  // State for forms
  const [serviceForm, setServiceForm] = useState({ idAdmission: '', idService: '' });
  const [personalDataForm, setPersonalDataForm] = useState({
    email: '', nom: '', prenom: '', sexe: '', date_naissance: '', cin: '', lieu_naissance: '', nationalite: ''
  });
  const [insuranceForm, setInsuranceForm] = useState({
    numero_securite_social: '', organisme_assurance_sante: '', prise_en_charge: ''
  });
  const [admissionForm, setAdmissionForm] = useState({ idPatient: '', motif: '', date: '' });
  const [financialForm, setFinancialForm] = useState({ idAssurance: '', prise_en_charge: '' });
  const [dossierForm, setDossierForm] = useState({ idUser: '' });
  const [dischargeForm, setDischargeForm] = useState({ idPatient: '', date: '' });
  const [consultPatientId, setConsultPatientId] = useState('');

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      switch (action) {
        case 'updateService':
          response = await api.updateServiceDestination(serviceForm.idAdmission, serviceForm.idService);
          setSuccess('Service destination mis à jour');
          break;
        case 'registerPersonalData':
          response = await api.registerPersonalData(personalDataForm);
          setSuccess('Données personnelles enregistrées');
          break;
        case 'registerInsurance':
          response = await api.registerInsuranceData(insuranceForm);
          setSuccess('Données d\'assurance enregistrées');
          break;
        case 'consultAdminData':
          response = await api.getAdministrativeData(consultPatientId);
          setAdminData(response);
          setSuccess('Données administratives chargées');
          break;
        case 'planAdmission':
          response = await api.planAdmission(admissionForm.idPatient, {
            motif: admissionForm.motif,
            date: admissionForm.date
          });
          setSuccess('Admission planifiée');
          break;
        case 'updateFinancial':
          response = await api.updateFinancialData(financialForm.idAssurance, financialForm.prise_en_charge);
          setSuccess('Données financières mises à jour');
          break;
        case 'createDossier':
          response = await api.createPatientDossier(dossierForm.idUser);
          setSuccess('Dossier patient créé');
          break;
        case 'planDischarge':
          response = await api.planDischarge(dischargeForm.idPatient, dischargeForm.date);
          setSuccess('Sortie planifiée');
          break;
      }
    } catch (err) {
      setError('Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'admissions':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Planifier une admission</h3>
            <form onSubmit={(e) => handleSubmit(e, 'planAdmission')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Patient</label>
                <input
                  type="text"
                  value={admissionForm.idPatient}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, idPatient: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="UUID du patient"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Motif</label>
                <input
                  type="text"
                  value={admissionForm.motif}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, motif: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Motif de l'admission"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="datetime-local"
                  value={admissionForm.date}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Planifier'}
              </button>
            </form>

            <h3 className="text-lg font-semibold mt-8">Mettre à jour le service de destination</h3>
            <form onSubmit={(e) => handleSubmit(e, 'updateService')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Admission</label>
                <input
                  type="text"
                  value={serviceForm.idAdmission}
                  onChange={(e) => setServiceForm({ ...serviceForm, idAdmission: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="UUID de l'admission"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Service</label>
                <input
                  type="text"
                  value={serviceForm.idService}
                  onChange={(e) => setServiceForm({ ...serviceForm, idService: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="UUID du service"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Mettre à jour'}
              </button>
            </form>
          </div>
        );

      case 'assurances':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Enregistrer les données d'assurance</h3>
            <form onSubmit={(e) => handleSubmit(e, 'registerInsurance')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Numéro Sécurité Sociale</label>
                <input
                  type="text"
                  value={insuranceForm.numero_securite_social}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, numero_securite_social: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Numéro de sécurité sociale"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Organisme d'assurance</label>
                <input
                  type="text"
                  value={insuranceForm.organisme_assurance_sante}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, organisme_assurance_sante: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Nom de l'organisme"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prise en charge (%)</label>
                <input
                  type="number"
                  value={insuranceForm.prise_en_charge}
                  onChange={(e) => setInsuranceForm({ ...insuranceForm, prise_en_charge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Pourcentage de prise en charge"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Enregistrer'}
              </button>
            </form>

            <h3 className="text-lg font-semibold mt-8">Mettre à jour les données financières</h3>
            <form onSubmit={(e) => handleSubmit(e, 'updateFinancial')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Assurance</label>
                <input
                  type="text"
                  value={financialForm.idAssurance}
                  onChange={(e) => setFinancialForm({ ...financialForm, idAssurance: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="UUID de l'assurance"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prise en charge (%)</label>
                <input
                  type="number"
                  value={financialForm.prise_en_charge}
                  onChange={(e) => setFinancialForm({ ...financialForm, prise_en_charge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Nouveau pourcentage"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Mettre à jour'}
              </button>
            </form>
          </div>
        );

      case 'sorties':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Planifier une sortie</h3>
            <form onSubmit={(e) => handleSubmit(e, 'planDischarge')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Patient</label>
                <input
                  type="text"
                  value={dischargeForm.idPatient}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, idPatient: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="UUID du patient"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de sortie</label>
                <input
                  type="datetime-local"
                  value={dischargeForm.date}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Planifier'}
              </button>
            </form>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Enregistrer les données personnelles</h3>
            <form onSubmit={(e) => handleSubmit(e, 'registerPersonalData')} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={personalDataForm.email}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={personalDataForm.nom}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, nom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Nom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    value={personalDataForm.prenom}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, prenom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexe</label>
                  <select
                    value={personalDataForm.sexe}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, sexe: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                  <input
                    type="date"
                    value={personalDataForm.date_naissance}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, date_naissance: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CIN</label>
                  <input
                    type="text"
                    value={personalDataForm.cin}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, cin: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Numéro CIN"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                  <input
                    type="text"
                    value={personalDataForm.lieu_naissance}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, lieu_naissance: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Lieu de naissance"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationalité</label>
                  <input
                    type="text"
                    value={personalDataForm.nationalite}
                    onChange={(e) => setPersonalDataForm({ ...personalDataForm, nationalite: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Nationalité"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Enregistrer'}
              </button>
            </form>

            <h3 className="text-lg font-semibold mt-8">Créer un dossier patient</h3>
            <form onSubmit={(e) => handleSubmit(e, 'createDossier')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Utilisateur</label>
                <input
                  type="text"
                  value={dossierForm.idUser}
                  onChange={(e) => setDossierForm({ ...dossierForm, idUser: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="UUID de l'utilisateur"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Créer'}
              </button>
            </form>

            <h3 className="text-lg font-semibold mt-8">Consulter les données administratives</h3>
            <form onSubmit={(e) => handleSubmit(e, 'consultAdminData')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Patient</label>
                <input
                  type="text"
                  value={consultPatientId}
                  onChange={(e) => setConsultPatientId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="UUID du patient"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {loading ? 'Chargement...' : 'Consulter'}
              </button>
            </form>

            {adminData && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold">Données administratives</h4>
                <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(adminData, null, 2)}</pre>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tâches administratives</h2>
        <p className="text-gray-600">Gérez les admissions, assurances et sorties</p>
      </div>
      {error && <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>}
      {success && <div className="bg-green-100 p-4 rounded-md text-green-700">{success}</div>}
      <div className="bg-white p-6 rounded-lg shadow-sm border">{renderContent()}</div>
    </div>
  );
};

export default AdminTasks;