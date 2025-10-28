# Module 33: Advanced - Building a Personalized Shopping Agent

## Challenging Lab - Solution

### Goal

In this lab, you will build the personalized shopping agent from scratch. You will implement the tools to interact with the web environment and define the agent with its prompt.

### Setup

1.  **Copy the `personalized_shopping` agent sample** from the `sample-agents` directory to a new directory for your lab.
2.  **Follow the `README.md`** in the `personalized_shopping` directory to download the data and set up the environment.
3.  **Create a new Python package** for your agent (e.g., `my_shopping_agent`).

### Solutions

#### `tools/search.py`

```python
# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from google.adk.tools import ToolContext
from google.genai import types

from ..shared_libraries.init_env import get_webshop_env


async def search(keywords: str, tool_context: ToolContext) -> str:
    """Search for keywords in the webshop.

    Args:
      keywords(str): The keywords to search for.
      tool_context(ToolContext): The function context.

    Returns:
      str: The search result displayed in a webpage.
    """
    webshop_env = get_webshop_env()
    status = {"reward": None, "done": False}
    action_string = f"search[{keywords}]"
    webshop_env.server.assigned_instruction_text = f"Find me {keywords}."
    print(f"env instruction_text: {webshop_env.instruction_text}")
    _, status["reward"], status["done"], _ = webshop_env.step(action_string)

    ob = webshop_env.observation
    index = ob.find("Back to Search")
    if index >= 0:
        ob = ob[index:]

    print("#" * 50)
    print("Search result:")
    print(f"status: {status}")
    print(f"observation: {ob}")
    print("#" * 50)

    # Show artifact in the UI.
    try:
        await tool_context.save_artifact(
            "html",
            types.Part.from_uri(
                file_uri=webshop_env.state["html"], mime_type="text/html"
            ),
        )
    except ValueError as e:
        print(f"Error saving artifact: {e}")

    return ob
```

#### `tools/click.py`

```python
# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from google.adk.tools import ToolContext
from google.genai import types

from ..shared_libraries.init_env import get_webshop_env


async def click(button_name: str, tool_context: ToolContext) -> str:
    """Click the button with the given name.

    Args:
      button_name(str): The name of the button to click.
      tool_context(ToolContext): The function context.

    Returns:
      str: The webpage after clicking the button.
    """
    webshop_env = get_webshop_env()
    status = {"reward": None, "done": False}
    action_string = f"click[{button_name}]"
    _, status["reward"], status["done"], _ = webshop_env.step(action_string)

    ob = webshop_env.observation
    index = ob.find("Back to Search")
    if index >= 0:
        ob = ob[index:]

    print("#" * 50)
    print("Click result:")
    print(f"status: {status}")
    print(f"observation: {ob}")
    print("#" * 50)

    if button_name == "Back to Search":
        webshop_env.server.assigned_instruction_text = "Back to Search"

    # Show artifact in the UI.
    try:
        await tool_context.save_artifact(
            "html",
            types.Part.from_uri(
                file_uri=webshop_env.state["html"], mime_type="text/html"
            ),
        )
    except ValueError as e:
        print(f"Error saving artifact: {e}")
    return ob
```

#### `prompt.py`

```python
# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

personalized_shopping_agent_instruction = \"\"\"You are a webshop agent, your job is to help the user find the product they are looking for, and guide them through the purchase process in a step-by-step, interactive manner.

**Interaction Flow:**

1.  **Initial Inquiry:**
    * Begin by asking the user what product they are looking for if they didn't provide it directly.
    * If they upload an image, analyze what's in the image and use that as the reference product.

2.  **Search Phase:**
    * Use the "search" tool to find relevant products based on the user's request.
    * Present the search results to the user, highlighting key information and available product options.
    * Ask the user which product they would like to explore further.

3.  **Product Exploration:**
    * Once the user selects a product, automatically gather and summarize all available information from the "Description," "Features," and "Reviews" sections.
        * You can do this by clicking any of the "Description," "Features," or "Reviews" buttons, navigate to the respective section and gather the information. After reviewing one section, return to the information page by clicking the "< Prev" button, then repeat for the remaining sections.
        * Avoid prompting the user to review each section individually; instead, summarize the information from all three sections proactively.
    * If the product is not a good fit for the user, inform the user, and ask if they would like to search for other products (provide recommendations).
    * If the user wishes to proceed to search again, use the "Back to Search" button.
    * Important: When you are done with product exploration, remeber to click the "< Prev" button to go back to the product page where all the buying options (colors and sizes) are available.

4.  **Purchase Confirmation:**
    * Click the "< Prev" button to go back to the product page where all the buying options (colors and sizes) are available, if you are not on that page now.
    * Before proceeding with the "Buy Now" action, click on the right size and color options (if available on the current page) based on the user's preference.
    * Ask the user for confirmation to proceed with the purchase.
    * If the user confirms, click the "Buy Now" button.
    * If the user does not confirm, ask the user what they wish to do next.

5.  **Finalization:**
    * After the "Buy Now" button is clicked, inform the user that the purchase is being processed.
    * If any errors occur, inform the user and ask how they would like to proceed.

**Key Guidelines:**

* **Slow and Steady:**
    * Engage with the user when necessary, seeking their input and confirmation.

* **User Interaction:**
    * Prioritize clear and concise communication with the user.
    * Ask clarifying questions to ensure you understand their needs.
    * Provide regular updates and seek feedback throughout the process.

* **Button Handling:**
    * **Note 1:** Clikable buttons after search look like "Back to Search", "Next >", "B09P5CRVQ6", "< Prev", "Descriptions", "Features", "Reviews" etc. All the buying options such as color and size are also clickable.
    * **Note 2:** Be extremely careful here, you must ONLY click on the buttons that are visible in the CURRENT webpage. If you want to click a button that is from the previous webpage, you should use the "< Prev" button to go back to the previous webpage.
    * **Note 3:** If you wish to search and there is no "Search" button, click the "Back to Search" button instead.\"\"\"
```

#### `agent.py`

```python
# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from google.adk.agents import Agent
from google.adk.tools import FunctionTool

from .tools.search import search
from .tools.click import click

from .prompt import personalized_shopping_agent_instruction

root_agent = Agent(
    model="gemini-1.5-flash",
    name="personalized_shopping_agent",
    instruction=personalized_shopping_agent_instruction,
    tools=[
        FunctionTool(
            func=search,
        ),
        FunctionTool(
            func=click,
        ),
    ],
)
```
