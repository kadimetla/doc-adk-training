---
sidebar_position: 2
---
# Module 21: Handling Files with Artifacts

## Lab 21: Building a Document Processing Pipeline

### Goal

In this lab, you will build a **Document Processor** agent that uses a multi-step pipeline to process a file, saving the output of each step as a versioned artifact. This will teach you how to build complex, auditable file management workflows.

### The Pipeline

1.  **Extract Text:** Takes a source document name and saves its cleaned text as an artifact.
2.  **Summarize:** Reads the extracted text artifact and saves a summary as a new artifact.
3.  **Report:** Reads all previously generated artifacts and compiles them into a final report artifact.

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

**Exercise:** Open `agent.py`. A skeleton with the tool function signatures is provided. Your task is to implement the logic for each tool using the `tool_context` to save and load artifacts. Remember that all artifact operations are `async` and must be `await`ed.

```python
# In agent.py (Starter Code)

from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from google.adk.tools.tool_context import ToolContext
from google.genai import types

# ============================================================================ 
# ARTIFACT-HANDLING TOOLS
# ============================================================================ 

async def extract_text(document_name: str, tool_context: ToolContext) -> str:
    """Extracts and cleans text from a document, saving it as an artifact."""
    extracted_content = f"EXTRACTED AND CLEANED TEXT FROM DOCUMENT: {document_name}"
    
    # TODO: 1. Create a types.Part from the `extracted_content`.
    # TODO: 2. Save the part as an artifact named f"{document_name}_extracted.txt".
    # TODO: 3. Return a confirmation message including the new version number.
    return "Extraction complete."

async def summarize_document(document_name: str, tool_context: ToolContext) -> str:
    """Generates a summary of a document from its extracted text artifact."""
    # TODO: 1. Load the latest version of the f"{document_name}_extracted.txt" artifact.
    # TODO: 2. If the artifact is not found, return a helpful error message.
    
    summary_content = f"This is a concise summary of the document '{document_name}'."
    
    # TODO: 3. Create a types.Part from the `summary_content`.
    # TODO: 4. Save the summary as a new artifact named f"{document_name}_summary.txt".
    # TODO: 5. Return a confirmation message.
    return "Summarization complete."

async def create_report(document_name: str, tool_context: ToolContext) -> str:
    """Creates a final report by compiling all artifacts for a document."""
    # TODO: 1. List all available artifacts using the tool_context.
    # TODO: 2. Filter the list to get only the names of artifacts for the current document.
    
    report = f"# Final Report for: {document_name}\n\n"
    # TODO: 3. Loop through your filtered list of artifact names. In the loop,
    # load each artifact and append its name and content to the `report` string.
    
    # TODO: 4. Save the final `report` string as an artifact named
    # f"{document_name}_FINAL_REPORT.md".
    # TODO: 5. Return a confirmation message.
    return "Report complete."

# ============================================================================ 
# AGENT DEFINITION
# ============================================================================ 

# TODO: Define the `root_agent`. Give it an instruction that tells it to run the
# pipeline in the correct order (extract -> summarize -> report) and register
# the three async tools.
root_agent = None
```

### Step 3: Run and Test the Pipeline

1.  **Set up your `.env` file** with your API key or Vertex AI project.
2.  **Start the Dev UI:** `adk web`
3.  **Interact with the agent:**
    *   Select "document_processor" and send a prompt like: "Process the document named 'Annual_Report_2025'."
4.  **Analyze the Trace and Artifacts:**
    *   In the **Trace** view, observe the chain of tool calls.
    *   In the **Chat** view, click the blue "Artifacts" button to see the list of files your agent created. Click on each one to view its content.

### Having Trouble?

If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary

You have successfully built a multi-step document processing agent that uses artifacts for state management and auditability. You have learned to:
*   Write `async` tools that can save and load artifacts.
*   Use `await tool_context.save_artifact()` to create versioned files.
*   Use `await tool_context.load_artifact()` to read previously created files.
*   Chain tools together to create a pipeline where the output of one step is the input to the next.