---
sidebar_position: 2
---
# Module 7: Multimodal and Image Processing

## Lab 39: Building a Visual Product Catalog Analyzer

### Goal

In this lab, you will build a multi-agent system that can analyze a product image and generate a marketing description. This will teach you how to handle image inputs and orchestrate a workflow between a vision-capable agent and a text-generation agent.

### The Architecture

1.  **Vision Analyzer Agent:** An `LlmAgent` that takes an image and a text prompt, and outputs a structured analysis of the image.
2.  **Catalog Generator Agent:** A second `LlmAgent` that takes the structured analysis from the first agent and uses it to generate a polished product description.

### Step 1: Create the Agent Project

1.  **Create the agent project:**
    ```shell
    adk create visual-catalog
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd visual-catalog
    ```

### Step 2: Implement the Multimodal Agents

**Exercise:** Open `agent.py`. A skeleton of the `ProductCatalogAnalyzer` class is provided. Your task is to complete the logic inside the `analyze_product` method to orchestrate the two agents.

```python
# In agent.py (Starter Code)
import asyncio
from typing import List, Dict
from google.adk.agents import Agent, Runner
from google.genai import types

# (Helper function load_image_from_file is in the solution)

class ProductCatalogAnalyzer:
    """Analyze product images and create catalog entries."""

    def __init__(self):
        """Initialize product catalog analyzer."""
        self.catalog: List[Dict] = []
        self.vision_agent = Agent(
            model='gemini-1.5-flash', name='vision_analyzer',
            instruction="You are a product vision analyst. Describe key visual features."
        )
        self.catalog_agent = Agent(
            model='gemini-1.5-flash', name='catalog_generator',
            instruction="You are a product catalog writer. Generate marketing descriptions from a visual analysis."
        )
        self.runner = Runner()

    async def analyze_product(self, product_id: str, image_path: str):
        """Analyze a product image and create a catalog entry."""
        print(f"\n--- Analyzing Product: {product_id} ---")

        # TODO: 1. Call the `load_image_from_file` helper (from the solution)
        # to get the `image_part`.
        image_part = None # Replace this

        # TODO: 2. Create the `analysis_query`, which must be a list containing
        # a text part (e.g., "Analyze this image") and the `image_part`.
        analysis_query = [] # Replace this

        # TODO: 3. Call the `vision_agent` by using `self.runner.run_async`.
        # Pass the `analysis_query` as the `new_message`.
        analysis_result = await self.runner.run_async(...)
        analysis_text = analysis_result.content.parts[0].text
        print(f"🔍 Visual Analysis Complete:\n{analysis_text}\n")

        # TODO: 4. Create the `catalog_query` string for the next agent.
        # It should contain the `analysis_text` from the previous step.
        catalog_query = "" # Replace this

        # TODO: 5. Call the `catalog_agent` using `self.runner.run_async`
        # to generate the final description.
        catalog_result = await self.runner.run_async(...)
        catalog_text = catalog_result.content.parts[0].text
        print(f"✅ Catalog Entry Generated:\n{catalog_text}\n")

        self.catalog.append({'product_id': product_id, 'catalog_entry': catalog_text})

# (The main function to run the demo is in the solution file)
```

### Step 3: Run and Test the Vision Agent

1.  **Set up your `.env` file for Vertex AI.** Vision models require a Vertex AI configuration.
2.  **Run the agent script directly** after completing the `TODO`s and adding the `main` block from the solution file.
    ```shell
    uv run python agent.py
    ```
3.  **Analyze the Output:** You should see the visual analysis from the first agent, followed by the final marketing copy from the second agent.

### Having Trouble?
If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary
You have successfully built a multi-agent system that can see and understand images! You have learned to:
*   Create multimodal prompts by combining text and image `types.Part` objects.
*   Build a pipeline where one agent's visual analysis becomes the input for another agent's text generation task.