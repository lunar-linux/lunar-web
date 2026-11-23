---
title: "Moonbase"
description: "Understanding Lunar Linux's package repository structure and organization"
category: "package-management"
tags: ["moonbase", "modules", "sections", "repository"]
lastUpdated: 2025-11-02
order: 2
---

The moonbase is the complete collection of all the software packages (modules) that Lunar Linux offers its users. It is organized in a hierarchical structure of directories and files, usually found on the user's system at `/var/lib/lunar/moonbase`.

Generically speaking, the moonbase is just a directory with subdirectories and files inside it.

## Sections

The moonbase's first level of structure and organization is a **section**. A section is a name that serves to classify and organize a group of modules into logical partitions.

Each section is simply a subdirectory that resides right below the root of the moonbase or inside another section. Sections can also be nested in other sections.

### Special Sections

There are two sections of special significance:

#### zbeta

Contains modules that are:
- Downloaded directly from live source code repositories (*-git, *-cvs or *-svn modules)
- Unable to be tested extensively by the Lunar team due to hardware availability or other constraints

These modules cannot be guaranteed to work at all times on all hardware.

#### zlocal

Where users can:
- Develop their own modules
- Copy and edit existing moonbase modules without risk of them being overwritten next time the moonbase is updated

This is your personal workspace for module development and customization.

## Modules

Modules sit in a section directory. A module consists of a directory with specific files and other directories that are not sections. These subdirectories represent a single module that "belongs" to that section of the moonbase.

A module, to be a bit simplistic, is a set of "instructions" to perform a task - namely, instructions to compile and then install what was compiled onto the user's filesystem.

### Example

If we had a module named FooGame that was located in the "games" section of the moonbase, we would find a directory called FooGame at:

```
/var/lib/lunar/moonbase/other/games/FooGame
```

## Summary

To summarize:
- Installable software packages are called **modules**
- The collection of all modules is called the **moonbase**
- The moonbase is simply a directory containing logical **sections** (subdirectories)
- Sections, in turn, contain the **module** directories

### Structure Diagram

```
Moonbase
\--section
   |--section
   |  \--module
   |     \-- files
   \--module
      \-- files
```

## Viewing and Browsing

You can explore the moonbase structure using several methods:

### Command Line

```bash
# List all sections
ls /var/lib/lunar/moonbase/

# List modules in a specific section
ls /var/lib/lunar/moonbase/other/games/

# View all modules in a section
lvu section other/games

# Search for a module
lvu search keyword
lvu apropos keyword
```

### Web Interface

Browse the moonbase online at [github.com](https://github.com/lunar-linux/) to see available modules and their details.

## Updating the Moonbase

The moonbase should be updated regularly to get the latest module definitions:

```bash
# Update moonbase to latest version and start updating
lunar update

# Only download a fresh moonbase
lin moonbase

# Just run updates without downloading a new moonbase
lunar renew
```

This downloads the latest module definitions from the Lunar Linux servers, ensuring you have access to the newest versions of software packages.

## Related Topics

- [Module Basics](/docs/development/module-basics) - Learn how modules are structured
- [Lin Basics](/docs/package-management/lin-basics) - Using the package installer
- [Module Submission](/docs/development/module-submission) - Contributing your own modules
