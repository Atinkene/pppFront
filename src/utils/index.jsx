import { 
  User, 
  Calendar, 
  UserCheck, 
  Stethoscope, 
  Syringe, 
  Heart, 
  TestTube, 
  Zap, 
  Brain, 
  FileText, 
  Activity 
} from 'lucide-react';

// Ajout d'un mapping pour les routes principales de chaque menu (pour une navigation basée sur l'URL)
const menuRoutes = {
  dashboard: '/dashboard',
  'rendez-vous': '/rendez-vous',
  patients: '/patients/search',
  'donnees-personnelles': '/donnees-personnelles',
  antecedents: '/antecedents',
  ordonnances: '/ordonnances',
  examens: '/examens',
  prescriptions: '/prescriptions',
  evaluations: '/evaluations',
  'parametres-intervention': '/parametres-intervention',
  operations: '/operations',
  'post-operatoire': '/post-operatoire',
  soins: '/soins',
  medicaments: '/medicaments',
  resultats: '/resultats',
  anomalies: '/anomalies',
  imagerie: '/imagerie',
  diagnostics: '/diagnostics',
  seances: '/seances',
  admissions: '/admissions',
  assurances: '/assurances',
  sorties: '/sorties',
  planification: '/planification',
  demandes: '/demandes',
  reeducation: '/reeducation',
  progres: '/progres'
};

