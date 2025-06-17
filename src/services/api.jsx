const api = {
  baseURL: 'http://localhost:8000/api',
  
  async request(method, endpoint, data = null, options = {}) {
    const token = localStorage.getItem('auth_token');
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      console.log(`API ${method} request to ${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorMessage;
        } catch (e) {
          errorMessage = await response.text();
        }
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`API response from ${endpoint}:`, result);
      return result;
    } catch (error) {
      console.error(`API error for ${endpoint}:`, error.message);
      throw error;
    }
  },

  async login(email, mot_de_passe) {
    try {
      const response = await this.request('POST', '/connexion', { email, mot_de_passe });
      if (!response.token) {
        throw new Error('Réponse de connexion invalide : token manquant');
      }
      const user = response.utilisateur || response.user || {};
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(user));
      return { token: response.token, user };
    } catch (error) {
      throw new Error(error.message || 'Échec de la connexion au serveur');
    }
  },

  async register(userData) {
    try {
      return await this.request('POST', '/inscription', userData);
    } catch (error) {
      throw new Error(error.message || "Échec de l'inscription");
    }
  },

  async logout() {
    try {
      await this.request('POST', '/deconnexion');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  // Common user endpoints
  async getRendezVous() {
    return await this.request('GET', '/rendez-vous');
  },

  async getDonneesPersonnelles() {
    return await this.request('GET', '/donnees-personnelles');
  },

  async updateDonneesPersonnelles(data) {
    return await this.request('PUT', '/donnees-personnelles', data);
  },

  // Patient search and dossier
  async searchPatient(searchData) {
    return await this.request('GET', '/patients/search', null, { params: searchData });
  },

  async getPatientDetails(idPatient) {
    return await this.request('GET', `/patients/${idPatient}/details`);
  },

  async updatePersonalInfo(idPatient, data) {
    return await this.request('PUT', `/patients/${idPatient}/donnees-personnelles`, data);
  },

  async getDossierSubElements(idDossier) {
    return await this.request('GET', `/dossiers/${idDossier}/sub-elements`);
  },

  async getPatientDossier(idPatient) {
    return await this.request('GET', `/patients/${idPatient}/dossier`);
  },

  // Patient-specific endpoints
  async getPatientAntecedents(idPatient) {
    return await this.request('GET', `/patients/${idPatient}/antecedents`);
  },

  async addAntecedent(idPatient, data) {
    return await this.request('POST', '/antecedents-medicaux', data);
  },

  async getPatientExamensPreoperatoires(idPatient) {
    return await this.request('GET', `/patients/${idPatient}/examens-preoperatoires`);
  },

  async annulerRendezVous(idRendezVous) {
    return await this.request('PUT', `/rendez-vous/${idRendezVous}/annuler`);
  },

  async prendreRendezVous(data) {
    return await this.request('POST', '/rendez-vous', data);
  },

  async getOrdonnances() {
    return await this.request('GET', '/ordonnances');
  },

  async getInstructionsSortie() {
    return await this.request('GET', '/instructions-sortie');
  },

  async getResultatsExamens() {
    return await this.request('GET', '/resultats-examens');
  },

  async enregistrerConsentement(data) {
    return await this.request('POST', '/consentements', data);
  },

  // Personnel administratif endpoints
  async enregistrerDonneesPersonnelles(data) {
    return await this.request('POST', '/donnees-personnelles', data);
  },

  async enregistrerDonneesAssurance(data) {
    return await this.request('POST', '/donnees-assurance', data);
  },

  async getAdministrativeData(idPatient) {
    return await this.request('GET', `/patients/${idPatient}/donnees-administratives`);
  },

  async planifierAdmission(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/admission`, data);
  },

  async mettreAJourServiceDestination(idAdmission, id_service) {
    return await this.request('PUT', `/admissions/${idAdmission}/service-destination`, { id_service });
  },

  async mettreAJourDonneesFinancieres(idAssurance, prise_en_charge) {
    return await this.request('PUT', `/assurances/${idAssurance}/donnees-financieres`, { prise_en_charge });
  },

  async creerPatientComplet(data) {
    return await this.request('POST', '/dossier-patient', data);
  },

  async planifierSortie(idPatient, date) {
    return await this.request('POST', `/patients/${idPatient}/sortie`, { date });
  },

  // Médecin endpoints
  async redigerCompteRenduConsultation(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/compte-rendu-consultation`, data);
  },

  async enregistrerDiagnostic(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/diagnostic`, data);
  },

  async enregistrerPrescription(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/prescription`, data);
  },

  async demanderExamenComplementaire(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/examen-complementaire`, data);
  },

  // Infirmier endpoints
  async enregistrerSignesVitaux(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/signes-vitaux`, data);
  },

  async enregistrerAdministrationMedicament(idMedicament, data) {
    return await this.request('POST', `/medicaments/${idMedicament}/administration`, data);
  },

  // Psychologue endpoints
  async enregistrerDiagnosticPsychologique(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/diagnostic-psychologique`, data);
  },

  async ajouterNoteSociale(idPatient, data) {
    return await this.request('POST', `/patients/${idPatient}/note-sociale`, data);
  },

  async getEtablissements() {
    return await this.request('GET', `/etablissements`);
  },

  async getDossierActifPatient(iduser) {
    return await this.request('GET', `/dossier/${iduser}`);
  },

   async mettreAJourRendezVous(idrv, data) {
    return await this.request('PUT', `/rendez-vous/${idrv}`, data);
  },

   // API Methods (add this new method to your API class)
async creerExamenImagerie(data) {
  return await this.request('POST', `/orthanc/examens-imagerie`, data);
},

async uploadDicomFile(formData) {
  return await this.request('POST', `/orthanc/upload`, formData);
}
};

export default api;
