# Context File

This folder manages user context building for more personalized and effective AI interactions.

## Purpose
- Collect and organize user information through conversations
- Build comprehensive user profiles
- Enable AI to provide more relevant recommendations
- Store context for consistent user experience across sessions

## Folder Structure
```
context-file/
├── schemas/
│   ├── user-profile.schema.js    # User profile schema
│   └── business-context.schema.js # Business context schema
├── builders/
│   ├── profile-builder.js        # User profile builder
│   └── context-aggregator.js     # Context aggregation
├── questions/
│   ├── onboarding-flow.json      # Initial onboarding questions
│   ├── business-questions.json   # Business-related questions
│   └── preference-questions.json # User preference questions
├── templates/
│   └── context-summary.md        # Context summary template
└── README.md                     # This file
```

## Context Categories

### 1. User Identity
- Name
- Email
- Role/Title
- Company (if applicable)

### 2. Domain Context
- Selected domain (SaaS, E-commerce, etc.)
- Subdomain specialization
- Industry experience level

### 3. Problem Context
- Problem description
- Pain points
- Previous solutions tried
- Urgency level

### 4. Business Context
- Business type
- Business size
- Current tech stack
- Budget range

### 5. Preference Context
- Communication style preference
- Detail level preference
- Learning style

## Question Flow

### Onboarding Questions
```json
{
  "step": 1,
  "question": "What's your name?",
  "type": "text",
  "contextField": "userName"
}
```

### Dynamic Questions
Questions adapt based on previous answers:
- If user selects "SaaS" → Show SaaS-specific questions
- If user mentions "startup" → Ask about funding stage

## Context Building Process

```
User Input → Question Handler → Context Builder → Profile Update → AI Enhancement
```

### Flow Diagram
```
1. User starts conversation
2. Identity collection (name, email)
3. Domain selection
4. Problem description
5. Business context
6. Generate context summary
7. Use context in AI prompts
```

## Context Summary Format

```markdown
## User Context Summary

### Identity
- Name: [User Name]
- Email: [User Email]
- Role: [User Role]

### Domain
- Primary: [Domain]
- Sub-domain: [Subdomain]

### Problem
- Description: [Problem]
- Urgency: [High/Medium/Low]
- Previous Solutions: [List]

### Business
- Type: [Business Type]
- Size: [Business Size]

### Preferences
- Communication: [Formal/Casual]
- Detail Level: [High/Medium/Low]
```

## Using Context in AI Prompts

```javascript
const contextEnhancedPrompt = `
Based on the user's context:
- They are a ${context.role} in the ${context.domain} space
- Their main problem is: ${context.problemDescription}
- They have ${context.techCompetency} technical competency

Please provide recommendations that are:
- Relevant to their ${context.domain} domain
- Appropriate for their technical level
- Addressing their specific problem
`;
```

## Storage

### LocalStorage (Client-side)
- Basic user preferences
- Session context

### Database (Server-side)
- Complete user profiles
- Historical context
- Cross-session data

## Privacy Considerations
1. Only collect necessary information
2. Allow users to view/delete their data
3. Encrypt sensitive context data
4. Clear context on user request
5. Follow data retention policies

## Adding New Context Fields

1. Update schema in `schemas/`
2. Add questions in `questions/`
3. Update builder in `builders/`
4. Update AI prompts to use new context
5. Document changes
