
---
title: Deployment to Agent Engine
---

## Module 35: Deploying to Agent Engine

## Overview

### Two Paths to Deployment

1.  **Accelerated Deployment (Recommended):** Use the official **[Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack)**. This GitHub template provides a pre-configured, production-ready foundation with CI/CD pipelines and Infrastructure as Code.
2.  **Standard Deployment (Manual):** Write a custom Python script using the Vertex AI SDK to package and deploy your agent.

The Accelerated Deployment workflow involves three phases: **Setup**, **Provision**, and **Deploy** (via `git push`), creating a seamless GitOps workflow.
