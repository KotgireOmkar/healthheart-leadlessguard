import React, { useState, useEffect } from 'react';
import { Patient, ClinicalAlert, ScenarioRecord, AuditRecord } from './types';
import { api, FALLBACK_PATIENTS } from './services/api';
import { Header } from './components/Header';
import { Sidebar, AdminTab } from './components/Sidebar';
import { ViewportFrame } from './components/ViewportFrame';

// Admin views
import { AdminDashboard } from './panels/admin/AdminDashboard';
import { LiveMonitoringView } from './panels/admin/LiveMonitoringView';
import { TrendsAnalyticsView } from './panels/admin/TrendsAnalyticsView';
import { AiAnalyticsView } from './panels/admin/AiAnalyticsView';
import { ResearchWorkspaceView } from './panels/admin/ResearchWorkspaceView';
import { SecurityCenterView } from './panels/admin/SecurityCenterView';
import { BatteryModelView } from './panels/admin/BatteryModelView';
import { VerificationSuiteView } from './panels/admin/VerificationSuiteView';
import { DataImportView } from './panels/admin/DataImportView';
import { ReportsView } from './panels/admin/ReportsView';
import { SettingsView } from './panels/admin/SettingsView';

// Patient Companion view
import { PatientCompanionView } from './panels/user/PatientCompanionView';

export const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'ADMIN' | 'USER'>('ADMIN');
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('home');

  const [patients, setPatients] = useState<Patient[]>(FALLBACK_PATIENTS);
  const [activePatient, setActivePatient] = useState<Patient>(FALLBACK_PATIENTS[0]);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [dbStatus, setDbStatus] = useState<string>('CONNECTED');

  // Load initial data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const health = await api.checkHealth();
        setDbStatus(health.database);

        const loadedPatients = await api.getPatients();
        setPatients(loadedPatients);
        if (loadedPatients.length > 0) setActivePatient(loadedPatients[0]);

        const loadedAlerts = await api.getAlerts();
        setAlerts(loadedAlerts);

        const loadedScenarios = await api.getScenarios();
        setScenarios(loadedScenarios);

        const loadedAudit = await api.getAuditTrail();
        setAuditRecords(loadedAudit);
      } catch (err) {
        console.warn('API sync fallback', err);
      }
    };

    loadData();
  }, []);

  const refreshScenarios = async () => {
    const updated = await api.getScenarios();
    setScenarios(updated);
  };

  const handlePatientUpdated = (updated: Patient) => {
    setActivePatient(updated);
    setPatients(prev => prev.map(p => (p.patientId === updated.patientId ? updated : p)));
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar only shown in Admin desktop mode */}
      {activeRole === 'ADMIN' && !isMobileView && (
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      <div className="main-layout">
        {/* Persistent Top Header */}
        <Header
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          isMobileView={isMobileView}
          onViewportToggle={() => setIsMobileView(!isMobileView)}
          dbStatus={dbStatus}
        />

        {/* Viewport Frame wrapper (supports both Desktop and Phone Mockup) */}
        <ViewportFrame isMobileView={isMobileView}>
          {activeRole === 'ADMIN' ? (
            <>
              {activeTab === 'home' && (
                <AdminDashboard
                  patients={patients}
                  activePatient={activePatient}
                  onSelectPatient={setActivePatient}
                  alerts={alerts}
                  onNavigateTab={setActiveTab}
                  onPatientUpdated={handlePatientUpdated}
                />
              )}
              {activeTab === 'live-monitoring' && (
                <LiveMonitoringView
                  patients={patients}
                  activePatient={activePatient}
                  onSelectPatient={setActivePatient}
                />
              )}
              {activeTab === 'trends' && (
                <TrendsAnalyticsView 
                  patients={patients}
                  activePatient={activePatient} 
                  onSelectPatient={setActivePatient}
                />
              )}
              {activeTab === 'ai-analytics' && (
                <AiAnalyticsView activePatient={activePatient} />
              )}
              {activeTab === 'research' && (
                <ResearchWorkspaceView
                  scenarios={scenarios}
                  onRefreshScenarios={refreshScenarios}
                />
              )}
              {activeTab === 'security' && (
                <SecurityCenterView />
              )}
              {activeTab === 'battery-model' && (
                <BatteryModelView />
              )}
              {activeTab === 'verification' && (
                <VerificationSuiteView />
              )}
              {activeTab === 'import' && <DataImportView />}
              {activeTab === 'reports' && <ReportsView auditRecords={auditRecords} />}
              {activeTab === 'settings' && (
                <SettingsView
                  activePatient={activePatient}
                  onPatientUpdated={handlePatientUpdated}
                />
              )}
            </>
          ) : (
            <div className="content-body">
              <PatientCompanionView patient={activePatient} />
            </div>
          )}
        </ViewportFrame>
      </div>
    </div>
  );
};

export default App;
