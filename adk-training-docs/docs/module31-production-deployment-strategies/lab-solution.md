---
sidebar_label: Lab Solution
sidebar_position: 3
---
sidebar_label: Lab Solution
## Module 31: Production Deployment Strategies

# Lab 31: Solution

# Lab 31: Solution

This file contains the recommended solutions and reasoning for the scenario-based exercise in the lab.

---
sidebar_label: Lab Solution

#### **Scenario 1: The Startup MVP**

*   **Recommendation:** ✅ **Cloud Run**
*   **Justification:** This scenario is the primary use case for Cloud Run. The key drivers are **speed** and **low cost**. The `adk deploy cloud_run` command allows the team to deploy in minutes without any DevOps expertise. The serverless, pay-per-use model is perfect for a startup managing its burn rate, and the platform's automatic security (HTTPS, DDoS, IAM) is more than sufficient for an MVP.

---
sidebar_label: Lab Solution

#### **Scenario 2: The Government Contractor**

*   **Recommendation:** ✅✅ **Agent Engine**
*   **Justification:** The non-negotiable requirement is **FedRAMP compliance**. Agent Engine is the only platform listed that provides this out of the box as a managed service. This eliminates a massive amount of complex and expensive compliance work the contractor would otherwise have to do themselves. The automatic audit logging and sandboxed execution are also critical features for this use case.

---
sidebar_label: Lab Solution

#### **Scenario 3: The FinTech Enterprise**

*   **Recommendation:** ✅ **GKE (Google Kubernetes Engine)**
*   **Justification:** The company already has a significant investment in Kubernetes. The requirements for **full control over the network** (via NetworkPolicies) and **custom hardware** (GPUs) are classic drivers for choosing Kubernetes over a more abstracted serverless platform. While GKE has a higher operational cost and complexity, it provides the flexibility and control this enterprise requires for its complex, high-performance computing environment.

---
sidebar_label: Lab Solution

#### **Scenario 4: The University Integration**

*   **Recommendation:** ⚙️ **Custom Server on Cloud Run**
*   **Justification:** The key requirement is **custom authentication (LDAP)**, which is not natively supported by Cloud Run's IAM or Agent Engine's OAuth. This forces the team to build a custom FastAPI server where they can implement their own LDAP authentication middleware. However, they still want a serverless, cost-effective platform. The best solution is to deploy this custom server to **Cloud Run**. This gives them the platform benefits of serverless scaling and management while allowing for the specific application-level authentication logic they need.
