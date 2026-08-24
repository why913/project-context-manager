# Project Context Manager

An [Agent Skill](https://agentskills.io) that keeps the engineering context around a codebase
true — so an AI agent picks a project up where the last session left it, instead of rebuilding
its understanding from scratch every time.

Vendor-neutral: one `SKILL.md`, installable into ~19 coding agents.

*[中文说明在下方](#中文说明)*

## The problem

Code shipped is not work finished. What actually decides whether an agent is useful on a project
in week six is the context around the code: what was asked for, why it was built this way, what
already exists, what was tested, and what is broken right now.

Without it, every session starts by guessing. With notes but no discipline, it gets worse — the
agent acts confidently on a CodeMap that went stale three commits ago.

```
request → context read → task (scoped, agreed) → code → tests → close-out → context updated
```

## What it enforces

| Rule | Why |
| --- | --- |
| Source code is the only source of truth | When a note disagrees with the code, the note is the bug. A stale map is worse than no map |
| Notes index code, never copy it | Pasted source rots silently and doubles maintenance |
| Test results are reported exactly as they came out | Never delete, skip, weaken, or xfail a test to make a run pass |
| Stay inside the declared scope | "May change / must not change", by file — so a small fix stays small |
| Confirm before anything hard to reverse | Migrations, deletions, history rewrites, deploy config |

Rule three is the one worth installing this for. A failing test in a report is useful
information. A green report that was manufactured destroys the value of every report after it.

## Install

### Bundled installer (no dependencies)

```bash
git clone https://github.com/why913/project-context-manager
cd project-context-manager
node install.mjs            # dry run — shows exactly what it would write
node install.mjs --write    # install
```

It detects which agents are present on the machine and copies the skill into each one's user
skills directory. Copies rather than symlinks, so it needs no admin rights on Windows.

```
node install.mjs --list              # every known target
node install.mjs --targets claude,codex --write
node install.mjs --all --write       # every target, detected or not
```

### Manual

Copy the directory (`SKILL.md` + `references/`) into whichever path your agent reads. The
cross-agent one covers the most ground:

```bash
cp -r project-context-manager ~/.agents/skills/
```

### Via the Vercel installer

If you already use [vercel-labs/skills](https://github.com/vercel-labs/skills):
`npx skills add why913/project-context-manager`. That installer tracks vendor path changes across
50+ targets, which the bundled script does not — but the bundled script is what this repo tests
against. Note it has no `workbuddy` target, so WorkBuddy users need the bundled script.

## Where it installs

User-scope paths, checked against each vendor's docs in August 2026.

| Target key | Agent | Path |
| --- | --- | --- |
| `standard` | **Cross-agent standard** | `~/.agents/skills/` |
| `claude` | Claude Code | `~/.claude/skills/` |
| `codex` | Codex CLI | `~/.codex/skills/` |
| `cursor` | Cursor 2.4+ | `~/.cursor/skills/` |
| `gemini` | Gemini CLI 0.26+ | `~/.gemini/skills/` |
| `copilot` | GitHub Copilot | `~/.copilot/skills/` |
| `codebuddy` | CodeBuddy | `~/.codebuddy/skills/` |
| `workbuddy` | WorkBuddy | `~/.workbuddy/skills/` |
| `zcode` | ZCode | `~/.zcode/skills/` |
| `trae` | Trae | `~/.trae/skills/` |
| `trae-cn` | Trae CN | `~/.trae-cn/skills/` |
| `lingma` | Lingma | `~/.lingma/skills/` |
| `qoder` | Qoder | `~/.qoder/skills/` |
| `iflow` | iFlow CLI | `~/.iflow/skills/` |
| `opencode` | OpenCode | `~/.config/opencode/skills/` |
| `windsurf` | Windsurf | `~/.codeium/windsurf/skills/` |
| `cline` | Cline | `~/.cline/skills/` |
| `roo` | Roo Code | `~/.roo/skills/` |
| `kilo` | Kilo Code | `~/.kilocode/skills/` |
| `amp` | Amp | `~/.config/agents/skills/` |
| `goose` | goose | `~/.config/goose/skills/` |
| `factory` | Factory Droid | `~/.factory/skills/` |
| `kiro` | Kiro | `~/.kiro/skills/` |
| `crush` | Crush | `~/.config/crush/skills/` |
| `pi` | Pi | `~/.pi/agent/skills/` |
| `antigravity` | Antigravity | `~/.gemini/antigravity/global_skills/` |

`~/.agents/skills/` alone is read by Codex (as its primary path), Cursor, Gemini CLI, Copilot,
Amp, and Warp natively, and by OpenCode, Cline, Roo Code, and Kilo Code as a fallback. If you
install to exactly one place, install there.

### Agents that don't read SKILL.md

Zed, Aider, Augment, Trae, and Kiro use their own rules formats. For those, `AGENTS.md` in this
repo is the entry point — it carries a condensed contract and points at `SKILL.md`. Copy it into
your project's `AGENTS.md`, `.rules`, or `CONVENTIONS.md`.

## What it creates

`project-knowledge/` at the project root, in version control next to the code it describes:

```
00-Inbox/          requests and bugs, not yet scoped
10-Requirements/   what was asked for, acceptance conditions
20-Architecture/   system shape, data flow, schema
30-CodeMap/        module purpose, location, call relationships — never source dumps
40-Decisions/      one ADR per decision: what, why, what was rejected
50-Tasks/          Active/ and Done/ — Done/ is the project's real history
60-Testing/        test plans, known bugs, regression results
70-Releases/       what shipped when
Home.md            entry points
Project-Status.md  what works, what is in flight, what is BROKEN right now
MEMORY.md          how to work here — not what the project contains
Project-Log.md     date, task, files changed, test outcome
```

Two files carry most of the value. `Project-Status.md` is what makes returning after three weeks
take two minutes — and it must list what is broken, because a status file that only records wins
reads as "everything is fine". And `30-CodeMap/` earns its keep through its gotchas: not what a
file listing already tells you, but the thing that costs an hour to rediscover.

## Usage

Once installed, the agent loads the skill on its own when a task matches. You can also ask:

- *Set up a project knowledge base for this repo*
- *I need to add rate limiting — write the task first, do not code yet*
- *Execute the agreed task*
- *Login fails intermittently on cold start — debug it*
- *Close out this task*

The interesting one is the second. It produces a scoped task with acceptance criteria you can
check, and stops for agreement before touching code — which is where a misunderstanding costs a
sentence to fix instead of a diff to unwind.

## Portability notes

Four things silently break a skill across agents. This repo handles all four; worth knowing if
you fork it.

1. **Frontmatter is limited to six fields** — `name`, `description`, `license`,
   `compatibility`, `metadata`, `allowed-tools`. Claude Code extensions like `when_to_use`,
   `argument-hint`, `paths`, or `model` cause `Unexpected key(s) in SKILL.md frontmatter` on
   claude.ai uploads and the Skills API.
2. **`name` must equal the directory name.** VS Code / Copilot skip the skill when they differ,
   with no error. `install.mjs` warns if you break this.
3. **The filename must be exactly `SKILL.md`.** Gemini CLI is case-sensitive about it.
4. **`SKILL.md` stays under 6000 characters** (Windsurf's per-file cap; 12000 total). Detail
   belongs in `references/`, loaded only when needed — which is what the format wants anyway.

Also: Antigravity uses `.agent/` (singular), everyone else uses `.agents/` (plural).

The skill body names no vendor-specific tool and hardcodes no build command — it reads the
project's own commands from `MEMORY.md`.

## Companion skill

[research-knowledge-manager](https://github.com/why913/research-knowledge-manager) does the same
job for research material: papers into atomic, evidence-linked notes. Same design, different
domain — the two are independent and neither needs the other.

## License

MIT

---

## 中文说明

一个让 AI **长期参与同一个软件项目**的 Agent Skill：把代码周边的上下文维持成真的，这样下一次
开工是接着上次继续，而不是每次重新猜一遍项目长什么样。不绑定任何厂商，一份 `SKILL.md` 可装进
约 18 种 AI 编程助手。

### 它解决什么

代码写完 ≠ 项目完成。真正决定 AI 在一个项目上第六周还有不有用的，是代码周边那些东西：当初要
求是什么、为什么这么设计、已经有什么、测过什么、现在哪儿是坏的。

没有这些，每次开工都靠猜。有笔记但没纪律更糟——AI 会拿着三个 commit 前就过期的 CodeMap 一脸
自信地动手。

```
需求/Bug → 读上下文 → 写Task(划定范围,先确认) → 写代码 → 跑测试 → 收尾 → 回写上下文
```

### 五条不让步的铁律

| 铁律 | 为什么 |
| --- | --- |
| 源码是唯一真相源 | 笔记和代码不一致时，是笔记错了。过期的地图比没地图更坏，因为人会照着它动手 |
| 笔记只索引代码，绝不复制代码 | 粘进来的源码会悄悄过期，还让维护量翻倍 |
| 测试结果照原样报 | 绝不靠删测试/跳过/放宽断言/标 xfail 来让它变绿 |
| 只动 Task 里声明可动的 | 按文件写清"可改/禁改"，小修才不会变成一大坨 diff |
| 不可逆操作先确认 | 数据库迁移、删文件、改历史、动部署配置 |

第三条是最值得为它装这个 skill 的一条。报告里有个失败的测试是有用信息；而一份编出来的绿色报告，
会让之后所有报告都失去价值。

### 安装

```bash
git clone https://github.com/why913/project-context-manager
cd project-context-manager
node install.mjs            # 先空跑,看清它准备往哪些目录写
node install.mjs --write    # 真正安装
```

脚本会探测本机装了哪些 agent，复制进各自的 skills 目录。用**复制而非软链**，Windows 上不需要
管理员权限。

只装一处的话装 `~/.agents/skills/` 覆盖面最广：Codex 拿它当主路径，Cursor、Gemini CLI、Copilot、
Amp、Warp 原生读它，OpenCode、Cline、Roo、Kilo 兜底读它。完整对照表见上面英文部分。

Zed、Aider、Augment、Trae、Kiro 不读 `SKILL.md`，对它们用仓库里的 `AGENTS.md`，直接粘进你项目的
`AGENTS.md` / `.rules` / `CONVENTIONS.md`。

### 它会建什么

在项目根目录建 `project-knowledge/`，跟着代码一起进版本库。其中两个文件承担了大部分价值：

- **`Project-Status.md`** —— 让你隔三周回来两分钟就能接上。它必须写清"现在哪儿是坏的"，因为
  一份只记成绩的状态文件读起来就等于"一切正常"。
- **`30-CodeMap/`** —— 它的价值全在"坑"那一行：不是文件列表已经能告诉你的东西，而是要花一小时
  才能重新发现的那件事。

### 怎么用

装好后 agent 会在任务对得上时自动加载。也可以直接说：

- *给这个仓库建项目知识库*
- *我要加限流——先写 Task，别动代码*
- *按确认好的 Task 执行*
- *冷启动时登录会偶发失败，debug 一下*
- *收尾这个任务*

第二条最值得试：它会产出一份范围明确、验收标准可核对的 Task，然后**停下来等你确认**再动代码——
误解在这个时候只需一句话就能纠正，等变成 diff 就得整个拆掉。

### 姊妹 skill

[research-knowledge-manager](https://github.com/why913/research-knowledge-manager) 是同一套设计
用在科研资料上：论文变成有出处、可追溯的原子笔记。两个仓库互相独立，装一个不需要另一个。

### 授权

MIT
