# Module 21: Handling Files with Artifacts

## Lab 21: Solution

This file contains the complete code for the `agent.py` script in the Document Processing Pipeline lab.

### `doc-processor/agent.py`

```python
"""
Document Processor with Artifact Management
Processes documents through multiple stages with versioning and audit trails.
"""

import asyncio
import os
from datetime import datetime
from typing import Dict
from google.adk.agents import Agent, Runner, Session
from google.adk.artifacts import InMemoryArtifactService
from google.adk.tools import FunctionTool
from google.adk.tools.tool_context import ToolContext
from google.genai import types

class DocumentProcessor:
    """Document processing pipeline with artifact tracking."""

    def __init__(self):
        """Initialize document processor."""
        self.processing_log: list[Dict] = []

        async def extract_text(document: str, tool_context: ToolContext) -> str:
            """Extract and clean text from document."""
            self._log_step('extract_text', document)
            extracted = f"EXTRACTED TEXT FROM: {document}\n..."
            part = types.Part.from_text(extracted)
            version = await tool_context.save_artifact(
                filename=f"{document}_extracted.txt", artifact=part
            )
            return f"Text extracted and saved as version {version}"

        async def summarize_document(document: str, tool_context: ToolContext) -> str:
            """Generate document summary."""
            self._log_step('summarize', document)
            artifact = await tool_context.load_artifact(f"{document}_extracted.txt")
            if not artifact:
                return "Error: Extracted text not found"
            summary = f"SUMMARY OF {document}\n- Point 1\n- Point 2"
            part = types.Part.from_text(summary)
            version = await tool_context.save_artifact(
                filename=f"{document}_summary.txt", artifact=part
            )
            return f"Summary created as version {version}"

        async def translate_document(document: str, language: str, tool_context: ToolContext) -> str:
            """Translate document to target language."""
            self._log_step('translate', f"{document} to {language}")
            artifact = await tool_context.load_artifact(f"{document}_extracted.txt")
            if not artifact:
                return "Error: Source document not found"
            translated = f"TRANSLATED ({language}): {document}\n..."
            part = types.Part.from_text(translated)
            version = await tool_context.save_artifact(
                filename=f"{document}_{language}.txt", artifact=part
            )
            return f"Translation to {language} saved as version {version}"

        async def create_report(document: str, tool_context: ToolContext) -> str:
            """Create comprehensive report from all artifacts."""
            self._log_step('create_report', document)
            all_artifacts = await tool_context.list_artifacts()
            doc_artifacts = [a for a in all_artifacts if a.startswith(document)]
            report = f"# Document Processing Report: {document}\n\n"
            for artifact_name in doc_artifacts:
                artifact = await tool_context.load_artifact(artifact_name)
                if artifact:
                    report += f"### {artifact_name}\n```\n{artifact.text[:200]}...\n```\n"
            part = types.Part.from_text(report)
            version = await tool_context.save_artifact(
                filename=f"{document}_FINAL_REPORT.md", artifact=part
            )
            return f"Final report created as version {version}"

        self.agent = Agent(
            model='gemini-1.5-flash',
            name='document_processor',
            instruction="""
You are a document processing agent. Follow the user's requested operations in sequence:
1. Extract text
2. Create summary
3. Translate if requested
4. Generate final report
            ",
            tools=[
                FunctionTool(extract_text),
                FunctionTool(summarize_document),
                FunctionTool(translate_document),
                FunctionTool(create_report),
            ]
        )
        self.runner = Runner(agent=self.agent, artifact_service=InMemoryArtifactService())
        self.session = Session()

    def _log_step(self, step: str, details: str):
        self.processing_log.append({'step': step, 'details': details})

    async def process_document(self, document_name: str, operations: list[str]):
        print(f"\n--- PROCESSING: {document_name} ---")
        query = f"Process document '{document_name}' with operations: {', '.join(operations)}"
        if 'translate' in operations:
            query += " (translate to Spanish and French)"
        
        result = await self.runner.run_async(
            new_message=types.Content(role="user", parts=[types.Part(text=query)]),
            session=self.session
        )
        print(f"🤖 Agent Response: {result.content.parts[0].text}")

async def main():
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()

    processor = DocumentProcessor()
    await processor.process_document(
        'contract_2025_Q3',
        ['extract', 'summarize', 'translate', 'report']
    )

if __name__ == '__main__':
    asyncio.run(main())

# The root_agent is the agent instance from the processor
root_agent = DocumentProcessor().agent
```

```
```