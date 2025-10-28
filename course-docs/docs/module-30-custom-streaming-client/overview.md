
---
title: Custom Streaming Client
---

## Module 30: Building a Custom Streaming Client

## Overview

### The Architecture of a Streaming Application

A custom streaming application consists of two main components:

1.  **The ADK Server:** Your ADK agent, run as a headless API server using `adk api_server`, which opens a **WebSocket** endpoint.
2.  **The Custom Client:** The user-facing part of the application (e.g., a web page) that captures audio, sends it to the WebSocket, and receives and plays back the agent's audio response.

### WebSockets: The Key to Real-time Communication

**WebSockets** provide a persistent, **full-duplex** (two-way) communication channel, enabling the continuous, low-latency flow of audio data required for a natural voice conversation.
