# Module 33: Advanced - Building a Personalized Shopping Agent

## Theory

### Introduction

In this advanced module, we'll build a sophisticated AI agent capable of navigating a simulated e-commerce website to help a user find and purchase a product. This agent will demonstrate how to integrate external web environments and use a combination of tools to perform complex, multi-step tasks.

### Agent Architecture

The personalized shopping agent is a single `LlmAgent` that uses a set of tools to interact with a web environment. The agent's behavior is guided by a detailed prompt that outlines the entire interaction flow, from searching for a product to confirming the purchase.

![Personalized Shopping Agent Architecture](../../sample-agents/personalized-shopping/ps_architecture.png)

### Core Components

1.  **Web Environment:**
    The agent interacts with a simulated webshop environment provided by the `web_agent_site` library. This environment mimics a real e-commerce website, with pages for search, product details, descriptions, features, and reviews. The environment is stateful, meaning it keeps track of the current page and updates it based on the agent's actions.

2.  **Tools:**
    The agent is equipped with two primary tools:
    *   **`search(keywords: str)`:** This tool takes a search query from the agent, passes it to the webshop environment, and returns the HTML content of the search results page.
    *   **`click(button_name: str)`:** This tool simulates clicking a button on the current webpage. It takes the name of the button to click (e.g., "Next >", "Description", "Buy Now"), updates the environment's state, and returns the new HTML content.

3.  **Prompt Engineering:**
    The agent's instruction prompt is crucial for its success. It defines a state machine-like flow that guides the agent through the shopping process:
    *   **Initial Inquiry:** Ask the user for the product they're looking for.
    *   **Search Phase:** Use the `search` tool and present the results.
    *   **Product Exploration:** Use the `click` tool to navigate to product details, descriptions, features, and reviews.
    *   **Purchase Confirmation:** Use the `click` tool to select options and confirm the purchase.
    *   **Finalization:** Inform the user that the purchase is complete.

    The prompt also includes specific instructions on how to handle the web environment's state, such as using the "`< Prev`" button to navigate back.

4.  **Artifacts:**
    To provide a better user experience, the agent saves the HTML content of the current page as an artifact after each action. This allows the user to see the web page that the agent is interacting with in the ADK's web UI.

By combining these components, we can create a powerful agent that can navigate a web environment, gather information, and interact with a user to complete a complex task.
