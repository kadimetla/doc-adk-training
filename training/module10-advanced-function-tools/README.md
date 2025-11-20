---
sidebar_position: 1
title: "Module 10: Advanced Function Tools"
---

# Module 10: Advanced Function Tools

## Theory

### Beyond the Basics

In the previous module, you learned the fundamentals of creating custom function tools. Now, we will explore advanced techniques to make your tools more robust, efficient, and powerful. The key feature we will cover is the ADK's ability to perform **parallel tool execution**.

### Automatic Parallel Tool Execution

One of the most powerful features of the ADK is its ability to execute multiple tools simultaneously. If a user's query requires several independent pieces of information, the agent's LLM is smart enough to request all the necessary tool calls in a single turn.

**How it works:**
1.  **User Prompt:** A user asks a question that requires multiple, unrelated pieces of information. For example: *"What's the monthly payment on a $300,000 loan over 30 years at 5% interest, and also how much would I need to save per month to have $20,000 in 3 years?"*
2.  **LLM Reasoning:** The LLM analyzes the prompt and recognizes that two different tools (`calculate_loan_payment` and `calculate_monthly_savings`) can be called with the provided information.
3.  **Multiple Function Calls:** The LLM returns a list of two `FunctionCall` requests in the same turn.
4.  **Parallel Execution:** The ADK receives this list and, instead of running the tools one by one, it executes them **in parallel** using `asyncio.gather()`.
5.  **Combined Response:** Both tool results are collected and sent back to the LLM, which then formulates a comprehensive final answer.

This provides a significant performance benefit. The total time to get a response is determined by the *longest-running tool*, not the sum of all tool execution times. You get this powerful feature for free, simply by designing focused, independent tools.

### Best Practices for Complex Tools

As your tools become more complex, it's important to make them robust.

> **Note on Type Hints:** You might see `from __future__ import annotations` at the top of Python files in more advanced examples. This is a best practice for handling type hints in Python, especially when dealing with forward references (types that are defined later in the code) or complex type structures. It allows for more flexible and robust type annotations.

#### 1. Input Validation
Never assume the LLM will provide perfect inputs. Your tool function should be the last line of defense. Validate the arguments you receive to prevent errors.

```python
def calculate_loan_payment(loan_amount: float, ...) -> dict:
    if loan_amount <= 0:
        return {'status': 'error', 'report': 'Error: Loan amount must be positive.'}
    # ... rest of the logic
```

#### 2. Structured Error Handling
If validation fails or an error occurs, always return a structured error dictionary. This allows the LLM to understand what went wrong and explain it to the user.

```python
return {
    'status': 'error',
    'report': 'A descriptive error message for the LLM.'
}
```

#### 3. Human-Readable Reports
For successful calls, the `report` field in your return dictionary should contain a pre-formatted, user-friendly string. This makes the LLM's job easier, as it can often pass your report directly to the user with minimal changes.

```python
report = (
    f"For a ${loan_amount:,.0f} loan..., your monthly payment will be "
    f"${monthly_payment:,.2f}."
)
return {
    'status': 'success',
    'report': report
}
```
In the lab, you will implement these best practices and see parallel execution in action.

### Key Takeaways
- The ADK can automatically execute multiple, independent tool calls in parallel, significantly improving performance.
- Robust tool functions should always perform their own input validation to prevent errors.
- Tools should return structured error dictionaries to allow the agent to understand and report failures gracefully.
- Providing a pre-formatted, human-readable `report` in a successful tool response makes the LLM's job easier and leads to better final answers.