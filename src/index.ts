import { Probot } from "probot";
import Anthropic from "@anthropic-ai/sdk";
import { buildRoastPrompt } from "./prompt.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default (app: Probot) => {
  app.on(["pull_request.opened", "pull_request.synchronize"], async (context) => {
    const pr = context.payload.pull_request;

    const { data: files } = await context.octokit.rest.pulls.listFiles({
      ...context.repo(),
      pull_number: pr.number,
    });

    const roast = await getRoast(pr, files);

    await context.octokit.rest.issues.createComment({
      ...context.repo(),
      issue_number: pr.number,
      body: roast,
    });
  });
};

async function getRoast(
  pr: { title: string; body: string | null; commits?: number },
  files: Array<{ filename: string; additions: number; deletions: number; patch?: string }>
): Promise<string> {
  const diffSummary = files
    .slice(0, 10)
    .map(
      (f) =>
        `### ${f.filename} (+${f.additions}/-${f.deletions})\n${(f.patch ?? "").slice(0, 800)}`
    )
    .join("\n\n");

  const prompt = buildRoastPrompt({
    title: pr.title,
    description: pr.body ?? "none — classic",
    filesChanged: files.length,
    commits: pr.commits ?? 0,
    diffSummary,
  });

  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  return (msg.content[0] as Anthropic.TextBlock).text;
}
