---
title: "Project Insight"
subtitle: "Turning a week of spreadsheet requests into a self-serve investor dashboard"
company: "Computershare Loan Services"
role: "Sole UX Designer"
team: "Investor Value Stream: project manager, business systems analyst, stakeholder, 12–15 engineers"
timeline: "December 2022 – February 2024"
industry: "Mortgage loan servicing · Finance"
tools: ["Figma", "FigJam", "Airtable", "Azure DevOps"]
methods: ["Assumption mapping", "Stakeholder interviews", "User interviews", "Personas", "Journey mapping", "Storyboards", "Co-design workshops", "Usability testing (5 investors)", "Information architecture", "Low → high-fidelity prototyping"]
status: "Designed and validated through high fidelity. Cancelled after an acquisition, before development."
hero_image: "assets/project-insight/10-hifi-main-dashboard.png"
---

<!-- DRAFT v2: confirmed by Tami on Nov 4, 2026: no colleague names, placeholder data, tools Figma + FigJam. -->

# Project Insight

**Turning a week of spreadsheet requests into a self-serve investor dashboard.**

<div class="impact" markdown="0">
<p class="impact-label">Impact</p>
<p>Designed self-serve investor dashboards to replace a <strong>3–5 day</strong> manual data-request process. Validated with <strong>5 investors</strong>, who asked <em>“When can I have this?”</em> at every fidelity.</p>
</div>

| | |
|---|---|
| **My role** | Sole UX designer, research → high-fidelity prototypes |
| **Team** | Project manager, business systems analyst, stakeholder, 12–15 engineers |
| **Timeline** | Dec 2022 – Feb 2024 |
| **Tools** | Figma · FigJam · Airtable · Azure DevOps |
| **Users** | Investors who own loan portfolios serviced by Computershare |

---

## The problem

Computershare services mortgage loans for investors. To check on a portfolio, investors **emailed a request** for each data point. A stakeholder spent **3–5 days** building spreadsheets and PDFs, sent over FTP, which were long and hard to read.

> Investors wanted answers. They got homework.

**How might we give investors clear insight into their portfolios?**

![I mapped our assumptions first, so we tested the riskiest guesses early.](../../assets/project-insight/01-assumption-map-desirability.png)

---

## My role

This was my first role in finance, so I learned mortgage servicing from scratch: UPB, delinquency buckets, loss mitigation, escrow and HELOCs. Our business systems analyst wrote SQL queries to pull the real data I designed from.

---

## Discovery

**1. Mapping what we didn't know.** With my PM, I mapped our assumptions: who the customers are, what they need, how they cope today and what could make this fail. I logged every interview and test finding in **Airtable**, so feedback could be compared and traced to design decisions.

**2. Talking to the people closest to the pain.** I interviewed the stakeholder who handled investor requests and wrote questions for investors.

**3. Reading the artifacts.** I studied the spreadsheets and PDFs investors received to learn what they actually asked for.

**4. Making the user real.** I started with a **proto-persona**, *Corey Watts*, a 56-year-old banker built from our assumption map. After the interviews, I built *Eduardo Reyes*, a persona **based on a real investor**, a head of asset management, and mapped his journey.

<div class="pair wide" markdown="1">
![Proto-persona: Corey emailed for every data point, searched the old Investor Web, then decoded long spreadsheets into his own dashboards.](../../assets/project-insight/19-persona-corey-watts.png)
![Eduardo's journey showed where investors got stuck: loss-mitigation data was buried and hard to find.](../../assets/project-insight/22-journey-map-eduardo-reyes.png)
</div>

**5. Telling the story.** Two storyboards showed the experience we were building toward.

<div class="pair wide" markdown="1">
![Panels 1–4: a new loan is added, and the investor logs in to see its impact.](../../assets/project-insight/20-storyboard-awareness-of-need.png)
![Panels 5–8: clear insight leads to more loans. That's the business case.](../../assets/project-insight/21-storyboard-data-driven-decisions.png)
</div>

---

## Co-designing the dashboard

I ran **in-person whiteboard sessions** with the stakeholder, BSA and project managers. We sketched what investors needed **at a glance** and what belonged one click deeper: delinquency, cashflow, escrow, entries and exits, and disasters.

One sticky note changed the product:

> *"Has my portfolio been impacted by natural disasters?"*

<div class="pair" markdown="1">
![Our whiteboard sketch became the main dashboard.](../../assets/project-insight/27-whiteboard-now-dashboard.jpg)
![This investor question became the FEMA disaster map.](../../assets/project-insight/05-workshop-sticky-natural-disasters.jpg)
</div>

Then I mapped every tab, chart and drill-down.

![8 focused dashboards with drill-downs, so investors never hunt for data.](../../assets/project-insight/09-dashboard-flow-full-ia.png)

---

## Testing: one dashboard wasn't enough

My first concept (**Prototype A**) was one at-a-glance dashboard built on the data we *assumed* mattered most.

After 1–2 rounds of low-fidelity testing with **5 investors**, the pattern was clear: they wanted **more data at a glance**, including data we didn't show. We asked what they needed, and their answers became a **secondary navigation** of focused dashboards.

**Prototypes B and C** differed only in where that navigation sat: two rows of top tabs, or a side nav plus top tabs.

**Finding:** investors had **no preference**. They only cared that the navigation was there.

**Decision:** we went with the version we **already had a component for** (side nav + top tabs), which saved design and development time.

<div class="pair wide" markdown="1">
![Prototypes A, B and C, tested with 5 investors.](../../assets/project-insight/13-prototypes-tested-abc.png)
![One dashboard wasn't enough, so it grew into a tabbed set.](../../assets/project-insight/12-lofi-trending-with-tabs.png)
</div>

---

## Design decisions

**Focused dashboards, not one crowded screen.** Main, Investor Type, Delinquency, Cashflow, HELOC, Active, Inactive and Disaster, each with drill-downs.

**Disasters on their own terms.** On the home dashboard, disaster data was noise when nothing was happening. I gave it its own tab with an embedded **FEMA disaster risk map**, ready when investors need it.

**Built for how investors work.** A UPB / Count / Weighted-average toggle, date filters, column editing, plus download, print and email.

![The main dashboard: portfolio health at a glance.](../../assets/project-insight/10-hifi-main-dashboard.png)

<div class="pair wide" markdown="1">
![Disaster data gets its own tab.](../../assets/project-insight/06-hifi-disaster-dashboard.png)
![County-level FEMA risk, mapped against the portfolio.](../../assets/project-insight/07-hifi-fema-disaster-map.webp)
</div>

**What we didn't build (yet).** I wireframed a loan-level search engine, but we focused on getting the dashboards right first.

---

## Outcome

At every fidelity level, low, mid and high, investors reacted the same way:

> *"How can I access this?"*
> *"When is this coming out? I need it now."*

The designs were complete and validated, and the data team was already organizing the backend feeds. Then **Newrez acquired the company**. Newrez already had its own investor tool, so Project Insight was cancelled before development started.

The goal was to replace a **3–5 day manual request process** with **self-serve, on-demand insight**. The research and testing showed investors wanted exactly that.

---

## What I'd do differently today

- **Start with a design system:** tokens, reusable components, and documented patterns, so the hand-off is dev-ready from day one. Nobody had taught me documentation then; I've since learned it.
- **Document every decision as I go**, not after.
- **Use AI to move faster.** I took this to high fidelity before AI design tools existed. Today I'd use AI to speed up synthesis, variations and prototyping, and spend that saved time with users.

---

*Data shown is representative; client information has been anonymized to protect confidentiality.*
