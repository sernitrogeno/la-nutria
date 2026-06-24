import { useState } from 'react';
import { Layout } from './components/Layout.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Patients } from './pages/Patients.jsx';
import { PatientDetail } from './pages/PatientDetail.jsx';
import { Agenda } from './pages/Agenda.jsx';
import { Content } from './pages/Content.jsx';
import { Services } from './pages/Services.jsx';
import { Solicitudes } from './pages/Solicitudes.jsx';
import { Finanzas } from './pages/Finanzas.jsx';

function App() {
  const [screen, setScreen] = useState('dashboard');
  const [patientId, setPatientId] = useState(null);

  const openPatient = (id) => {
    setPatientId(id);
    setScreen('patients');
  };

  const nav = (id) => {
    setPatientId(null);
    setScreen(id);
  };

  let view;
  if (screen === 'dashboard') view = <Dashboard onNav={nav} onOpenPatient={openPatient} />;
  else if (screen === 'patients') {
    view = patientId ? (
      <PatientDetail patientId={patientId} onBack={() => setPatientId(null)} />
    ) : (
      <Patients onOpenPatient={openPatient} />
    );
  } else if (screen === 'agenda') view = <Agenda />;
  else if (screen === 'solicitudes') view = <Solicitudes />;
  else if (screen === 'finanzas') view = <Finanzas />;
  else if (screen === 'content') view = <Content />;
  else view = <Services />;

  return (
    <Layout active={screen} onNav={nav}>
      {view}
    </Layout>
  );
}

export default App;
