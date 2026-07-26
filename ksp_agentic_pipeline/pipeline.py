import os
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

# State schema for the LangGraph pipeline
class AgentState(TypedDict):
    fir_details: str
    severity_score: int
    action_plan: str
    requires_dispatch: bool

# Initialize Gemini LLM (Datathon Fallback logic)
# Note: Production migration planned for Catalyst QuickML API endpoints
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash") 

def analyze_severity(state: AgentState) -> AgentState:
    """Agent Node 1: Analyzes the crime details and outputs a severity score."""
    print("[Agent 1] Analyzing Severity...")
    prompt = f"Analyze this FIR and reply with ONLY a severity score from 1 to 10: {state['fir_details']}"
    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        score = int(response.content.strip())
    except:
        score = 5
    return {"severity_score": score}

def generate_action_plan(state: AgentState) -> AgentState:
    """Agent Node 2: Generates a tactical action plan based on severity."""
    print("[Agent 2] Generating Action Plan...")
    prompt = f"Generate a short 2-sentence tactical action plan for police based on this crime with severity {state['severity_score']}/10: {state['fir_details']}"
    response = llm.invoke([HumanMessage(content=prompt)])
    return {"action_plan": response.content}

def dispatch_decision(state: AgentState) -> AgentState:
    """Agent Node 3: Decides if this requires an emergency SMS dispatch."""
    print("[Agent 3] Making Dispatch Decision...")
    requires_dispatch = state["severity_score"] >= 8
    return {"requires_dispatch": requires_dispatch}

# ---------------------------------------------------------
# Build the LangGraph Pipeline
# ---------------------------------------------------------
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("analyze_severity", analyze_severity)
workflow.add_node("generate_action_plan", generate_action_plan)
workflow.add_node("dispatch_decision", dispatch_decision)

# Define edges
workflow.set_entry_point("analyze_severity")
workflow.add_edge("analyze_severity", "generate_action_plan")
workflow.add_edge("generate_action_plan", "dispatch_decision")
workflow.add_edge("dispatch_decision", END)

# Compile graph
app = workflow.compile()

if __name__ == "__main__":
    print("🚀 Initializing KSP LangGraph Agentic Pipeline...")
    
    # Test Payload
    test_input = {
        "fir_details": "Armed robbery at MG Road jewelry store. 3 suspects fled in a black SUV. Repeat offenders.",
        "severity_score": 0,
        "action_plan": "",
        "requires_dispatch": False
    }
    
    # Execute Graph
    result = app.invoke(test_input)
    
    print("\n--- 🚨 Final Pipeline Output ---")
    print(f"Severity Score: {result['severity_score']}/10")
    print(f"Action Plan: {result['action_plan']}")
    print(f"Requires SMS Dispatch: {'YES' if result['requires_dispatch'] else 'NO'}")
    print("--------------------------------")
