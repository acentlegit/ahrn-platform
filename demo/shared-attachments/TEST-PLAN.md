# AHRN Mobile — Test Plan

**Source:** BRD — Home Warranty Platform v0.2 (Draft), 2026-05-29  
**App under test:** AHRN Mobile v1.1.0 (`com.ahrn.mobile`)  
**Suite total:** 134 cases (77 High, 57 Medium/Low) — full platform; mobile demo covers a subset.

## How to run tests

| Type | Command |
|------|---------|
| **Unit tests** | `cd AHRN-Mobile` → `npm test` |
| **Emulator smoke** | `.\scripts\smoke-test-ahrn.ps1` (from repo root) |
| **Manual UI** | `.\launch-ahrn.ps1` then walk through roles below |

### Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Homeowner | homeowner@ahrn.demo | homeowner123 |
| Technician | tech@ahrn.demo | tech123 |
| Admin | admin@ahrn.demo | admin123 |
| Super Admin | super@ahrn.demo | super123 |

---

## Coverage summary (mobile vs full suite)

| Module | Suite cases | Mobile coverage | Notes |
|--------|-------------|-----------------|-------|
| Platform Admin (Super Admin) | 13 | **Partial** | Super Admin tab: AI Console + Governance (demo UI) |
| Organization Management | 9 | **Not in app** | Web/platform only |
| Homeowner Onboarding & Enrollment | 9 | **Partial** | Role select + login; no real enrollment |
| Plan & Coverage Management | 5 | **Partial** | Dashboard shows plan context; no CRUD |
| Service Request / Claim Intake | 8 | **Partial** | Open Claims on Home; Job tab tracking |
| Diagnosis, Triage & Adjudication | 10 | **Partial** | Forecast AI explanation; Admin disputes screen |
| Vendor Management & Dispatch | 9 | **Partial** | Bids + Technician opportunity feed |
| Repair & Replacement Fulfillment | 9 | **Partial** | Job progress + Complete Job flow |
| Parts Procurement | 3 | **Not in app** | — |
| Billing, Payments & Renewals | 9 | **Not in app** | — |
| Maintenance & Notifications | 4 | **Partial** | Scheduled maintenance on dashboard |
| Reporting & Analytics | 4 | **Partial** | Admin overview metrics (static demo) |
| IoT & Predictive Claims | 14 | **Partial** | Forecast module, risk chart, cost impact |
| Non-Functional Requirements | 14 | **Manual** | Performance, offline, security — smoke script + device testing |
| RBAC / Permissions Matrix | 6 | **Pass (demo)** | Four roles route to different navigators |
| Authentication & Access | 5 | **Pass (demo)** | Valid/invalid login covered by unit tests + manual |
| End-to-End Lifecycle | 3 | **Partial** | Forecast → Bids → Job (demo data, no backend) |

**Automated today:** 12 unit tests (auth + bid scoring + cost impact).  
**Recommended next:** Expand Jest for dashboard data shapes; Detox/Maestro for UI E2E when backend exists.

---

## Priority smoke checklist (run on AHRN_Pixel emulator)

Mark: **Pass** | **Fail** | **Blocked** | **N/A**

### Authentication & Access (High)

- [ ] **AUTH-01** Role select shows 4 roles with descriptions — *Manual*
- [ ] **AUTH-02** Valid credentials per role reach role home — *Smoke script + manual*
- [ ] **AUTH-03** Wrong password shows error, stays on login — *Manual*
- [ ] **AUTH-04** Logout returns to role select — *Manual*
- [ ] **AUTH-05** Cross-role email rejected — *Unit test ✓*

### RBAC (High — all 6)

- [ ] **RBAC-01** Homeowner sees Home / Forecast / Bids / Job only — *Manual*
- [ ] **RBAC-02** Technician sees Opportunities / Job detail / Complete — *Manual*
- [ ] **RBAC-03** Admin sees Overview / Disputes / Compliance — *Manual*
- [ ] **RBAC-04** Super Admin sees AI Console / Governance — *Manual*
- [ ] **RBAC-05** No admin screens visible when logged in as homeowner — *Manual*
- [ ] **RBAC-06** Role cannot be switched without logout — *Manual*

### Homeowner — core flows (High)

- [ ] **HOME-01** Dashboard: Health Score, Alerts, Risks, Claims, Maintenance — *Manual*
- [ ] **IOT-01** Forecast: risk chart + AI explanation — *Manual*
- [ ] **IOT-02** Recommended Actions (3 items) — *Manual*
- [ ] **IOT-03** Cost Impact ($250 / $1,800 / $1,550 savings) — *Unit test ✓*
- [ ] **BID-01** Three vendors in comparison table — *Manual*
- [ ] **BID-02** Weight sliders re-rank bids — *Unit test ✓*
- [ ] **BID-03** AI recommends CoolFix at default weights — *Manual + unit*
- [ ] **JOB-01** Job progress timeline visible — *Manual*

### Technician / Admin / Super Admin (sample High)

- [ ] **TECH-01** Opportunity list loads — *Manual*
- [ ] **TECH-02** Open job → detail → complete job — *Manual*
- [ ] **ADM-01** Admin overview loads — *Manual*
- [ ] **SA-01** Super Admin AI console loads — *Manual*

### Non-functional (spot check)

- [ ] **NFR-01** App launches without Metro (release APK) — *install-ahrn-release.ps1*
- [ ] **NFR-02** Cold start &lt; 10s on emulator — *Smoke script*
- [ ] **NFR-03** No crash on tab switch (all homeowner tabs) — *Smoke script*

---

## Unit test inventory

| File | What it verifies |
|------|------------------|
| `src/auth/credentials.test.ts` | Valid login per role, wrong password, cross-role, empty |
| `src/utils/bidScoring.test.ts` | Weighted score, slider ranking, cost impact math |

Run: `npm test` in `AHRN-Mobile/`.

---

## Status legend (for your spreadsheet)

| Status | Meaning for AHRN Mobile |
|--------|-------------------------|
| **Pass** | Verified on device or automated test green |
| **Fail** | Expected behavior missing or broken |
| **Blocked** | Needs backend/API not in demo |
| **Not Run** | Not yet executed |
| **N/A** | Module not in mobile scope (e.g. billing) |

Copy results back into the master **Test Case Suite** workbook under a sheet named **AHRN Mobile v1.1.0**.
