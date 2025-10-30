---
sidebar_position: 3
---
## Module 36: Gemini Enterprise

# Lab 36: Solution

# Lab 36: Solution

This file contains example answers and thought processes for the conceptual lab exercise on designing an enterprise agent strategy.

---

### Step 1: Identify the Agents (Example Ideas)

*   **Sales Team:**
    *   **Lead Qualifier Agent (ADK-built):** Connects to Salesforce to score new leads based on company size, industry, and budget.
    *   **Proposal Writer Agent (Agent Designer):** A no-code agent for the sales team to quickly generate standard sales proposals by filling in a few fields.

*   **Marketing Team:**
    *   **Idea Generation Agent (Pre-built):** Used for brainstorming new campaign slogans and themes.
    *   **Social Media Scheduler (ADK-built):** An agent that can draft and schedule social media posts, possibly connecting to a service like HubSpot.

*   **HR Team:**
    *   **Policy Assistant Agent (ADK-built):** Connects to the company's SharePoint to answer employee questions about HR policies.
    *   **Resume Screener (ADK-built):** An agent that can review resumes (PDF artifacts) and check them against a job description to provide a shortlist.

---

### Step 2: Plan the Data Connectors (Example Plan)

*   **Salesforce Connector:** Used by the `Lead Qualifier Agent` to access lead and account data.
*   **SharePoint Connector:** Used by the `Policy Assistant Agent` to access HR policy documents.
*   **Google Drive Connector:** Used by the `Resume Screener` to access resumes stored in a specific folder.
*   **HubSpot Connector:** Used by the `Social Media Scheduler` to post content.

---

### Step 3: Design the Governance and Access Control (Example Policy)

*   **`Lead Qualifier Agent`:**
    *   **Users:** `sales-team@company.com` group.
    *   **Managers:** `sales-managers@company.com` group (can view metrics and edit the agent).
*   **`Policy Assistant Agent`:**
    *   **Users:** All employees (`all-employees@company.com`).
    *   **Managers:** `hr-team@company.com`.
*   **Data Access:**
    *   The `Marketing Team` should **not** have direct access to the `Salesforce Connector`. If they need sales data, they should ask the `Lead Qualifier Agent`, which can provide summarized, non-sensitive information. This enforces a layer of abstraction and security.

---

### Step 4: Plan for Monitoring and Cost Management (Example Plan)

*   **`Lead Qualifier Agent` Metric:**
    *   **Key Metric:** "Lead Conversion Rate from Agent-Qualified Leads". This business-level metric measures the actual impact of the agent, not just its activity.
*   **`Policy Assistant Agent` Alert:**
    *   **Alert:** Set up an alert in Cloud Monitoring that triggers if the agent's "failure rate" (the percentage of queries where it couldn't find an answer) exceeds 15% over a 1-hour period. This could indicate a problem with the SharePoint connector or that the knowledge base is missing critical documents.
*   **Marketing Team Budget:**
    *   In Gemini Enterprise's cost management dashboard, create a budget for the "Marketing" cost center. Set a monthly limit of $500. Configure an alert to notify the `marketing-manager@company.com` when usage reaches 80% of the budget.