const roleConfigs = {
  patient: {
    name: 'Patient',
    icon: User,
    color: 'bg-blue-500',
    menus: ['dashboard', 'rendez-vous', 'Mon dossier'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: true },
      'antecedents': { view: true, edit: false },
      'ordonnances': { view: true, edit: false }
    }
  },
  medecin: {
    name: 'Médecin',
    icon: Stethoscope,
    color: 'bg-green-500',
    menus: ['dashboard', 'rendez-vous', 'patients'],
    subDossiers: {
       administratif: { view: true, edit: false, add: false },
      admissions: { view: true, edit: false, add: false },
      consultations: { view: true, edit: true, add: true },
      soins: { view: true, edit: true, add: true },
      medicaments: { view: true, edit: true, add: true },
      examens: { view: true, edit: true, add: true },
      imagerie: { view: true, edit: true, add: true },
      diagnostics: { view: true, edit: true, add: true },
      antecedents: { view: true, edit: true, add: true },
      allergies: { view: true, edit: true, add: true },
      vaccinations: { view: true, edit: true, add: true },
      traitementsLongueDuree: { view: true, edit: true, add: true },
      maladiesChroniques: { view: true, edit: true, add: true },
      urgences: { view: true, edit: false, add: false },
      consentements: { view: true, edit: false, add: false },
      sorties: { view: true, edit: false, add: false },
      assurances: { view: false },
      seances: { view: false },
      operations: { view: false },
      'post-operatoire': { view: false },
      reeducation: { view: false },
      progres: { view: false },
      psycho: { view: false },
      fichesPreoperatoires: { view: false },
      comptesRendusHospitalisation: { view: false },
      suivisHospitaliers: { view: false },
      comptesRendusSortie: { view: false },
      imagesDicom: { view: false },
      evaluationsPsychologiques: { view: false },
      observationsInfirmieres: { view: false },
      administrationsMedicaments: { view: false },
      effetsSecondaires: { view: false },
    }
  },
  anesthesiste: {
    name: 'Anesthésiste',
    icon: Syringe,
    color: 'bg-purple-500',
    menus: ['dashboard', 'rendez-vous', 'patients', 'evaluations', 'parametres-intervention'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: false },
      'antecedents': { view: true, edit: true },
      'examens-preoperatoires': { view: true, edit: true, add: true },
      'evaluations': { view: true, edit: true, add: true }
    }
  },
  chirurgien: {
    name: 'Chirurgien',
    icon: Heart,
    color: 'bg-red-500',
    menus: ['dashboard', 'rendez-vous', 'patients', 'operations', 'post-operatoire'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: false },
      'antecedents': { view: true, edit: false },
      'examens-preoperatoires': { view: true, edit: false },
      'operations': { view: true, edit: true, add: true },
      'comptes-rendus': { view: true, edit: true, add: true }
    }
  },
  infirmier: {
    name: 'Infirmier',
    icon: UserCheck,
    color: 'bg-teal-500',
    menus: ['dashboard', 'rendez-vous', 'patients', 'soins', 'medicaments'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: false },
      'soins': { view: true, edit: true, add: true },
      'medicaments': { view: true, edit: true, add: true }
    }
  },
  biologiste: {
    name: 'Biologiste',
    icon: TestTube,
    color: 'bg-orange-500',
    menus: ['dashboard', 'examens', 'resultats', 'anomalies'],
    subDossiers: {
      'examens': { view: true, edit: true, add: true },
      'resultats': { view: true, edit: true, add: true }
    }
  },
  radiologue: {
    name: 'Radiologue',
    icon: Zap,
    color: 'bg-yellow-500',
    menus: ['dashboard', 'patients', 'rendez-vous', 'anomalies'],
    subDossiers: {
      'examens': { view: true, edit: true, add: true },
      'imagerie': { view: true, edit: true, add: true }
    }
  },
  psychologue: {
    name: 'Psychologue',
    icon: Brain,
    color: 'bg-indigo-500',
    menus: ['dashboard', 'rendez-vous', 'patients', 'diagnostics', 'seances'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: false },
      'diagnostics': { view: true, edit: true, add: true },
      'seances': { view: true, edit: true, add: true }
    }
  },
  personnel_administratif: {
    name: 'Personnel Administratif',
    icon: FileText,
    color: 'bg-gray-500',
    menus: ['dashboard', 'admissions', 'patients', 'assurances', 'sorties'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: true, add: true },
      'donnees-administratives': { view: true, edit: true, add: true },
      'admissions': { view: true, edit: true, add: true },
      'assurances': { view: true, edit: true, add: true },
      'sorties': { view: true, edit: true, add: true }
    }
  },
  assistant_medical: {
    name: 'Assistant Médical',
    icon: Calendar,
    color: 'bg-pink-500',
    menus: ['dashboard', 'rendez-vous', 'planification', 'demandes'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: false },
      'rendez-vous': { view: true, edit: true, add: true }
    }
  },
  kinesitherapeute: {
    name: 'Kinésithérapeute',
    icon: Activity,
    color: 'bg-cyan-500',
    menus: ['dashboard', 'rendez-vous', 'patients', 'reeducation', 'progres'],
    subDossiers: {
      'donnees-personnelles': { view: true, edit: false },
      'reeducation': { view: true, edit: true, add: true },
      'progres': { view: true, edit: true, add: true }
    }
  }
};

const getMenuLabel = (menuKey) => {
  const labels = {
    dashboard: 'Tableau de bord',
    'rendez-vous': 'Rendez-vous',
    patients: 'Patients',
    'donnees-personnelles': 'Mes données',
    antecedents: 'Antécédents',
    ordonnances: 'Ordonnances',
    examens: 'Examens',
    prescriptions: 'Prescriptions',
    evaluations: 'Évaluations',
    'parametres-intervention': 'Paramètres',
    operations: 'Opérations',
    'post-operatoire': 'Post-opératoire',
    soins: 'Soins',
    medicaments: 'Médicaments',
    resultats: 'Résultats',
    anomalies: 'Anomalies',
    imagerie: 'Imagerie',
    diagnostics: 'Diagnostics',
    seances: 'Séances',
    admissions: 'Admissions',
    assurances: 'Assurances',
    sorties: 'Sorties',
    planification: 'Planification',
    demandes: 'Demandes',
    reeducation: 'Rééducation',
    progres: 'Progrès',
    patients: 'Patients'
  };
  return labels[menuKey] || menuKey;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export { roleConfigs, getMenuLabel, formatDate, menuRoutes };