# Module 35: Multimodal and Image Processing

## Lab 35: Solution

This file contains the complete code for the `agent.py` script in the Visual Product Catalog Analyzer lab.

### `visual-catalog/agent.py`

```python
"""
Visual Product Catalog Analyzer
Analyzes product images, extracts information, and generates descriptions.
"""

import asyncio
import os
from typing import List, Dict
from google.adk.agents import Agent, Runner, Session
from google.adk.tools import FunctionTool
from google.adk.tools.tool_context import ToolContext
from google.genai import types
from PIL import Image
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

        # Agent 1: Vision specialist
        self.vision_agent = Agent(
            model='gemini-1.5-flash',
            name='vision_analyzer',
            instruction="""
You are a product vision analyst. When analyzing product images, identify the product type, describe key visual features (color, material, design), and note any visible text. Provide a structured, detailed analysis.
            """.strip(),
        )

        # Agent 2: Content specialist
        self.catalog_agent = Agent(
            model='gemini-1.5-flash',
            name='catalog_generator',
            instruction="""
You are a product catalog content creator. Generate professional, marketing-ready product descriptions based on a visual analysis provided to you. Focus on compelling descriptions and key features.
            """.strip(),
        )

        self.runner = Runner()

    async def analyze_product(self, product_id: str, image_path: str):
        """Analyze a product image and create a catalog entry."""
        print(f"\n--- Analyzing Product: {product_id} ---")

        # Step 1: Visual analysis with the vision_agent
        print("📸 Step 1: Performing visual analysis...")
        image_part = load_image_from_file(image_path)
        analysis_query = [
            types.Part.from_text(f"Analyze this product image for {product_id}:"),
            image_part
        ]
        analysis_result = await self.runner.run_async(
            new_message=analysis_query,
            agent=self.vision_agent
        )
        analysis_text = analysis_result.content.parts[0].text
        print(f"🔍 Visual Analysis Complete:\n{analysis_text}\n")

        # Step 2: Generate catalog entry with the catalog_agent
        print("📝 Step 2: Generating catalog entry...")
        catalog_query = f"Based on this visual analysis, create a professional catalog entry for {product_id}:\n\n{analysis_text}"
        catalog_result = await self.runner.run_async(
            new_message=types.Content(role="user", parts=[types.Part(text=catalog_query)]),
            agent=self.catalog_agent
        )
        catalog_text = catalog_result.content.parts[0].text
        print(f"✅ Catalog Entry Generated:\n{catalog_text}\n")

        self.catalog.append({'product_id': product_id, 'analysis': analysis_text, 'catalog_entry': catalog_text})

async def main():
    """Main entry point to run a demo."""
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()

    analyzer = ProductCatalogAnalyzer()

    # Create dummy images for the demo
    os.makedirs('images', exist_ok=True)
    products = [
        ('PROD-001', 'images/laptop.jpg'),
        ('PROD-002', 'images/headphones.jpg'),
    ]
    for _, image_path in products:
        img = Image.new('RGB', (200, 200), color = 'red')
        img.save(image_path)

    # Batch analyze the products
    for product_id, image_path in products:
        await analyzer.analyze_product(product_id, image_path)
        await asyncio.sleep(1)

if __name__ == '__main__':
    asyncio.run(main())

# Define root_agent for the ADK CLI
# In this case, we can expose the orchestrating class logic through a simple agent
async def run_full_analysis(product_id: str, image_path: str) -> str:
    """Analyzes a product image and returns the final catalog entry."""
    analyzer = ProductCatalogAnalyzer()
    await analyzer.analyze_product(product_id, image_path)
    return analyzer.catalog[0]['catalog_entry']

root_agent = Agent(
    model='gemini-1.5-flash',
    name='visual_catalog_orchestrator',
    instruction="You are an orchestrator for a visual cataloging system.",
    tools=[FunctionTool(run_full_analysis)]
)
```
