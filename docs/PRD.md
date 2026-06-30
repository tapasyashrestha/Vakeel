# Product Requirements Document (PRD) — Vakeel

**Document Version:** 1.0.0  
**Date:** June 30, 2026  
**Status:** Approved  
**Author:** AI Product Architect  

---

## 1. Executive Summary & Vision

### Vision
To modernize the Indian legal ecosystem by replacing informal, verbal coordination inside advocate chambers with a secure, citation-traceable, and operationally transparent digital workspace. 

### Mission
To build the definitive operating system for Indian law chambers—empowering advocates, seniors, associates, and interns with a verified Multi-Agent RAG workspace, structured document workflows, case automation, and digital provenance.

### Problem Statement
Indian law chambers operate largely via informal, verbal communication and fragmented document storage (local drives, WhatsApp groups, and paper bundles). This results in:
1. **Citation & Hallucination Risks**: Generic AI platforms create fictitious precedents or reference non-existent cases, threatening legal standings.
2. **Operational Black Boxes**: Senior advocates have no easy way of tracking what research task is assigned to which intern or verifying their work.
3. **Drafting Discrepancies**: Lack of true typing and mechanical checks leads to errors in notice replies and appeals, triggering delays.
4. **Disorganized Timelines**: Deadlines are manually tracked in diaries, leading to missed hearings.

### Market Opportunity
India has over 1.4 million practicing lawyers, and millions of pending cases. Chamber practices represent the operational backbone of this ecosystem. A dedicated B2B legal SaaS platform designed for the unique workflow of Indian chambers (Seniors, Associates, Interns) solves critical risk and compliance bottlenecks.

### Target Audience
- **Senior Advocates**: Chamber owners who assign tasks, review final drafts, and manage client relations.
- **Associate Advocates**: Mid-level lawyers who draft pleadings, perform core research, and guide interns.
- **Interns**: Law students performing research queries and uploading notice summaries.
- **Chamber Admins**: Staff managing client billing, scheduling, and physical file locations.

### Product Positioning
Vakeel is **not** an open-ended generic LLM assistant. It is a closed-loop B2B Chamber OS. It prioritizes *provenance over generative creativity*, enforcing strict citation validation gates and absolute transparency in role permissions.

---

## 2. User Personas

### Persona A: Senior Advocate (Aditya Singhania)
- **Role**: Chamber Owner / Principal
- **Goals**: Maintain 100% citation accuracy, track associate/intern tasks, review case dashboard.
- **Pain Points**: Hallucinations in research reports, lack of tracking on research drafts.

### Persona B: Associate Advocate (Priya Sen)
- **Role**: Core Drafter / Researcher
- **Goals**: Swiftly draft appeals and replies, cross-reference Indian Kanoon with internal chamber files.
- **Pain Points**: Manual comparison of GSTR-3B vs GSTR-2A data, locating older chamber files.

### Persona C: Law Intern (Rohan)
- **Role**: Junior Researcher
- **Goals**: Summarize notices, run similarity queries, learn case facts.
- **Pain Points**: Restricted access to confidential client files, manual citation lookup.

---

## 3. Core Modules Specification

### Module 1: AI Conversation Agent
- **Overview**: An interactive conversational portal allowing advocates to query the chamber knowledge base and public case laws naturally.
- **User Stories**:
  - *As an associate*, I want to ask questions about GST section 73 so I can immediately view relevant case summaries.
- **Functional Requirements**:
  - FR-1.1: Multi-turn chat interface with memory retention.
  - FR-1.2: Automatic intent-based routing to public or private search corpora.
- **Acceptance Criteria**: Answers must load within 2 seconds.
- **Edge Cases**: Unclear or multi-intent questions should prompt structural disambiguation rather than returning generic results.
- **Future Scope**: Voice query inputs matching spoken advocacy styles.

### Module 2: Legal Intelligence Engine (Multi-Agent RAG)
- **Overview**: A dual-corpus search system connecting public Indian case law (Indian Kanoon) with private tenant chamber documents.
- **User Stories**:
  - *As an intern*, I want to query a legal point and see which source document it originates from.
- **Functional Requirements**:
  - FR-2.1: Semantic and keyword hybrid search options.
  - FR-2.2: Tenant isolation to guarantee private files do not bleed into other chambers.
- **Acceptance Criteria**: 100% separation between client workspaces; zero cross-tenant leakages.
- **Edge Cases**: Empty retrieval sets must result in a clear "Insufficient Chunks" warning rather than a generated response.
- **Future Scope**: Cross-jurisdictional research capability.

### Module 3: AI Drafting
- **Overview**: Template-driven drafting system that generates legal notices, petitions, and replies using verified citations.
- **User Stories**:
  - *As an associate*, I want to select a template and generate a GST mismatch reply.
- **Functional Requirements**:
  - FR-3.1: Text editor interface with side-by-side verification panel.
  - FR-3.2: Export to docx/pdf formats.
- **Acceptance Criteria**: Drafts must only pull facts from verified retrieved chunks.
- **Edge Cases**: Unverified citations must be highlighted in red before export is enabled.
- **Future Scope**: Collaborative real-time editing.

### Module 4: OCR & True Typing
- **Overview**: High-fidelity Optical Character Recognition (OCR) converting scanned notices into searchable, structured JSON/markdown layouts.
- **User Stories**:
  - *As an admin*, I want to drag a scanned PDF notice into the portal to index its text and extract key metadata.
- **Functional Requirements**:
  - FR-4.1: Support for multi-lingual scanned PDFs.
  - FR-4.2: Metadata extraction (Court, Date, Section, Mismatch Amount).
