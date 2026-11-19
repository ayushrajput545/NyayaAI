from pydantic import BaseModel
from typing import Any
from langgraph.graph import StateGraph, START , END
from src.agents.legal_agents import query_understanding_agent , legal_research_agent , legal_context_agent,legal_analysis_agent,evidence_verification_agent , fallback_agent
from langchain_groq import ChatGroq

llm = ChatGroq(model='openai/gpt-oss-120b', temperature=0)

# Define State
class LegalResearchState(BaseModel):

    # Input
    question: str
    user_id: Any
    document_id: Any
    db: Any
    chat_history: list

    # Processing
    search_question: str
    results: list
    context: str

    # Output
    answer: str
    verification_result: str


def query_understanding_node(state:LegalResearchState):
    rewritten_question= query_understanding_agent(
        llm,
        state.question,
        state.chat_history
    )

    return {
        "search_question": rewritten_question #will update this in state
    }


# Legal Research Node
def legal_research_node(state: LegalResearchState):

    results = legal_research_agent(
        state.db, 
        state.search_question,
        state.user_id,
        state.document_id
    )
    
    return {
        "results": results #do not need to write state.results = results ; Langgraph automatically updates the results field in the shared graph state.
    }


# Legal Context Node
def legal_context_node(state: LegalResearchState):

    context = legal_context_agent(
        state.results
    )

    return {
        "context": context
    }


# # ==========================================
# LEGAL ANALYSIS NODE
# ==========================================
def legal_analysis_node(state: LegalResearchState):

    answer = legal_analysis_agent(
        llm,
        state.question,
        state.context,
        state.chat_history
    )

    return {
        "answer": answer
    }


# ==========================================
# EVIDENCE VERIFICATION NODE
# ==========================================

def evidence_verification_node(state: LegalResearchState):

    verification_result = evidence_verification_agent(
        llm,
        state.context,
        state.answer
    )

    return {
        "verification_result": verification_result
    }


# Fallback Node
def fallback_node(state: LegalResearchState):

    answer = fallback_agent()

    return {
        "answer": answer
    }


# Conditional Routing
def route_after_research(state: LegalResearchState):

    if not state.results:
        return "fallback"

    return "continue"


def route_after_verification(state: LegalResearchState):

    if state.verification_result == "PASS":
        return "end"

    return "fallback"


# Build LangGraph
def build_legal_research_graph():

    graph = StateGraph(LegalResearchState)

    # ragister nodes
    graph.add_node("query_understanding_agent" , query_understanding_node)
    graph.add_node("legal_research_agent", legal_research_node)
    graph.add_node("legal_context_agent", legal_context_node)
    graph.add_node("legal_analysis_agent",legal_analysis_node)
    graph.add_node("evidence_verification_agent",evidence_verification_node)
    graph.add_node("fallback_agent", fallback_node)

    # main flow
    graph.add_edge(START , "query_understanding_agent") #rewrtei questiona after undestanding
    graph.add_edge("query_understanding_agent" , "legal_research_agent")
    graph.add_conditional_edges("legal_research_agent" , route_after_research,{"continue": "legal_context_agent", "fallback": "fallback_agent"})
    graph.add_edge("legal_context_agent" , "legal_analysis_agent")
    graph.add_edge("legal_analysis_agent" , "evidence_verification_agent")
    graph.add_conditional_edges("evidence_verification_agent", route_after_verification,{ "end": END,  "fallback": "fallback_agent"})
    graph.add_edge("fallback_agent" , END)

    return graph.compile()


legal_research_graph = build_legal_research_graph()

