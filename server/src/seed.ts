import { Patient } from './models/Patient.js';
import { ClinicalAlert } from './models/ClinicalAlert.js';
import { AuditRecord } from './models/AuditRecord.js';
import { ScenarioRecord } from './models/ScenarioRecord.js';

export const seedDatabase = async (force: boolean = false) => {
  try {
    const count = await Patient.countDocuments();
    if (count > 0 && !force) {
      console.log(`[Seed] Database already contains ${count} patients. Skipping re-seed.`);
      return;
    }

    if (force) {
      console.log('[Seed] Force refresh requested. Clearing legacy patients, alerts, and records...');
      await Patient.deleteMany({});
      await ClinicalAlert.deleteMany({});
      await ScenarioRecord.deleteMany({});
      // Keep audit record or re-init genesis
      await AuditRecord.deleteMany({});
    }

    console.log('[Seed] Seeding 5 canonical de-identified patient profiles into MongoDB Atlas...');

    const initialPatients = [
      {
        patientId: 'PT-001',
        fullName: 'PT-001 ABC',
        age: 64,
        gender: 'Male',
        implantDate: '2024-03-15',
        deviceModel: 'LeadlessGuard-VR Pro',
        serialNumber: 'SN-9482-TX',
        rhythmProfile: 'Normal Sinus Rhythm',
        baselineHeartRate: 72,
        pacingBurdenPercent: 2,
        lowerRateLimit: 60,
        refractoryPeriodMs: 250,
        captureThresholdVolts: 0.5,
        leadImpedanceOhms: 580,
        batteryLongevityYears: 8.4,
        batteryPercentage: 92,
        rWaveAmplitudeMv: 10.4,
        signalQualityIndex: 99,
        telemetryStatus: 'ONLINE',
        activeScenario: 'SCENARIO_D',
      },
      {
        patientId: 'PT-002',
        fullName: 'PT-002-XYZ',
        age: 71,
        gender: 'Female',
        implantDate: '2023-11-20',
        deviceModel: 'LeadlessGuard-VR Pro',
        serialNumber: 'SN-9014-AX',
        rhythmProfile: 'Complete Heart Block (CHB)',
        baselineHeartRate: 60,
        pacingBurdenPercent: 100,
        lowerRateLimit: 60,
        refractoryPeriodMs: 250,
        captureThresholdVolts: 0.65,
        leadImpedanceOhms: 610,
        batteryLongevityYears: 7.1,
        batteryPercentage: 78,
        rWaveAmplitudeMv: 8.2,
        signalQualityIndex: 96,
        telemetryStatus: 'ONLINE',
        activeScenario: 'SCENARIO_A',
      },
      {
        patientId: 'PT-003',
        fullName: 'PT-003-LMN',
        age: 58,
        gender: 'Male',
        implantDate: '2024-06-02',
        deviceModel: 'LeadlessGuard-VR Pro',
        serialNumber: 'SN-7729-BX',
        rhythmProfile: 'Sinus Bradycardia (<50 BPM Mild Alert)',
        baselineHeartRate: 46,
        pacingBurdenPercent: 44,
        lowerRateLimit: 45,
        refractoryPeriodMs: 250,
        captureThresholdVolts: 0.55,
        leadImpedanceOhms: 595,
        batteryLongevityYears: 8.0,
        batteryPercentage: 86,
        rWaveAmplitudeMv: 9.7,
        signalQualityIndex: 97,
        telemetryStatus: 'ONLINE',
        activeScenario: 'SCENARIO_B',
      },
      {
        patientId: 'PT-004',
        fullName: 'PT-004-PQR',
        age: 69,
        gender: 'Female',
        implantDate: '2023-08-14',
        deviceModel: 'LeadlessGuard-VR Pro',
        serialNumber: 'SN-6392-CX',
        rhythmProfile: 'Severe Sinus Arrest (<40 BPM Urgent Dispatch)',
        baselineHeartRate: 36,
        pacingBurdenPercent: 82,
        lowerRateLimit: 35,
        refractoryPeriodMs: 250,
        captureThresholdVolts: 0.5,
        leadImpedanceOhms: 570,
        batteryLongevityYears: 7.5,
        batteryPercentage: 80,
        rWaveAmplitudeMv: 11.0,
        signalQualityIndex: 98,
        telemetryStatus: 'ONLINE',
        activeScenario: 'SCENARIO_C',
      },
      {
        patientId: 'PT-005',
        fullName: 'PT-005-DEF',
        age: 62,
        gender: 'Female',
        implantDate: '2024-01-10',
        deviceModel: 'LeadlessGuard-VR Pro',
        serialNumber: 'SN-5521-DX',
        rhythmProfile: 'Elevated Impedance / Sensor Artifact',
        baselineHeartRate: 74,
        pacingBurdenPercent: 12,
        lowerRateLimit: 60,
        refractoryPeriodMs: 250,
        captureThresholdVolts: 0.9,
        leadImpedanceOhms: 1240,
        batteryLongevityYears: 8.1,
        batteryPercentage: 89,
        rWaveAmplitudeMv: 4.8,
        signalQualityIndex: 65,
        telemetryStatus: 'WARNING',
        activeScenario: 'SCENARIO_E',
      },
    ];

    await Patient.insertMany(initialPatients);

    // Initial clinical alerts with de-identified personas
    const initialAlerts = [
      {
        alertId: 'ALT-1001',
        patientId: 'PT-005',
        patientName: 'PT-005-DEF',
        severity: 'WARNING',
        ruleIdentifier: 'RULE_IMPEDANCE_THRESHOLD_EXCEEDED',
        title: 'Elevated Lead Impedance Detected',
        description: 'Bipolar pacing impedance measured at 1240 Ohms (Threshold: >1200 Ohms). Potential lead micro-dislodgement or sensor contact variation.',
        sourceSignal: 'Intracardiac BIA / Electrode Telemetry',
        vitalValues: { impedanceOhms: 1240, threshold: 1200 },
        status: 'ACTIVE',
      },
      {
        alertId: 'ALT-1002',
        patientId: 'PT-002',
        patientName: 'PT-002-XYZ',
        severity: 'ADVISORY',
        ruleIdentifier: 'RULE_HIGH_PACING_BURDEN_V1',
        title: 'Sustained Ventricular Pacing (100%)',
        description: 'Patient pacing burden at 100% in VVI mode for >24 hours consistent with complete heart block.',
        sourceSignal: 'VVI Pacing Engine',
        vitalValues: { pacingBurdenPercent: 100, lowerRateLimit: 60 },
        status: 'ACKNOWLEDGED',
        acknowledgedBy: 'Dr. Clinician EP',
        acknowledgedAt: new Date(),
        resolutionNotes: 'Expected pacing demand for high-grade AV block. Battery longevity re-estimated at 7.1 years.',
      },
      {
        alertId: 'ALT-1003',
        patientId: 'PT-001',
        patientName: 'PT-001 ABC',
        severity: 'ADVISORY',
        ruleIdentifier: 'RULE_ROUTINE_BATTERY_UPDATE',
        title: 'Battery Longevity Verification Normal',
        description: 'Projected battery life 8.4 years remaining at current 2% pacing burden.',
        sourceSignal: 'Battery Chemistry Duty-Cycle Model',
        vitalValues: { batteryPercentage: 92, longevityYears: 8.4 },
        status: 'RESOLVED',
      },
    ];

    await ClinicalAlert.insertMany(initialAlerts);

    // Initial Genesis Audit Block
    const genesisBlock = {
      blockIndex: 0,
      timestamp: new Date(),
      actorRole: 'SYSTEM_GENESIS',
      category: 'INITIALIZATION',
      action: 'GENESIS_BLOCK_CREATION',
      details: 'LeadlessGuard enterprise clinical telemetry blockchain initialized with de-identified clinical cohort (PT-001 through PT-005).',
      previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
      currentBlockHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    };

    await AuditRecord.create(genesisBlock);

    // Initial 8 Canonical Scenarios
    const scenarios = [
      { scenarioCode: 'A', name: 'Complete Heart Block', description: 'Atrial-ventricular dissociation requiring 100% ventricular pacing support.', status: 'PASS', metrics: { pacingBurden: '100%', intrinsicRate: '42 bpm' }, assertionsPassed: 5, totalAssertions: 5 },
      { scenarioCode: 'B', name: 'Intermittent Conduction', description: 'Alternating intrinsic and dropped conduction with adaptive escape pacing.', status: 'PASS', metrics: { pacingBurden: '44%', transitionTime: '120ms' }, assertionsPassed: 5, totalAssertions: 5 },
      { scenarioCode: 'C', name: 'High Pacing Burden', description: 'Sustained low intrinsic rate driving high energy duty cycle.', status: 'PASS', metrics: { batteryImpact: '-0.4 yrs/yr', pacingRate: '82%' }, assertionsPassed: 4, totalAssertions: 4 },
      { scenarioCode: 'D', name: 'Normal Sinus Rhythm', description: 'Stable 72 BPM baseline rhythm conserving pacing energy.', status: 'PASS', metrics: { pacingBurden: '0%', batteryRate: 'Normal' }, assertionsPassed: 6, totalAssertions: 6 },
      { scenarioCode: 'E', name: 'Noisy Sensor Artifact', description: 'Electrode movement and baseline wander triggering SQI degradation.', status: 'PASS', metrics: { sqiScore: '65%', falseAlarmRejection: '100%' }, assertionsPassed: 5, totalAssertions: 5 },
      { scenarioCode: 'F', name: 'Telemetry Link Dropout', description: 'RF communication outage triggering stale data state without disrupting pacing.', status: 'PASS', metrics: { linkRecovery: '350ms', bufferLoss: '0%' }, assertionsPassed: 4, totalAssertions: 4 },
      { scenarioCode: 'G', name: 'Replay Attack Injection', description: 'Duplicate sequence packet rejected by gateway security verification.', status: 'PASS', metrics: { replayRejectionTime: '12ms', tamperStatus: 'BLOCKED' }, assertionsPassed: 6, totalAssertions: 6 },
      { scenarioCode: 'H', name: 'Battery Budget Stress', description: 'Accelerated continuous RF transmission testing battery endurance modeling.', status: 'PASS', metrics: { projectedDraw: '8.5mA burst', modelAccuracy: '99.4%' }, assertionsPassed: 5, totalAssertions: 5 },
    ];

    await ScenarioRecord.insertMany(scenarios);

    console.log('[Seed] Database seeded with 5 de-identified patients (PT-001 ABC to PT-005-DEF), alerts, audit ledger, and 8 scenarios.');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};
