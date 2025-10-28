
---
title: Multimodal and Images
---

## Module 7: Multimodal and Image Processing

## Overview

### Why Multimodal Matters

**Multimodal models**, like Gemini, can process text and images together, enabling a powerful new class of vision-enabled agents.

**Benefits**:

*   👁️ **Vision Understanding**: Analyze images to extract information.
*   🎨 **Image Generation**: Create new images from text descriptions.
*   🧠 **Multimodal Reasoning**: Combine visual and textual information to answer complex questions.

### The `types.Part` Object

The fundamental building block for multimodal content is the `types.Part` object. A user's prompt is a list of `Part` objects, which can contain:

*   **Text:** `types.Part.from_text("Describe this image")`
*   **Image Data:** `types.Part(inline_data=types.Blob(data=image_bytes, mime_type='image/png'))`

When you send a list of these parts to a vision-capable model, it can reason about the text and the image(s) together.
