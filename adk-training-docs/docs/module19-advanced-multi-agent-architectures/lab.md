---
sidebar_position: 2
---
# Module 18: Advanced Multi-Agent Architectures

## Lab 18: Building a Content Publishing System

### Goal

In this lab, you will build a sophisticated **Content Publishing System** that demonstrates a complex multi-agent architecture. You will combine sequential and parallel patterns to create a system that researches a topic from multiple angles concurrently and then synthesizes the findings into a final article. This is a capstone exercise for the multi-agent section of the course.

### The Architecture

1.  **Phase 1: Parallel Research (Fan-Out)**
    Three independent, sequential pipelines will run concurrently:
    *   **News Pipeline:** Fetches current events, then summarizes the key points.
    *   **Social Pipeline:** Gathers trending topics, then analyzes the insights.
    *   **Expert Pipeline:** Finds expert opinions, then extracts key quotes.

2.  **Phase 2: Sequential Content Creation (Gather)**
    A final sequential pipeline will run after all research is complete:
    *   **Writer Agent:** Combines the summaries from all three research pipelines into a draft article.
    *   **Editor Agent:** Reviews and improves the draft.
    *   **Formatter Agent:** Formats the final article for publication.

### Step 1: Create the Project Structure

1.  **Create the agent project:**
    ```shell
    adk create content-publisher
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd content-publisher
    ```

### Step 2: Assemble the Multi-Agent System

**Exercise:** Open `agent.py`. All eight of the individual specialist agents (e.g., `news_fetcher`, `news_summarizer`, `article_writer`, etc.) have been provided for you. Your task is to assemble them into the complete, multi-level architecture described above.

```python
# In agent.py (Starter Code)

from __future__ import annotations
from google.adk.agents import Agent, ParallelAgent, SequentialAgent
from google.adk.tools import google_search

# ===== All 8 Specialist Agent Definitions Are Provided Here... =====
# (news_fetcher, news_summarizer, social_monitor, sentiment_analyzer, 
#  expert_finder, quote_extractor, article_writer, article_editor, 
#  article_formatter)

# =====================================================
# ASSEMBLE THE MULTI-AGENT SYSTEM
# =====================================================

# TODO: 1. Create the three sequential research pipelines.
# - `news_pipeline` should contain `news_fetcher` then `news_summarizer`.
# - `social_pipeline` should contain `social_monitor` then `sentiment_analyzer`.
# - `expert_pipeline` should contain `expert_finder` then `quote_extractor`.
news_pipeline = SequentialAgent(...)
social_pipeline = SequentialAgent(...)
expert_pipeline = SequentialAgent(...)

# TODO: 2. Create the parallel research phase. This `ParallelAgent` should
# contain the three sequential pipelines you just defined.
parallel_research = ParallelAgent(...)

# TODO: 3. Create the final `SequentialAgent` for the entire system.
# It should run the `parallel_research` phase first, followed by the
# `article_writer`, `article_editor`, and `article_formatter` in order.
content_publishing_system = SequentialAgent(...)

# TODO: 4. Set the `root_agent` to be your final `content_publishing_system`.
root_agent = None
```
*(Note: The full agent definitions are in the `lab-solution.md` if you need to inspect them.)*

### Step 3: Run and Test the System

1.  **Set up your `.env` file** and start the Dev UI: `adk web`
2.  **Interact with the system:**
    *   Select "content_publisher" and give it a topic, like: "The future of electric vehicles".
3.  **Analyze the Trace:**
    *   This is the most important step. Expand the trace to see the nested structure. Verify that the three research pipelines run in parallel, and that the content creation agents run sequentially after the parallel phase is complete.

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have successfully built and orchestrated a complex, production-quality multi-agent system. You have learned:
*   How to nest `SequentialAgent` workflows inside a `ParallelAgent`.
*   How to combine parallel and sequential patterns to create a fan-out/gather architecture.
*   How to analyze the execution of a complex, nested trace in the Dev UI.