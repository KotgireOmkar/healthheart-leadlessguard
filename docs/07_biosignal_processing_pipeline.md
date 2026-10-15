# HealthHeart™ | LeadlessGuard™ Biosignal Processing Pipeline
**Classification:** `SIMULATION` / `MONITORING`

---

## 1. 4-Channel Biosignal Generation Pipeline

1. **Lead II Synthetic ECG ($250\text{ Hz}$):**
   - Synthesized using a mixture of Gaussians parameterized by cardiac phase $\theta \in [0, 1)$:
     $$V_{\text{ecg}}(\theta) = \sum_{i \in \{P, Q, R, S, T\}} a_i \exp\left(-\frac{(\theta - \mu_i)^2}{2\sigma_i^2}\right) + \eta(t)$$
   - Pacing spikes injected as sharp $1.8\text{ mV}$ impulses when virtual stimulation is delivered.
2. **Arterial Photoplethysmography (PPG, $100\text{ Hz}$):**
   - Synthesizes systolic peak rise followed by a secondary dicrotic notch reflection delayed by Pulse Transit Time ($PTT \approx 180\text{ ms}$).
3. **Pulse Oximetry ($SpO_2$, $1\text{ Hz}$):**
   - Baseline oxygen saturation of $98\%$ modulated by respiratory tidal volume and sensor contact impedance.
4. **Thoracic Bioelectrical Impedance (BIA, $25\text{ Hz}$):**
   - Baseline transthoracic impedance of $580\ \Omega$ with sinusoidal breathing modulation ($\pm 15\ \Omega$ at $0.25\text{ Hz}$).

---

## 2. Digital Calipers Math
HTML5 Canvas calipers calculate interval duration and equivalent instantaneous heart rate:
$$\Delta t = |x_2 - x_1| \times \left(\frac{1000\text{ ms}}{250\text{ px}}\right) \text{ ms}$$
$$\text{Instantaneous HR} = \frac{60000}{\Delta t} \text{ BPM}$$
