# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains two main projects:

1. **Skills Collection** (`001/`) - Claude Code skills from `jimliu/baoyu-skills`
2. **轻记账 Web App** (`001.产品PRD（产品经理）/src/`) - A personal finance management web application

---

## 轻记账 Web App

A mobile-first financial management web application with a pink/kawaii design theme.

### Project Structure

```
001.产品PRD（产品经理）/
├── src/
│   ├── index.html      # Main HTML (SPA architecture)
│   ├── css/
│   │   └── style.css  # Pink theme styling (CSS variables)
│   └── js/
│       ├── storage.js  # localStorage data persistence
│       └── app.js      # Main application logic
└── 个人财务管理系统-PRD.md  # Product requirements document
```

### Key Features

- **Recording**: Track income/expense with categories
- **Statistics**: Monthly stats with category breakdown and trend charts
- **Customer/Supplier Management**: For small business users
- **Data Import/Export**: JSON backup and restore

### Design System

Pink/kawaii color palette:
- Primary: `#FF8FAB` (Sakura Pink)
- Secondary: `#FFB3C6` (Rose Pink)
- Accent: `#FF6B9D` (Coral Pink)
- Income: `#7ED7C1` (Mint Green)
- Background: `#FFF5F7` (Cream Pink)

### Running the App

```bash
# Open directly in browser
start "" "001.产品PRD（产品经理）/src/index.html"

# Or on Windows
open "001.产品PRD（产品经理）/src/index.html"
```

### Data Storage

All data persists in browser `localStorage`:
- `light记账_records` - Transaction records
- `light记账_customers` - Customer data
- `light记账_suppliers` - Supplier data
- `light记账_categories` - Custom categories
- `light记账_settings` - User settings

### Architecture Notes

- Single HTML file with embedded JavaScript modules
- CSS uses BEM-style naming with CSS variables for theming
- No build step required - runs directly in browser
- Mobile-first responsive design (max-width: 430px)
- Safe area insets supported for iOS notch/home indicator

---

## Skills Collection (001/)

Located in `001/` directory.

### Installed Skills

| Category | Skills |
|----------|--------|
| Image Generation | `baoyu-image-gen` - OpenAI, Azure, Google, etc. |
| Content Creation | `baoyu-article-illustrator`, `baoyu-comic`, `baoyu-cover-image` |
| Publishing | `baoyu-post-to-wechat`, `baoyu-post-to-weibo`, `baoyu-post-to-x` |
| Utilities | `baoyu-translate`, `baoyu-markdown-to-html`, `baoyu-diagram` |
| Workflow | `release-skills` - Universal release workflow |

### Managing Skills

```bash
cd 001
npx skills add jimliu/baoyu-skills  # Add new skills

# Skill configuration via EXTEND.md
.baoyu-skills/<skill-name>/EXTEND.md  # Project level
~/.baoyu-skills/<skill-name>/EXTEND.md  # User level
```

### Image Generation Usage

```bash
bun .agents/skills/baoyu-image-gen/scripts/main.ts --prompt "A cat" --image out.png
bun .agents/skills/baoyu-image-gen/scripts/build-batch.ts --outline outline.md --prompts prompts --output batch.json
```

---

## Directory Structure

```
claude-my-product/
├── CLAUDE.md                    # This file
├── .claude/                    # Claude Code settings
├── 001/                        # Skills collection
│   ├── CLAUDE.md              # Skills documentation
│   ├── skills-lock.json       # Skill versions
│   └── .agents/skills/        # Installed skills
└── 001.产品PRD（产品经理）/      # Product development folder
    ├── 个人财务管理系统-PRD.md   # PRD document
    └── src/                    # Web app source
```