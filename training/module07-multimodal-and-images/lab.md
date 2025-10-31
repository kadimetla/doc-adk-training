# Module 7: Multimodal and Image Processing

## Lab 7: Building a Visual Product Catalog Analyzer

### Goal

In this lab, you will build a multi-agent system that can analyze a product image and generate a marketing description. This will teach you how to handle image inputs and orchestrate a workflow between a vision-capable agent and a text-generation agent.

### The Architecture

1.  **Vision Analyzer Agent:** An `LlmAgent` that takes an image and a text prompt, and outputs a structured analysis of the image.
2.  **Catalog Generator Agent:** A second `LlmAgent` that takes the structured analysis from the first agent and uses it to generate a polished product description.

### Step 1: Create and Prepare the Project

1.  **Create the agent project:**
    ```shell
    adk create visual-catalog
    ```
    When prompted, choose the **Programmatic (Python script)** option.

2.  **Navigate into the new directory:**
    ```shell
    cd visual-catalog
    ```

3.  **Install Dependencies:**
    This lab requires the `Pillow` library for image handling. Install it now:
    ```shell
    pip install Pillow
    ```

4.  **Set up your `.env` file.**
    Create a `.env` file in this directory. Vision models require a Vertex AI configuration.
    ```
    GOOGLE_GENAI_USE_VERTEXAI=1
    GOOGLE_CLOUD_PROJECT=<your_gcp_project>
    GOOGLE_CLOUD_LOCATION=us-central1
    ```

### Step 2: Implement the Multimodal Agents

**Exercise:** Open `agent.py`. The full boilerplate code is provided below. Your task is to complete the core logic inside the `analyze_product` method by filling in the `# TODO` sections.

```python
# In agent.py (Starter Code)
import asyncio
import os
from typing import List, Dict
from google.adk.agents import Agent, Runner
from google.genai import types
import io

# Helper function to load an image from a local file path
def load_image_from_file(path: str) -> types.Part:
    """Load image from file and return a types.Part object."""
    with open(path, 'rb') as f:
        image_bytes = f.read()
    
    if path.lower().endswith('.png'):
        mime_type = 'image/png'
    elif path.lower().endswith(('.jpg', '.jpeg')):
        mime_type = 'image/jpeg'
    else:
        mime_type = 'image/jpeg' # Default

    return types.Part(
        inline_data=types.Blob(data=image_bytes, mime_type=mime_type)
    )

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

        # TODO: 1. Call the `load_image_from_file` helper to get the `image_part`.
        image_part = None # Replace this

        # TODO: 2. Create the `analysis_query`, which must be a list containing
        # a text part (e.g., "Analyze this image") and the `image_part`.
        analysis_query = [] # Replace this

        # TODO: 3. Call the `vision_agent` by using `self.runner.run_async`.
        # Pass the `analysis_query` as the `new_message` and the `vision_agent`
        # as the `agent`.
        analysis_result = await self.runner.run_async(...) # Replace this
        analysis_text = analysis_result.content.parts[0].text
        print(f"🔍 Visual Analysis Complete:\n{analysis_text}\n")

        # TODO: 4. Create the `catalog_query` string for the next agent.
        # It should contain the `analysis_text` from the previous step.
        catalog_query = "" # Replace this

        # TODO: 5. Call the `catalog_agent` using `self.runner.run_async`
        # to generate the final description. Remember to package the query
        # in a `types.Content` object.
        catalog_result = await self.runner.run_async(...) # Replace this
        catalog_text = catalog_result.content.parts[0].text
        print(f"✅ Catalog Entry Generated:\n{catalog_text}\n")

        self.catalog.append({'product_id': product_id, 'catalog_entry': catalog_text})

async def main():
    """Main entry point to run a demo."""
    from dotenv import load_dotenv
    load_dotenv()

    analyzer = ProductCatalogAnalyzer()

    # Use local images directly
    products = [
        ('PROD-001', '../../headphones.jpg'),
        ('PROD-002', '../../laptop.jpg'),
    ]

    for product_id, image_path in products:
        await analyzer.analyze_product(product_id, image_path)
        await asyncio.sleep(1)

if __name__ == '__main__':
    asyncio.run(main())
```

### Step 3: Run and Test the Vision Agent

1.  **Run the agent script directly** after completing the `TODO`s.
    ```shell
    python agent.py
    ```
2.  **Analyze the Output:** You should see the script use the local images, then see the visual analysis from the first agent, followed by the final marketing copy from the second agent for each product.

### Having Trouble?
If you get stuck, you can find the complete, working code in the `lab-solution.md` file.

### Lab Summary
You have successfully built a multi-agent system that can see and understand images! You have learned to:
*   Create multimodal prompts by combining text and image `types.Part` objects.
*   Build a pipeline where one agent's visual analysis becomes the input for another agent's text generation task.

### Self-Reflection Questions
- In our two-agent pipeline, the `vision_agent`'s output is passed to the `catalog_agent`. What are the benefits of separating these two tasks into specialized agents instead of using one single, more complex agent?
- The `load_image_from_file` helper function reads the image as bytes. Why is it necessary to also provide a `mime_type` (like 'image/jpeg') when creating the `types.Part` object?
- How could you extend this project to handle video input? What kind of new agent or tool would you need to build?
