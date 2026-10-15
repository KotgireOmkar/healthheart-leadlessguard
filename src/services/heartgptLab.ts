// HeartGPT Transformer Interpretability Lab Service
// Based on Davies, Monsen, Mandic (Imperial College London, arXiv:2407.20775)

export interface TokenizedSignal {
  tokens: number[];
  normalized: number[];
  min: number;
  max: number;
}

export interface AttentionHeadWeight {
  layer: number;
  head: number;
  label: string;
  focusFeature: string;
  matrix: number[][]; // Attention matrix (T x T)
}

export interface HomonymVectorPoint {
  x: number;
  y: number;
  amplitude: number;
  phase: 'Systolic Rise' | 'Systolic Peak' | 'Dicrotic Notch' | 'Diastolic Decay';
  clusterColor: string;
}

export class HeartGPTLabService {
  // Tokenize biosignal into [0..100] discrete tokens (from tokenise/preprocess.py)
  public tokenize(signal: number[]): TokenizedSignal {
    const min = Math.min(...signal);
    const max = Math.max(...signal);
    const range = max - min === 0 ? 1 : max - min;

    const normalized = signal.map(v => (v - min) / range);
    const tokens = normalized.map(v => Math.min(100, Math.max(0, Math.round(v * 100))));

    return { tokens, normalized, min, max };
  }

  // Generate synthetic attention maps showcasing head specialization
  public getAttentionHeadMaps(seqLength: number = 32): AttentionHeadWeight[] {
    const matrix: number[][] = [];
    for (let i = 0; i < seqLength; i++) {
      const row: number[] = [];
      let sum = 0;
      for (let j = 0; j < seqLength; j++) {
        if (j > i) {
          row.push(0); // Causal mask (tril)
        } else {
          // Peaks around similar cardiac cycle offsets (e.g. j ≈ i - 10)
          const dist = i - j;
          const weight = Math.exp(-Math.pow(dist - 8, 2) / 12) + (dist === 0 ? 0.3 : 0.05);
          row.push(weight);
          sum += weight;
        }
      }
      // Softmax normalize
      matrix.push(row.map(w => (sum > 0 ? Number((w / sum).toFixed(3)) : 0)));
    }

    return [
      {
        layer: 3,
        head: 2,
        label: 'Layer 3 Head 2 (ECG P-Wave Specialist)',
        focusFeature: 'Electrical atrial depolarization (P-wave)',
        matrix,
      },
      {
        layer: 4,
        head: 1,
        label: 'Layer 4 Head 1 (PPG Dicrotic Notch Specialist)',
        focusFeature: 'Mechanical aortic valve closure (dicrotic reflection)',
        matrix,
      },
    ];
  }

  // Generate 2D PCA points illustrating Cardiac Homonyms phase separation
  public getHomonymClusters(numPoints: number = 200): HomonymVectorPoint[] {
    const points: HomonymVectorPoint[] = [];

    // Tokens with identical amplitude (e.g. value 50) occurring at different phases
    // form separate high-dimensional clusters in transformer embedding space:
    for (let i = 0; i < numPoints; i++) {
      const randX = (Math.random() - 0.5) * 1.5;
      const randY = (Math.random() - 0.5) * 1.5;

      if (i < 50) {
        // Systolic rise cluster
        points.push({
          x: -4.5 + randX,
          y: 3.2 + randY,
          amplitude: 50,
          phase: 'Systolic Rise',
          clusterColor: '#3b82f6',
        });
      } else if (i < 100) {
        // Systolic peak cluster
        points.push({
          x: 4.8 + randX,
          y: 4.1 + randY,
          amplitude: 85,
          phase: 'Systolic Peak',
          clusterColor: '#10b981',
        });
      } else if (i < 150) {
        // Dicrotic notch cluster
        points.push({
          x: 2.5 + randX,
          y: -3.8 + randY,
          amplitude: 50, // SAME amplitude as Systolic Rise, but separate cluster!
          phase: 'Dicrotic Notch',
          clusterColor: '#f59e0b',
        });
      } else {
        // Diastolic decay cluster
        points.push({
          x: -3.2 + randX,
          y: -4.2 + randY,
          amplitude: 25,
          phase: 'Diastolic Decay',
          clusterColor: '#8b5cf6',
        });
      }
    }

    return points;
  }
}

export const heartGptLab = new HeartGPTLabService();
