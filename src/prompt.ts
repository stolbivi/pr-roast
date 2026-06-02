import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const promptPath = join(dirname(fileURLToPath(import.meta.url)), "..", "prompt.md");

let cachedTemplate: string | undefined;

function loadTemplate(): string {
  if (!cachedTemplate) {
    cachedTemplate = readFileSync(promptPath, "utf-8");
  }
  return cachedTemplate;
}

export function buildRoastPrompt(vars: {
  title: string;
  description: string;
  filesChanged: number;
  commits: number;
  diffSummary: string;
}): string {
  return loadTemplate()
    .replaceAll("{{title}}", vars.title)
    .replaceAll("{{description}}", vars.description)
    .replaceAll("{{filesChanged}}", String(vars.filesChanged))
    .replaceAll("{{commits}}", String(vars.commits))
    .replaceAll("{{diffSummary}}", vars.diffSummary);
}