- **Acceptance Criteria**: OCR accuracy threshold of 95%+ on clean scans.
- **Edge Cases**: Extremely blurry or handwritten scans must trigger a low-confidence flag.
- **Future Scope**: Automated stamp and seal detection.

### Module 5: Chamber Files & Document Repository
- **Overview**: A secure hierarchical repository for storing chamber documents (e.g. older petitions, client files, orders).
- **User Stories**:
  - *As a senior*, I want to create a nested folder structure to organize case files.
- **Functional Requirements**:
  - FR-5.1: File storage with access levels based on user roles.
  - FR-5.2: OCR processing on upload.
- **Acceptance Criteria**: Immediate document indexing for full-text search.
- **Edge Cases**: Handling of duplicate files with warning dialogs.
- **Future Scope**: Automatic folder organization using semantic classification.

### Module 6: Case Management
- **Overview**: Centralized tracking system for ongoing lawsuits, petitions, and client disputes.
- **User Stories**:
  - *As an associate*, I want to view case logs and history to keep track of previous hearings.
- **Functional Requirements**:
  - FR-6.1: Case status timeline visualization.
  - FR-6.2: Linkage between cases, tasks, and documents.
- **Acceptance Criteria**: Fast status updating and linkage.
- **Edge Cases**: Conflicting hearing dates on the same case.
- **Future Scope**: Automatic scraper updates from court websites.

### Module 7: Chamber Management
- **Overview**: Administrative tools for managing the physical and digital footprint of the chamber.
- **User Stories**:
  - *As a senior*, I want to manage advocate memberships and licenses.
- **Functional Requirements**:
  - FR-7.1: Add, modify, or remove advocate profiles.
  - FR-7.2: Role assignment (Senior, Associate, Intern).
- **Acceptance Criteria**: Role changes must reflect instantly in UI permissions.
- **Edge Cases**: Last senior advocate cannot delete their account without transferring ownership.
- **Future Scope**: Chamber inventory tracking.

### Module 8: Intern Management
- **Overview**: Work tracking system allowing seniors and associates to delegate research to interns and monitor audits.
- **User Stories**:
  - *As an associate*, I want to assign a citation verification task to an intern.
- **Functional Requirements**:
  - FR-8.1: Task assignments dashboard.
  - FR-8.2: Logging of intern search terms and queries for audit.
- **Acceptance Criteria**: Audit trail must capture all queries run by interns.
- **Edge Cases**: Orphaned tasks when an intern's profile is deactivated.
- **Future Scope**: Performance reports on intern accuracy rates.

### Module 9: Smart Calendar
- **Overview**: A scheduling calendar integrated with court listing databases to prevent hearing conflicts.
- **User Stories**:
  - *As an associate*, I want to view all upcoming hearings in a grid.
- **Functional Requirements**:
  - FR-9.1: Daily, weekly, monthly calendar views.
  - FR-9.2: Conflict warning alerts when double-booking advocates.
- **Acceptance Criteria**: Updates sync within 1 minute.
- **Edge Cases**: Sudden court schedule alterations.
- **Future Scope**: Integration with Google Calendar and Outlook.

### Module 10: Deadline Engine
- **Overview**: Alert automation matching statutory limitation periods for filing replies.
- **User Stories**:
  - *As a senior*, I want notifications for reply filings that are 3 days from limitation deadlines.
- **Functional Requirements**:
  - FR-10.1: Automatic computation of limitation periods based on notice reception date.
  - FR-10.2: Escalating email/SMS notifications.
- **Acceptance Criteria**: Alerts must trigger exactly at the computed milestone.
- **Edge Cases**: Notice uploaded post-deadline.
- **Future Scope**: Direct WhatsApp notification integration.

### Module 11: Analytics Dashboard
- **Overview**: High-level visual reports detailing chamber activity, citation passes, and task statuses.
- **User Stories**:
  - *As a senior*, I want to see a chart showing citation pass rates.
- **Functional Requirements**:
  - FR-11.1: Charts showing query metrics, file ingestion volumes, and task completion.
  - FR-11.2: Filter metrics by date range and user role.
- **Acceptance Criteria**: Charts must render with smooth animations.
- **Edge Cases**: Missing data points must render as 0 instead of breaking charts.
- **Future Scope**: Custom report exporting.

### Module 12: Notification System
- **Overview**: Alert dispatch center for tasks, deadlines, and dashboard updates.
- **User Stories**:
  - *As an intern*, I want a notification when a senior approves my research draft.
- **Functional Requirements**:
  - FR-12.1: In-app real-time notification toasts.
  - FR-12.2: Daily email digest summarizing pending items.
- **Acceptance Criteria**: Real-time alerts must render in under 1 second.
- **Edge Cases**: Network disconnection handles queueing of alerts.
- **Future Scope**: Push notifications on mobile.

### Module 13: Settings
- **Overview**: Configuration hub for chamber profiles, API keys, and notification preferences.
- **User Stories**:
  - *As an admin*, I want to update our custom prompt guidelines.
- **Functional Requirements**:
  - FR-13.1: Profile configuration panel.
  - FR-13.2: AI temperature and search parameter controls.
- **Acceptance Criteria**: Configuration updates apply immediately.
- **Edge Cases**: Input validation on custom email domains.
- **Future Scope**: Dark mode and UI theme customizer.

### Module 14: Billing
- **Overview**: Subscription management, plan selection, and invoice printing for the chamber.
- **User Stories**:
  - *As a senior*, I want to download our monthly billing invoices.
- **Functional Requirements**:
  - FR-14.1: Subscription tiers selector.
  - FR-14.2: Payment logs and PDF invoice generators.
- **Acceptance Criteria**: Secure integration with Razorpay Checkout.
- **Edge Cases**: Handling of payment timeouts and failed renewals.
- **Future Scope**: Usage-based billing per OCR page.
