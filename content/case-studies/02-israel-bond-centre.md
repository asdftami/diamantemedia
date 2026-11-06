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
| **My role** | Sole UX/UI designer, from audit to dev-ready designs |
| **Team** | Product owners, project managers, development teams |
| **Users** | **Bondholders** managing their Israel Bonds, and **admins** reviewing and approving their requests |
| **Platforms** | Desktop web + responsive mobile |
| **Tools** | Figma |

---

## The problem

Bond Centre is where people who own State of Israel Bonds check their portfolio, update their details and submit forms. The existing app felt **large, clunky and hard to use**:

- **Cognitive overload:** too many loans and too much data crammed onto one screen
- **Navigation that didn't make sense:** one long menu mixing everyday tasks with account settings
- **Weak admin controls:** staff had no clear way to review, approve or reject what bondholders submitted


---

## Two users, two jobs

| **Bondholders** | **Admins** |
|---|---|
| See what they own and what it's worth | Review submitted forms and documents |
| Download statements and tax forms | Approve or reject requests |
| Update banking, address and communication preferences | Keep bondholders informed of the status |

Designing for both meant every flow had two sides: what the bondholder does, and what the admin sees next.

---

## 1. Navigation: separating *doing* from *managing*

I tested **one long left-hand menu** against a **split navigation**:

- **Left:** the tasks you came to do (Portfolio, Payments & Transactions, Banking Details, Account Statements, Suppress Maturity Payment)
- **Top right:** everything about *you* (Alerts, Messages, country, User Preferences, Help & FAQ, Logout)

**The split navigation won.** With everything stacked on the left, people found it busy and confusing. Splitting it follows a pattern people already know from the apps they use every day.

![Version A: every link stacked on the left. Users found it busy and confusing.](../../assets/israel-bond-centre/12-new-portfolio-single-left-nav-variant.png)
![Version B won: tasks on the left, account settings at the top right, a pattern people already know.](../../assets/israel-bond-centre/10-new-portfolio-split-nav.png)

---

## 2. Taming the data: accordions + pagination

Some bondholders hold **many bonds across many accounts**. Instead of showing everything at once:

- Each account is an **accordion**, closed until you need it, with **Expand all / Collapse all**
- Inside, bonds sit in a **short, paginated table**, and users choose how many rows to see
- A summary panel shows the **total balance** at a glance, with a **USD / CAD** toggle

The bondholder decides how much information is on screen, not the system.

![Accordions and pagination let bondholders with many accounts see only what they need, with the total balance always in view.](../../assets/israel-bond-centre/10-new-portfolio-split-nav.png)

---

## 3. Wizards for multi-step tasks

Updating communication preferences across several accounts used to be one dense form. I turned it into a **3-step wizard**:

1. **Select accounts:** checkboxes, with select-all
2. **Choose preferences:** email or postal mail for tax statements, bond statements and other mail
3. **Review the summary:** "Your information is not complete until you click Submit"

…followed by a clear **success confirmation**. A stepper shows where you are, and you can always go back.

![Step 1: choose which accounts to update, all at once or one by one.](../../assets/israel-bond-centre/17-comm-prefs-wizard-step1-select-accounts.png)
![Step 2: pick email or postal mail for each type of statement.](../../assets/israel-bond-centre/18-comm-prefs-wizard-step2-preferences.png)
![Step 3: review everything before submitting, so nothing changes by accident.](../../assets/israel-bond-centre/19-comm-prefs-wizard-step3-summary.png)
![A clear confirmation closes the loop: no guessing whether it worked.](../../assets/israel-bond-centre/20-comm-prefs-success-modal.png)

---

## 4. Forms and uploads without losing your place

Printable forms are grouped into accordions: US holders, international holders, tax forms, direct registration, international currency. Bondholders can **view a form and upload the signed copy right inside the section**: drag and drop, a progress bar, an "Uploaded ✓" state, and a **Remove file** option if they picked the wrong one.

![Five form categories in tidy accordions, so bondholders open only the one they need.](../../assets/israel-bond-centre/03-printable-forms-one-expanded.png)
![Upload a signed form right where you found it: no new page, no lost place.](../../assets/israel-bond-centre/04-upload-drag-and-drop.png)
![Clear progress and an "Uploaded ✓" state, plus a way to remove the wrong file.](../../assets/israel-bond-centre/05-upload-success.png)

---

## 5. Admin controls that close the loop

When a bondholder submits a form, the **admin** sees it marked **Proposed**, with **Preview, Approve, Reject and Cancel** actions. The **bondholder** then sees the result (for example, **Rejected**) right next to the form, with an info icon explaining what happened. No more guessing whether a request went through.

![Admins review each submission and approve or reject it in one place.](../../assets/israel-bond-centre/06-admin-approve-reject-proposed.png)
![Bondholders see the decision right next to their form, closing the loop between both users.](../../assets/israel-bond-centre/07-bondholder-rejected-status.png)

---

## 6. Designed for every screen

I designed the full product for **desktop and mobile** (iOS and Android sizes): portfolio, tax details, printable forms, communication preferences, FAQ, inbox, online support, banking details and address change.

For the mobile **Inbox**, I compared two layouts:
- **A:** message list and message detail on separate screens
- **B:** message detail stacked above the list

**A won:** it was more intuitive, because it works like the email apps people already use.

![The full product, designed for iOS and Android: portfolio, forms, tax details, inbox and more.](../../assets/israel-bond-centre/15-mobile-wireframes-overview.png)
![Version A won: separate list and message screens felt more intuitive, like the email apps people already use.](../../assets/israel-bond-centre/14-mobile-inbox-a-vs-b.png)

---

## Outcome

**Bond Centre 2.0 shipped to production.** The development team and product owners were excited about the upgrade: a cleaner, calmer, more organized experience for bondholders, and real controls for admins.

![Shipped: the Bond Centre welcome page live in production.](../../assets/israel-bond-centre/09-BEFORE-old-welcome-page.webp)

I was part of a company-wide layoff shortly after launch, so I wasn't able to collect post-launch usage data.

---

## What I learned

- **Research turns unknowns into solutions.** I didn't start with every answer. Researching proven patterns led me to the accordions and wizards that solved the clutter.
- **Component libraries raise the bar.** Building with Figma component libraries helped me reach a polished, consistent look quickly.
- **Next time: a real handoff.** I'd deliver clear handoff documentation (specs, states and interaction notes) instead of leaving developers to work out how to build my designs.
