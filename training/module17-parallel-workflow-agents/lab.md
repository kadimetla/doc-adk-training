# Module 16: Parallel Processing with ParallelAgent

## Lab 16: Building a Smart Travel Planner

### Goal

In this lab, you will build a **Smart Travel Planner** that uses the **fan-out/gather** pattern. You will use a `ParallelAgent` to concurrently search for flights, hotels, and activities, and then use a final agent in a `SequentialAgent` to synthesize the results into a complete travel itinerary.

### Step 1: Create the Project Structure

1.  **Navigate to your training directory** and create a new project.
    ```shell
    cd /path/to/your/adk-training
    adk create travel-planner
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd travel-planner
    ```

### Step 2: Define the Travel Planning Agents

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this code and understand its key components:

1.  **The Parallel Search Agents:**
    *   `flight_finder`, `hotel_finder`, `activity_finder`.
    *   Each of these is a standard `LlmAgent` with a specific task.
    *   Crucially, each one has a unique `output_key` to avoid overwriting state (`flight_options`, `hotel_options`, `activity_options`).

2.  **The `ParallelAgent` ("Fan-Out"):**
    *   The `parallel_search` agent is a `ParallelAgent`.
    *   Its `sub_agents` list includes the three finder agents. When this agent runs, all three will execute concurrently.

3.  **The Itinerary Builder Agent ("Gather"):**
    *   The `itinerary_builder` is a standard `LlmAgent`.
    *   Its `instruction` is designed to read the outputs from all three parallel agents (`{flight_options}`, `{hotel_options}`, `{activity_options}`) and create a final summary.

4.  **The `SequentialAgent` (The Main Pipeline):**
    *   The `travel_planning_system` is a `SequentialAgent` that orchestrates the entire workflow.
    *   It first runs the `parallel_search` agent.
    *   Once all parallel searches are complete, it runs the `itinerary_builder` agent.

### Step 3: Run and Test the Pipeline

1.  **Set up your API key** in the `.env` file.

2.  **Navigate to the parent directory** of your `travel-planner` project.
    ```shell
    cd ..
    ```

3.  **Start the Dev UI:**
    ```shell
    adk web
    ```

4.  **Interact with the pipeline:**
    *   Open `http://localhost:8080` and select "travel_planner".
    *   Send a message to trigger the pipeline.

    **Try these prompts:**
    *   "Plan a 3-day trip to Paris"
    *   "I need a 5-day Tokyo trip for 2 people. Budget-friendly options preferred."

5.  **Examine the Trace View:**
    *   Expand the trace to see the `SequentialAgent` running.
    *   Inside, you will first see the `ParallelAgent`. Expand it to see that all three finder agents started at roughly the same time.
    *   After the `ParallelAgent` completes, you will see the `itinerary_builder` agent execute. Inspect its prompt to see how it received the combined data from the state.

### Lab Summary

You have successfully built a high-performance, multi-agent system using the fan-out/gather pattern. You have learned:
*   How to configure and use a `ParallelAgent` to run agents concurrently.
*   The importance of using unique `output_key` values for parallel agents.
*   How to combine `ParallelAgent` and `SequentialAgent` to create efficient data-gathering and synthesis pipelines.
*   How to verify parallel execution in the Trace View.