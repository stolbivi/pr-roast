import { Probot } from "probot";
import Anthropic from "@anthropic-ai/sdk";

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

  const prompt = `You are a brutally honest but funny senior engineer doing a PR roast.
PR title: "${pr.title}"
PR description: "${pr.body ?? "none — classic"}"
Files changed: ${files.length}, Commits: ${pr.commits ?? 0}

Diff:
${diffSummary}

Roast this PR. Format:
**The Verdict** — one savage opening line
**Offenses** — 3-5 specific jokes tied to actual code issues, each ending with the real fix in italics
**The Real Talk** — 3 deadpan bullet points of genuine improvements
**Merge-ability Score** — X/10 with a one-line justification`;

  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  return (msg.content[0] as Anthropic.TextBlock).text;
}
