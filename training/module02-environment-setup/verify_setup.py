# verify_setup.py
try:
    from google.adk.discover import get_default_llm
    print("✅ Google ADK is installed correctly.")
    
    print("Attempting to connect to the LLM service...")
    llm = get_default_llm()
    if llm:
        print("✅ Authentication successful: Connected to the LLM service.")
    else:
        print("❌ Authentication failed: Could not connect to the LLM service.")
        
except ImportError:
    print("❌ Installation error: The 'google-adk' package could not be found.")
except Exception as e:
    print(f"❌ An unexpected error occurred: {e}")
