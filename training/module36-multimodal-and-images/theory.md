# Module 35: Multimodal and Image Processing

## Theory

### Why Multimodal Matters

Many real-world applications require agents to understand and process more than just text. **Multimodal models**, like Gemini, can process text and images together, enabling a powerful new class of vision-enabled agents.

**Benefits**:

*   👁️ **Vision Understanding**: Analyze images to extract information, identify objects, and understand visual context.
*   🎨 **Image Generation**: Create new images from text descriptions.
*   🧠 **Multimodal Reasoning**: Combine visual and textual information to answer complex questions.
*   📄 **Document Analysis**: Extract text and structure from images of documents (OCR).

### The `types.Part` Object

The fundamental building block for multimodal content in the ADK is the `types.Part` object from the `google.genai` library. A user's prompt is no longer just a string, but a list of `Part` objects.

A `Part` can contain:
*   **Text:** `types.Part.from_text("Describe this image")`
*   **Image Data:** `types.Part(inline_data=types.Blob(data=image_bytes, mime_type='image/png'))`

When you send a list of these parts to a vision-capable model like `gemini-1.5-flash`, the model can reason about the text and the image(s) together.

### Image Generation

Beyond understanding images, some models can also **generate** them. Services like **Vertex AI Imagen** provide text-to-image capabilities. You can create a custom tool that takes a text description, calls the image generation API, and returns the resulting image.

This allows you to build agents that can:
*   Create product mockups from a description.
*   Generate illustrations for a story.
*   Create charts and diagrams from data.

In the lab, you will build a "Visual Product Catalog Analyzer" that uses a vision-capable agent to analyze a product image and a second agent to generate a marketing description from that analysis.
