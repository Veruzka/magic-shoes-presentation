# Twinkle Toes / Music Sampling Shoes: Figma Context

Everything from the project's three Figma files: the team board, the Input / Component / Output map, and the Related Work file. Companion to `PROJECT_CONTEXT.md` (full background) and `MVP_CONTEXT.md` (the built prototype).

Last compiled: 18 Nov 2026.

| File | Link | What it holds |
|---|---|---|
| TUI Workspace (team FigJam) | figma.com/board/5O01k6Vb0RCX2HY6gH4cIf | Timelines, idea vote, each teammate's area, the Concept Design table |
| Input / Component / Output Map (FigJam) | figma.com/board/RfMG5EZLUJ4QcqEV2CzLTP | System map, pose-to-sound table, worlds, parts count, voting lanes |
| Related Work (Figma design file) | figma.com/design/ng7gCg5UTzbane3bZBoWMX | Quadrant charts, feature matrix, Venn, Position frame, 18 references |

---

## 1. Team board and the Input / Component / Output Map

**Team board "TUI Workspace"** (figma.com/board/5O01k6Vb0RCX2HY6gH4cIf): Final Project Timelines & Workspace, idea vote, education buckets, each teammate's area, and the **Concept Design: inputs & outputs** table:

| Input | Output | People |
|---|---|---|
| Dancer's pose | One of three: complete silence, music plays, or everyone's sound stops | Solo or group |
| Kick | The sound transfers to another person | Pair |
| Camera (point at something; stretch) | Shoes take on the sound of whatever you point at | Solo |
| Group of 5 or more | All sounds merge into one new melodic tone; rarely, a horrific sound makes everyone scatter | 5 or more |
| Click of heels | Ends the game and returns the wearer to home and real life | Solo or group |

Sticky notes beside it: "sounds + story + paired interactions // ID tagged interactions + sounds + assumption of story and embodied narrative @liz // open ended generative storytelling with our product" and "you can automate bits and pieces of these things with AI." Next steps on the board: 1) a library of movements and their outputs, 2) a sound design map to movements, 3) break down components to realize the inputs and outputs.

