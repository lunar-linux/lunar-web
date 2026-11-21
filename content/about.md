---
title: About
headline: A Linux you build yourself
description: Lunar is a source-based Linux distribution. Every program is compiled on your own machine, with the options you choose.
---

Most distributions ship programs that someone else compiled for an average computer. Lunar hands you the recipes instead. Your machine builds every program itself, from the original source code, with the options you pick, and you end up with a system that has exactly what you asked for and nothing you didn't.

::fact-sheet
---
title: Lunar at a glance
facts:
  - label: In orbit since
    value: 2002, and here's the story
    to: /history
  - label: Builds
    value: Everything from source, on your machine
  - label: Package manager
    value: "`lin`, `lrm`, `lvu` and `lunar`"
  - label: Moonbase
    value: About 4,100 modules in 74 sections
  - label: Runs on
    value: 64-bit PCs (x86_64)
  - label: License
    value: GNU General Public License, version 2
  - label: Crew
    value: Around 200 contributors so far
  - label: Mission control
    value: "#lunar on Libera.Chat"
    to: https://web.libera.chat/#lunar
---
::

## What happens when you type `lin`

One command does the whole trip. Here's what happens when you install the nano text editor:

::launch-sequence
---
command: lin nano
steps:
  - title: Questions first
    text: "Lunar asks about the options before anything compiles: colour highlighting? A .nanorc file? Multiple buffers? It asks for every dependency too, all up front, so you can walk away while it builds."
  - title: Fetch and check
    text: "Missing dependencies, like the ncurses library, get built first. Then nano's source comes straight from nano-editor.org, and Lunar checks it against the checksum in the module."
  - title: Build
    text: "The source is unpacked and compiled for your processor, with the optimization settings you chose in `lunar optimize`."
  - title: Track
    text: "As nano installs, Lunar writes down every file that lands on your system. That list is why `lrm nano` can remove it again cleanly, down to the last file."
  - title: Liftoff
    text: "nano is installed, and the compile log is kept in case you're curious how it went."
---
::

## No magic, just recipes

A module is a handful of short shell files, and you can read every one of them. Here is nano's module as it stands in November 2026, minus its long description. `DETAILS` says what to download and how to check it:

```bash
    MODULE=nano
   VERSION=8.7.1
    SOURCE=$MODULE-$VERSION.tar.xz
SOURCE_URL=https://www.nano-editor.org/dist/v8/
SOURCE_VFY=sha256:76f0dcb248f2e2f1251d4ecd20fd30fb400a360a3a37c6c340e0a52c2d1cdedf
  WEB_SITE=https://www.nano-editor.org
   ENTERED=20010922
   UPDATED=20260326
     SHORT="Superior clone of the pico text editor"
```

`DEPENDS` names what it needs, and `CONFIGURE` asks the questions:

```bash
depends ncurses
```

```bash
mquery COLOR  "Enable color and syntax highlighting?" y
mquery NANORC "Enable use of .nanorc file?" y
mquery MULTI  "Enable multiple file buffers?" y
```

A short `BUILD` file turns your answers into compile options. That's the whole thing. And look at `ENTERED`: nano joined on 22 September 2001, in the Sorcerer days, before Lunar even had its name.

## Why build from source?

- **Built for your machine:** compiled for your processor and your compiler flags, not for an average PC.
- **Only what you ask for:** optional features are questions, not defaults. Say no, and they're never built.
- **Nothing hidden:** modules are plain shell, and every build keeps a log, so when something goes wrong you can see exactly what happened.
- **Close to upstream:** software comes straight from the people who wrote it, patched only when necessary.
- **Keeps itself in shape:** `lunar update` rebuilds whatever has a new version, and `lunar fix` checks the installed system and repairs what's broken.

## Is Lunar for you?

The crew requirements are short:

- You're comfortable at a shell prompt, or you'd like to be.
- You'd rather understand your system than have it guess for you.
- You enjoy choosing what goes on your machine.
- You don't mind waiting while big programs compile. A browser takes a while; consider it a coffee break.

If that sounds like you, welcome aboard. If you'd rather never meet a compiler, there are excellent binary distributions out there, and no hard feelings.

## Where to next

- [Download](/download): the latest ISO and how to verify it
- [Installation guide](/docs/installation/installation-guide): from first boot to a running system
- [Lin basics](/docs/package-management/lin-basics): the four commands you'll use every day
- [History](/history): how Lunar got here, one moon phase at a time
- [#lunar on Libera.Chat](https://web.libera.chat/#lunar): ask the crew anything

## Signing off

The first About page was written by Suzanne Burns in 2003. It signed off with a motto: "History is irrelevant, only the future matters." We kept the motto, and wrote a [history page](/history) anyway.
