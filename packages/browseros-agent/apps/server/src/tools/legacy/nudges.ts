import { z } from 'zod'
import { defineTool } from './framework'

export const suggest_schedule = defineTool({
  name: 'suggest_schedule',
  description:
    'Call this to suggest scheduling a task. Use in two cases: (1) MANDATORY after completing a task that could run on a recurring schedule (news, monitoring, reports, price tracking, data gathering). (2) Immediately when the user explicitly asks to schedule, automate, or repeat the current task — do NOT ask for clarification, infer all parameters from context. Do NOT call if the task requires real-time user interaction.',
  input: z.object({
    query: z.string().describe('The original user query to schedule'),
    suggestedName: z
      .string()
      .describe(
        'A short, descriptive name for the scheduled task (e.g. "Morning News Briefing")',
      ),
    scheduleType: z
      .enum(['daily', 'hourly'])
      .describe('How often the task should run'),
    scheduleTime: z
      .string()
      .optional()
      .describe(
        'Suggested time for daily tasks in HH:MM format (e.g. "09:00"). Ignored for hourly.',
      ),
  }),
  handler: async (args, _ctx, response) => {
    response.text(
      JSON.stringify({
        type: 'schedule_suggestion',
        query: args.query,
        suggestedName: args.suggestedName,
        scheduleType: args.scheduleType,
        scheduleTime: args.scheduleTime ?? '09:00',
      }),
    )
  },
})
