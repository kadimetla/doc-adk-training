# Module 21: Handling Files with Artifacts

## Lab 21: Building a Document Processing Pipeline

### Goal

In this lab, you will build a **Document Processor** agent that uses a multi-step pipeline to process a file, saving the output of each step as a versioned artifact. This will teach you how to build complex, auditable file management workflows.

### The Pipeline

1.  **Extract Text:** Takes a source document name and saves its cleaned text as `doc_extracted.txt`.
2.  **Summarize:** Reads the extracted text and saves a summary as `doc_summary.txt`.
3.  **Translate:** Reads the extracted text and saves a translation as `doc_Spanish.txt`.
4.  **Report:** Reads all the previously generated artifacts and compiles them into a final `FINAL_REPORT.md`.

### Step 1: Create the Agent Project

1.  **Create the agent project:**
    ```shell
    adk create doc-processor
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd doc-processor
    ```

### Step 2: Implement the Artifact Pipeline

**Exercise:** Open `agent.py` and replace its contents with the full solution from the `lab-solution.md`.

Your task is to study this code and understand how the artifact pipeline is constructed:

1.  **`DocumentProcessor` Class:** This class encapsulates the agent and its tools.
2.  **Async Tools:** Notice that all the tool functions (`extract_text`, `summarize_document`, etc.) are defined as `async def`. This is required for artifact operations.
3.  **`tool_context: ToolContext`:** Each tool takes the `ToolContext` as a parameter to get access to the artifact methods.
4.  **`await tool_context.save_artifact()`:** In each tool, see how the output of a step is saved as a new artifact. Note the use of `await`.
5.  **`await tool_context.load_artifact()`:** In later steps, like `summarize_document`, notice how the tool loads the output from a previous step to use as its input.
6.  **Agent Instruction:** The agent's prompt guides it to call the tools in the correct sequence to form the pipeline.

### Step 3: Run and Test the Pipeline

1.  **Set up your `.env` file** with your API key or Vertex AI project.

2.  **Run the agent script directly:**
    The solution file includes a `main` block that will run the full pipeline for a sample document.

    ```shell
    uv run python agent.py
    ```

3.  **Analyze the Output:**
    The script will print the agent's final response, which should be a confirmation that the final report was created.

    More importantly, if you were running this in the Dev UI, you could inspect the trace and see the chain of tool calls. You could also use the "Artifacts" tab (or the blue buttons in the chat) to view the content of each of the generated files: the extracted text, the summary, the translation, and the final markdown report.

### Lab Summary

You have successfully built a powerful, multi-step document processing agent that uses artifacts for state management and auditability.

You have learned to:
*   Write `async` tools that can save and load artifacts.
*   Use `await tool_context.save_artifact()` to create versioned files.
*   Use `await tool_context.load_artifact()` to read previously created files.
*   Chain tools together to create a pipeline where the output of one step is the input to the next.
*   Understand the importance of versioning for creating auditable workflows.
