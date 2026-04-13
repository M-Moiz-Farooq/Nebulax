# NEBULAX — What to say in the lecturer meeting (≈2 minutes each)

**Tip:** Read your section once aloud; it should land around **two minutes**. Speak slowly. If the lecturer interrupts with a question, answer short, then you can return to “happy to show that on screen if useful.”

---

## Muhammad Moiz Farooq — Team lead

**Opening**

Good morning / afternoon. I’m Muhammad Moiz, team lead for NEBULAX. I’ll give a quick picture of how we organised the work and what I owned technically.

**Body**

On coordination, I kept the repo and tasks moving so everyone knew who was doing UI versus API versus testing. My own focus was the **back end**: the Express API, the **JWT authentication**, **role-based access** on the routes, and wiring **MongoDB** through Mongoose models. I also made sure **validation** and **security middleware**—things like rate limiting and sanitisation—were in place so we weren’t just “demo secure” but aligned with what we wrote in the system design.

When the front end needed new behaviour—for example who can **create a transaction** under each role—I updated the **API rules** and the **integration** so the React app and the server stayed in sync. I documented **how to run** the API and the database so the whole team could test locally, not just one machine.

**Close**

Next week we’re locking evidence: screenshots, a clean demo path, and final report text. I’m happy to walk through any endpoint or security choice in more detail—or we can demo the app live.

---

## Muskan Panwar

**Opening**

Hi, I’m Muskan. My main responsibility on NEBULAX was the **user interface**—what the lecturer and the markers actually see when they open the application.

**Body**

I built out the **React** front end: the **login and sign-up** flow, the **dashboard**, **transactions** table with search and export, the **notes** screens for staff roles, the **admin users** page, and the **project hub** where we surface our requirements and system design. I worked in **Vite** with **React Router** for navigation, and I used **Framer Motion** for sensible page transitions so the app feels finished, not like a rough prototype.

Styling is mostly in our **`index.css`**: I kept a **consistent layout**—sidebar, main area, cards, tables—and made sure **each role** only sees what they’re allowed to, matching the API. I also tuned **typography** and spacing so tables and forms stay readable for assessment screenshots.

**Close**

I coordinated with Moiz when the API behaviour changed so the UI labels and buttons stayed accurate. I’m happy to show any screen or explain a design decision.

---

## Piyush Tatwani

**Opening**

Hi, I’m Piyush. I supported the project mainly on **alignment between our documents and what we ship**, plus **smaller fixes** on the front end after reviews.

**Body**

A lot of our coursework is judged on whether the **requirements document** and **system design** match the product. I helped keep the **project hub** content accurate—things like the **API routes**, **roles**, and **security points**—so when someone reads the PDF and then opens the app, the story lines up. When we spotted mismatches in wording or a label that didn’t match the behaviour, I worked with Muskan on **copy and small UI tweaks**.

I also joined **design discussions** when we decided how to present features to the user—what to call actions, what to hide for a standard user versus an admin—so the experience stayed consistent with RBAC.

**Close**

I’m comfortable answering questions on how the **documentation** maps to the **live system**, and I can point to specific sections in the hub if useful.

---

## Simranjeet Singh Somal

**Opening**

Hi, I’m Simranjeet. My contribution was mostly **testing and quality assurance**—making sure what we built actually works the way the requirements say, before we submit.

**Body**

I ran **manual test passes**: sign-up, login, navigation, and then **role-based checks**—logging in as a normal user versus staff roles and confirming I only see the right menus and actions. When something failed—wrong error message, a button that shouldn’t show—I **logged it**, the team fixed it, and I **retested** the same path.

I also helped **edge-case testing**: empty lists, invalid inputs on forms, and making sure error messages from the API surface clearly in the UI. That’s important for a finance-style app where bad data shouldn’t silently save.

**Close**

I’m happy to describe our **test approach** or walk through an example of a bug we caught and how we verified the fix.

---

## Optional: one sentence each if time is short

| Person   | One-liner |
|----------|-----------|
| **Moiz** | “I led integration and the secured API—JWT, roles, validation, and keeping the stack runnable for everyone.” |
| **Muskan** | “I designed and built the React UI end to end so the product is demo-ready and matches our RBAC.” |
| **Piyush** | “I kept documentation and the live app aligned, with small UI and copy fixes after review.” |
| **Simranjeet** | “I tested flows by role, reported issues, and retested after fixes for submission quality.” |

---

*NEBULAX · IT6006 — edit names only if needed; practise once before the meeting.*
