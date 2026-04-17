import { generateText } from "./claude";

export type OutreachType = "guest_post" | "resource" | "broken_link" | "partnership";

export interface OutreachParams {
  type: OutreachType;
  prospectDomain: string;
  prospectName?: string;
  context: string;
}

export interface OutreachEmail {
  subject: string;
  body: string;
}

const OUTREACH_TEMPLATES: Record<OutreachType, { subjectTemplate: string; bodyPrompt: string }> = {
  guest_post: {
    subjectTemplate: "Content collaboration idea for {domain}",
    bodyPrompt: "Write a professional outreach email proposing a guest post collaboration.",
  },
  resource: {
    subjectTemplate: "Resource suggestion for your page on {domain}",
    bodyPrompt: "Write a professional outreach email suggesting our resource as an addition to their page.",
  },
  broken_link: {
    subjectTemplate: "Quick fix for a broken link on {domain}",
    bodyPrompt: "Write a professional outreach email notifying about a broken link and suggesting our resource as a replacement.",
  },
  partnership: {
    subjectTemplate: "Partnership opportunity with {domain}",
    bodyPrompt: "Write a professional outreach email proposing a mutually beneficial partnership.",
  },
};

export async function generateOutreachEmail(
  params: OutreachParams
): Promise<OutreachEmail> {
  // TODO: Implement real AI-powered email generation with personalization
  try {
    const template = OUTREACH_TEMPLATES[params.type];
    const recipientName = params.prospectName ?? "there";

    const prompt = `${template.bodyPrompt}

Details:
- Recipient: ${recipientName} at ${params.prospectDomain}
- Type: ${params.type.replace("_", " ")}
- Context: ${params.context}

Requirements:
- Professional but friendly tone
- Personalized to the prospect
- Clear value proposition
- Under 200 words
- Include a clear call to action

Return JSON: { "subject": "...", "body": "..." }`;

    const response = await generateText(prompt, { maxTokens: 1024 });

    try {
      const parsed = JSON.parse(response);
      return {
        subject: String(parsed.subject ?? template.subjectTemplate.replace("{domain}", params.prospectDomain)),
        body: String(parsed.body ?? ""),
      };
    } catch {
      // Fallback if AI response isn't valid JSON
      return {
        subject: template.subjectTemplate.replace("{domain}", params.prospectDomain),
        body: `Hi ${recipientName},\n\nI came across ${params.prospectDomain} and wanted to reach out about a potential ${params.type.replace("_", " ")} opportunity.\n\n${params.context}\n\nWould you be open to discussing this further?\n\nBest regards`,
      };
    }
  } catch (error) {
    console.error("generateOutreachEmail error:", error);
    throw new Error(
      `Failed to generate outreach email: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
