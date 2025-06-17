import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { roleConfigs, formatDate } from '../utils';
import api from '../services/api';
import { Folder } from 'lucide-react';

const SUB_DOSSIERS_LIST = [
  { name: 'administratif', label: 'Données Administratives' },
  { name: 'admissions', label: 'Admissions' },
  { name: 'consultations', label: 'Consultations' },
  { name: 'sorties', label: 'Sorties' },
  { name: 'assurances', label: 'Assurances' },
  { name: 'soins', label: 'Soins' },
  { name: 'medicaments', label: 'Médicaments' },
  { name: 'examens', label: 'Examens' },
  { name: 'imagerie', label: 'Imagerie' },
  { name: 'diagnostics', label: 'Diagnostics' },
  { name: 'seances', label: 'Séances' },
  { name: 'operations', label: 'Opérations' },
  { name: 'post-operatoire', label: 'Post-opératoire' },
  { name: 'reeducation', label: 'Rééducation' },
  { name: 'progres', label: 'Progrès' },
  { name: 'antecedents', label: 'Antécédents' },
  { name: 'allergies', label: 'Allergies' },
  { name: 'vaccinations', label: 'Vaccinations' },
  { name: 'traitementsLongueDuree', label: 'Traitements Longue Durée' },
  { name: 'maladiesChroniques', label: 'Maladies Chroniques' },
  { name: 'psycho', label: 'Psycho-sociaux' },
  { name: 'urgences', label: 'Contacts d\'Urgence' },
  { name: 'consentements', label: 'Consentements' },
  { name: 'fichesPreoperatoires', label: 'Fiches Préopératoires' },
  { name: 'comptesRendusHospitalisation', label: 'Comptes Rendus Hospitalisation' },
  { name: 'suivisHospitaliers', label: 'Suivis Hospitaliers' },
  { name: 'comptesRendusSortie', label: 'Comptes Rendus de Sortie' },
  { name: 'imagesDicom', label: 'Images DICOM' },
  { name: 'evaluationsPsychologiques', label: 'Évaluations Psychologiques' },
  { name: 'observationsInfirmieres', label: 'Observations Infirmières' },
  { name: 'administrationsMedicaments', label: 'Administrations de Médicaments' },
  { name: 'effetsSecondaires', label: 'Effets Secondaires' },
];

