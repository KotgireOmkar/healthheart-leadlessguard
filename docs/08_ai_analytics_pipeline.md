# HealthHeart™ | LeadlessGuard™ AI Analytics Pipeline Document
**Classification:** `ANALYTICS` / `RESEARCH ONLY`

---

## 1. Multi-Stage Pipeline Architecture

```mermaid
flowchart TD
    Raw["Raw Telemetry Stream (ECG, PPG, SpO2, BIA)"] --> Pre["1. Preprocessing & Quality Assessment\n(Bandpass 0.5-40Hz, SQI Scoring)"]
    Pre --> Token["2. HeartGPT Biosignal Tokenization\n(Quantization into [0..100] Integer Bins)"]
    Pre --> Features["3. Quantitative Feature Extraction\n(HRV: SDNN, RMSSD, pNN50, Pacing Burden)"]
    Token --> Attention["4. Multi-Head Attention Heatmap\n(8 Heads: P-Wave & Dicrotic Notch Weights)"]
    Features --> Classifier["5. 9-Class Rhythm Pattern Classifier\n(Bradycardia, AFib, CHB, Artifact, etc.)"]
    Classifier --> Evidence["6. Structured AI Evidence Explanation Card\n(Confidence, Evidence String, Decision Support)"]
```

---

## 2. HeartGPT Interpretability Lab Integration
- **Tokenization:** Min-max scaling into 101 discrete tokens ($[0..100]$) inspired by natural language processing architectures.
- **Cardiac Homonyms:** Disambiguates identical voltage amplitudes occurring during systole vs diastole using 2D PCA phase-space projection.
- **Safety Restriction:** AI output is strictly decision-support. It possesses **zero write permissions** to pacing parameters.
