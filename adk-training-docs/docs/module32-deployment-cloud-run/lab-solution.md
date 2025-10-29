sidebar_position: 3
---
## Module 32: Deployment to Cloud Run

# Lab 32: Solution

# Lab 32: Solution

This lab is a procedural tutorial. The primary "solution" is a successfully deployed agent and a public URL.

### Expected Output

After running the `adk deploy cloud_run` command and waiting for the build and deployment process to complete, you should see output in your terminal that looks similar to this:

```
...
✓ Deploying new service... Done.
  ✓ Creating new revision...
  ✓ Routing traffic...
  ✓ Setting IAM Policy...
Done.
Service [customer-support-cloud] revision [customer-support-cloud-00001-...] has been deployed and is serving 100 percent of traffic.
Service URL: https://customer-support-cloud-xxxxxxxxxx-uc.a.run.app
```

The most important part is the **Service URL**.

### Expected Behavior

1.  When you open the **Service URL** in your browser, you should see the ADK Developer UI, identical to the one you have been using locally.

2.  When you interact with the agent, it should correctly route your requests to the appropriate sub-agent:
    *   **You:** "I have a question about my invoice."
    *   **Agent (billing_agent):** "I can help with that. What is your question about your invoice?"
    *   **You:** "My app is not loading."
    *   **Agent (tech_support_agent):** "I understand you're having trouble with the app. Can you tell me what error message you are seeing?"

### Troubleshooting Common Errors

*   **`PERMISSION_DENIED` on `iam.googleapis.com`:**
    *   **Problem:** Your user account does not have permission to set IAM policies, which is required to make the Cloud Run service public.
    *   **Solution:** Ensure your Google Cloud user account has the `Owner` or `Editor` role in the project.

*   **`PERMISSION_DENIED` on `cloudbuild.googleapis.com` or `artifactregistry.googleapis.com`:**
    *   **Problem:** The Cloud Build service account, which builds the container, doesn't have permission to push to Artifact Registry or deploy to Cloud Run. The `adk deploy` command attempts to set these permissions automatically, but may fail if your user account lacks sufficient privileges.
    *   **Solution:** Manually grant the `Cloud Build Service Account` the `Artifact Registry Writer` and `Cloud Run Admin` roles in the IAM section of the Google Cloud Console.

*   **Deployment fails with a generic error:**
    *   **Solution:** Go to the Google Cloud Console, navigate to "Cloud Build", and look at the build history. Find the failed build and inspect its logs. The logs will provide a detailed error message explaining why the container build failed (e.g., a typo in `requirements.txt`, a syntax error in a Python file, etc.).
