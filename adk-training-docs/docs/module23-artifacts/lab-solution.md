sidebar_position: 3
---
# Module 21: Handling Files with Artifacts

# Lab 23: Solution

This file contains the complete, simplified code for the `agent.py` script in the Document Processing Pipeline lab.

### `doc-processor/agent.py`

```python
"""
Document Processor with Artifact Management
Processes documents through multiple stages with versioning and audit trails.
"""

from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from google.adk.tools.tool_context import ToolContext
from google.genai import types

# ============================================================================ 
# ARTIFACT-HANDLING TOOLS
# ============================================================================ 

async def extract_text(document_name: str, tool_context: ToolContext) -> str:
    """Extracts and cleans text from a document, saving it as an artifact."""
    print(f"Extracting text from '{document_name}'...")
    # In a real scenario, this would involve file reading and cleaning.
    extracted_content = f"EXTRACTED AND CLEANED TEXT FROM DOCUMENT: {document_name}"
    
    part = types.Part.from_text(extracted_content)
    version = await tool_context.save_artifact(
        filename=f"{document_name}_extracted.txt", artifact=part
    )
    return f"Text extracted from '{document_name}' and saved as version {version}."

async def summarize_document(document_name: str, tool_context: ToolContext) -> str:
    """Generates a summary of a document from its extracted text artifact."""
    print(f"Summarizing '{document_name}'...")
    # Load the artifact from the previous step.
    source_artifact = await tool_context.load_artifact(f"{document_name}_extracted.txt")
    if not source_artifact:
        return "Error: Could not find the extracted text. Please run the 'extract_text' step first."

    # In a real scenario, this would involve an LLM call for summarization.
    summary_content = f"This is a concise summary of the document '{document_name}'."
    
    part = types.Part.from_text(summary_content)
    version = await tool_context.save_artifact(
        filename=f"{document_name}_summary.txt", artifact=part
    )
    return f"Summary for '{document_name}' created and saved as version {version}."

async def create_report(document_name: str, tool_context: ToolContext) -> str:
    """Creates a final report by compiling all artifacts for a document."""
    print(f"Creating final report for '{document_name}'...")
    all_artifacts = await tool_context.list_artifacts()
    
    # Filter for artifacts related to the specific document.
    doc_artifacts_names = [name for name in all_artifacts if name.startswith(document_name)]
    
    report = f"# Final Report for: {document_name}\n\n"
    for name in doc_artifacts_names:
        artifact = await tool_context.load_artifact(name)
        if artifact and artifact.text:
            report += f"## Artifact: {name}\n\n```text\n{artifact.text[:500]}...\n```\n\n"
            
    part = types.Part.from_text(report)
    version = await tool_context.save_artifact(
        filename=f"{document_name}_FINAL_REPORT.md", artifact=part
    )
    return f"Final report for '{document_name}' created and saved as version {version}."

# ============================================================================ 
# AGENT DEFINITION
# ============================================================================ 

root_agent = Agent(
    model='gemini-1.5-flash',
    name='document_processor',
    instruction="""
You are a document processing pipeline agent. Your job is to take a document name
and process it through a series of steps by calling the appropriate tools in the
correct order.

Workflow:
1.  When the user wants to process a document, first call `extract_text`.
2.  After extraction, call `summarize_document`.
3.  Finally, call `create_report` to compile all the results.
    """,
    tools=[
        FunctionTool(extract_text),
        FunctionTool(summarize_document),
        FunctionTool(create_report),
    ]
)
```

```
