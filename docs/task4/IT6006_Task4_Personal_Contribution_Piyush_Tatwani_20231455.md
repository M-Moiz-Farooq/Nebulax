# IT6006 — Task 4: Personal Contribution Summary

| Field | Detail |
|-------|--------|
| **Course** | IT6006 — Development of an Enterprise Web Application |
| **Assessment** | Project (Task 4 — Reflective journal / personal contribution) |
| **Student** | Piyush Tatwani |
| **Student ID** | 20231455 |
| **Team** | NEBULAX |
| **Team role (contract)** | System design support, **database and data model planning**, **URL structure**, **security controls planning**, implementation support, presentation support (`IT6006_Team_Contract_NEBULAX.md`, §5). **Team emphasis for delivery:** documentation alignment, delivery assurance, and targeted minor front-end fixes (see progress report §4.3). |

**Repository:** https://github.com/M-Moiz-Farooq/Nebulax  

---

## 1. How my role matches the team contract and documentation

The contract assigns me leadership in **Stage 2** as **Recorder / Documentation Lead** (rotating structure, §4) and lists my primary responsibilities around **system design**, **data model planning**, **URL planning**, and **security planning**. That matches how I contributed best when translating agreed designs into **traceable documentation** and ensuring the **delivered application** still reads consistently with the PRD/SDD during the build phase.

The progress report highlights my work aligning the **in-app project hub** with PRD/SDD wording and endpoints, supporting **demonstration narrative**, and performing **targeted frontend adjustments** after review (copy/minor fixes)—this is the “delivery assurance” slice: closing gaps between “what we wrote” and “what we shipped.”

---

## 2. Tasks I completed (documentation + delivery assurance + minor UI)

**Documentation traceability**

- Cross-checked **functional requirements** statements against visible UI routes and API endpoints listed in the SDD, feeding corrections into shared docs and the in-app hub content (`frontend/src/content/nebulaxProject.js` and related pages).
- Supported **URL design consistency** discussions so REST paths and UI navigation tell the same story (auth vs protected resources; staff-only areas).

**Security & privacy documentation alignment (rubric Task 2 privacy policies)**

- Participated in translating security controls from design into **documented** privacy/security principles (data minimisation, access control narrative, retention assumptions) so coursework templates reflect what the system actually attempts to enforce (JWT, RBAC, validation), consistent with the contract’s expectation of privacy-aware design.

**Delivery assurance**

- Ran **smoke checks** on the documented run path (`HOW_TO_START_NEBULAX.md`): Django on port 8000 + Vite proxy expectations, to reduce “works on my machine” risk before meetings and submission.
- Coordinated **pre-demo readiness**: confirming key flows for the spokesperson/presentation segments (contract: presentation support).

**Minor front-end contributions**

- Implemented or refined small UI-facing improvements after review—commonly **formatting consistency** and shared helpers—so screens present finance data uniformly across pages.

---

## 3. My contribution to decisions

- **Design-vs-delivery trade-offs:** I advocated for freezing scope late in the project and focusing on **evidence-quality** (consistent terminology, reliable demo steps) rather than adding unstable features, matching milestone 6 in the contract §9 table.
- **Documentation as a quality gate:** I pushed for updating wording when API behaviour changed, so PRD/SDD do not contradict GitHub reality—important for academic integrity and marker trust.
- **Risk reduction:** Raised integration risks early (proxy mismatch, missing migrate/seed steps) so the team could fix them before the deadline.

---

## 4. Implementation commentary — Shared money formatting (presentation + integrity of display)

**Rubric link:** Supports **usability**, **data presentation consistency**, and supports reviewers to trust displayed figures during demo—aligned with **non-functional** requirements and with **validation** themes (clear handling of numeric input/display separation).

Centralising currency presentation reduces duplicated logic across pages and prevents inconsistent rounding during marking:

```1:22:frontend/src/utils/money.js
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Display amounts in USD (UI only; stored values are plain numbers). */
export function formatMoney(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return usd.format(0);
  return usd.format(n);
}

/** e.g. +$1,234.56 or −$1,234.56 */
export function formatSignedMoney(isCredit, amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return usd.format(0);
  const formatted = usd.format(Math.abs(n));
  const sign = isCredit ? '+' : '−';
  return `${sign}${formatted}`;
}
```

This snippet also documents an important separation: **storage** remains numeric while **presentation** is handled consistently—an organisational practice that reduces accidental misreporting in UI screenshots and supports clearer auditing narratives in documentation.

---

## 5. Evidence of contribution

**GitHub — NEBULAX repository**  
The project repository is **https://github.com/M-Moiz-Farooq/Nebulax**. Documentation alignment, supporting frontend changes, and related contributions appear in **commits**, **pull requests**, **issues**, and **reviews** on that repository.

**Team communication**  
Per **IT6006_Team_Contract_NEBULAX.md**, the team used **Microsoft Teams** for coordination; documentation and delivery decisions are also reflected in **repository history** and shared project files.

---

## 6. Declaration alignment

This summary aligns with the NEBULAX **team contract** responsibilities for Piyush Tatwani and with the **updated progress report** (§4.3).

**Student:** Piyush Tatwani (20231455)
