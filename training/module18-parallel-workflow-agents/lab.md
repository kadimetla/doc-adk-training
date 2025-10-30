# Module 18: Parallel Processing with ParallelAgent

## Lab 18: Building a Smart Travel Planner

### Goal

In this lab, you will build a **Smart Travel Planner** that uses the **fan-out/gather** pattern. You will use a `ParallelAgent` to concurrently search for flights, hotels, and activities, and then use a final agent to synthesize the results into a complete travel itinerary.

### The Fan-Out/Gather Pattern

This lab implements a powerful and efficient architectural pattern.

```
        ┌──── Agent 1 (flights) ────┐
User ───┼──── Agent 2 (hotels) ─────┼──→ Merger Agent → Final Result
        └──── Agent 3 (activities) ─┘

      ParallelAgent (fast!)       SequentialAgent (combine)
```

### Step 1: Create the Project Structure

1.  **Create a new project:**
    ```shell
    adk create travel-planner
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd travel-planner
    ```

### Step 2: Assemble the Fan-Out/Gather Pipeline

**Exercise:** Open `agent.py`. The specialist agents (`flight_finder`, `hotel_finder`, `activity_finder`, and `itinerary_builder`) have been provided for you. Your task is to assemble them into a functioning fan-out/gather pipeline.

```python
# In agent.py (Starter Code)

from __future__ import annotations
from google.adk.agents import Agent, ParallelAgent, SequentialAgent

# ===== Specialist Agents (Provided for you) =====

flight_finder = Agent(name="flight_finder", model="gemini-2.5-flash", ..., output_key="flight_options")
hotel_finder = Agent(name="hotel_finder", model="gemini-2.5-flash", ..., output_key="hotel_options")
activity_finder = Agent(name="activity_finder", model="gemini-2.5-flash", ..., output_key="activity_options")
itinerary_builder = Agent(name="itinerary_builder", model="gemini-2.5-flash", ..., instruction="...{flight_options}...{hotel_options}...{activity_options}...")

# ============================================================================
# FAN-OUT: PARALLEL DATA GATHERING
# ============================================================================

# TODO: 1. Create a `ParallelAgent` named `parallel_search`.
# TODO: 2. Add the three "finder" agents to its `sub_agents` list so they
# run concurrently.
parallel_search = None

# ============================================================================
# COMPLETE FAN-OUT/GATHER PIPELINE
# ============================================================================

# TODO: 3. Create a `SequentialAgent` named `travel_planning_system`.
# This will be the main entry point for the entire workflow.
# TODO: 4. Add the `parallel_search` agent as the first step and the
# `itinerary_builder` agent as the second step.
travel_planning_system = None

# TODO: 5. Set the `root_agent` to be your `travel_planning_system`.
root_agent = None
```
*(Note: The full agent definitions are in the `lab-solution.md` if you need to inspect them, but you don't need to change them for this exercise.)*

### Step 3: Run and Test the Pipeline

1.  **Set up your `.env` file.**
2.  **Navigate to the parent directory** (`cd ..`) and start the Dev UI:
    ```shell
    adk web travel-planner
    ```
3.  **Interact with the pipeline:**
    *   Send a travel request, like: "Plan a 7-day vacation to Honolulu".
4.  **Examine the Trace View:**
    *   Expand the trace to see the `SequentialAgent` run.
    *   Inside, expand the `ParallelAgent` to see the three finder agents running concurrently.
    *   Observe the `itinerary_builder` running *after* the parallel step is complete.
    *   **Note:** Notice in the trace that the three finder agents start at roughly the same time. The total time for this step is determined by the slowest of the three, not the sum of all three, which is much more efficient!

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have successfully built a high-performance, multi-agent system using the fan-out/gather pattern. You have learned:
*   How to configure and use a `ParallelAgent` to run agents concurrently.
*   How to combine `ParallelAgent` and `SequentialAgent` to create efficient data-gathering and synthesis pipelines.
*   How to verify parallel execution in the Trace View.
