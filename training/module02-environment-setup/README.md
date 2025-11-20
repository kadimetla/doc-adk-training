---
sidebar_position: 1
title: "Module 2: Setting Up Your Development Environment"
---

# Module 2: Setting Up Your Development Environment

## Theory

### The Importance of a Clean Environment

Before diving into building agents, it's crucial to set up a proper development environment. A well-structured environment ensures that your project's dependencies are isolated, preventing conflicts with other Python projects on your system. It makes your project self-contained and easily reproducible by others.

The standard and recommended way to achieve this in Python is by using a **virtual environment**.

### What is a Virtual Environment?

A virtual environment is an isolated directory that contains a specific version of Python and its own set of installed packages. When you activate a virtual environment, your system's shell is configured to use the Python interpreter and packages from that directory, rather than the global ones.

**Key Benefits:**

*   **Dependency Isolation:** You can install the exact versions of libraries your project needs (like `google-adk`) without affecting any other project. If Project A needs version 1.0 of a library and Project B needs version 2.0, a virtual environment prevents them from clashing.
*   **Reproducibility:** You can easily generate a `requirements.txt` file that lists all the packages and their exact versions using the command `pip freeze > requirements.txt`. Anyone else can then create an identical environment by installing the packages from that file.
*   **System Cleanliness:** It keeps your global Python installation clean and free from project-specific packages, which helps prevent system-wide issues.

In this course, we will be using `venv`, the standard virtual environment tool that comes built-in with Python 3.

### Authentication: Connecting to Google Services

To use the ADK, your agent needs to communicate with Google's services to access the Gemini Large Language Models. There are two primary ways to authenticate.

#### Option A: API Key (Recommended for Beginners)

The quickest way to get started is by using an API key from **Google AI Studio**.

1.  **Get an API Key:** Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a new API key.
2.  **Set an Environment Variable:** You will then provide this key to your application through an environment variable named `GOOGLE_API_KEY`. This is typically done by creating a `.env` file in your project directory.

This method is simple, fast, and doesn't require a full Google Cloud project, making it ideal for learning and prototyping.

#### Option B: Google Cloud Authentication (Advanced)

For production applications or for users who are already deeply integrated with Google Cloud, the standard authentication method is to use **Application Default Credentials (ADC)**.

The **Google Cloud CLI (gcloud)** is the primary tool for handling this. By running a simple command (`gcloud auth application-default login`), you grant your local development environment the necessary permissions to access Google Cloud APIs (like the Vertex AI API) on your behalf.

When you run your ADK agent, the underlying Google client libraries automatically find and use these credentials, so you don't have to manage API keys directly in your code. This method is more secure and robust for production environments.

In the following lab, you will put these concepts into practice by creating a virtual environment, installing the ADK, and setting up your chosen authentication method.

### Key Takeaways
- A **virtual environment** is essential for isolating project dependencies and ensuring reproducibility.
- The `venv` module is the standard tool for creating virtual environments in Python.
- You can authenticate with Google services using either a simple **API Key** from Google AI Studio or through **Google Cloud Authentication** with the `gcloud` CLI.
- Using a `.env` file to manage your API key or project settings is a standard and secure practice.