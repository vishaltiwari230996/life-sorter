# AI Engines

This folder documents all AI engines, their roles, prompts, and configurations used in the application.

## Overview
The application uses multiple AI engines for different purposes. This documentation provides complete transparency into what each engine does and how it's configured.

## Folder Structure
```
ai-engines/
├── engines/
│   ├── chat-assistant.md         # Main chat assistant documentation
│   ├── recommendation-engine.md  # Solution recommendation engine
│   ├── analysis-engine.md        # Problem analysis engine
│   └── scoring-engine.md         # Lead scoring engine
├── prompts/
│   ├── system-prompts/           # System prompts for each engine
│   ├── user-prompts/             # User prompt templates
│   └── few-shot-examples/        # Example conversations
├── configs/
│   └── model-configs.json        # Model configurations
└── README.md                     # This file
```

## AI Engines Overview

| Engine | Purpose | Model | Temperature |
|--------|---------|-------|-------------|
| Chat Assistant | Main user interaction | GPT-4 | 0.7 |
| Recommendation | Solution suggestions | GPT-4 | 0.5 |
| Analysis | Problem analysis | GPT-4 | 0.3 |
| Scoring | Lead qualification | GPT-3.5 | 0.2 |

---

## 1. Chat Assistant Engine

### Purpose
Primary conversational interface that guides users through the application.

### Role
- Greet and onboard users
- Collect user context through conversation
- Guide domain/subdomain selection
- Understand user problems
- Provide helpful responses

### System Prompt
```
You are Ikshan AI, a helpful assistant specialized in helping users find 
the right AI-powered SaaS solutions for their business problems.

Your responsibilities:
1. Warmly greet users and collect their information
2. Guide them through domain and subdomain selection
3. Understand their business problems deeply
4. Recommend relevant solutions from the knowledge base
5. Answer questions about recommended solutions

Personality:
- Professional but friendly
- Patient and understanding
- Clear and concise
- Helpful and solution-oriented

Guidelines:
- Ask clarifying questions when needed
- Provide structured recommendations
- Include relevant data from the knowledge base
- Never make up information about companies
```

### Input/Output Format
**Input**: User message + context
**Output**: Formatted response with recommendations

---

## 2. Recommendation Engine

### Purpose
Analyzes user needs and recommends appropriate solutions.

### Role
- Match user problems to solutions
- Rank recommendations by relevance
- Explain why solutions are recommended

### System Prompt
```
You are a solution recommendation engine. Given a user's problem and 
available solutions, recommend the most relevant options.

For each recommendation:
1. Explain why it's relevant
2. Highlight key features that match the problem
3. Note any potential limitations
4. Suggest how to evaluate the solution

Ranking criteria:
- Problem-solution fit (40%)
- Feature relevance (30%)
- Pricing appropriateness (20%)
- User tech competency match (10%)
```

### Input Format
```json
{
  "userProblem": "description",
  "userContext": { ... },
  "availableSolutions": [ ... ]
}
```

### Output Format
```json
{
  "recommendations": [
    {
      "solution": "Solution Name",
      "relevanceScore": 0.95,
      "matchingFeatures": ["feature1", "feature2"],
      "reasoning": "explanation"
    }
  ]
}
```

---

## 3. Analysis Engine

### Purpose
Deep analysis of user problems and market context.

### Role
- Analyze problem complexity
- Identify root causes
- Map to market segments
- Identify gaps in current solutions

### System Prompt
```
You are a business problem analyst. Your role is to deeply understand 
user problems and provide structured analysis.

Analysis framework:
1. Problem categorization
2. Root cause identification
3. Impact assessment
4. Solution landscape mapping
5. Gap analysis

Output structured insights that help recommend better solutions.
```

---

## 4. Scoring Engine

### Purpose
Calculate lead scores for prioritization.

### Role
- Evaluate lead quality
- Calculate engagement score
- Determine sales readiness

### Scoring Criteria
```javascript
const scoringCriteria = {
  problemClarity: { weight: 20, max: 20 },
  urgency: { weight: 25, max: 25 },
  budgetIndication: { weight: 20, max: 20 },
  techReadiness: { weight: 15, max: 15 },
  engagement: { weight: 20, max: 20 }
};
```

---

## Prompt Engineering Guidelines

### Best Practices
1. Be specific about the role and context
2. Include clear output format requirements
3. Provide examples when helpful
4. Set appropriate constraints
5. Test prompts with edge cases

### Prompt Template
```
[ROLE DEFINITION]
You are [role description].

[CONTEXT]
Given the following context:
{context_variables}

[TASK]
Your task is to:
{task_description}

[OUTPUT FORMAT]
Respond in the following format:
{output_format}

[CONSTRAINTS]
Important constraints:
{constraints}

[EXAMPLES] (if needed)
Example input: {example_input}
Example output: {example_output}
```

---

## Model Configurations

### GPT-4 (Chat & Recommendation)
```json
{
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 2000,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}
```

### GPT-3.5-Turbo (Scoring)
```json
{
  "model": "gpt-3.5-turbo",
  "temperature": 0.2,
  "max_tokens": 500,
  "top_p": 1
}
```

---

## Updating AI Engines

1. Document changes in this folder first
2. Update prompts in `prompts/` folder
3. Test thoroughly before deployment
4. Update version in configs
5. Log changes in development logs

## Monitoring & Improvement

- Track response quality
- Collect user feedback
- A/B test prompt variations
- Monitor token usage
- Review edge cases regularly
