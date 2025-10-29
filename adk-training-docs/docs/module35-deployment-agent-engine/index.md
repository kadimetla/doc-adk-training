---
sidebar_position: 1
---
# Module 35: Deploying to Agent Engine

## Theory

### From Local Development to Production-Grade Deployment

Deploying an agent involves packaging its code and running it on a scalable, reliable, and managed platform. **Google Cloud's Agent Engine** is a fully managed service in Vertex AI designed for this, handling server management, scaling, and security.

### Two Paths to Deployment

1.  **Accelerated Deployment (Recommended Best Practice):**
    *   **Method:** Use the official **[Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack)**. This is a GitHub template and command-line tool that provides a pre-configured, production-ready foundation for your agent.
    *   **Key Features:** It includes pre-built CI/CD pipelines using Cloud Build, Infrastructure as Code (IaC) with Terraform, and automated scripts for a seamless deployment process.
    *   **Best For:** All new projects. It establishes best practices for security, reliability, and maintainability from the start.

2.  **Standard Deployment (Manual):**
    *   **Method:** Write a custom Python script using the Vertex AI SDK to package and deploy your agent.
    *   **Best For:** Learning the underlying mechanics of deployment or for legacy projects.

This module's lab will guide you through both methods.

### The Accelerated Deployment Workflow

The Agent Starter Pack streamlines the path to production into three distinct phases:

1.  **Setup (`./setup.sh`):** This initial, one-time script connects your GitHub repository to your Google Cloud project. It sets up the necessary IAM permissions and creates a Cloud Build trigger that listens for changes to your `main` branch.

2.  **Provision (`gcloud builds submit --config=cloudbuild-terraform.yaml`):** This command runs a Cloud Build pipeline that uses Terraform to create all the necessary cloud infrastructure for your agent. This includes the Artifact Registry for your container images, the Cloud Run or Agent Engine service, and the necessary service accounts and permissions. This step is typically run once per environment (e.g., dev, staging, prod).

3.  **Deploy (`git push`):** This is the step you will perform most often. Every time you push new code to your `main` branch, the Cloud Build trigger you created during setup automatically runs. It packages your agent, builds a new container image, and deploys it to the infrastructure you created in the provision step. This creates a seamless GitOps workflow.