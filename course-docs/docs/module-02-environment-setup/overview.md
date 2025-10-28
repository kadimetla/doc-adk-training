
---
title: Environment Setup
---

## Module 2: Setting Up Your Development Environment

## Overview

### The Importance of a Clean Environment

Before diving into building agents, it's crucial to set up a proper development environment. A well-structured environment ensures that your project's dependencies are isolated, preventing conflicts with other Python projects on your system. It makes your project self-contained and easily reproducible by others.

The standard and recommended way to achieve this in Python is by using a **virtual environment**.

### What is a Virtual Environment?

A virtual environment is an isolated directory that contains a specific version of Python and its own set of installed packages. When you activate a virtual environment, your system's shell is configured to use the Python interpreter and packages from that directory, rather than the global ones.

**Key Benefits:**

*   **Dependency Isolation:** You can install the exact versions of libraries your project needs (like `google-adk`) without affecting any other project.
*   **Reproducibility:** You can easily generate a `requirements.txt` file that lists all the packages and their exact versions.
*   **System Cleanliness:** It keeps your global Python installation clean and free from project-specific packages.

### Authenticating with Google Cloud

To use the ADK, your agent will need to communicate with Google's services. The **Google Cloud CLI (gcloud)** is the primary tool for handling authentication. By running `gcloud auth application-default login`, you grant your local environment the necessary permissions to access Google Cloud APIs.
