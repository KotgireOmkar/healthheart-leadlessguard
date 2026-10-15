# HealthHeart™ | LeadlessGuard™ Simulation-Engine Architecture
**Classification:** `SIMULATION` / `RESEARCH ONLY`

---

## 1. Deterministic VVI/VVIR Ventricular Demand Engine
The core pacing engine implements the following timing cycle:

$$T_{\text{escape}} = \frac{60000}{\text{LRL}_{\text{bpm}}} \text{ ms}$$

- **Case 1 (Intrinsic Activity Detected):** If intrinsic ventricular depolarization is sensed within $t < T_{\text{escape}}$, a Ventricular Sensed event (`VS`) is recorded. Pacing output is inhibited, and the escape timer resets to $0$.
- **Case 2 (Bradycardia / Escape Timeout):** If $t \ge T_{\text{escape}}$, a virtual Ventricular Paced stimulus (`VP`) is emitted.
- **Refractory Blanking Window:** A $250\text{ ms}$ post-ventricular refractory period ($VRP$) is enforced, during which incoming electrical noise is ignored to prevent double-counting of T-waves.

---

## 2. Electrophysiology Rhythm Presets
The engine deterministically simulates 8 canonical rhythm modes:
1. `NORMAL_SINUS`: Stable $72\text{ BPM}$, $<2\%$ pacing demand.
2. `COMPLETE_HEART_BLOCK`: Total AV dissociation; $100\%$ VVI pacing support required.
3. `SINUS_BRADYCARDIA`: Low intrinsic rate ($48\text{ BPM}$); escape pacing at $60\text{ BPM}$.
4. `IRREGULAR_AFIB`: High RR interval variability ($>28\%$).
5. `VENTRICULAR_TACHYCARDIA`: Rapid rate ($140\text{ BPM}$); high-rate alert generation.
6. `INTERMITTENT_CONDUCTION`: Alternating intrinsic conduction and escape pacing.
7. `NOISY_SENSOR`: High-frequency artifact filter demonstration.
8. `SENSOR_DROPOUT`: Flatline detection and fallback asynchronous mode.
