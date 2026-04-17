# Delta for SDD (Specification-Driven Development)

## ADDED Requirements

### REQ-ERR-001: Mandatory Root Cause Analysis for All Reported Errors

When an error is reported in the MenuLink project, the team **MUST** perform a Root Cause Analysis (RCA) using the `.openspec/templates/rca-template.md` template before applying any fix.

#### Scenario: Error Reported without RCA Documentation
- **GIVEN** a developer discovers an error in the system
- **WHEN** the error is reported to the team
- **THEN** the team **MUST** create an RCA document using `rca-template.md`
- **AND** the RCA document **MUST** be stored in `.openspec/root-causes/RCA-YYYY-MM-DD-NNN.md`
- **AND** the RCA **MUST** include the error description, impact, timeline, root cause using the 5 Whys technique, and category classification

#### Scenario: Error Fixed Without RCA is a Process Violation
- **GIVEN** an error is fixed without an RCA document
- **WHEN** the change is reviewed
- **THEN** the review **MUST** reject the change
- **AND** the reviewer **MUST** request an RCA to be created before re-submission

---

### REQ-ERR-002: Root Cause Analysis Template Structure

The RCA template **MUST** contain the following mandatory sections:

1. Error description (what happened)
2. Impact assessment (users, functionality, revenue)
3. Timeline of events
4. Immediate cause
5. Root cause using the 5 Whys technique
6. Root cause category classification
7. Tests created (unit, integration, BDD)
8. Fix applied
9. Lessons learned
10. Preventive actions

#### Scenario: RCA Template Contains All Mandatory Sections
- **GIVEN** a new RCA document is created from the template
- **WHEN** the document is saved
- **THEN** the document **MUST** contain all 10 mandatory sections
- **AND** each section **MUST** be filled with relevant information

#### Scenario: Root Cause Category Classification
- **GIVEN** an RCA is being completed
- **WHEN** the root cause is identified
- **THEN** the team **MUST** classify the cause in one of these categories:
  - Código (Code)
  - Configuração (Configuration)
  - Infraestrutura (Infrastructure)
  - Processo (Process)
  - Design
  - Testes (Tests)
  - Documentação (Documentation)

---

### REQ-ERR-003: Mandatory Tests by Severity Before Fix

Before applying any fix, the team **MUST** create tests that reproduce the error according to the severity table:

| Severity | Unit Tests | Integration Tests | BDD Scenarios |
|----------|------------|------------------|---------------|
| Critical | ≥ 3 | ≥ 2 | ≥ 1 |
| High     | ≥ 2 | ≥ 1 | ≥ 1 |
| Medium   | ≥ 1 | ≥ 1 | 0 |
| Low      | ≥ 1 | 0 | 0 |

#### Scenario: Critical Error Has Minimum Required Tests
- **GIVEN** a Critical severity error is identified
- **WHEN** tests are created before the fix
- **THEN** at least 3 unit tests **MUST** be created
- **AND** at least 2 integration tests **MUST** be created
- **AND** at least 1 BDD scenario **MUST** be created

#### Scenario: Tests Fail Before Fix and Pass After Fix
- **GIVEN** tests are created for an error
- **WHEN** the tests are executed before the fix is applied
- **THEN** the tests **MUST** fail (reproducing the error)
- **AND** after the fix is applied, the tests **MUST** pass

---

### REQ-ERR-004: Validation - All Tests Must Pass

After the fix is applied, all created tests **MUST** pass, and existing regression tests **MUST NOT** break.

#### Scenario: All Created Tests Pass After Fix
- **GIVEN** a fix has been applied for an error with RCA
- **WHEN** all created tests (unit, integration, BDD) are executed
- **THEN** all tests **MUST** pass
- **AND** the error is considered resolved

#### Scenario: No Regression in Existing Tests
- **GIVEN** a fix has been applied
- **WHEN** existing regression tests are executed
- **THEN** all existing tests **MUST** continue to pass
- **AND** no existing functionality **MUST** be broken

---

### REQ-ERR-005: RCA Documentation Storage and Retrieval

The RCA document **MUST** be stored in `.openspec/root-causes/` with a unique identifier `RCA-YYYY-MM-DD-NNN` format, where NNN is a sequential number starting from 001.

#### Scenario: RCA Stored with Correct Naming Convention
- **GIVEN** an RCA is completed for an error reported on 2026-04-17
- **WHEN** it is the third RCA on that date
- **THEN** the file **MUST** be named `RCA-2026-04-17-003.md`
- **AND** stored in `.openspec/root-causes/`

#### Scenario: RCA Directory Has README with Usage Guidelines
- **GIVEN** the `.openspec/root-causes/` directory exists
- **WHEN** a developer accesses the directory
- **THEN** a `README.md` file **MUST** exist
- **AND** it **MUST** explain how to use the RCA process
- **AND** it **MUST** reference the `rca-template.md`

---

### REQ-ERR-006: SDD Workflow Integration

The error handling workflow **MUST** be integrated with the existing SDD pipeline as follows:

```
Error Reported → RCA Created → Tests Written → Fix Applied → Verification → Archive
```

#### Scenario: SDD Flow for Error Handling
- **GIVEN** an error is reported
- **WHEN** the error handling workflow starts
- **THEN** it **MUST** create a PRD entry in `.openspec/backlog/prds/`
- **AND** an RCA document **MUST** be created before any code change
- **AND** tests **MUST** be written before the fix
- **AND** after fix, verification **MUST** confirm all tests pass
- **AND** the change **MUST** be archived following the SDD archive process

#### Scenario: 100% of Reported Errors Have RCA
- **GIVEN** a metric report is generated
- **WHEN** the report measures error handling compliance
- **THEN** 100% of reported errors **MUST** have an associated RCA document
- **AND** this metric **MUST** be tracked in the project quality metrics

---

## Criteria of Acceptance

### CA-ERR-001: RCA Template Available
- `.openspec/templates/rca-template.md` exists
- Template contains all 10 mandatory sections

### CA-ERR-002: Root Causes Directory Structure
- `.openspec/root-causes/` directory exists
- Directory contains a `README.md` with usage guidelines
- RCA files follow naming convention `RCA-YYYY-MM-DD-NNN.md`

### CA-ERR-003: menulink-rules.md Updated
- `.openspec/specs/menulink-rules.md` contains REQ-ERR-001 through REQ-ERR-006

### CA-ERR-004: AGENTS.md Updated
- Root `AGENTS.md` documents the error handling workflow
- Flow is integrated with existing SDD process

### CA-ERR-005: Quality Metric
- Project tracks 100% RCA compliance for all reported errors
- Metric is documented in quality rules

---

## MODIFIED Requirements

None.

## REMOVED Requirements

None.

---

**Change ID:** 002-2026-04-17-error-handling-rule
**Status:** Specification
**Author:** AI Agent
**Date:** 2026-04-17
