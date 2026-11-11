# How we work

The routine that has worked well for building Magic Shoes, in one place. The rules behind it are in `AGENTS.md` and [my-instructions.md](my-instructions.md). The lessons are in [what-works.md](what-works.md).

## Working with Claude: what to say
You don't need to open these docs to work with Claude. `AGENTS.md` is loaded automatically every session and tells Claude to follow them. Just talk normally. These phrases switch on the right process:

| You say | Claude does |
|---|---|
| "Let's add / change X" + a reference image | Asks quick questions, plans, waits for your OK, builds in small steps, checks, updates the docs |
| "This looks wrong" + a screenshot of the spot | Follows [visual-checks.md](visual-checks.md): zooms in at 2×, finds the cause, shows a before/after |
| "The motion feels off / jumps / is slow" + what happened and what's different on a second try | Follows [debugging-motion.md](debugging-motion.md): wheel-notch walk, frame check, suspects |
| "Make a new image of X" | Follows the AI image steps in [tools-and-setup.md](tools-and-setup.md): prompt template, keep the original, cut out, measure, log credits |
| "Add another sensor / part" | Follows the checklist in [electronics-style-guide.md](electronics-style-guide.md) |
| "I like this" / "perfect" | Records it in [what-works.md](what-works.md) |
| "From now on, always…" | Adds it to [my-instructions.md](my-instructions.md) and follows it |
| "Save a checkpoint" / "go back to checkpoint N" / "push" | Follows [checkpoints.md](checkpoints.md), or publishes to GitHub |

**When to open a doc yourself:**
- **To tweak something:** [how-to-change-things.md](how-to-change-things.md).
- **To see what's open:** [design-improvements.md](design-improvements.md), also shown in the app's "i" panel.
- **To look up a word:** [glossary.md](glossary.md).
- **To review a session:** [changelog.md](changelog.md).

**Two habits that help most:**
- **Point at a doc when you want something done the same way again,** e.g. "do it like the FSR, following the electronics style guide". Claude then reuses the recipe instead of improvising.
- **Say so when a doc is wrong or a step was skipped.** Claude fixes the doc too, so the fix lasts.

## Each piece of work, step by step
1. **You describe it.** Reference images help most: a screenshot, a photo, or a sample in the style you want. For problems: what you did, what you expected, what happened, and what's different on a second try.
2. **I ask a few quick multiple-choice questions** about what you're trying to learn and the real design choices, with my recommendation first. You can always answer "other".
3. **I describe the plan and wait for your OK.** The plan says which files change, what you'll see, and how I'll check it.
4. **I build it in small steps,** one visible change at a time. Big motion is split into pieces (e.g. one shoe layer at a time).
5. **I check it:**
   - **looks:** [visual-checks.md](visual-checks.md), zoomed at 2× and in a real browser for sharpness
   - **motion:** `npm run debug:walk` (logic) and `npm run debug:stalls` (smoothness, under about 20ms per frame)
   - **build:** `npm run build`
6. **I update the docs** it affected (see "Where things go" below).
7. **I save it locally** (a git commit). Nothing is published until you say **"push"**. Vercel then publishes from GitHub. The Vercel command-line tool is never used.
8. **I tell you what to look at:** where to click and how far to scroll.
9. **You react.** If you like it, it goes into [what-works.md](what-works.md). If not, we adjust in small rounds. Screenshots of the exact problem are the fastest.
10. **Checkpoints when you ask:** a named snapshot to come back to ([checkpoints.md](checkpoints.md)).

## Where things go
| Kind of information | Doc |
|---|---|
| How to change a setting | [how-to-change-things.md](how-to-change-things.md) |
| How the parts fit together; every AI image | [architecture.md](architecture.md) |
| Page-wide visual rules | [design-spec.md](design-spec.md) |
| The look and motion of electronics | [electronics-style-guide.md](electronics-style-guide.md) |
| What changed each session (and AI prompts) | [changelog.md](changelog.md) |
| What you liked, what failed, lessons | [what-works.md](what-works.md) |
| Your lasting instructions | [my-instructions.md](my-instructions.md) |
| Known issues, ideas and open decisions | [design-improvements.md](design-improvements.md) |
| Tools and Mac quirks | [tools-and-setup.md](tools-and-setup.md) |
| Words we use | [glossary.md](glossary.md) |

**Rule:** each fact has one home. Other docs link to it instead of repeating it. When a technique becomes reusable, it gets its own recipe doc.

## Habits that keep it fast
- **Build options as switchers** when there are two good directions, so you can compare them on the page (Style lab).
- **Measure, don't guess:** read the page's numbers and the images' pixels before changing code.
- **Bake expensive effects** (textures, filters) into pictures once.
- **Keep AI originals** in `design/originals/`, at most 2–3 tries per image, and log every credit.
- **Every setting you might tweak** lives in a plain settings file in `src/shoes/` or `src/backgrounds/`, with a comment saying what it does.
