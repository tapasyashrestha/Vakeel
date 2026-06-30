# UI/UX Specification — Vakeel

**Document Version:** 1.0.0  
**Date:** June 30, 2026  
**Status:** Approved  
**Author:** Lead UI/UX Designer  

---

## 1. Global Navigation and Layout Guidelines

### Navigation Model
Vakeel uses a persistent header nav bar on desktop containing brand logo, view selector buttons (Home, RAG Workspace, Ingestion, Dashboard), and role status badge. Mobile screens fold navigation items into a hamburger menu.

### Styling Tokens
- **Theme**: Luxury / Premium Legal Dark Theme
- **Fonts**: EB Garamond, Georgia, serif (Body); Cinzel, serif (Headings); Outfit, Inter (San-serif UI elements)
- **Primary Color**: `#c9a84c` (Gold / Bronze)
- **Background Color**: `#1a1408` (Dark gold-tinted charcoal)
- **Card Background**: `#221c0e` (Deep bronze brown)

---

## 2. Screen Specifications

---

### Screen 1: Landing Page
- **Purpose**: Brand introduction, value proposition demonstration, call-to-actions (RAG Workspace access and Notice upload).
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | [Logo] VAKEEL    [Home]  [Workspace]  [Ingest]  [Dashboard] |
  +-------------------------------------------------------------+
  |                                                             |
  |  B2B LEGAL TECH BUILT FOR TRUST.                            |
  |  Where Law Meets Intelligence.                              |
  |                                                             |
  |  [Access Workspace]  [Ingest Notice]                        |
  |                                                             |
  |  "Fiat justitia ruat caelum"                                |
  |                                                             |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Banner**: Rotating list of Latin legal maxims.
    - **CTA Buttons**: Animated access routes.
- **States**:
    - *Success*: Display of active Aegis engines.
- **Navigation**:
    - Clicking "Access Workspace" directs user to Screen 5 (Research).
    - Clicking "Ingest Notice" directs user to Screen 7 (OCR Ingest).

---

### Screen 2: Authentication (Sign In/Up)
- **Purpose**: Authenticate chamber members and assign role claims to sessions.
- **Wireframe Layout**:
  ```
  +---------------------------------------------------+
  |                  [ Logo ] VAKEEL                  |
  |                                                   |
  |               Sign in to your Chamber             |
  |             +-----------------------+             |
  |             | Email address         |             |
  |             +-----------------------+             |
  |             | Password              |             |
  |             +-----------------------+             |
  |             | [ Sign In ]           |             |
  |             +-----------------------+             |
  +---------------------------------------------------+
  ```
- **Key Components**:
    - **Auth Form**: Inputs for email and password.
- **States**:
    - *Loading*: Spinners on credentials submission.
    - *Error*: "Invalid Chamber credentials" validation message.
- **Navigation**:
    - Successful auth redirects to Screen 3 (Dashboard).

---

### Screen 3: Dashboard (Chamber Hub)
- **Purpose**: Overall tracking of chamber activity logs, recent notices, and pending items.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Active: Senior Advocate Aditya                              |
  +-----------------------------+-------------------------------+
  | Chamber Activity (Logs)     | Active Tasks                  |
  | - Aditya approved draft     | - [Pending] Zenith Challans   |
  | - Priya uploaded Notice     | - [In Progress] Apex Reply    |
  | - Rohan searched RAG        |                               |
  +-----------------------------+-------------------------------+
  ```
- **Key Components**:
    - **Activity Feed**: Interactive filter buttons (All, Updates, RAG Audit).
    - **Tasks List**: Displays deadline badges.
- **States**:
    - *Empty State*: "No recent tasks or activity logs recorded today."
- **Navigation**:
    - Clicking a task redirects to the related Case detail screen.

---

### Screen 4: AI Chat Portal
- **Purpose**: Generative conversation pane with context citation.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Chat History List                                           |
  | User: What's the latest HC view on ITC mismatch?             |
  | AI: Under Kerala HC Diya Agencies [Diya Agencies Para 14]... |
  | +---------------------------------------------------------+ |
  | | Query text input area                                [>]| |
  | +---------------------------------------------------------+ |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Response Cards**: Styled markdown text highlighting citations in gold.
- **States**:
    - *Loading*: Typing dots animation during synthesis.
- **Navigation**:
    - Clicking a citation inside a response card opens the related Document viewer.

---

### Screen 5: Research Workspace (Multi-Agent RAG)
- **Purpose**: Main portal for running verified queries on public and private corpora.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Input Query: [ GST mismatch Zenith Tech               ] [S] |
  +-----------------------------+-------------------------------+
  | Router & Planner Agent      | Synthesis Agent               |
  | [Both Corpora Selected]     | "Based on Diya Agencies..."   |
  +-----------------------------+-------------------------------+
  | Retrieved Chunks (Top-3)    | Provenance Chain              |
  | - Chunk 1: Diya Agencies    | - Document: SCN_Zenith.pdf    |
  | - Chunk 2: Apex Case Notes  | - Verifier Status: Verified   |
  +-----------------------------+-------------------------------+
  ```
