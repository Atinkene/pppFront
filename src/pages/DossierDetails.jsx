import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function DossierDetails() {
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const data = await api.getDossierSubElements(id);
        setDossier(data);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des données');
      }
    };
    fetchDossier();
  }, [id]);

  if (!dossier) return <div className="container mx-auto p-4">Chargement...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Détails du Dossier #{dossier.dossier_id}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Admissions</h2>
          {dossier.sub_elements.admissions.length > 0 ? (
            <ul className="space-y-2">
              {dossier.sub_elements.admissions.map((admission) => (
                <li key={admission.id} className="border-b py-2">
                  <p><strong>Motif:</strong> {admission.motif || 'Non spécifié'}</p>
                  <p><strong>Date:</strong> {admission.date}</p>
                  <p><strong>Service:</strong> {admission.service?.nom || 'Aucun'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune admission trouvée.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Consultations</h2>
          {dossier.sub_elements.consultations.length > 0 ? (
            <ul className="space-y-2">
              {dossier.sub_elements.consultations.map((consultation) => (
                <li key={consultation.id} className="border-b py-2">
                  <p><strong>Compte Rendu:</strong> {consultation.compte_rendu || 'Non spécifié'}</p>
                  <p><strong>Examen Clinique:</strong> {consultation.examen_clinique || 'Non spécifié'}</p>
                  <p><strong>Diagnostic:</strong> {consultation.diagnostic || 'Non spécifié'}</p>
                  <p><strong>Professionnel:</strong> {consultation.professionnel?.type || 'Aucun'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune consultation trouvée.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Données Administratives</h2>
          {dossier.sub_elements.administratif ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Contacts</h3>
                {dossier.sub_elements.administratif.contacts.length > 0 ? (
                  <ul className="space-y-2">
                    {dossier.sub_elements.administratif.contacts.map((contact) => (
                      <li key={contact.id} className="border-b py-2">
                        <p><strong>Adresse:</strong> {contact.adresse_postale || 'Non spécifié'}</p>
                        <p><strong>Téléphone:</strong> {contact.numero_telephone || 'Non spécifié'}</p>
                        <p><strong>Email:</strong> {contact.email || 'Non spécifié'}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun contact trouvé.</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">Assurances</h3>
                {dossier.sub_elements.administratif.assurances.length > 0 ? (
                  <ul className="space-y-2">
                    {dossier.sub_elements.administratif.assurances.map((assurance) => (
                      <li key={assurance.id} className="border-b py-2">
                        <p><strong>Numéro Sécurité Sociale:</strong> {assurance.numero_securite_social || 'Non spécifié'}</p>
                        <p><strong>Organisme:</strong> {assurance.organisme || 'Non spécifié'}</p>
                        <p><strong>Prise en Charge:</strong> {assurance.prise_en_charge || 'Non spécifié'}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune assurance trouvée.</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">Consentements</h3>
                {dossier.sub_elements.administratif.consentements.length > 0 ? (
                  <ul className="space-y-2">
                    {dossier.sub_elements.administratif.consentements.map((consentement) => (
                      <li key={consentement.id} className="border-b py-2">
                        <p><strong>Type:</strong> {consentement.type || 'Non spécifié'}</p>
                        <p><strong>Statut:</strong> {consentement.statut || 'Non spécifié'}</p>
                        <p><strong>Date Autorisation:</strong> {consentement.date_autorisation || 'Non spécifié'}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun consentement trouvé.</p>
                )}
              </div>
            </div>
          ) : (
            <p>Aucune donnée administrative trouvée.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Sorties</h2>
          {dossier.sub_elements.sorties.length > 0 ? (
            <ul className="space-y-2">
              {dossier.sub_elements.sorties.map((sortie) => (
                <li key={sortie.id} className="border-b py-2">
                  <p><strong>Date:</strong> {sortie.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune sortie trouvée.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DossierDetails;