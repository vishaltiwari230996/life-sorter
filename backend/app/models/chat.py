"""
Chat models — request/response schemas for the chat endpoint.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class Persona(str, Enum):
    """Available chat personas."""
    PRODUCT = "product"
    CONTRIBUTOR = "contributor"
    ASSISTANT = "assistant"
    DEFAULT = "default"


class ConversationMessage(BaseModel):
    """A single message in the conversation history."""
    role: str = Field(..., description="Message role: 'user', 'assistant', or 'system'")
    content: str = Field(..., description="Message text content")


class ChatContext(BaseModel):
    """Optional context for chat requests."""
    generateBrief: bool = False
    isRedirecting: bool = False
    domain: Optional[str] = None
    subDomain: Optional[str] = None


class ChatRequest(BaseModel):
    """Request body for the chat endpoint."""
    message: str = Field(..., min_length=1, description="The user's message")
    persona: Persona = Persona.DEFAULT
    context: Optional[ChatContext] = None
    conversationHistory: Optional[list[ConversationMessage]] = None
    stage: int = Field(default=1, ge=1, le=2, description="Chat stage: 1 (free) or 2 (paid)")
    payment_order_id: Optional[str] = Field(
        default=None,
        description="JusPay order ID — required for stage 2",
    )


class ChatResponse(BaseModel):
    """Response from the chat endpoint."""
    message: str
    usage: Optional[dict] = None
