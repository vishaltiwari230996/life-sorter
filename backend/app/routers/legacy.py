"""
Legacy API Compatibility Routes

Maps the old Vercel serverless function paths to the new FastAPI services.
This allows the existing frontend to work without modification.

Old Path               -> New FastAPI Handler
/api/chat              -> openai_service.chat_completion
/api/companies         -> sheets_service.fetch_companies_by_domain
/api/search-companies  -> sheets_service.search_companies
/api/save-idea         -> Google Sheets webhook (httpx)
"""

from __future__ import annotations

import structlog
import httpx
from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional

from app.config import get_settings
from app.services import openai_service, sheets_service

logger = structlog.get_logger()

router = APIRouter()


# -- /api/chat (matches old api/chat.js) --

class LegacyChatRequest(BaseModel):
    message: str
    persona: str = "assistant"
    context: Optional[dict] = None
    conversationHistory: Optional[list] = None


@router.post("/chat")
async def legacy_chat(request: Request, body: LegacyChatRequest):
    """Legacy chat endpoint matching old Vercel /api/chat."""
    settings = get_settings()

    if not settings.openai_api_key_active:
        raise HTTPException(status_code=500, detail="API key not configured")

    try:
        result = await openai_service.chat_completion(
            message=body.message,
            persona=body.persona,
            context=body.context,
            conversation_history=body.conversationHistory,
        )
        return {"message": result["message"], "usage": result.get("usage")}
    except Exception as e:
        logger.error("Legacy chat error", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


# -- /api/companies (matches old api/companies.js) --

@router.get("/companies")
async def legacy_companies(
    request: Request,
    domain: str = Query(default=None),
):
    """Legacy companies endpoint matching old Vercel /api/companies."""
    result = await sheets_service.fetch_companies_by_domain(domain)
    return result


# -- /api/search-companies (matches old api/search-companies.js) --

class LegacySearchRequest(BaseModel):
    domain: str = ""
    subdomain: str = ""
    requirement: str = ""
    goal: str = ""
    role: str = ""
    userContext: Optional[dict] = None


@router.post("/search-companies")
async def legacy_search_companies(request: Request, body: LegacySearchRequest):
    """Legacy search endpoint matching old Vercel /api/search-companies."""
    result = await sheets_service.search_companies(
        domain=body.domain,
        subdomain=body.subdomain,
        requirement=body.requirement,
        user_context=body.userContext,
    )
    return result


# -- /api/save-idea (matches old api/save-idea.js) --

class LegacySaveIdeaRequest(BaseModel):
    userMessage: str = ""
    botResponse: str = ""
    timestamp: str = ""
    userName: str = ""
    userEmail: str = ""
    domain: str = ""
    subdomain: str = ""
    requirement: str = ""
    source: str = "Ikshan Website - New Flow"


@router.post("/save-idea")
async def legacy_save_idea(request: Request, body: LegacySaveIdeaRequest):
    """Legacy save-idea endpoint matching old Vercel /api/save-idea."""
    settings = get_settings()

    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        # Silently succeed if webhook not configured (non-critical)
        logger.warning("Google Sheets webhook not configured, skipping save")
        return {"success": True, "message": "Skipped (webhook not configured)"}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                settings.GOOGLE_SHEETS_WEBHOOK_URL,
                json=body.model_dump(),
            )

        return {"success": True, "message": "Saved"}
    except Exception as e:
        logger.error("Save idea error", error=str(e))
        return {"success": False, "error": str(e)}