const DossierViewer = () => {
  const { idDossier } = useParams();
  const { user } = useAuth();
  const roleConfig = roleConfigs[user?.role] || {};
  const [dossierData, setDossierData] = useState(null);
  const [selectedSubDossier, setSelectedSubDossier] = useState(null);
  const [newData, setNewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Génère la liste des sous-dossiers autorisés
  const buildSubDossiers = (sub_elements) =>
    SUB_DOSSIERS_LIST
      .map(sd => ({
        ...sd,
        items: sub_elements[sd.name] || (sd.name === 'administratif' ? {} : []),
      }))
      .filter(sd => roleConfig.subDossiers?.[sd.name]?.view);

  // Chargement initial
  const fetchDossier = async () => {
    try {
      const response = await api.getDossierSubElements(idDossier);
      setDossierData({
        id: response.dossier_id,
        patient_id: response.patient_id, // Assurez-vous que cette donnée est renvoyée par l'API
        subDossiers: buildSubDossiers(response.sub_elements),
      });
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement du dossier');
    }
  };

  useEffect(() => {
    fetchDossier();
    // eslint-disable-next-line
  }, [idDossier, user?.role]);

  const handleSelectSubDossier = (subDossier) => {
    setSelectedSubDossier(subDossier);
    setNewData({});
    setError('');
    setSuccess('');
  };

  // Cas spécifique radiologue sur examens
  const renderExamensRadiologue = () => {
  const items = selectedSubDossier.items || [];
  // Récupère l'id du patient depuis le dossier courant (supposé dans dossierData.patient_id)
  const patientId = dossierData?.patient_id;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{selectedSubDossier.label}</h3>
      {error && <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>}
      {success && <div className="bg-green-100 p-4 rounded-md text-green-700">{success}</div>}

      {/* Liste des examens d'imagerie */}
      {items.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <ul className="space-y-4">
            {items.map((examen) => (
              <li key={examen.id} className="border-b pb-2">
                <div>
                  <p className="font-medium">
                    Examen : {examen.type} | Résultat : {examen.resultat}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date : {formatDate(examen.created_at)}<br />
                    <span className="font-semibold">Images DICOM :</span>
                    {examen.images && examen.images.length > 0 ? (
                      <ul className="ml-4">
                        {examen.images.map((img) => (
                          <li key={img.id}>
                            <a
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Voir l'image DICOM
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="ml-2 text-gray-400">Aucune image</span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">Aucun examen d'imagerie</p>
      )}

      {/* Formulaire d'ajout d'un nouvel examen d'imagerie */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h4 className="text-md font-semibold mb-4">Ajouter un nouvel examen d'imagerie</h4>
        <form
  onSubmit={async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // 1. Création de l'examen d'imagerie (en base)
      console.log(user.id, dossierData.id, dossierData, patientId, newData.type, newData.resultat);
      const examenRes = await api.creerExamenImagerie({
        id_professionnel: user.id,
        id_dossier_examen: dossierData.id,
        patient_id: patientId,
        type: newData.type,
        resultat: newData.resultat,
      });
      
      // 2. Upload de l'image DICOM à Orthanc et sauvegarde en base
      if (newData.file) {
        const formData = new FormData();
        formData.append('file', newData.file);
        formData.append('id_examen_imagerie', examenRes.id);
        formData.append('patient_id', patientId);
        
        // Use a different method for DICOM upload
        await api.uploadDicomFile(formData);
      }

      setSuccess('Examen et image DICOM ajoutés avec succès');
      setNewData({});
      await fetchDossier();
    } catch (err) {
      console.error('Error:', err);
      setError('Erreur lors de l\'ajout de l\'examen ou de l\'image DICOM');
    } finally {
      setLoading(false);
    }
  }}
  className="space-y-4"
>
  <input
    type="text"
    name="type"
    value={newData.type || ''}
    onChange={e => setNewData({ ...newData, type: e.target.value })}
    className="w-full px-3 py-2 border rounded-md"
    placeholder="Type d'examen (ex: IRM, Scanner...)"
    required
  />
  <input
    type="text"
    name="resultat"
    value={newData.resultat || ''}
    onChange={e => setNewData({ ...newData, resultat: e.target.value })}
    className="w-full px-3 py-2 border rounded-md"
    placeholder="Résultat (optionnel)"
  />
  <input
    type="file"
    name="file"
    accept=".dcm,application/dicom"
    onChange={e => setNewData({ ...newData, file: e.target.files[0] })}
    className="w-full"
    required
  />
  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
  >
    {loading ? 'Chargement...' : 'Ajouter l\'examen et l\'image DICOM'}
  </button>
</form>
      </div>
    </div>
  );
};

  const renderSubDossierContent = () => {
    if (!selectedSubDossier) return <p className="text-gray-600">Sélectionnez un sous-dossier</p>;
    const items = selectedSubDossier.items || [];
    // Cas spécifique radiologue sur examens
    if (user?.role === 'radiologue' && selectedSubDossier.name === 'examens') {
      return renderExamensRadiologue();
    }
    // Cas par défaut
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">{selectedSubDossier.label}</h3>
        {error && <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>}
        {success && <div className="bg-green-100 p-4 rounded-md text-green-700">{success}</div>}
        {Array.isArray(items) && items.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="border-b pb-2">
                  <div>
                    <p className="font-medium">{JSON.stringify(item)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">Aucun élément dans ce sous-dossier</p>
        )}
      </div>
    );
  };

  if (!dossierData) return <div className="container mx-auto p-4">Chargement...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dossier #{dossierData.id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Sous-Dossiers</h3>
          <ul className="space-y-2">
            {dossierData.subDossiers.map((subDossier) => (
              <li
                key={subDossier.name}
                onClick={() => handleSelectSubDossier(subDossier)}
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                  selectedSubDossier?.name === subDossier.name ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
              >
                <Folder size={20} className="text-blue-600" />
                <span>{subDossier.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">{renderSubDossierContent()}</div>
      </div>
    </div>
  );
};

export default DossierViewer;