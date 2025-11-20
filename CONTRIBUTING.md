# How to Contribute

Thank you for your interest in contributing to the ADK Developer Training Course! We welcome improvements, corrections, and new content from the community.

## Getting Started

Before you contribute, please take a moment to review our [Code of Conduct](#code-of-conduct). We expect all contributors to adhere to it to ensure a positive and collaborative environment.

## Branching Strategy & Workflow

This repository uses a specific two-branch system to ensure a spoil-free experience for students while maintaining a complete reference for instructors and contributors.

### The Branches

*   **`solution` (The "Source of Truth"):** 🌟 **ALWAYS WORK HERE.**
    *   This is the primary branch where all development happens.
    *   It contains the full course material, including labs, **solutions** (`lab-solution.md`), and instructor guides.
    *   The documentation website is built from this branch.
    *   **Contributors:** Always target your Pull Requests to the `solution` branch.

*   **`main` (Student Branch):**
    *   This is a sanitized version of the `solution` branch intended for students to clone.
    *   It does **NOT** contain solution files (`lab-solution.md`).
    *   **Do not commit directly to `main`.** It is automatically synchronized from `solution`.

### How to Contribute

1.  **Find an Issue:** Check the [GitHub Issues](https://github.com/mauripsale/doc-adk-training/issues).
2.  **Fork the Repository:** Fork the repo to your account.
3.  **Create a Feature Branch:** Create a new branch starting from `solution`:
    ```bash
    git checkout -b my-feature-branch origin/solution
    ```
4.  **Make Changes:** Edit files as needed. If you are adding a new lab, remember to include the solution file (`lab-solution.md`) if applicable.
5.  **Submit a Pull Request:** Open a PR targeting the **`solution`** branch.

## For Maintainers: Publishing to Students

To update the `main` (student) branch with the latest changes from `solution`, do not merge manually. Instead, use the provided automation script.

1.  Ensure you are on the `solution` branch and your local state is up to date.
2.  Run the publishing script from the root of the repository:
    ```bash
    ./scripts/publish_to_students.sh
    ```
    
**What the script does:**
*   Switches to `main` and pulls the latest changes.
*   Merges `solution` into `main`.
*   **Forcefully removes** all `lab-solution.md` files to prevent leakage.
*   Pushes the updated `main` branch to GitHub.
*   Returns you to the `solution` branch.

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## Licensing

By contributing, you agree that your contributions will be licensed under the terms of the Apache License 2.0 for code and the Creative Commons Attribution 4.0 International License for documentation, as described in our `LICENSE` files.