**Input / Component / Output Map** (figma.com/board/RfMG5EZLUJ4QcqEV2CzLTP, built 12 Nov for the 13 Nov meeting):
- A five-column system map: **Inputs** (press + weight, tilt + hold, burst, aim, two bodies, stillness) → **Sensors** (FSR, MPU-6050, BLE signal strength between shoes, color sensor as a stretch) → **Processing** (Minima, XIAO, Chrome sampler app, power bank) → **Actuators** (laptop speakers; vibration motor, LEDs and projector parked) → **Outputs** (world sound effects, echo, swap/transfer a sound, merge or silence, a shared rule for everyone; haptic, light and visuals parked).
- The Concept Design table annotated with how to sense each idea and what to watch out for. Group of 5 is parked (2 players). Camera replaced by "point at something" using the gyro + a color sensor, kept purely sensory.
- **Direction table: bodystorm poses → sound effects** (Cassius's picks starred):

| Pose | How a pair of shoes senses it | Sound effect | Two-player twist |
|---|---|---|---|
| ★ Kick (P-09) | gyro spike on one shoe while the other shoe's FSR holds your weight | laser zap or thunder crack | kick toward your partner and your sound flies to them |
| ★ Heel click (P-20) | both shoes spike together, both FSRs at zero (airborne) | whoosh + chime: back home | ends the session for both |
| ★ Dancer's pose (P-08) | one FSR near zero, other loaded, gyro still about 1 s | the world holds its breath: shimmer, then silence | holding the pose silences your partner's sounds |
| Stomp (P-01) | FSR spike | boom, ground shake | both stomp within 0.25 s = swap sound sets + next world |
| Feet to the sky (P-03) | both shoes tilt about 90 degrees, FSRs at zero | camera shutter, star twinkle | partner stays still to be "photographed" |
| Tightrope (P-10) | slow steps, little roll | wind at height, creaking rope | partner stomps to shake the rope |
| Tippy-toe (P-11) | toe-up pitch (gyro) | a tone that rises and falls | rise together to harmonize |
| Lava tap (P-22) | quick FSR blip, foot lifts | sizzle, floor turns to lava | lava for everybody |
| Toe point (P-21b) | toe-down pitch, held | the ground answers: grass, water | in whatever world you are in |
| Red light, green light (P-18) | moving vs. still (gyro) | footsteps, then silence + "caught" sting | nobody is out |
| Heel-toe (P-05) | alternating pitch (gyro) | tap-shoe clicks | the copier echoes the leader |

- **Worlds:** Sky (stars twinkle, wind, thunder kicks) → Lava (sizzle, rumble, bubbling steps) → Forest (rustle, twigs snap, birds scatter) → Water (splash, drips, waves on a stomp). A double stomp moves both players on.
- **Recommended foot roles:** each person is one character with both feet together, because kick, heel click and dancer's pose are read by comparing your two shoes. Add a quiet footstep layer so ordinary steps make world sounds; save big effects for big poses.
- **Parts for 4 shoes:** need +2 Minima, +1 XIAO, +1 MPU-6050, +1 FSR, +2 breadboards, +2 power banks, 2 more cases. Option to discuss: the XIAO reads the FSR and gyro itself and the Minima is dropped.
- **Friday voting area:** a lane for each teammate (Cassius, Elizabeth, Kimney, Veruzka, Vinay) for top inputs and outputs.

---

## 2. Related work and positioning (13 Nov, Figma file "Related Work")

Built with Claude on 13 Nov in figma.com/design/ng7gCg5UTzbane3bZBoWMX: two quadrant charts, a feature matrix, a Venn, a **Position** frame and 18 references. This was a targeted scan, not a systematic review: search ACM DL, NIME, MOCO, TEI and CHI Play before claiming novelty.

**Chart 1, Movement × Story:** x = hands/touch → whole body (everyday walk, run, spin); y = set mapping or script → open, players author the story. Our quadrant: whole body + open story.
**Chart 2, Together × Story:** x = solo → together (moving in sync shapes the sound); y as above. Our quadrant: together + open story.
**Feature matrix columns:** everyday moves · sound embodies the motion · players imagine the story · two players shape it together · no screen needed. No single precedent covers all five.

**Closest work to cite and differ from:**
- **Audio Personas** (Tao, Ye, Bailenson, Follmer, Stanford, 2025; arXiv): people attach sounds to their bodies (giant stomps, a "woosh" when approaching) heard over headphones, studying social perception. *Our difference:* sound comes from how you move, plays out loud, and the point is play created together.
- **Preisler, Dahl, Kantan (MOCO '26):** two dancers' synchrony turned into sound in real time. *Our difference:* everyday movement by non-dancers, and Foley that makes each move believable rather than an abstract soundscape.
- **Magical Musical Mat** (Chen et al.): two people touching change the music; began in Kimiko's own TUI course and sits in Dor Abrahamson's lab. Cite it and differ: feet instead of touch, improv and theatre instead of embodied learning.
- **GlowSteps** (de Valk, Bekker, Eggen, 2015): floor tiles for open-ended social play; finding that play starts alone and becomes social supports the clustering idea.
- Also: SoundWear (Hong et al. 2020, sound for children's open-ended outdoor play, passing sounds), Expressive Footwear (Paradiso & Hu 1997), As Light as Your Footsteps (Tajadura-Jimenez et al. 2015), interactive shoes (Papetti et al. 2010), footstep sonification (Bresin et al. 2010), Jogging over a Distance (Mueller et al. 2007), Yamove! (Isbister et al. 2016), I/O Brush (Ryokai et al. 2004), StoryMat (Ryokai & Cassell 1999), Sleep No More (Punchdrunk 2011), Sonic City (Gaye et al. 2003), Márquez Segura et al. 2016 on bodystorming for movement design, Franinović and Serafin's *Sonic Interaction Design*.

**Position (draft):** Earlier work changes how one walker's footsteps sound, turns trained dancers' movement into sound, or attaches chosen sounds to bodies over headphones. We frame TUI as improv: everyday movement gets **Foley sound that gives each move a body**, the shoe acts as a **scene partner**, and **two players moving in sync blend their sounds out loud**. The players write the story.