- **Key Components**:
    - **Query Bar**: Search inputs + quick query suggestions.
    - **Router Panel**: Displays target corpus routing outputs.
    - **Retrieved Chunks**: Cards highlighting source paragraphs.
- **States**:
    - *Error (Insufficient Chunks)*: Displays warning notification when no local documents match the query terms.
- **Navigation**:
    - Workspace triggers direct updates dynamically without full-page reloads.

---

### Screen 6: AI Drafting Panel
- **Purpose**: Document editor displaying generated text side-by-side with source citation checks.
- **Wireframe Layout**:
  ```
  +-----------------------------+-------------------------------+
  | Editor Pane                 | Verification Pane             |
  | "To, STO Ward 12 Delhi...   | - Precedent: NKAS Services    |
  | Reference: SCN under Sec 73 |   Status: [PASSED]            |
  | [Radha Krishan Para 45]     | - Precedent: Radha Krishan    |
  | "                           |   Status: [FLAGGED/MISMATCH]  |
  +-----------------------------+-------------------------------+
  ```
- **Key Components**:
    - **Rich Text Area**: Editable workspace.
    - **Verification Sidebar**: Dynamic checklists checking citation compliance.
- **States**:
    - *Loading*: Verification checker running.
- **Navigation**:
    - "Save Draft" records document state to Screen 8 (Document Repository).

---

### Screen 7: OCR Notice Upload
- **Purpose**: Ingest and metadata extraction from scanned physical files.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | [ Drag and Drop scanned PDF Notice files here to upload ]   |
  +-------------------------------------------------------------+
  | Recent Uploads:                                             |
  | - Apex_SCN_Sec73.pdf  | Size: 1.2 MB | Status: [Processing] |
  | - Matrix_SCN_Sec74.pdf | Size: 2.4 MB | Status: [Verified]   |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Dropzone**: Animated SVG border.
    - **Upload Progress**: Queue status list with confidence levels.
- **States**:
    - *Error (Tamper Flagged)*: Displays a red warning banner if a digital signature mismatch is detected.
- **Navigation**:
    - Clicking a processed file in the list opens Screen 8 (Document Repository) view.

---

### Screen 8: Chamber Files & Document Repository
- **Purpose**: List view of all uploaded chamber documents and case notes.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Search Files: [ Search... ]                         [+ Add] |
  | Name                   Size      Uploader       Role Limit  |
  | Apex_SCN_Sec73.pdf     1.2MB     Priya Sen      None        |
  | Billing_2026_Q1.pdf    540KB     Aditya S       Private     |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Filter Tabs**: Public, Private, All folders.
- **States**:
    - *Empty*: "No documents uploaded under this category."
- **Navigation**:
    - Selecting a file displays its inline OCR-extracted text details.

---

