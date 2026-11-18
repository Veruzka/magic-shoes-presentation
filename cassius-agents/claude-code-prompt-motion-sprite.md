# Claude Code prompt: movement scene with sprite, pattern wall and shoe (motion graphics)

Paste everything below the line into Claude Code. It adds one signature scene to the presentation website: the **Concept / movement** section.

---

## Your role

You are a motion designer for the web. Build one scroll-driven scene that feels as polished as an Apple product page. Read `PROJECT_CONTEXT.md` first. Follow the existing site's look and code (see the "refine, don't replace" rules); this scene is an addition, not a redesign.

## Reference

A screen recording of Apple's Apple Watch workouts page: a headline with a gradient, then a wall of round badges, each holding a bright single-color pictogram of a different activity (running, cycling, yoga, kicks, hiking). The wall starts zoomed in on a few large badges and **pulls back on scroll** to reveal dozens of smaller ones, all gently in motion. Borrow the **technique and feel** (pictograms in circles, a living pattern wall, the pull-back reveal, gradient type). Do not copy Apple's icons, copy or branding.

## The scene

**One hero sprite, one pattern wall, one shoe, all in sync.**

1. **The sprite (foreground).** A single **electric cyan-blue** animated pictogram figure (one sprite only), flat and bold, performing our movements in place while the viewer scrolls: walk → run → spin → dancer's pose → side kick → feet to the sky → heel click. The figure stays centered; only its body moves ("motion in place"). Scroll position chooses the movement; each movement loops smoothly while it is active and blends into the next.
2. **The pattern wall (background).** Behind the sprite, a grid of round badges, each showing a small pictogram of **the same movement the sprite is doing**, at **lower opacity** (about 15 to 25%) so it reads as texture, not competition. When the sprite changes movement, the wall changes with it in a staggered ripple from the center outward. The wall drifts slowly and does the Apple-style pull-back as the scene begins.
3. **The shoes (.glb).** The 3D shoe from `/assets/models/` starts large on screen. As the sprite starts walking, it **scales down into the sprite's world** and becomes **a pair**: clone the model, mirror it for the other foot, and settle one shoe onto each of the sprite's feet, so the viewer understands these shoes are what's on the moving body (each player wears a full pair). Both ride along with every movement. On exiting the scene, the pair lifts off and scales back up for the next section (the shoe breaking apart into its parts).
4. **Label.** One short line under the sprite naming the current movement (for example "Side kick"), crossfading on change. Nothing else. Less is more.

## Visual rules

- **Electric cyan-blue sprite** that glows against a dark background (the way the reference's lime green pops), a lighter, low-opacity tint of the same blue for the wall pictograms. Badges are soft circles slightly lighter than the background.
- Pictograms: flat, single color, rounded strokes, no faces or detail. If the repo has the bodystorm pictograms (from the synthesis, drawn from our tracked poses), base the sprite poses on those so the site's figures match our research.
- Motion: springy and playful, never stiff. Ease every transition; no linear tweens.
- Text: gradient on the headline only, as in the reference.
- **Silent.** No audio in this scene. Show sound visually instead: small cyan ripples or rings pulse out from the feet on each step, stomp and kick.

## How to build it

- **GSAP + ScrollTrigger** for the scroll timeline (pin the scene; scrub through it).
- **Sprite:** one SVG figure with named limbs (head, torso, upper/lower arms and legs, feet) animated by keyframed rotations per movement, so all movements share one rig and blend smoothly. Fall back to a sprite sheet only if a pose can't be rigged.
- **Pattern wall:** reuse the same rig's poses as small static or lightly looping SVGs; generate the grid in JS. Keep it cheap: CSS transforms and opacity only, no layout thrashing.
- **Shoes:** Three.js loading the `.glb` once, with a mirrored clone for the second foot, rendered in a canvas layered over the SVG. Drive both shoes' scale, position and rotation from the same ScrollTrigger timeline, anchored to the left and right foot of the rig, so they line up at every scroll position. Until the model arrives, use a simple placeholder shape with the same anchor point.
- **Timeline (scene progress 0 to 100%):** 0 to 15% wall pulls back, shoe large; 15 to 30% the shoe scales down and splits into a pair on the sprite's feet as it starts walking; 30 to 90% the movements, about 8% each; 90 to 100% the pair lifts off and the shoe scales up into the next section.
- **Performance:** 60 fps on a laptop in Chrome. Pause off-screen animation. Keep the `.glb` light.
- **Accessibility:** with `prefers-reduced-motion`, show each movement as a still pose with a fade, and skip the wall drift.
- Keyboard navigation (arrow keys) must still jump through the scene's movements during the live presentation.

## Done when

- [ ] The sprite performs all seven movements in place, driven by scroll, with smooth blends.
- [ ] The background wall mirrors the current movement at low opacity and changes with a ripple.
- [ ] The shoe scales down into a pair on the sprite's feet and stays aligned through every movement (placeholder until the `.glb` arrives).
- [ ] Footstep ripples show sound visually; no audio plays.
- [ ] The scene hands off cleanly to the next section, with the shoe scaling back up.
- [ ] Runs smoothly, respects reduced motion, and works with arrow keys.
- [ ] Committed on the working branch with a short note on what to tune.
