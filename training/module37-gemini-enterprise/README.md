# Module 37: Gemini Enterprise (formerly AgentSpace)

## Theory

### From Development to Enterprise Operations

While the ADK is a powerful framework for **building** agents, **Gemini Enterprise** (formerly known as Google AgentSpace) is Google Cloud's platform for **deploying, managing, and governing** those agents at an enterprise scale.

Think of the relationship like this:
*   **ADK = Development**: The tools you use to write, test, and debug your agent's logic locally.
*   **Gemini Enterprise = Operations**: The cloud platform where you run your finished agents in a secure, scalable, and managed environment.

### What is Gemini Enterprise?

Gemini Enterprise is a fully managed platform that provides the infrastructure and tooling needed for enterprise-grade agentic systems. Its key features include:

*   **Managed Hosting:** Deploy your ADK-built agents to a serverless environment where Google handles all the scaling, security, and infrastructure management.
*   **Agent Governance:** Provides centralized control over all agents in your organization, including role-based access control (RBAC), audit logging, and compliance enforcement (e.g., for HIPAA or FedRAMP).
*   **Data Connectors:** Offers pre-built, secure connectors to popular enterprise data sources like Google Drive, SharePoint, Salesforce, and BigQuery. This allows your agents to be grounded in your company's private data.
*   **Agent Gallery:** A central, internal marketplace where you can publish your agents for others in your organization to discover, share, and use.
*   **Pre-built Google Agents:** Comes with a library of powerful, production-ready agents built by Google, such as the "Deep Research Agent" and "Idea Generation Agent," which your own agents can collaborate with.
*   **Agent Designer:** A no-code, web-based interface that allows non-developers to build and configure their own simple agents.

### The Deployment Workflow

The typical workflow is to build and test your agent locally using the ADK, and then deploy it to Gemini Enterprise for production use.

```text
+---------------------+      +----------------------+      +-----------------------+
|  1. Build & Test    |----->|  2. Deploy via ADK    |----->|  3. Manage & Monitor  |
|   Agent Locally     |      |  or Cloud Console     |      |   in Gemini Enterprise|
|     (using ADK)     |      +----------------------+      +-----------------------+
+---------------------+
```

By providing a clear separation between development (ADK) and operations (Gemini Enterprise), this model allows developers to focus on building great agent logic, while platform administrators can focus on ensuring security, compliance, and efficient operation at scale.
