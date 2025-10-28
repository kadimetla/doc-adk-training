
---
title: Observability
---

## Module 25: Advanced Observability with Plugins

## Overview

### The ADK Plugin System

**Plugins** are modular, reusable classes that intercept and observe the events flowing through an agent's execution without modifying the agent's core logic.

### How Plugins Work

1.  You create a class that inherits from `google.adk.plugins.BasePlugin`.
2.  You implement the `async def on_event_callback(self, *, event: Event, **kwargs)` method.
3.  This method is automatically called for **every event** during the agent's execution.
4.  Inside this method, you can inspect the event and perform actions like logging, incrementing a metric, or sending an alert.
5.  You register your plugin when you instantiate the `Runner`: `Runner(plugins=[MyMetricsPlugin()])`.
