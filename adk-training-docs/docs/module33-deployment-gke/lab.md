# Module 26: Deployment to Google Kubernetes Engine (GKE)

## Lab 26: Manually Deploying an Agent to GKE

### Goal

In this lab, you will learn the fundamental process of deploying an ADK agent to Google Kubernetes Engine (GKE). Walking through the manual steps of creating a `Dockerfile`, building a container, and writing Kubernetes manifests provides a deep understanding of the deployment process.

### Prerequisites

*   A Google Cloud Project with billing enabled.
*   Google Cloud CLI installed and authenticated.
*   `kubectl` command-line tool installed (`gcloud components install kubectl`).
*   Docker running on your local machine.

### Step 1: Prepare Your Project

1.  **Copy the Echo Agent:**
    Make a fresh copy of the `echo-agent` from Module 3.
    ```
    cp -r echo-agent/ gke-echo-agent/
    cd gke-echo-agent/
    ```

2.  **Set Environment Variables:**
    In your terminal, set these variables. **Replace `YOUR_PROJECT_ID` with your actual GCP Project ID.**
    ```
    export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
    export GOOGLE_CLOUD_LOCATION=us-central1
    ```

3.  **Enable APIs:**
    ```
    gcloud services enable \
        container.googleapis.com \
        artifactregistry.googleapis.com \
        cloudbuild.googleapis.com
    ```

### Step 2: Containerize the Agent

1.  **Create `requirements.txt`:**
    ```
    echo "google-adk" > requirements.txt
    ```

2.  **Create the `Dockerfile`:**
    Create a file named `Dockerfile` and add the following:
    ```
    FROM python:3.11-slim
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    EXPOSE 8080
    CMD ["adk", "web", "--host", "0.0.0.0"]
    ```

### Step 3: Build and Push the Container Image

1.  **Create an Artifact Registry Repository:**
    ```
    gcloud artifacts repositories create adk-images \
        --repository-format=docker \
        --location=\$GOOGLE_CLOUD_LOCATION
    ```

2.  **Build and Push with Cloud Build:**
    ```
    gcloud builds submit \
        --tag \${GOOGLE_CLOUD_LOCATION}-docker.pkg.dev/\${GOOGLE_CLOUD_PROJECT}/adk-images/echo-agent:v1
    ```

### Step 4: Create and Deploy to a GKE Cluster

1.  **Create a GKE Autopilot Cluster:**