### Screen 9: Case Management Detail
- **Purpose**: Complete folder history of a specific case file.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Case: Apex Retailers GST ITC discrepancy (Delhi HC)        |
  | Status: [Active]                Next Hearing: July 15, 2026 |
  +-----------------------------+-------------------------------+
  | Linked Documents            | Connected Tasks & Assignees   |
  | - SCN Delhi.pdf             | - Rohan: Verify E-Way bills   |
  | - Draft_Reply_v1.docx       | - Priya: Submit reply         |
  +-----------------------------+-------------------------------+
  ```
- **Key Components**:
    - **Status Timeline**: Graphical dots tracking case stages.
- **States**:
    - *Loading*: Fetching registry records.
- **Navigation**:
    - "Add Task" button opens a modal targeting Screen 10 (Calendar).

---

### Screen 10: Smart Calendar
- **Purpose**: Chamber-wide schedule grid preventing double bookings.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | July 2026                                         [ < ] [ > ]|
  | Mon       Tue       Wed       Thu       Fri       Sat       Sun|
  | 30 (SCN)  01        02        03        04        05        06 |
  | 07        08        09        10        11        12        13 |
  | 14        15(Hear)  16        17        18        19        20 |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Month Grid**: Interactive day squares with scheduled alerts.
- **States**:
    - *Success*: Confirmed hearing slots sync dynamically.
- **Navigation**:
    - Clicking a day opens detail summary panels of hearings scheduled.

---

### Screen 11: Intern Dashboard
- **Purpose**: Activity logs, task assignments, and RAG access rules for junior researchers.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Intern Management Dashboard                                 |
  | Name             Task Count     Active Search   Search Logs |
  | Rohan            2 Pending      "GST Sec 73"    [View Logs] |
  | Sameer           0 Pending      None            [View Logs] |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Audit Log Access**: Button triggers popup containing query history logs.
- **States**:
    - *Empty*: "No active interns assigned to this chamber."
- **Navigation**:
    - Selecting an intern opens their specific profile analytics.

---

### Screen 12: Analytics Dashboard
- **Purpose**: Overview of chamber throughput, citation checks, and task completions.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Analytics                                                   |
  | +-----------------------+    +----------------------------+ |
  | | Search Pass Rate: 92% |    | Task Ingestion Vol: 34     | |
  | +-----------------------+    +----------------------------+ |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Charts**: Interactive line and bar widgets.
- **States**:
    - *Loading*: Running calculations.
- **Navigation**:
    - Filters allow changing data view scope.

---

### Screen 13: Notification Center
- **Purpose**: Manage notifications for tasks, system events, and deadlines.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Notifications                                               |
  | [x] Aditya Singhania approved draft reply (10m ago)         |
  | [x] WARNING: Limitation deadline for Apex Retailers: 3 days |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Notification Row**: Message text, timestamp, checkoff actions.
- **States**:
    - *Empty*: "You're all caught up! No unread notifications."
- **Navigation**:
    - Clicking a notification redirects to the corresponding element.

---

### Screen 14: Settings Configuration
- **Purpose**: Custom profile configuration, theme toggling, and API token storage.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Settings                                                    |
  | Chamber Name: [ Singhania & Partners           ]            |
  | AI Temp:      [ Normal - 0.2                   ]            |
  | [ Save Configurations ]                                     |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Form Inputs**: Text fields and selects.
- **States**:
    - *Success*: Toast message "Settings updated successfully."
- **Navigation**:
    - Sidebar menu links settings categories.

---

### Screen 15: Billing & Invoicing
- **Purpose**: Subscribe to premium plans and download receipts.
- **Wireframe Layout**:
  ```
  +-------------------------------------------------------------+
  | Active Plan: Pro Chamber Tier ($49/mo) | Renew Date: July 30|
  | Payment History:                                            |
  | Invoice #12894   | Date: June 30, 2026 | Status: [Success]  |
  +-------------------------------------------------------------+
  ```
- **Key Components**:
    - **Plan Selector**: Visual cards highlighting tiers.
- **States**:
    - *Processing*: Payments checkout page.
- **Navigation**:
    - Checkout redirects to success screen upon confirmation.
