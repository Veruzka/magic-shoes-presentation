# Twinkle Toes / Music Sampling Shoes: Project Context

Rich background for anyone (or any agent) working on this project: the presentation website, the build, or the write-up. Read this before making content decisions. Facts are labeled with where they came from. Where sources disagree, both are kept and flagged.

Last compiled: 17 Nov 2026.

---

## 1. At a glance

| | |
|---|---|
| Course | NWMEDIA C262 Theory and Practice of Tangible User Interfaces, UC Berkeley, Fall 2026 |
| Instructors | Prof. Kimiko Ryokai, TA Connie Gu |
| Team | Cassius Palacio (author order: first), Elizabeth (Liz) Wang, Kimney Nguyen, Veruzka Oropeza, Vinay Thorat (credited on the Medium post and the MVP build) |
| Names in use | "Twinkle Toes" (Liz's Medium post), "Music Sampling Shoes" (the MVP), "Shoes as Instruments" (bodystorm documents), "SonicStride" (early concept name, no longer used for the build) |
| Brief from Kimiko | Make shoes an instrument that moves people beyond walking |
| Key dates | Bodystorm 29 Oct 2026 · Class critique of the synthesis 4 Nov · MVP due 9 Nov · Team input/output decision meeting 13 Nov · Website rough draft 17 Nov, refined 18 Nov |

**One-line pitch (draft):** Shoes that turn your movement into sound, so two people can play, copy each other and make up stories together.

---

## 2. Where the concept stands now (latest first)

These are Cassius's positions from team discussions. Treat them as the current direction unless the team changes them.

**For the presentation website (17 Nov):**
- Section order: **1. Concept first, 2. What we've built, 3. Process.** Explain what we're doing right off the bat.
- The site tells the **changing worlds** story: two players move through worlds made of sound (Sky, Lava, Forest, Water). When both stomp together, they swap sound sets and everyone moves to the next world.

**From the 13 Nov team meeting:**
- The shoe is a **scene partner**: sounds should prompt players toward generative play and storytelling, and feel like a partner rather than a sound effect.
- The real scene partner is **the other player**. The shoes only respond to movement. Copying the other player's move should **heighten** the sound.
- Sound effects **personify and embody each motion** so play feels believable (scene partner, social clustering).
- "The next world" means moving between **game-like and ambient moods**. One note from that day also says the team is *not* building distinct games or worlds: "the world is human imagination."
- The team is building its **own sound-effect library**.
- Success looks like players **copying each other and making up stories unprompted** (TUI as improv).
- **2 players, each wearing a full pair** (4 shoes). Each shoe gets an **FSR + gyro**. Cassius and a teammate are building integrated shoes to house the parts. Engineering decides whether each shoe keeps its own Minima + XIAO or moves to a more dedicated hardware setup.
- Target user: undecided. Test site: none fixed ("any place can be a stage").

**From the 12 Nov input/output planning (Figma map):**
- Sound only (no LEDs, haptics or projection). Laptop speakers.
- Push for **kick, heel click and dancer's pose** as signature moves.
- Keep the MVP **stomp swap**.
- Open-ended play, no winner. A heel click ends the session ("back home").
- Purely sensory: **no phone camera, no copper tape**.

> **Flag:** "changing worlds" (site, 12 and 17 Nov) and "the world is human imagination, no distinct worlds" (13 Nov) pull in different directions. One way to reconcile them: the worlds are sound palettes that set a mood, and the stories are still the players' own. Confirm with the team.

---

## 3. Kimiko's framing (29 Oct session, the guiding brief)

- Make shoes an instrument.
- How do you encourage people to move beyond just walking?
- Bonus: how can you use your foot to interact with the environment?
- Think about the instrument and the input: what output is also whimsical?
- Be playful and improvisational. No correct answer. "Yes, and..."
- Step back from storytelling constraints for now; the application area may emerge once there is a unique interaction.
- Don't apply too many lenses. Find an interaction the whole team is excited about.
- Eventually show a contribution: what's original, what do we learn.
- "We don't know the community (audience) we're catering for and that's okay... interaction design deserves our unique ideas."
- "If you worry too much about the format you may end up working on something you don't love."
- We're not asked to produce the best industrial design or a solution; we're meant to explore and create.

---

## 4. Class critique of the synthesis (4 Nov): Cassius's comments

Cassius left these as comments on the Bodystorming Synthesis PDF during the 4 Nov critique, capturing feedback from Kimiko and the class. Lightly cleaned, grouped by theme, original wording kept where possible.

**Surprise and generativity**
- Were there elements of surprise, delight, the unexpected?
- More generative... in a sense.
- Seeds of different narratives, and participants can take it in many different ways.

**Public space, edge cases, "non-space"**
- We grew up to behave in this physical social world... look for more edge cases and extremes, and ask why we don't do them.
- Because it's public: do we want to support this activity in school, outdoors, or in a more private area? More exposed areas vs. more private areas.
- Past PhD students: spaces not intentionally designed a certain way (non-space), ambiguity in the spaces. A start of inquiry into how we could make them more socially useful spaces.
- "People usually don't notice this space." The grid diagram hints at that.

**Make it social, not individual**
- Still feels individual. What are some other interactions?
- The interaction part is not really represented here. Show those social dynamics.
- When we first got to the space: "oh, we're in public and we're going to start moving around in weird ways." Once we started mimicking each other, we started feeling more comfortable (tagged to Veruzka).
- Depends on the age of the social clustering.
- Are we giving kids the tools of imagination, or giving adults the tools of imagination?

**Sound as the output**
- Look at Veruzka's doc.
- Include elements from the outside in this world. Auditory experiences.
- Sound design: different tools that create those sounds; design that experience.
- Sound as the output.
- Equip users with the sounds and they make their own stories. Open-ended.

**The big thread (14 replies)**
- Seeds to include the outside in your play.
- TUI as improv... shoes made of ice, or wings, a jet pack... mobility and the sense of it changes.
- Fire and ice somehow working together.
- Likes the idea that we each have a unique sound and are the owner of it: owning a sound (our footprint). Own and gift a sound.
- If I come close, my sound is somehow influenced by my partner's, and maybe we run away.
- Maybe physically going up and down the hill: elevation for the scale. What if it's more like an I/O Brush? If you climb a rock, it picks up the audio of that thing.
- Spatial, dynamic sound: not a piezo beep, but a beautiful sound that could really move with us.
- Have a social aspect to it.
- Sound Foley artists.
- Avoid overwhelming the users with components. The opportunity is turning something mundane...
- You don't usually get to turn something into a tornado, but we get to do that.
- Encourage more social clustering, and something rewarding will happen. Nudge people toward this non-existing space.
- Push it more toward that interesting space.
- Thought-provoking, and "why not?"

**How this showed up in the team's 4 Nov notes (Final Project Proposal doc):** weird or fun-looking shoes (bread shoes); owning a sound; the sound is given to the person, who decides what story or play world to imagine; collaboration where a pull, a push and proximity matter (someone getting close changes my sound, so I run and they chase; or I gift a sound); building a tornado together; a piezo "brush" that takes on the sound of the surface you stand on (sky = thunder, rock = rock); think of the non-socially-accepted; stretch goal visuals (fire/ice on shoes).

---

## 5. Bodystorming synthesis (29 Oct 2026)

Source: "Shoes as Instruments: Bodystorming Synthesis" (46 pages, Drive: TUI / Ideation Brainstorm / 03 Bodystorming synthesis).

**Session:** outdoors on a campus plaza, about 11:30 AM to 12:00 PM, shoes kept on, mutual facilitation, no fixed rounds. Kimney filmed (two phone recordings, about 17.7 min in 4K, plus a 6 s clip). Four voice memos. All consented. Claims are labeled SAID (in a recording), SHOWN (on video) or INFERRED (our reading).

**People:** A = Veruzka, B = Elizabeth, C = Cassius, D = Kimney.

### The 28 gestures (input → imagined output)

| ID | Gesture | Who | Imagined output | Grid |
|---|---|---|---|---|
| P-01 | Stomp | unattributed | none stated; the obvious baseline | Street Percussion |
| P-02 | Foot handshake, count to ten | C with B | a shared count ("coordination") | Play (contested) |
| P-03 | Feet up to the sky | D | feet as a camera, photographing the sky | Reverie |
| P-04 | Spell the ABCs with a foot | C | "little messages in the sand" or chalk | Pause (contested) |
| P-05 | Heel-toe swivel | A | "guide users to replicate it"; drew "how do you do that?" 3x | Street Percussion |
| P-06 | Sideways slide | D | none stated | Street Percussion |
| P-07 | Lunge with pressure | D | pressure "you could sense" (first sensor quantity named) | Street Percussion |
| P-08a/b/c | Dancer's pose, arabesque, forward tilt balance | D, A, C | "maybe you could measure that"; focused moves glow blue | Pause |
| P-09a/b/c | Leg shoot: front kick, knee drive, side kick sole out | C, A, D | lasers, thunder, "sounds erupting"; "can a message shoot out of the bottom of your foot?" | Play |
| P-10 | Tightrope walk | D | focus; an imagined drop from a tall building | Reverie |
| P-11 | Tippy-toe descent, together (hands joined) | B, C, D | the challenge itself; only moment of physical linking | Pause (contested) |
| P-12 | Sitting on the feet | D | none; everyone sat and the mood changed | Pause |
| P-13a | Butterfly sit | unattributed | none; nostalgic | Pause |
| P-13b | Sole to sole with a partner | unattributed | none; Kimiko's prompt "but why not?" | Reverie |
| P-14 | Seated fidget | unattributed | none; anchor for "expected" | Pause |
| P-15 | Ride on someone's feet | unattributed | guidance, "like an exoskeleton" | Reverie (contested) |
| P-16 | Knee-tap prank | unattributed | partner's knee gives way (demo declined) | Play (contested) |
| P-17 | Tag | D | "gotcha," the caught player is it | Street Percussion |
| P-18 | Red light, green light | C (as caller) | C plays the system: "Green light. Red light. You're out." | Street Percussion |
| P-19 | Skip / gallop | D | none stated | Street Percussion |
| P-20 | Heel-click jump | C | none ("it's hard to do") | Play |
| P-21a | Foot as pointer: sole aimed | D | object recognized; "lightning shoots out" | Play (contested) |
| P-21b | Foot as pointer: toe tip | C | "Oh, I see you": the shoe knows it's on grass and changes its sound | Reverie (contested) |
| P-22 | Touch to make it lava | D | "it becomes lava for everybody": a shared world state | Play |

### The grid
- **X axis: Expected → Whimsy.** Expected = socially acceptable, readable to a bystander, close to ordinary gait. Whimsy = built on layers of imagination; only makes sense inside an imagined world or rule.
- **Y axis: Ambient → Active.** Active = motion is the input. Ambient = taking space to reflect; stillness and presence are the input.
- **Quadrants:** Street Percussion (expected + active), Play (whimsy + active), Pause (expected + ambient), Reverie (whimsy + ambient).
- **Crowded:** Street Percussion and the top-right corner (the three leg shoots). **Empty:** the far Reverie corner (very still, very imaginative): nobody stood still and let the ground answer. Strongest candidate for an original idea. **Thin:** pure rhythm; only the stomp, never filmed.
- Placements are a provisional draft; the team was meant to place each gesture independently.

### Patterns and reactions
- **Copying was the strongest signal.** The balance chain, the leg shoot and the toe descent each spread to three people within 20 seconds.
- **Power and aggression delighted the group.** "It feels so powerful." "It's so aggressive, I love the vibe." The leg shoot was the biggest movement peak on video.
- **The foot became a pointer** late in the session (P-21a, P-21b).
- **Rules shared by everyone:** red light, green light; "lava for everybody."
- **Standing vs. sitting changed the mood:** standing was all games; sitting made it ambient and quiet.
- Strongest reactions: "I love it!" (foot handshake), "that felt really good / amazing" (balance chain), "oh my gosh, that was good" (leg shoot).

### Tensions
- Inputs were plentiful; outputs stayed verbal. "How do I make it whimsical, though? That's the output."
- Spectacle (lasers from the sole) vs. sensing (the shoe hears it's on grass).
- Storytelling kept creeping in, though the brief said to hold it back.
- Nostalgia vs. novelty.
- Positioning: the team chooses **not** to frame the work as continuing Dor Abrahamson's embodied math research. Its own ground: storytelling and embodied moments, TUIs as improv and theatre.

### Not tested
Barefoot, any real output (no sound was ever played back), surfaces other than pavement, rhythm, outside users, and the ambient stillness corner.

---

## 6. Strategy and Directions (companion document)

Source: "Shoes as Instruments: Strategy and Directions" (21 pages, same Drive folder). Speculative, for the team to edit.

**Position: tangible interfaces as improv and theatre.** Most interactive footwear treats the foot as a controller. Here the shoe is a partner: the wearer makes an offer, and the shoe, the ground and nearby people answer with an offer of their own ("yes, and"). The unit of design is an **embodied moment**: a few seconds where a movement, a response and a shared imagined world line up. The bodystorm already worked this way; what was missing was a partner who could answer back.

**Draft question:** How can a shoe act as a scene partner so the wearer can embody [a character, a stake, a world] in order to [step out of ordinary walking, notice and play with their surroundings, and enter places they could not otherwise reach]?

**Ten improv moves mapped to foot input and output:**

| Move | Gestures | Shoe or world output |
|---|---|---|
| Count-in | P-02 foot handshake | a shared sting opens the world for both |
| Offer | P-21b, P-04 toe point / trace | the shoe names what it found and gives it a voice |
| Endow | P-22, P-21a tap or aim | that spot becomes lava, a door, a sleeping giant for everyone |
| Accept, "yes, and" | P-05, P-08b copy and vary | the shoe plays the partner's rhythm back plus a new layer |
| Heighten | P-09 repeated kicks | each repeat escalates: spark, thunder, storm |
| Mirror | P-08a, P-11 same pose / descend together | shoes hum in unison only while bodies are in sync |
| Status | P-01 stomp vs. P-10 tightrope | steps sound like a giant or something tiny and nervous |
| Freeze | P-18, P-08a stop and hold | the world holds its breath: silence or one sustained note |
| Edit | P-12 sit down | the story moves to a quieter chapter |
| Callback | P-04, P-17 walk where someone walked | earlier footsteps or voices replay |

**Four story ideas:** The Ground Wakes Up (pointer → lava rule → kicks escalate to a storm) · Tightrope over the City (wind and height, harmonize when in sync, quiet when you sit) · The Giant Is Coming (giant footsteps approach, freeze, chase) · Walk in Their Shoes (ghost footsteps and messages replay where others walked).

**Recommended directions (checked against prior work):**
1. **Scene Partner Shoes** (primary): a shoe that improvises back under "yes, and" rules. Gap: prior work treats tech as an instrument controlled by trained performers; no footwear acting as an improv partner for non-performers in everyday space.
2. **Cast the World** (pairs with 1): the foot as the casting gesture that turns surroundings into story characters.
3. **Ground That Answers** (wildcard): stillness as the input; the story is heard only by staying. Riskiest and most distinctive.
- Folded in: Foot Handshake Duet (input already done by Shoes++), Lava Rule (exists commercially as a game).

**Key prior work:** Paradiso et al. expressive footwear (MIT, 1997/2000) · Tajadura-Jimenez et al., "As light as your footsteps" (CHI '15) · Bresin et al. 2010 and Turchet et al. 2016 on footstep sonification · Shoes++ (IMWUT 2022) · Velloso et al., "The feet in HCI" (2015) · Con Moto (NIME 2026) · Mikalauskas 2019 (improv props) · YOUPLAY 2016 · Sleep No More remote immersion (MIT/Punchdrunk 2012) · Gerber 2007 and Medler & Magerko 2010 (improv as design method).

---

## 7. The MVP: Music Sampling Shoes (built, due 9 Nov)

Repo: **github.com/cassiusp-beep/tui-music-sampling-shoes** (README, firmware, sampler app, Tinkercad model, photos in `docs/`).

**How it plays:** two players, one shoe each. A song is split into 4 parts with Demucs (drums, bass, vocals, melody). Left player = drums + bass, right player = vocals + melody.

| Move | Left player | Right player |
|---|---|---|
| Stand on your shoe | drums in | vocals in |
| Lift your foot | part drops out | part drops out |
| Tip toes up or down | bass | melody |
| Shake your foot | echo | echo |
| **Both stomp within 0.25 s** | **swap parts** | |

The stomp swap became the heart of the instrument "because it only works if you're paying attention to each other" (Liz's post). Inspired by Kanye West's Stem Player.

**Per shoe:** FSR in the sole (A0, 220 ohm to GND) · MPU-6050 gyro/accelerometer (I2C) · Arduino UNO R4 Minima · XIAO ESP32-C6 sharing the gyro's I2C wires · USB power bank · 3D-printed tent-shaped case. No soldering.

**Data flow:** FSR + gyro → Minima (reads and smooths, 50x a second) → XIAO over I2C → Bluetooth LE (40x a second) → Chrome sampler app (Web Bluetooth joins L + R, calibrate "standing flat" / "foot lifted", thresholds turn numbers into moves) → laptop speakers.

**Parts in hand (both shoes):** 2 Minima, 3 XIAO, 3 MPU-6050, 3 FSR, 2 breadboards, 220 ohm resistors, jumpers, 2 power banks.

**Original build roles (MVP):** Veruzka + Vinay: Tinkercad · Kimney + Cash: code · Liz: interaction + Medium post · Cassius: ergonomics of mounting the Arduino and breadboard on the shoe (and built most of the MVP).

**Liz's Medium post, "Twinkle Toes":** constraints were sound from physical manipulation, at least four inputs, ideally multiple players. It covers the Stem Player inspiration, the concept sketched in FigJam, the 4-part split, the stomp swap, the parts, the Tinkercad practice model with two Unos, the tent case and the Chrome app. Its materials list includes copper tape; **copper tape has since been dropped.**

---

## 8. Figma sources

See [FIGMA_CONTEXT.md](FIGMA_CONTEXT.md) for the full tables. In short: the team board "TUI Workspace" (figma.com/board/5O01k6Vb0RCX2HY6gH4cIf) holds the Concept Design inputs and outputs table; the Input / Component / Output Map (figma.com/board/RfMG5EZLUJ4QcqEV2CzLTP, built 12 Nov) holds the five-column system map, the bodystorm poses → sound effects direction table, the four worlds (Sky → Lava → Forest → Water, a double stomp moves both players on), the recommended foot roles, the parts count for 4 shoes, and the Friday voting lanes.

---

## 9. The presentation website plan (17 Nov sprint)

**Format:** a scrolling website that is also the presentation, in the style of an Apple product page (reference: the apple.com iPhone 17 page, with the phones fanned out in a spread of colors). Presented live with keyboard navigation, and shared as a link.

**Vision (Cassius):** as you scroll, you see visuals and a little text explaining the concept: stories and movement, very dynamic. Mostly visuals of the shoes moving around, jumping and making sounds, explaining the whole thing. In "what we've built," the shoe opens up and shows its parts.

**Agreed order:**
1. **Concept** ("Stories! Movement!"). Basic movements: walk, run (more to add after meeting Kimney). Playful functionality: spin. Whimsy movements: dancer's pose, side kick, feet to the sky.
2. **What we've built.** The music + shoes MVP; building on it, the bodystorming interaction we will make; takeaways.
3. **Process.** Started with movement and math → encouraged to explore embodied interaction and bring back whimsy (unexpected movements, improv, storytelling) → landed on the basics: what can we do with our feet? → bodystorming session (takeaway: we want people to play with our tool the way we played in the bodystorm) → wrote down the movements we liked and grouped them into standard (run, walk/step) and whimsical.
4. **Moving forward.**

(Liz's original outline had process first; the team moved concept up and process down.)

**Workflow:** a teammate is building the site with several agents, each owning a part. Plan: wait for her repo, branch it, run the agent locally, push to GitHub. Rough draft on 17 Nov, refine on 18 Nov. The 3D-printed parts go from model to resin (SLA) print software.

---

## 10. Related work and positioning (13 Nov, Figma file "Related Work")

See [FIGMA_CONTEXT.md](FIGMA_CONTEXT.md), section 2, for the charts, feature matrix, closest work and the draft position.

**Position (draft):** Earlier work changes how one walker's footsteps sound, turns trained dancers' movement into sound, or attaches chosen sounds to bodies over headphones. We frame TUI as improv: everyday movement gets **Foley sound that gives each move a body**, the shoe acts as a **scene partner**, and **two players moving in sync blend their sounds out loud**. The players write the story.

---

## 11. How the project evolved (Claude chat history)

A timeline of Cassius's working sessions with Claude, so later sessions don't repeat settled questions.

- **Early Oct: SonicStride.** A spatial audio concept for fitness and play: open-ear audio, shoe sensors and wristbands letting people physically explore imagined worlds (another planet, an ancient forest, a mythic battlefield) layered over real space, without screens or VR. Research cards on inactivity, play-driven movement (Pokémon GO, Zombies, Run!), footstep sound and perceived effort, and synchrony and cooperation. Ambition to submit to **CHI** (Late-Breaking Work, Interactivity or Student Research Competition). Under-explored angles found then: two-person music through footsteps, force-based (not tempo-based) mapping.
- **Early Nov: SonicStride reframed.** Less dance, more play and fitness; "TUI as theatre." After meeting Kimiko, the direction became "make shoes an instrument."
- **29 Oct: bodystorm analysis.** Built the synthesis method: frame extraction, MediaPipe pose tracking, safety-manual-style pictograms, the Expected/Whimsy × Active/Ambient grid, SAID / SHOWN / INFERRED labels, and Kimiko's framing as the lens (storytelling held back to a later section). Produced the Synthesis and the Strategy and Directions documents.
- **3 to 9 Nov: building the MVP.** Hardware evolved from UNO R4 WiFi → Minima + XIAO (Minima has no radio) → briefly an Adafruit Bluefruit shield (dropped: needs soldering) → a no-solder build with pre-soldered XIAO ESP32-C6 and GY-521 MPU-6050. A voltage divider was replaced by having the XIAO listen on the gyro's I2C bus (its pull-ups hold 3.3 V), leaving one 220 ohm resistor per shoe. Renamed SonicStride → **Music Sampling Shoes**; Bluetooth names `MusicShoe-L` / `MusicShoe-R`. Made a **Team Build Guide** doc (claude.ai/artifact/SXWsLA3LTsEKXzFWbHKvFS) and one doc per role. The Arduino code was not tested on real boards inside the chat; the sampler app was tested in a browser.
- **12 Nov: input/output planning.** Built the Input / Component / Output Map FigJam (section 8) through a long Q&A: full pair per person, 2 players, sound only as world sound effects, 1 FSR + gyro per shoe, open-ended play, laptop speakers, stomp swap moves to the next world, copper tape and phone camera removed.
- **13 Nov: team meeting and related work.** Scene-partner framing, the other player as partner, copying heightens the sound, own sound-effect library, the world is imagination (section 2). Related Work Figma file and Position frame (section 10).
- **17 Nov: website sprint.** Claude Code prompt for the scroll-story site (concept → built → process), this context file.

**Working preferences Cassius has stated across these sessions:** no em dashes in anything written for him; plain, content-only visuals over decoration; concise prose; keep claims honest and labeled (said vs. inferred); the team should play their parts even though he often builds most of it himself.

---

## 12. Open questions

1. Final name: Twinkle Toes or Music Sampling Shoes?
2. Changing worlds vs. "the world is imagination" (see section 2).
3. With 4 shoes, does one foot or both count as a stomp?
4. More basic movements after the Kimney meeting.
5. Takeaways and next-steps copy for the site.
6. Is there demo footage of the MVP being played?
7. Final per-shoe hardware (Minima + XIAO, or XIAO only).
8. Target user: kids, adults, or both ("tools of imagination" for whom?).

---

## 13. Sources

- Bodystorming Synthesis v1 (PDF and DOCX) and Strategy and Directions v1: Google Drive, TUI / Ideation Brainstorm / 03 Bodystorming synthesis. Cassius's 4 Nov critique comments are on the PDF.
- Final Project Proposal (11/4 notes) and Music Shoes: Synthesis Lab: Google Drive, TUI folder.
- MVP repo: github.com/cassiusp-beep/tui-music-sampling-shoes
- Liz Wang, "Twinkle Toes," Medium: medium.com/@elizabeth_wang/twinkle-toes-f98c42327bf4
- Team FigJam: figma.com/board/5O01k6Vb0RCX2HY6gH4cIf (TUI Workspace)
- Input / Component / Output Map FigJam: figma.com/board/RfMG5EZLUJ4QcqEV2CzLTP
- Team iMessage thread, 17 Nov (website sprint plan and section order)
- Related Work Figma file: figma.com/design/ng7gCg5UTzbane3bZBoWMX
- Team Build Guide (MVP): claude.ai/artifact/SXWsLA3LTsEKXzFWbHKvFS
- Claude chat history: SonicStride spatial audio (Oct), bodystorm analysis prompt (29 Oct), MVP hardware build (3 to 13 Nov), input/output map (12 Nov)
