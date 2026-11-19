# Cassius' agents

Prompts and context files Cassius wrote for AI agents working on Twinkle Toes / Music Sampling Shoes. Added 2026-11-18 on the `web-presentation-draft` branch.

| File | What it is |
|---|---|
| [claude-code-prompt-twinkle-toes-site.md](claude-code-prompt-twinkle-toes-site.md) | The Claude Code prompt for the scroll-story presentation website (story order, sections, look and feel). |
| [claude-code-prompt-keep-integrity.md](claude-code-prompt-keep-integrity.md) | Ground rules: refine the teammate's site, don't replace it (audit first, smallest change, one change per commit, never delete). |
| [claude-code-prompt-motion-sprite.md](claude-code-prompt-motion-sprite.md) | The movement scene: one sprite, a pattern wall and the shoe pair (Apple Watch page as technique reference). |
| [`.claude/agents/anti-slop-reviewer.md`](../.claude/agents/anti-slop-reviewer.md) | The anti-slop reviewer agent, from Cassius's other projects. It lives in `.claude/agents/` because Claude Code only runs agents from there. Its checklist is [docs/anti-slop.md](../docs/anti-slop.md). |
| [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) | Full project background: concept, bodystorm, class critique, MVP, Figma maps, related work, open questions. |
| [FIGMA_CONTEXT.md](FIGMA_CONTEXT.md) | Everything from the three Figma files (team board, input/output map, related work). |
| [MVP_CONTEXT.md](MVP_CONTEXT.md) | The built MVP: how it plays, parts, wiring, data flow, test order. |

When these disagree with each other, the prompt wins on story order and section content (it says so itself).
