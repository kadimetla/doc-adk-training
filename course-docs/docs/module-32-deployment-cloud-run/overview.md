
---
title: Deployment to Cloud Run
---

## Module 32: Deployment to Cloud Run

## Overview

### Introducing Google Cloud Run

Google Cloud Run is a **fully managed, serverless platform** designed to run containers. You simply provide your container, and Cloud Run handles everything else: provisioning, scaling, load balancing, and security.

### The Deployment Process with `adk deploy cloud_run`

The ADK provides a powerful command-line tool that automates the entire deployment process: `adk deploy cloud_run`.

When you run this command, it:

1.  Packages your code.
2.  Builds a container image.
3.  Pushes the image to a registry.
4.  Creates a Cloud Run service.
5.  Deploys the image to the service.

The result is a publicly accessible HTTPS endpoint for your agent, all from a single command.
