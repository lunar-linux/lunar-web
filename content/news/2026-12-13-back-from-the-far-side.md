---
title: "Back from the far side of the Moon"
description: "A new website, a new look, a lot of quiet work, and Lunar 2.0.0 \"Lacus Gaudii\", our first official release since 1.7.0, landing before Christmas Eve."
date: 2026-12-13
author: "The Lunar Team"
---

Hello again, Earth!

When the Apollo crews swung around behind the Moon, Mission Control lost radio contact with them. Houston called it *loss of signal*: for the better part of an hour, the people on the ground could only wait and trust that the crew was still up there, busy, flipping switches. Then the spacecraft came around the edge of the Moon, the radio crackled back to life, and that was *acquisition of signal*.

Lunar has been on the far side for a while. Our last official release, 1.7.0 "Sinus Successus", came out on 11 October 2014. Its announcement promised that Lunar was back "like the phoenix rising from the ashes". Then the skies went quiet for a very long time: 150 new moons, to be exact. Every year or so someone floated into #lunar and asked, very politely, whether anyone was still alive in here.

From the outside it looked like ashes. It never was. (Fun fact: the little ping that Lunar sends home after an install has been called `houston` all along. We were always listening.)

### What we were up to on the far side

Working behind the scenes, in secret, which in our case means in public on [GitHub](https://github.com/lunar-linux), where hardly anybody was looking:

- **The moonbase never stopped.** Nearly 50,000 changes have landed in the moonbase since 1.7.0, and every single year has seen more than 3,000 of them. It now holds 4,162 modules, all of them in the [new module browser](/modules).
- **The package manager kept getting sharper.** `lunar` has had twelve releases this year alone. Highlights: the [CATALYST trigger system](/docs/development/module-basics#the-catalyst-file), which lets a module react when others are installed or removed; much faster dependency handling in `lin`, `lrm` and `lvu`; and [`llint`](/docs/development/module-writing), a linter that reads every module.
- **The ground crew grew.** Continuous integration builds every contribution, the linter checks it, and since March a new crew member called moonbeam takes version bumps on IRC and turns them into pull requests: more than 1,100 so far.
- **The ISO kept rolling off the launch pad.** Daily builds since 2017, with serial-console installs, a reworked EFI boot and better partitioning for NVMe drives along the way.

### A new home, and a new face

You're reading this on the new lunar-linux.org. The logo that quietly moved onto our GitHub page in 2022 finally has a website to match, and we had a lot of fun building it. Every news post sits on an orbit with the Moon's real phase on the day it was published. The [arrivals board](/#moonbase) shows modules landing in the moonbase as it happens, with the crew member who landed each one. The docs are a flight plan from Earth to the Moon. And if you've ever wondered where Lunar comes from, the [history page](/history) tells the whole story, sorcerers included.

Look at the little moon next to this post, by the way: a waxing crescent, four days after the new moon. A new cycle, just getting started. Seemed fitting.

### Coming soon: Lunar 2.0.0 "Lacus Gaudii"

Now for the part we've been itching to tell you. Our first official release since 1.7.0 is almost ready for launch, and it gets a big round number: **Lunar 2.0.0**, codename **"Lacus Gaudii"**.

Like every Lunar codename it's a real place on the Moon: Lacus Gaudii, the *Lake of Joy*, a small plain on the side of the Moon that faces us. Lunar 1.6.4 "Lacus Autumni", the Lake of Autumn, came out in December 2008, because we have always been a little late for the season. Not this time: the Lake of Joy will be out **before Christmas Eve**, when, as it happens, the Moon will be full.

We're not saying more just yet. Keep an eye on this page, warm up your favourite USB stick, and if you can't wait, the [daily build](/download) is already on the pad.

### Before you `lin` anything

If you already run Lunar, update the package manager first:

```bash
lin lunar
```

Releases from v59 onward fetch the moonbase and source mirrors from `https://download.lunar-linux.org`. If a system misses the update and `lin moonbase` stops working, this one line points it at the right place:

```bash
lunar set MOONBASE_URL[0] https://download.lunar-linux.org/lunar/
```

### Stay in touch

The signal is back, and we intend to keep it that way. Come say hello in [#lunar on Libera.Chat](https://web.libera.chat/#lunar), follow along on [GitHub](https://github.com/lunar-linux), or [join the crew](/docs/contributing). There is always room on board.

See you at the Lake of Joy!

\- The Lunar Team
