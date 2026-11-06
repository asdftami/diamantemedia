---
title: "Bond Centre 2.0"
subtitle: "Redesigning a cluttered bond portal into a calm, guided experience for bondholders and admins"
company: "Computershare, for the State of Israel Bonds program"
role: "Sole UX/UI Designer"
team: "Product owners, project managers, development teams"
industry: "Government bonds · Financial services"
platforms: ["Desktop web", "Responsive mobile (iOS and Android sizes)"]
tools: ["Figma"]
methods: ["Heuristic review", "Information architecture", "Navigation A/B testing", "Wizard and form design", "Responsive design", "Prototyping"]
status: "Shipped to production"
hero_image: "assets/israel-bond-centre/10-new-portfolio-split-nav.png"
---

<!-- DRAFT v1: written from Tami's interview notes. [confirm] = quick check before publishing.
     Before publishing the screens: fix "Decreased" → "Deceased" and "sharesinto" in the mockups, replace lorem ipsum, and crop/blur the internal username on the old portfolio screenshot (11). -->

# Bond Centre 2.0

**Redesigning a cluttered bond portal into a calm, guided experience for bondholders and admins.**

<div class="impact" markdown="0">
<p class="impact-label">Impact</p>
<p>Redesigned a cluttered bond portal for bondholders and admins and <strong>shipped it to production</strong>. The <strong>split navigation won in A/B testing</strong>, and multi-step tasks became guided <strong>3-step wizards</strong>.</p>
</div>

| | |
|---|---|
| **My role** | Sole UX/UI designer, audit → dev-ready designs |
| **Team** | Product owners, project managers, developers |
| **Users** | Bondholders and admins |
| **Platforms** | Desktop + responsive mobile |
| **Tools** | Figma |

---

## The problem

Bond Centre is where State of Israel Bond owners check their portfolio, update details and submit forms. The old app was **clunky and hard to use**:

- **Cognitive overload:** too much data on one screen
- **Confusing navigation:** one long menu mixing everyday tasks with account settings
- **Weak admin controls:** no clear way to approve or reject submissions

---

## Two users, two jobs

| **Bondholders** | **Admins** |
|---|---|
| See their bonds and value | Review submitted forms |
| Download statements and tax forms | Approve or reject requests |
| Update banking, address and preferences | Keep bondholders informed |

Every flow had two sides: what the bondholder does, and what the admin sees next.

---

## 1. Navigation: separating *doing* from *managing*

I tested **one long left menu** against a **split navigation**:

- **Left:** tasks (Portfolio, Payments & Transactions, Banking Details, Statements, Suppress Maturity Payment)
- **Top right:** account items (Alerts, Messages, Preferences, Help, Logout)

**The split navigation won.** The single menu felt busy; the split follows a pattern people know from everyday apps.

<div class="pair wide" markdown="1">
![Version A: every link on the left felt busy.](../../assets/israel-bond-centre/12-new-portfolio-single-left-nav-variant.png)
![Version B won: tasks left, account top right.](../../assets/israel-bond-centre/10-new-portfolio-split-nav.png)
</div>

---

## 2. Taming the data: accordions + pagination

Some bondholders hold **many bonds across many accounts**, so:

- Each account is an **accordion**, with **Expand all / Collapse all**
- Bonds sit in a **short, paginated table**, and users choose how many rows to see
- A summary panel shows the **total balance**, with a **USD / CAD** toggle

The bondholder decides how much is on screen, not the system.

---

## 3. Wizards for multi-step tasks

Updating communication preferences across accounts used to be one dense form. I turned it into a **3-step wizard** with a stepper and a back button:

1. **Select accounts**, with select-all
2. **Choose preferences:** email or postal mail for each statement type
3. **Review and submit**

…then a clear **success confirmation**.

<div class="pair wide" markdown="1">
![Step 1: select accounts.](../../assets/israel-bond-centre/17-comm-prefs-wizard-step1-select-accounts.png)
![Step 2: email or mail, per statement.](../../assets/israel-bond-centre/18-comm-prefs-wizard-step2-preferences.png)
![Step 3: review before submitting.](../../assets/israel-bond-centre/19-comm-prefs-wizard-step3-summary.png)
![Confirmation: no guessing whether it worked.](../../assets/israel-bond-centre/20-comm-prefs-success-modal.png)
</div>

---

## 4. Forms and uploads without losing your place

Printable forms sit in five accordions (US, international, tax, direct registration and international currency). Bondholders **upload the signed copy right inside the section**: drag and drop, a progress bar, an "Uploaded ✓" state and **Remove file**.

<div class="pair wide trio" markdown="1">
![Five form groups; open only what you need.](../../assets/israel-bond-centre/03-printable-forms-one-expanded.png)
![Upload right where you found the form.](../../assets/israel-bond-centre/04-upload-drag-and-drop.png)
![Clear progress, plus a way to remove the wrong file.](../../assets/israel-bond-centre/05-upload-success.png)
</div>

---

## 5. Admin controls that close the loop

Admins see each submission marked **Proposed**, with **Preview, Approve, Reject and Cancel**. Bondholders see the result (for example, **Rejected**) right next to their form, with an info icon explaining why.

<div class="pair wide" markdown="1">
![Admins approve or reject in one place.](../../assets/israel-bond-centre/06-admin-approve-reject-proposed.png)
![Bondholders see the decision next to their form.](../../assets/israel-bond-centre/07-bondholder-rejected-status.png)
</div>

---

## 6. Designed for every screen

I designed every screen for **desktop and mobile** (iOS and Android sizes).

For the mobile **Inbox**, I compared separate list and message screens (**A**) against the message stacked above the list (**B**). **A won**, because it works like the email apps people already use.

<div class="pair wide" markdown="1">
![The full product, designed for iOS and Android.](../../assets/israel-bond-centre/15-mobile-wireframes-overview.png)
![Inbox: Version A won.](../../assets/israel-bond-centre/14-mobile-inbox-a-vs-b.png)
</div>

---

## Outcome

Product owners and developers were excited about the upgrade: calmer for bondholders, with real controls for admins.

![Live in production: the new Bond Centre welcome and login page.](../../assets/israel-bond-centre/08b-new-welcome-login-page-clean.png)

A company-wide layoff shortly after launch meant I couldn't collect usage data.

---

## What I learned

- **Research turns unknowns into solutions.** Proven patterns led me to the accordions and wizards that solved the clutter.
- **Component libraries raise the bar.** Figma libraries got me to a polished, consistent look fast.
- **Familiar patterns win.** Both A/B tests went to the layout people already know from everyday apps and email.
- **Next time: a real handoff.** Specs, states and interaction notes, so developers don't have to guess.
