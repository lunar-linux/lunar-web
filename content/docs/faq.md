---
title: "Frequently Asked Questions"
description: "Common questions and answers about Lunar Linux, installation, optimization, and package management"
category: "general"
tags: ["faq", "help", "troubleshooting", "guide"]
lastUpdated: 2025-11-02
order: 1
---

These are the Frequently Asked Questions for Lunar Linux. You have a question about Lunar? You might get your answer below.

## General

### What is Lunar Linux?

Please read the [About Lunar Linux](/about) page.

### Can I run Lunar Linux in 64-bit mode?

Yes you can. You can run Lunar Linux in either 64-bit or 32-bit mode, but there is no multi-lib mode. Be aware that some applications are still only available for 32-bit mode!

### Where can I find how to...?

The Lunar documentation only offers details specific to Lunar Linux. Many other resources already exist for general Linux problem solving.

For example, information on how to customize the Linux kernel can be found at:
- [http://kernelnewbies.org/](http://kernelnewbies.org/)
- [http://en.wikipedia.org/wiki/Linux_kernel_mailing_list](http://en.wikipedia.org/wiki/Linux_kernel_mailing_list)

## Lunar Linux Installation

### My USB keyboard is not recognized

At the boot prompt type `linux uhci-hcd ehci-hcd` to make sure those modules are loaded during startup. These will enable your USB keyboard.

### So how should I partition my disk?

Server systems have very different demands than desktops. It's all about flexibility.

#### Desktop Systems

Desktops commonly have one hard disk. You don't want to reformat or repartition often, so you want to be done with it at once. The easiest setup is just two partitions:

1. **Root filesystem** - Big enough for all Lunar software (4-12 GB based on applications installed)
2. **Home partition** - The rest of the disk for `/home`

Typically, Lunar occupies between 4 and 12 GB based on how many applications you install. If you clean up often you can manage with 8GB, but you should keep some extra space.

**Swap recommendation:** Use a swapfile instead of a swap partition. You can always later delete the swap, or move the swapfile to another disk or partition. A swap partition is harder to relocate.

#### Server Systems

Servers have different needs:
- `/home` doesn't need to be that large
- Setup space for logfiles that cannot cause problems if they grow too fast
- Putting `/var/tmp` and `/var/log` on separate partitions is quite normal
- `/tmp` can be abused similarly, and is mostly run in tmpfs to avoid cluttering and give fast access times
- `/usr` will be separate and the usual separate rootfs
- Most users will want to make the rootfs quite small (as small as 200MB sometimes!)
- `/home` also needs to be on a separate partition

### Kernel features: built-in or module?

When compiling a kernel, should I compile drivers as built-in or as modules?

There are many schools of thought on kernel compiling. Here is a suggestion: **If it's not needed to boot, it's a module.**

Thus USB, input, sound, mice, ACPI, network, CD-ROM, floppy, and all non-boot file systems all get built as modules. This reduces the size of the main kernel so it can be put on a floppy.

Another consideration is that not everything works perfectly, and some features can cause your kernel to misbehave. If a feature is built-in, the bad behavior is practically inevitable. With a module, you can choose not to load it and thus be left with a working system.

**Note:** Some people need to make some features built into their kernel and vice versa. Do whatever works best for you.

### QEMU and Lunar ISO testing

A very simple way to test a Lunar ISO for booting purposes is:

```bash
qemu -cdrom lunar-1.5.0-i686.iso -boot d
```

If you want to test a full install, create a 512 megabyte sparse root_fs image:

```bash
dd if=/dev/zero of=hda.img bs=$((1024 * 1024)) count=0 seek=512
```

Now invoke qemu:

```bash
qemu -cdrom lunar-1.5.0-i686.iso -boot d -hda hda.img
```

You can then proceed to test your Lunar install. QEMU can also be quite easily used to test if your brand new kernel is bootable or not, which is quite neat.

**Note:** You should say yes to using SDL as an optional_depends. The GUI version of QEMU is very nice in its own little X11 window.

## Optimizations

### How do I set optimizations?

Run `lunar optimize`. You'll be taken through an interactive menu that explains all the options. Remember to optimize safely.

### What are safe optimizations?

The default sure-fire optimizations that are recommended are:

**C/C++:**
- `-pipe`

**CPU Architecture:**
- You should pick the correct architecture for your own system (defaults to x86 for most people)

**Basic Optimizations:**
- Faster (`-O2`, the default)

**CPU:**
- This should be set to your own CPU, or the CPU of the machine you plan to run this install on
- If you want to run this install on many machines, you should be safe with I686

**Speed Optimizations:**
- If you want to be 100% sure that there won't be optimization problems, you shouldn't select any of these

**Extra features:**
- Not recommended to use any of these optimizations, even for modules known to be able to handle them, since they cause many apps to break

**Floating Point Math:**
- None. If your architecture is x86 and you don't own a 386SX or 486SX, it's safe to select x387

**Linker Options:**
- Strip

**Addon Program Support:**
- CCache (make sure to install it first)

These settings should work for almost everyone, and there is room for pushing these optimizations more, at the risk of problems with some applications. Read `info gcc` and make sure you understand a given optimization before you enable it.

### What optimizations may cause problems?

Some optimizations that are known to cause problems on x86 with many applications:

- `-funroll-loops`
- `-fstrict-aliasing`
- `-ffast-math`
- `-ffloat-store`

These are sorted from the least unstable to most unstable. Read `info gcc` and make sure you understand a given optimization before you enable it.

### What optimizations can give some speed without issues?

Start with the basic optimizations and change the Basic Optimizations to Faster or Fastest if you know that GCC will generate correct code for that CPU:
- `-O2` obviously takes more compile time than `-O1`
- `-O3` takes the most time to compile

Then select the CPU you will run it on. Some speed optimizations that should be decent and shouldn't cause too many problems: `-fomit-frame-pointer`

A safe bet for floating point math on x86 would be x387, if you know your CPU has a floating point unit. Check `cat /proc/cpuinfo` to see if your CPU supports SSE or SSE2. If your CPU does have SSE or SSE2, you can also add that to the math optimizations.

Your results may vary. Read `info gcc` and make sure you understand a given optimization before you enable it.

### What optimizations should I avoid?

All the ones listed in "What optimizations may cause problems?" plus:

- `-fprofile-arcs`
- `-fbranching-probabilities`

Please read `info gcc` and make sure you understand a given optimization before you enable it. The Lunar developers will not respond to bug reports of broken compiles by users with risky optimizations.

## Installing Modules

### Can I compile several modules at once?

Yes, Lunar even promotes it. However, doing so will cause installs to compile slower. Lunar will not install core system modules like GCC and glibc while something else is installing and will wait until the rest is finished. Also, you cannot install applications while those major modules are installing - they will wait their turn until it's safe and continue to install them automatically.

### error: download failed - broken URL

There are three possible reasons why the download failed:

**1. Mirror is busy or incomplete:**
- You are trying to download from one of a set of mirror sites, and the mirror you are using is either busy or incomplete
- Run `lunar` as root, select Options / Software Mirrors, and change the mirror to something closer to you
- Note: There seems to be a consistent problem with the SFORGE mirror: `http://osdn.dl.sourceforge.net`

**2. File location has changed:**
- You are trying to download from a particular site, but the location of the file has changed (or the site is temporarily off-line)
- Browse the module's website (see `lvu website`) or search the web for the tarball
- Download it manually, copy it to `/var/spool/lunar`, and try to run `lin` again
- Run `lvu edit` to create a zlocal copy, and edit that copy with the new location or secondary URL

**3. Version has been removed:**
- You are trying to download a version that has been removed because a newer version exists
- Browse the module's website to discover the new version number
- Run `lvu edit` to create a zlocal copy, and edit that copy with the new location, version number, sha1sum, etc.
- Note: You could first try to run `lin -w newVersion` and hope that it builds without problems

If you do create your own zlocal copy, please consider submitting it using `lvu submit`. (See [Module Submission](/docs/development/module-submission))

### error: C compiler cannot create executables

What does this error mean and how can I fix it?

This is basically the same problem as the C preprocessor error below: There are kernel headers missing that are vital to compilation. You will have to restore them. See the next topic for how to do that.

### configure: error: C preprocessor "/lib/cpp" fails sanity check

This is an include file problem. Sometimes `/usr/include/gnu/stubs.h` is missing - this can be found in the glibc source tarball. Most of the time the following applies:

Your kernel headers are missing from `/usr/include`. This means the C PreProcessor cannot verify that it has the proper cached copies of those vital header files. You need to install the proper ones manually.

**Try this first:**

```bash
lin kernel-headers-2.4
```

(Use the 2.6 version if needed)

**If that doesn't work:**

Create the target directories:

```bash
mkdir -p /usr/include/{linux,asm}
```

Then copy the files manually:

```bash
cp -av /usr/src/linux/include/linux /usr/include/
cp -av /usr/src/linux/include/asm/* /usr/include/asm/
```

**Warning:** The second command has to be done this way since `/usr/src/linux/include/asm` is a softlink to your arch asm header files (asm points to asm-i386 on x86 machines). If you had copied:

```bash
cp -av /usr/src/linux/include/asm /usr/include/
```

You would then get a softlink to nowhere under `/usr/include/`.

Last, you can always try to unpack the kernel tarball you have into `/usr/src/linux` and manually link or copy the headers over yourself.

### Can I add more window managers to gdm?

Copy the desktop startup files to `/etc/X11/dm/Sessions/`. That works with gdm. For kdm you will have to copy them to `$KDE_PREFIX/share/apps/kdm/sessions`.

### How do I get Flash to work in Mozilla or Firefox?

If you are using Mozilla or Firefox, you can simply do a `lin flash-plugin` and that will download and install the Macromedia Flash plugin that works with a gtk+ based Mozilla through the old ABI wrappers.

The Flash plugin does not work with Galeon. The Galeon developers have declined to provide the "old" ABI wrappers needed for the plugin to work.

### How do I install Java?

You will have to download the Java source code from Sun yourself and you have to "click" to agree to their license. You have to compile it yourself too. We don't have a Sun Java module as we currently have no way to automate the "click" to agree to the Sun Java license.

The "Java from scratch" hint from Linux From Scratch used to have some handy info on this (the original link is no longer available).

There is a j2sdk module in moonbase which is the Blackdown port of Sun's Java Virtual Machine.

## Removing Modules

### How do I remove a module?

If you have just installed a module for the first time using `lin`, then it is usually safe to remove it using `lrm`.

However, if you have built or rebuilt other modules that depend on it, you will need to be careful:
- Use `lvu eert` to identify these modules
- Remove them too, or rebuild them using `lin -rc` to change the optional dependency
- Run `lunar nofix` to make sure that some hidden dependency has not been affected

You can also use `lrm -p` to purge all modules that depend on it, but this is not recommended in general because it is easy to break your system.

### How do I safely remove an optional module?

There are three ways, ranging from "time-consuming but safe" to "possibly quick but dangerous":

**Method 1: Using lvu eert**

Use the `lvu eert` approach described above.

**Method 2a: Rebuild depending modules**

You can use `lsh` to access the Lunar internal functions to find other modules that have a known dependency on theModule and rebuild them. If you `lrm` theModule first, the rebuilds and `lunar fix` cannot silently reuse the module again.

```bash
for i in `lsh list_installed_depending theModule`; do lin -cr "$i"; done
lunar fixdepends
lunar fix
```

**Method 2b: Rebuild in dependency order**

If you want to rebuild the modules in dependency order, you will need to do a bit more work:

```bash
MODULES=""
for i in `lsh list_installed_depending theModule`
do
 VAR=$(echo "$MODULES" | grep "$i")
 if [ -z "$VAR" ]
 then
  MODULES="$MODULES $i"
 fi
done
lin -cr "$MODULES"
lunar fixdepends
lunar fix
```

**Method 3: Quick but potentially dangerous**

Run `lrm theModule`. Use `lunar nofix` to identify problems. Run `lin -cr` for each problem. Rinse and repeat.

## Lunar Core Tools

### How can I recompile my module with new options?

Try:

```bash
lin -r MODULE
```

The `-r` switch will allow you to select new configuration and dependencies for modules.

### How can I make modules recompile instead of resurrecting?

Try doing:

```bash
lin -c MODULE
```

The `-c` option tells `lin` to compile this module even if there is an install cache copy available in `/var/cache/lunar`.

### How can I tell Lunar that module X no longer depends on module Y?

Module X no longer depends on module Y, but Lunar insists on reinstalling module Y too. How can I tell Lunar to remove that dependency?

Lunar adds a module's dependencies to a cache when you install it. You can't remove a dependency automatically, but you can rebuild the dependency cache to reflect the current dependencies of the modules that are now installed:

```bash
lsh create_module_index
lsh create_depends_cache
lunar fixdepends
```

**Note:** Dependencies of modules in zlocal are ignored. If module X in the main moonbase depends on module Y, then the dependency cache will still contain that dependency.

### My moonbase is gone and I can't install anything

How do I fix problems with my moonbase when it's missing or damaged?

Simple solution:

```bash
lin moonbase
```

This will download the latest moonbase from the internet and restore it to working order.

### What is a module?

A module is a set of files that tell the core tools the following:

- What name, version, and other properties a package has
- Where to download all needed source files
- What other modules are required, or conflict with this one
- How to unpack the source files, how to patch
- How to configure the code
- How to compile
- How to install everything
- What else to do with it

The module is coded in a set of files in a directory structure, and scripted in bash.

### What is the Moonbase?

The Moonbase is a database with modules. In this database there are descriptions of packages that tell the core tools where to download, how to compile, and how to install a module. You can consider this the Lunar equivalent of portage, grimoire, ports, etc.

See [Moonbase](/docs/package-management/moonbase) for more details.

### What is theedge?

theedge is the same as lunar, and is also known as the core code. theedge is just another version of lunar. These two pieces of code install your packages, but they do not contain package descriptions. Those are defined in moonbase.

theedge is a development version of lunar. Often there are many more features in theedge, and bugs are fixed quicker as well. However, if you do not like all this tweaking on your system, we advise you to use the stable lunar core tools instead.

You can install theedge by issuing:

```bash
lin theedge
```

theedge is automatically updated if you do a `lunar renew` or `lunar update`.

## Other

### How do I unpack an .RPM file in Lunar?

The easiest way to unpack an RPM file is to use the module called `rpmunpack`. Simply run:

```bash
rpmunpack XYZ.rpm
```

This will create a cpio file (XYZ.cpio.gz and XYZ.cpio.bz2 are not uncommon). Once you perform any additional uncompression with `gunzip` or `bunzip2`, you can then extract it using:

```bash
cpio -i -d < XYZ.cpio
```

If you are trying to rpmunpack a source RPM (i.e., .src.rpm) file, then XYZ.cpio may further contain a tar.bz2 or tar.gz source tarball.

In the zbeta section of moonbase, there is an unsupported module called `rpm` for those of you that are really desperate.

You might want to do `man cpio` to check out additional cpio parameters that may interest you, such as the `-L` switch.

### What is that in the Lunar Linux logo?

The logo is a [Rockhopper Penguin](http://en.wikipedia.org/wiki/Southern_Rockhopper_Penguin). It's a kind of nasty penguin that crowds up in thousands to take over the continent. They have a few long feathers sticking out at their "ears" sideways, just like some owl species do.

You can check out [Google Images](http://images.google.com/images?q=Rockhopper+Penguin) for lots of Rockhopper Penguin pictures!

The current logo has been designed by Michael Schindler in 2003 and appeared as the official logo of the Lunar Linux project in 2004.
