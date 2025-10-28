
---
title: Deployment to GKE
---

## Module 33: Deployment to Google Kubernetes Engine (GKE)

## Overview

### When You Need More Control

For complex applications that require specific hardware (like GPUs), fine-grained control over networking, or need to run alongside other services in a private network, the industry-standard solution is **Kubernetes**.

### Google Kubernetes Engine (GKE)

**Google Kubernetes Engine (GKE)** is a managed Kubernetes service that takes care of the heavy lifting of managing a cluster's infrastructure, so you can focus on deploying your applications.

### Cloud Run vs. GKE

| Feature | Cloud Run | GKE |
| :--- | :--- | :--- |
| **Abstraction** | High (Serverless) | Medium (Managed K8s) |
| **Control** | Less | Full |
| **Complexity** | Very low | Moderate to high |
