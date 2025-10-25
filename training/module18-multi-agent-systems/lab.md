# Module 17: Multi-Agent Systems - Complex Orchestration

## Lab 17: Building a Content Publishing System

### Goal

In this lab, you will build a sophisticated **Content Publishing System** that demonstrates a complex multi-agent architecture. You will combine sequential and parallel patterns to create a system that researches a topic from multiple angles concurrently and then synthesizes the findings into a final article.

This system will use the **Nested Sequential Pipelines** pattern.

### The Architecture

1.  **Phase 1: Parallel Research (Fan-Out)**
    Three independent, sequential pipelines will run concurrently:
    *   **News Pipeline:** Fetches current events using the `google_search` tool, then summarizes the key points.
    *   **Social Pipeline:** Gathers trending topics and sentiment from social media (simulated via `google_search`), then analyzes the insights.
    *   **Expert Pipeline:** Finds expert opinions on the topic (`google_search`), then extracts key quotes.

2.  **Phase 2: Sequential Content Creation (Gather)**
    A final sequential pipeline will run after all research is complete:
    *   **Writer Agent:** Combines the summaries from all three research pipelines into a single draft article.
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

### Step 2: Define the Multi-Agent System

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this complex architecture and understand how the different agents and workflows are composed:

1.  **The Research Agents:** Identify the three pairs of agents for the News, Social, and Expert pipelines. Notice how the first agent in each pair uses the `google_search` tool and saves its raw findings to state with an `output_key`.
2.  **The Research Pipelines:** Find the three `SequentialAgent` instances (`news_pipeline`, `social_pipeline`, `expert_pipeline`) that group the research agents into two-step workflows.
3.  **The Parallel Orchestrator:** Locate the `parallel_research` agent, which is a `ParallelAgent` that runs the three sequential research pipelines concurrently.
4.  **The Content Creation Agents:** Identify the `article_writer`, `article_editor`, and `article_formatter` agents. Trace how they use `output_key` and `{state_keys}` to pass the article from one stage to the next.
5.  **The Root Agent:** See how the final `content_publishing_system` is a `SequentialAgent` that combines the parallel research phase with the sequential creation phase.

### Step 3: Run and Test the System

1.  **Set up your API key** in the `.env` file.

2.  **Navigate to the parent directory** and start the Dev UI:
    ```shell
    cd ..
    adk web
    ```

3.  **Interact with the system:**
    *   Open `http://localhost:8080` and select "content_publisher".
    *   Give the system a topic to write about.

    **Try these prompts:**
    *   "Write an article about artificial intelligence in healthcare"
    *   "Create an article about renewable energy adoption"

4.  **Analyze the Trace:**
    The Trace view is essential for understanding this complex system.
    *   Expand the top-level `SequentialAgent`.
    *   You will see the `ParallelAgent` run first. Expand it to confirm that the three research pipelines (`NewsPipeline`, `SocialPipeline`, `ExpertPipeline`) all started at the same time.
    *   Expand one of the research pipelines (e.g., `NewsPipeline`) to see its two steps (e.g., `news_fetcher` and `news_summarizer`) run sequentially.
    *   After the `ParallelAgent` completes, you will see the three content creation agents run one after another.

### Lab Summary

You have successfully built and orchestrated a complex, production-quality multi-agent system. You have learned:
*   How to nest `SequentialAgent` workflows inside a `ParallelAgent`.
*   How to combine parallel and sequential patterns to create a fan-out/gather architecture.
*   How to use the built-in `google_search` tool to give agents access to real-world information.
*   How to analyze the execution of a complex, nested trace in the Dev UI.