# Contributing to HealthHeart™ / LeadlessGuard™

Thank you for your interest in contributing to **HealthHeart™**! This document provides guidelines for contributing to this research platform.

---

## 1. Code of Conduct

All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all members of the community with respect and empathy.

---

## 2. Research & Non-Model Boundary

When contributing to this codebase, please observe the fundamental project boundaries:
1. **Deterministic & Transparent:** Signal processing and clinical alert detection should remain deterministic and inspectable.
2. **Related Work Boundary:** External models (such as *HeartGPT*) are cited as external reference work only and must not be bundled or embedded as black-box inference checkpoints.
3. **Safety Isolation:** Do not add code that attempts to bind to real medical device RF/BLE protocols or hardware programmer peripherals.

---

## 3. Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster (optional for mock-only mode)

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/healthheart-leadlessguard.git
cd healthheart-leadlessguard

# Install dependencies for both frontend and backend
npm run install:all
```

### Running Locally
```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run client      # Frontend on http://localhost:5173
npm run server      # Backend on http://localhost:5000
```

---

## 4. Verification & Testing

Before submitting a Pull Request, ensure that all verification suites pass:

```bash
# Typecheck and build frontend
npm run build

# Typecheck and build backend
npm --prefix server run build
```

---

## 5. Branching & Commit Conventions

We follow Conventional Commits:
- `feat:` A new simulation view, visualizer, or feature
- `fix:` A bug fix in pacing logic, signal synthesis, or API routes
- `docs:` Documentation updates in `/docs` or README
- `refactor:` Code reorganization without behavioral change
- `test:` Adding automated verification scenarios

### Submitting a Pull Request
1. Fork the repository and create your feature branch from `main`:
   ```bash
   git checkout -b feat/rhythm-conduction-enhancement
   ```
2. Commit your changes with clear messages.
3. Push to your branch and open a Pull Request targeting `main`.
4. Ensure the PR template checklist is completed.
