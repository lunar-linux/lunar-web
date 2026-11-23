---
title: "Package Management"
description: "Managing packages with Lunar's source-based package management system"
category: "package-management"
lastUpdated: 2026-11-23
order: 1
---

Package management is the system for installing, removing, consulting various informations and updating software packages. It's a key component of any operating system, and Lunar Linux's approach is unique among Linux distributions.

## What Makes Lunar Different

Lunar Linux's package management system is distinctive because all applications are compiled directly from source code, rather than installed from pre-compiled binaries. This approach offers several advantages:

- **Optimization:** Software is compiled specifically for your hardware
- **Customization:** Choose exactly which features to include or exclude
- **Transparency:** See exactly what's being installed
- **Flexibility:** Easy to modify or patch packages
- **Currency:** Access to latest upstream sources

## Core Components

### lin - Package Installation Tool

The primary command for installing packages. See [lin Basics](/docs/package-management/lin-basics) for detailed usage.

### Moonbase - Package Repository

The moonbase is Lunar's package repository, containing module definitions for thousands of software packages. See [Moonbase Overview](/docs/package-management/moonbase) for more information.

### Modules

In Lunar, a "module" is a package definition containing:
- Last known software version
- Source download locations
- Last date it was updated
- Date when it entered the repo
- Author website
- Short and long descriptions
- Build instructions
- Dependency information
- List of conflicting modules
- Configuration options

## Getting Started

For new users, start with these guides:

1. [lin Basics](/docs/package-management/lin-basics) - Learn the fundamental commands
2. [Moonbase Overview](/docs/package-management/moonbase) - Understand the package repository
3. [Build Times](/docs/guides/build-times) - Plan your compilation workflow

## See Also

- [Module Development](/docs/development/module-basics)
- [Contributing](/docs/contributing)
- [FAQ](/docs/faq)
