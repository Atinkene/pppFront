import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import PatientLayout from '../layouts/PatientLayout';
import MedecinLayout from '../layouts/MedecinLayout';
import AnesthesisteLayout from '../layouts/AnesthesisteLayout';
import PersonnelAdministratifLayout from '../layouts/PersonnelAdministratifLayout';
import ChirurgienLayout from '../layouts/ChirurgienLayout';
import InfirmierLayout from '../layouts/InfirmierLayout';
import BiologisteLayout from '../layouts/BiologisteLayout';
import RadiologueLayout from '../layouts/RadiologueLayout';
import PsychologueLayout from '../layouts/PsychologueLayout';
import AssistantMedicalLayout from '../layouts/AssistantMedicalLayout';
import KinesitherapeuteLayout from '../layouts/KinesitherapeuteLayout';
import PatientSearch from '../pages/PatientSearch';
import PatientDetails from '../pages/PatientDetails';
import DossierViewer from '../components/DossierViewer';
import Dashboard from '../pages/Dashboard';
import RendezVous from '../pages/RendezVous';
import MesDonneesPersonnelles from '../pages/MesDonneesPersonnelles';
import AccountPage from '../pages/AccountPage';

const roleToLayout = {
  patient: PatientLayout,
  medecin: MedecinLayout,
  anesthesiste: AnesthesisteLayout,
  personnel_administratif: PersonnelAdministratifLayout,
  chirurgien: ChirurgienLayout,
  infirmier: InfirmierLayout,
  biologiste: BiologisteLayout,
  radiologue: RadiologueLayout,
  psychologue: PsychologueLayout,
  assistant_medical: AssistantMedicalLayout,
  kinesitherapeute: KinesitherapeuteLayout,
};

const AppRoutes = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'patient';
  const Layout = roleToLayout[userRole] || PatientLayout;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="patients/search" element={<PatientSearch />} />
        <Route path="patients/:idPatient" element={<PatientDetails />} />
        <Route path="dossiers/:idDossier" element={<DossierViewer />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="rendez-vous" element={<RendezVous />} />
        <Route path="compte" element={<MesDonneesPersonnelles />} />
        <Route path="donnees-personnelles" element={<MesDonneesPersonnelles />} />

        {/* <Route index element={<Navigate to="patients/search" replace />} /> */}
      </Route>
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes;
// ...existing code...