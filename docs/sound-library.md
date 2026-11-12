# Sound library

Every sound in the project, where it came from, and whether we may use it. This is the one home for the sound rules. `AGENTS.md` and other docs link here.

## Where sounds live
- **Originals:** `sounds/<category>/<role>/`. Kept untouched, like the AI images in `design/originals/`.
- **Web copies:** `public/sounds/<category>/<role>/`, same name, ending `.m4a`. These are the small files the app loads. Make them with `npm run sound:web`.
- **App catalog:** `sounds.json`. The app reads sounds from this file only. To swap a sound, change one line there.

**Categories:** `giant`, `lightning`, `cartoon`, `music`, `ambient`, `experiments`.

**Roles** (the folder inside each category):
- **one-shot** (`one-shots/`): plays once, e.g. a single stomp.
- **loop** (`loops/`): repeats seamlessly, e.g. a beat or rain.
- **layer** (`layers/`): mixed on top of another sound to add character, e.g. a rumble under a stomp.

## Naming rule
`category_description_variant.ext`, all lowercase. Use hyphens inside the description, and a two-digit variant number.

| Example | Why |
|---|---|
| `giant_stomp-deep_01.wav` | giant category, "stomp deep", first version |
| `cartoon_boing-high_02.wav` | second version of a high boing |
| `music_beat-120bpm_loop_01.wav` | music always includes the tempo (beats per minute); loops add `_loop` |

## Web format: AAC (.m4a)
- **What it is:** a compressed audio format, like MP3 but a bit better quality at the same size. It plays in every current browser.
- **Size:** about 1/10 of a `.wav`. A 1-second stomp goes from about 170 KB to about 17 KB.
- **Quality:** 128 kbps (kilobits per second, how much detail is kept). Fine for effects and music on a website.
- **How it's made:** with `afconvert`, built into every Mac, so there's nothing to install.
- **One catch:** the format adds a tiny bit of silence at the start. For one-shots you won't notice. For loops, the app should skip that sliver when it repeats; we'll handle it when we wire up the first loop.

## Allowed values
- **Source:** Adobe Firefly, ElevenLabs, Stable Audio, Freesound, recorded.
- **License:** `commercial OK`, `non-commercial`, or `Creative Commons` plus the license type and author (e.g. `CC BY 4.0, author: jane_doe`).
- **Shoe action:** e.g. hard heel press, toe tap, jump, spin.

**Non-commercial sounds:** fine while this is a prototype. If the project becomes commercial, each one must be replaced or licensed.

## The log
Sorted by category (in the order above), then by file name.

| File | Category | Role | Source | Prompt used | License | Mood | Shoe action | Notes |
|---|---|---|---|---|---|---|---|---|
| *(no sounds yet)* | | | | | | | | |
