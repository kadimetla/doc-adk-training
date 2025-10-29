---
sidebar_position: 3
---
## Module 33: Deployment to Google Kubernetes Engine (GKE)

## Lab 33: Solution

## Lab 33: Solution

This lab is a procedural tutorial. The primary "solution" is a successfully deployed agent running on a GKE cluster, accessible via a public IP address.

### Expected Outputs

#### `gcloud builds submit`
After a successful build, the output will confirm the image was created and pushed, showing the image name and creation time.

#### `kubectl apply`
When you apply the manifest, you should see a confirmation that the deployment and service were created:
```
deployment.apps/echo-agent-deployment created
service/echo-agent-service created
```

#### `kubectl get service --watch`
This command will first show `<pending>` under the `EXTERNAL-IP` column. After a few minutes, GKE will provision a load balancer and the output will change to show a public IP address:
```
NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
echo-agent-service   LoadBalancer   10.44.192.123   34.123.45.67    80:30123/TCP   2m30s
```
The `EXTERNAL-IP` is the public address of your agent.

### Expected Behavior

When you navigate to the `http://<EXTERNAL-IP>` address in your browser, you should see the ADK Developer UI. You can interact with the "Echo" agent, and it will respond as it did locally.

### Troubleshooting Common GKE Errors

*   **`ImagePullBackOff` or `ErrImagePull`:**
    *   **Problem:** The GKE cluster cannot pull the container image from Artifact Registry. This is almost always a permissions issue.
    *   **Solution:** Ensure the Artifact Registry API is enabled. Verify that the GKE node service account has the `Artifact Registry Reader` role. GKE Autopilot clusters usually handle this automatically, but Standard clusters may require manual configuration. Also, double-check that the image path in your `deployment.yaml` is exactly correct.

*   **`CrashLoopBackOff`:**
    *   **Problem:** The container is starting and then immediately crashing. This is an error within the container itself.
    *   **Solution:** Use `kubectl logs deployment/echo-agent-deployment` to view the logs from the crashing pod. The logs will show the error message from the `adk web` command (e.g., a missing environment variable, a syntax error in an agent file, etc.).

*   **Service IP remains `<pending>`:**
    *   **Problem:** GKE is having trouble creating the external load balancer. This can happen due to project quota issues or incorrect network configurations.
    *   **Solution:** Use `kubectl describe service echo-agent-service` to see the events associated with the service. The "Events" section at the bottom will usually contain a detailed error message from the cloud load balancer controller explaining the problem.
