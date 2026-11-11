# How we work

The routine that has worked well for building Magic Shoes, in one place. The rules behind it are in `AGENTS.md` and [my-instructions.md](my-instructions.md). The lessons are in [what-works.md](what-works.md).

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
