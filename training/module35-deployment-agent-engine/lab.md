# Module 35: Deploying to Agent Engine

## Lab 35: Deploying the Calculator Agent

### Goal
In this lab, you will deploy the `calculator-agent` to Google Cloud's Agent Engine using both the recommended Accelerated method and the manual Standard method.

### Prerequisites
*   A Google Cloud Project with billing enabled.
*   `gcloud` CLI installed and authenticated (`gcloud auth application-default login`).
*   A GCS bucket for staging files (`gsutil mb -p YOUR_PROJECT_ID -l us-central1 gs://YOUR_UNIQUE_BUCKET_NAME`).
*   **Required APIs:** Ensure the following APIs are enabled in your project:
    *   Vertex AI API
    *   Cloud Build API
    *   Artifact Registry API
    *   Cloud Resource Manager API
*   **Set GCP Project:** Before starting, ensure your `gcloud` CLI is configured to the correct project:
    ```shell
    gcloud config set project YOUR_PROJECT_ID
    ```

---

## Part 1: Accelerated Deployment (Recommended)

This method uses the official [Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) to deploy your agent with a production-ready CI/CD pipeline using Terraform and Cloud Build.

### Step 1: Setup
1.  **Use the Template:** Go to the [Agent Starter Pack repository](https://github.com/GoogleCloudPlatform/agent-starter-pack) and click **"Use this template"** to create a new repository in your own GitHub account.
2.  **Clone Your New Repository:** Clone the repository you just created to your local machine.
3.  **Connect to Google Cloud:** In your terminal, run the interactive setup script. This will guide you through connecting your GitHub repository to Google Cloud Build.
    ```shell
    ./setup.sh
    ```
4.  **Add Your Agent Code:** Copy the `calculator-agent` project from `module08-intro-custom-function-tools` into the `src/` directory of your starter pack repository.

### Step 2: Provision Infrastructure
This step uses Terraform and Cloud Build to create the necessary cloud infrastructure (like Artifact Registry, Cloud Run services, and IAM permissions).

1.  **Configure Terraform:**
    *   Rename `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars`.
    *   Edit `terraform/terraform.tfvars` and fill in your `project_id`, `region`, and a unique `app_name` (e.g., "calculator-agent").
2.  **Run the Provisioning Build:**
    ```shell
    gcloud builds submit --config=cloudbuild-terraform.yaml
    ```
    This command executes the Terraform plan, which may take several minutes.

### Step 3: Deploy the Agent
Once the infrastructure is provisioned, you can deploy your agent by simply pushing your code to the `main` branch. The Cloud Build trigger you configured in the setup step will automatically build and deploy your agent.

1.  **Commit and Push Your Code:**
    ```shell
    git add .
    git commit -m "Add calculator agent"
    git push origin main
    ```
2.  **Monitor the Build:** Go to the Cloud Build section in your Google Cloud Console to watch the deployment pipeline run.
3.  **Find Your Agent:** Once the build is complete, navigate to **Vertex AI -> Agent Engine** in the Cloud Console to find your deployed agent and its ID.

---

## Part 2: Standard Deployment (Manual)

This method involves writing a custom Python script to deploy the agent, which is useful for understanding the underlying mechanics.

### Step 1: Prepare the Agent Project
1.  Copy the `calculator-agent` project from `module09-intro-custom-function-tools` to a new directory named `deploy-calculator`.
    ```shell
    cp -r ../module09-intro-custom-function-tools/calculator-agent deploy-calculator
    cd deploy-calculator
    ```
2.  Create a `requirements.txt` file:
    ```shell
    echo "google-adk>=1.0.0" > requirements.txt
    echo "google-cloud-aiplatform[adk,agent-engines]>=1.111.0" >> requirements.txt
    ```
3.  Create an empty `__init__.py` file in the `calculator` directory to make it a Python package:
    ```shell
    touch calculator/__init__.py
    ```
4.  Update the `pyproject.toml` (if it exists) or ensure your environment has the necessary deployment dependencies. For this lab, we'll rely on `requirements.txt`.
5.  **Clarify STAGING_BUCKET:** The `STAGING_BUCKET` name must be globally unique across all Google Cloud projects. Choose a name that is unlikely to be taken by others.

### Step 2: Create the Deployment Script
1.  Create a `deployment/deploy.py` file.
2.  **Action:** Add the code from the `lab-solution.md` and configure it with your `PROJECT_ID`, `LOCATION`, and `STAGING_BUCKET`.

### Step 3: Deploy the Agent
Run the deployment script. This will take several minutes.
```shell
python deployment/deploy.py
```

### Step 4: Interact with the Deployed Agent
1.  Create an `interact.py` script (code available in `lab-solution.md`).
2.  **Action:** Configure the script with your `PROJECT_ID`, `LOCATION`, and the `AGENT_ENGINE_ID` from the deployment output.
3.  Run the script to test your deployed agent:
    ```shell
    python interact.py
    ```
    You should see the agent respond with the correct answer.

### Lab Summary
You have successfully deployed an agent to Agent Engine using both the recommended automated method and the manual method. You have learned:
*   How to use the Agent Starter Pack for accelerated, best-practice deployments.
*   How to write a custom deployment script using the Vertex AI SDK.
*   How to interact with a deployed agent programmatically.

### Cleanup (Important!)

Agent Engine deployments and GCS buckets can incur costs if left running. It is crucial to delete the resources you created after completing the lab.

#### For Part 1 (Accelerated Deployment):
1.  **Delete the GitHub Repository:** Delete the repository you created from the Agent Starter Pack template.
2.  **Delete Cloud Build Triggers and Service Accounts:** The `setup.sh` script creates Cloud Build triggers and service accounts. You may need to manually delete these from the Cloud Build section of the Google Cloud Console if they are not automatically removed with the repository.
3.  **Delete Terraform-managed resources:** If you ran the Terraform provisioning, you might need to run `terraform destroy` from your local `terraform` directory within the starter pack, or manually delete the resources (Artifact Registry, Agent Engine instance) from the Google Cloud Console.

#### For Part 2 (Standard Deployment):
1.  **Delete the Agent Engine Instance:**
    ```shell
    gcloud ai agent-engines delete YOUR_AGENT_ENGINE_ID \
        --region=$LOCATION \
        --async # Runs in background
    ```
2.  **Delete the GCS Staging Bucket:**
    ```shell
    gsutil rm -r gs://YOUR_UNIQUE_BUCKET_NAME
    ```
3.  **Delete the `deploy-calculator` directory:**
    ```shell
    cd ..
    rm -rf deploy-calculator
    ```