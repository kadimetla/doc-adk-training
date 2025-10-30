# Module 18: Parallel Processing with ParallelAgent

## Lab 18: Solution

This file contains the complete code for the `agent.py` script in the Smart Travel Planner lab.

### `travel-planner/agent.py`

```python
from __future__ import annotations

from google.adk.agents import Agent, ParallelAgent, SequentialAgent

# ============================================================================ 
# PARALLEL SEARCH AGENTS
# ============================================================================ 

# ===== Parallel Branch 1: Flight Finder =====
flight_finder = Agent(
    name="flight_finder",
    model="gemini-2.5-flash",
    description="Searches for available flights",
    instruction=(
        "You are a flight search specialist. Based on the user's travel request, "
        "search for available flights.\n"
        "\n"
        "Provide 2-3 flight options with:\n"
        "- Airline name\n"
        "- Departure and arrival times\n"
        "- Price range\n"
        