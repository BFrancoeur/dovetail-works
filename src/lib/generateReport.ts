import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type DiagnosticInput = {
  workType?: string
  projectSize?: string
  monthlyLeads?: string
  leadSource?: string
  responseTime?: string
  biggestProblem?: string
  followUp?: string
  firstName?: string
  companyName?: string
}

export type GeneratedReport = {
  heroHeadline: string
  heroSubheadline: string
  whatThisMeans: string[]
  whatWereSeeing: string[]
  systemProblemTitle: string
  systemProblemBody: string
  costingYou: string[]
  whatYouWant: string[]
  nextStepHeading: string
  nextStepBody: string
}

export async function generateReport(input: DiagnosticInput): Promise<GeneratedReport> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are a lead generation expert for home remodeling companies doing $1M–$4M annually.
Write diagnostic reports that are direct, specific, and actionable. No fluff.
Speak directly to a busy contractor. Short sentences. Plain language.
Every insight must tie back to the specific answers provided — no generic advice.`,
    tools: [
      {
        name: 'generate_diagnostic_report',
        description: 'Generate a structured diagnostic report based on contractor answers',
        input_schema: {
          type: 'object' as const,
          properties: {
            heroHeadline: {
              type: 'string',
              description: 'Bold headline naming their specific lead problem. Max 10 words. Examples: "You\'re Getting Leads—But Too Many Aren\'t Worth Your Time"',
            },
            heroSubheadline: {
              type: 'string',
              description: 'One sentence explaining what the report will show them, specific to their answers.',
            },
            whatThisMeans: {
              type: 'array',
              items: { type: 'string' },
              description: '3 specific insights about what their answers reveal. Start each with a short bold keyword.',
            },
            whatWereSeeing: {
              type: 'array',
              items: { type: 'string' },
              description: '3 concrete problems actively happening in their business based on their answers.',
            },
            systemProblemTitle: {
              type: 'string',
              description: 'Title for the system problem callout. Example: "This Isn\'t a Lead Problem—It\'s a System Problem"',
            },
            systemProblemBody: {
              type: 'string',
              description: 'Two sentences explaining why more leads won\'t fix this, specific to their situation.',
            },
            costingYou: {
              type: 'array',
              items: { type: 'string' },
              description: '3 specific costs this situation is causing them right now.',
            },
            whatYouWant: {
              type: 'array',
              items: { type: 'string' },
              description: '3 concrete outcomes they want instead.',
            },
            nextStepHeading: {
              type: 'string',
              description: 'Heading for the booking CTA. Example: "Here\'s the Next Step"',
            },
            nextStepBody: {
              type: 'string',
              description: 'One sentence explaining what happens on the call and why it\'s worth their time.',
            },
          },
          required: [
            'heroHeadline', 'heroSubheadline', 'whatThisMeans', 'whatWereSeeing',
            'systemProblemTitle', 'systemProblemBody', 'costingYou', 'whatYouWant',
            'nextStepHeading', 'nextStepBody',
          ],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'generate_diagnostic_report' },
    messages: [
      {
        role: 'user',
        content: `Generate a diagnostic report for this remodeling contractor:

Company: ${input.companyName || 'their company'}
Type of work: ${input.workType || 'general remodeling'}
Typical project size: ${input.projectSize || 'not specified'}
Monthly leads: ${input.monthlyLeads || 'not specified'}
Primary lead source: ${input.leadSource || 'not specified'}
Response time: ${input.responseTime || 'not specified'}
Biggest problem: ${input.biggestProblem || 'not specified'}
Follow-up approach: ${input.followUp || 'not specified'}`,
      },
    ],
  })

  const toolUse = response.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude did not return structured output')
  }

  return toolUse.input as GeneratedReport
}
