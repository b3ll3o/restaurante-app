---
name: sdd-tasks
description: Generate phased `tasks.md` checklists from specs and design.
---

# SDD Tasks Skill

Translate the approved spec and design into an implementation checklist.

## Shared Conventions

- Shared references:
- `~/.config/opencode/skills/_shared/openspec-convention.md`
- `~/.config/opencode/skills/_shared/persistence-contract.md`
- `~/.config/opencode/skills/_shared/thoth-mem-convention.md`

## Persistence Mode

The orchestrator passes the artifact store mode (`thoth-mem`, `openspec`, or
`hybrid`). Follow
`~/.config/opencode/skills/_shared/persistence-contract.md` for read/write
rules per mode.

- `thoth-mem`: persist to thoth-mem only — do NOT create or modify
  `openspec/` files.
- `openspec`: write files only — do NOT call thoth-mem save tools.
- `hybrid`: persist to both (default).

## When to Use

- **Full pipeline**: proposal, spec, and design are ready for execution planning
- **Accelerated pipeline**: proposal is ready and spec/design are intentionally skipped
- A task plan must be refreshed after scope changes

## Prerequisites

- `change-name`
- `pipeline-type` (`accelerated` or `full`)
- Proposal artifact
- Spec artifact (full pipeline only)
- Design artifact (full pipeline only)

## Workflow

1. Read the shared conventions.
2. Recover artifacts via the retrieval protocol in
   `~/.config/opencode/skills/_shared/persistence-contract.md`:
   - **Always**: recover `proposal`
   - **Full pipeline only**: recover `spec` and `design`
   - In accelerated pipeline, derive task structure directly from the proposal.
3. If a task plan already exists, recover `sdd/{change-name}/tasks` with the
   same mode-aware retrieval rules before rewriting it.
4. Build a flat, parallelizable checklist for `openspec/changes/{change-name}/tasks.md`. In
   `thoth-mem` mode, produce the same canonical checklist content without
   creating the file.
5. Use flat numbering, explicit dependencies, and Markdown checkboxes:

   ```md
   # Tasks: {Change Title}

   ## Pré-condições
   - [ ] Spec aprovada
   - [ ] Design aprovado

   ---

   ## Tarefas (execução paralela quando possível)

   ### Grupo 1: Independentes (podem rodar em paralelo)
   - [ ] 1: [Tarefa atômica - um arquivo, uma função]
   - [ ] 2: [Tarefa atômica] (depende: none)
   - [ ] 3: [Tarefa atômica] (depende: none)

   ### Grupo 2: Depende do Grupo 1
   - [ ] 4: [Tarefa] (depende: 1, 2)
   - [ ] 5: [Tarefa] (depende: 3)

   ### Grupo 3: Integração
   - [ ] 6: [Tarefa] (depende: 4)
   - [ ] 7: [Tarefa] (depende: 5)
   ```

   Key principles:
   - **Flat numbering** (1, 2, 3...) — never hierarchical (1.1, 1.2, 2.1)
   - **Explicit dependencies** — each task states ` (depende: N, M)` or ` (depende: none)`
   - **Small tasks** — one file, one function, single responsibility
   - **Parallel by default** — tasks in the same group have NO dependencies between them
   - **Group by dependency level** — same group = can run concurrently
   - Avoid "Fase" terminology that implies sequence — use "Grupo X" instead

   Recognized task states:

   - `- [ ]` pending
   - `- [~]` in progress
   - `- [x]` completed
   - `- [-]` skipped with reason

6. Reference concrete file paths and specific spec scenarios in the tasks.
7. If the selected mode includes thoth-mem, persist the full checklist with:

   ```text
   thoth_mem_mem_save(
     title: "sdd/{change-name}/tasks",
     topic_key: "sdd/{change-name}/tasks",
     type: "architecture",
     project: "{project}",
     scope: "project",
     content: "{full tasks markdown}"
   )
   ```

8. After `tasks.md` is generated, the workflow proceeds to an optional oracle
   plan review via the `plan-reviewer` skill. This is managed outside the scope
   of this skill.
9. The orchestrator handles the `[OKAY]` / `[REJECT]` review loop and any
   necessary fixes before proceeding to execution.

## Output Format

Return:

- `Change`
- `Artifact`: `openspec/changes/{change-name}/tasks.md`
- `Topic Key`: `sdd/{change-name}/tasks`
- `Phase Summary`: task counts per phase
- `Execution Order`: one short paragraph
- `Next Step`: `sdd-apply`

## Rules

- **Small tasks**: each task does ONE thing — one file, one function, single responsibility.
- **Parallelizable**: tasks in the same group have NO dependencies between them.
- **Flat numbering**: use `1`, `2`, `3` — never `1.1`, `1.2`, `2.1`.
- **Explicit dependencies**: every task states ` (depende: N, M)` or ` (depende: none)`.
- **Group by dependency level**: same group = can run concurrently.
- Avoid "Fase" terminology — use "Grupo X" instead.
- Tasks must be small, actionable, and verifiable.
- Order tasks by dependency.
- Include testing and verification work explicitly.
- Do not create vague tasks such as "implement feature".
- Retrieve all dependencies through the mode-aware protocol in
  `~/.config/opencode/skills/_shared/persistence-contract.md`.
