# Solution Framework

This folder contains the prompt library, workflow documentation, and master prompts that define how the application works.

## Purpose
- Document the complete application workflow
- Store the prompt library for reuse
- Maintain master prompts and configurations
- Provide a single source of truth for the solution architecture

## Folder Structure
```
solution-framework/
├── workflow/
│   ├── user-journey.md           # Complete user journey documentation
│   ├── conversation-flow.md      # Chat conversation flows
│   └── decision-trees.md         # Decision logic documentation
├── prompts/
│   ├── master-prompts.md         # Master prompts collection
│   ├── domain-prompts/           # Domain-specific prompts
│   └── utility-prompts/          # Utility prompts
├── architecture/
│   ├── system-overview.md        # System architecture overview
│   └── data-flow.md              # Data flow documentation
└── README.md                     # This file
```

---

## Application Workflow

### High-Level Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Lands    │ -> │   Onboarding    │ -> │ Domain Selection│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  AI Response    │ <- │Problem Analysis │ <- │ Problem Input   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         v
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Recommendations │ -> │  User Feedback  │ -> │   Lead Saved    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Detailed Steps

#### Step 1: User Landing
- User arrives at the application
- Welcome message displayed
- Identity form shown (name, email)

#### Step 2: Onboarding
- Collect user identity
- Save to localStorage
- Create initial chat session

#### Step 3: Domain Selection
- Present domain options via quick actions
- User selects primary domain
- Store domain in context

#### Step 4: Subdomain Selection
- Based on domain, show subdomain options
- User selects specific area
- Refine context further

#### Step 5: Problem Input
- Guide user to describe their problem
- Collect additional context through conversation
- Prepare problem summary

#### Step 6: Problem Analysis
- AI analyzes the problem
- Match against knowledge base
- Identify relevant solutions

#### Step 7: AI Response
- Generate contextual response
- Include relevant recommendations
- Provide actionable insights

#### Step 8: Recommendations
- Display matching solutions
- Show relevance scores
- Provide comparison data

#### Step 9: User Feedback
- Collect user feedback on recommendations
- Refine suggestions if needed
- Answer follow-up questions

#### Step 10: Lead Saved
- Save complete lead data to database
- Calculate lead score
- Trigger any automations

---

## Master Prompts

### 1. System Master Prompt
```markdown
# Ikshan AI System Prompt

You are Ikshan AI, an intelligent assistant that helps users discover 
the right AI-powered SaaS solutions for their business challenges.

## Core Identity
- Name: Ikshan AI
- Role: AI Solution Discovery Assistant
- Tone: Professional, friendly, helpful

## Primary Objectives
1. Understand user's business context
2. Identify their specific problems
3. Recommend relevant AI solutions
4. Guide them through the selection process

## Knowledge Base Access
You have access to a curated database of AI SaaS solutions across domains:
- Personal Productivity
- B2B SaaS
- E-commerce
- Health & Wellness
- Finance
- Education

## Response Guidelines
- Always be helpful and solution-oriented
- Ask clarifying questions when needed
- Provide structured, easy-to-read responses
- Include relevant data when recommending solutions
- Never fabricate information about companies
- Acknowledge limitations honestly

## Conversation Structure
1. Greet and establish rapport
2. Collect necessary context
3. Understand the problem deeply
4. Provide relevant recommendations
5. Answer follow-up questions
6. Guide next steps
```

### 2. Recommendation Prompt Template
```markdown
# Recommendation Generation Prompt

Given:
- User Context: {user_context}
- Problem Description: {problem_description}
- Available Solutions: {solutions_list}

Generate recommendations following this structure:

## Top Recommendations

### 1. [Solution Name]
**Why it's relevant:** [Explanation]
**Key Features:**
- Feature 1
- Feature 2

**Pricing:** [Pricing info]
**Best for:** [Use case]

[Repeat for top 3-5 recommendations]

## Comparison Table
| Solution | Fit Score | Key Feature | Pricing |
|----------|-----------|-------------|---------|
| ... | ... | ... | ... |

## Next Steps
[Actionable recommendations]
```

### 3. Problem Analysis Prompt
```markdown
# Problem Analysis Prompt

Analyze the following user problem:
"{problem_description}"

User Context:
- Domain: {domain}
- Role: {role}
- Business Type: {business_type}

Provide analysis in this format:

## Problem Summary
[Concise problem statement]

## Root Causes
1. [Cause 1]
2. [Cause 2]

## Impact Assessment
- Business Impact: [High/Medium/Low]
- Urgency: [High/Medium/Low]

## Solution Categories
[Types of solutions that could address this]

## Key Considerations
[Important factors for solution selection]
```

---

## Prompt Library

### Utility Prompts

#### Summarization
```
Summarize the following in 2-3 sentences: {content}
```

#### Extraction
```
Extract the following information from the text:
- Main problem: 
- Key requirements:
- Constraints:

Text: {text}
```

#### Classification
```
Classify the following into one of these categories: {categories}
Text: {text}
Return only the category name.
```

### Domain-Specific Prompts

Located in `prompts/domain-prompts/`:
- `saas-prompts.md`
- `ecommerce-prompts.md`
- `productivity-prompts.md`
- etc.

---

## Key Metrics to Track

| Metric | Description | Target |
|--------|-------------|--------|
| Response Relevance | How relevant are AI responses | > 85% |
| Recommendation Accuracy | Do recommendations match needs | > 80% |
| User Satisfaction | User feedback scores | > 4.0/5 |
| Conversation Completion | Users completing full flow | > 70% |
| Lead Quality Score | Average lead score | > 60 |

---

## Updating This Framework

1. Document proposed changes
2. Test with sample conversations
3. Update relevant prompts
4. Update workflow documentation
5. Log changes in development logs
6. Review metrics after deployment
