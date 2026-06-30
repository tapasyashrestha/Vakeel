export interface ChunkMetadata {
  id: string;
  document_id: string;
  source_corpus: "public" | "private";
  case_name?: string;
  court?: string;
  year?: number;
  paragraph_reference?: string;
  title: string;
  is_private?: boolean;
}

export interface TextChunk {
  id: string;
  document_id: string;
  chunk_text: string;
  source_corpus: "public" | "private";
  is_private: boolean;
  metadata: ChunkMetadata;
}

// 15-20 Mock Indian Kanoon shaped case summaries (Public Corpus)
export const PUBLIC_CORPUS_CHUNKS: TextChunk[] = [
  {
    id: "pub_chk_1",
    document_id: "pub_doc_1",
    is_private: false,
    source_corpus: "public",
    chunk_text: "Input Tax Credit (ITC) cannot be denied to a buyer solely on the ground of mismatch between GSTR-3B and GSTR-2A. If the buyer proves genuine purchase and payment of tax to the supplier, the department must take action against the supplier first before denying credit to the purchasing taxpayer.",
    metadata: {
      id: "pub_chk_1",
      document_id: "pub_doc_1",
      source_corpus: "public",
      case_name: "Diya Agencies vs State Tax Officer",
      court: "Kerala High Court",
      year: 2023,
      paragraph_reference: "Para 14",
      title: "ITC Mismatch and Buyer Liability"
    }
  },
  {
    id: "pub_chk_2",
    document_id: "pub_doc_1",
    is_private: false,
    source_corpus: "public",
    chunk_text: "In the absence of any collusion or fraud, the department cannot levy penalties or demand recovery of input tax credit from the buyer where the supplier failed to upload the invoice, provided the invoice is genuine and the goods were received.",
    metadata: {
      id: "pub_chk_2",
      document_id: "pub_doc_1",
      source_corpus: "public",
      case_name: "Diya Agencies vs State Tax Officer",
      court: "Kerala High Court",
      year: 2023,
      paragraph_reference: "Para 19",
      title: "Absence of Fraud in Supplier Defaulters"
    }
  },
  {
    id: "pub_chk_3",
    document_id: "pub_doc_2",
    is_private: false,
    source_corpus: "public",
    chunk_text: "A recovery process initiated under Section 79 of the CGST Act without issuing a prior Show Cause Notice (SCN) under Section 73 or Section 74 is bad in law and violates principles of natural justice. The assessee must be given a reasonable opportunity of being heard.",
    metadata: {
      id: "pub_chk_3",
      document_id: "pub_doc_2",
      source_corpus: "public",
      case_name: "Mahadeo Construction Co. vs Union of India",
      court: "Jharkhand High Court",
      year: 2020,
      paragraph_reference: "Para 25",
      title: "Mandatory SCN for Section 79 Recovery"
    }
  },
  {
    id: "pub_chk_4",
    document_id: "pub_doc_3",
    is_private: false,
    source_corpus: "public",
    chunk_text: "Interest under Section 50 of the CGST Act on delayed filing of returns is payable only on the portion of tax paid through cash ledger (net tax liability), and not on the portion paid through input tax credit ledger (gross tax liability), retrospectively amended by Finance Act.",
    metadata: {
      id: "pub_chk_4",
      document_id: "pub_doc_3",
      source_corpus: "public",
      case_name: "Refex Industries Ltd vs Assistant Commissioner",
      court: "Madras High Court",
      year: 2020,
      paragraph_reference: "Para 8",
      title: "Interest on Net Tax Liability"
    }
  },
  {
    id: "pub_chk_5",
    document_id: "pub_doc_4",
    is_private: false,
    source_corpus: "public",
    chunk_text: "Circular No. 183/15/2022-GST clarifies the procedure to deal with difference in Input Tax Credit (ITC) availed in FORM GSTR-3B as compared to GSTR-2A for the FY 2017-18 and 2018-19. It permits the supplier to submit a certificate from a Chartered Accountant (CA) or supplier declaration verifying actual tax payments.",
    metadata: {
      id: "pub_chk_5",
      document_id: "pub_doc_4",
      source_corpus: "public",
      case_name: "CBIC Circular 183/15/2022-GST",
      court: "CBIC Guidelines",
      year: 2022,
      paragraph_reference: "Section 3.1",
      title: "Clarification on ITC Reconciliation"
    }
  },
  {
    id: "pub_chk_6",
    document_id: "pub_doc_5",
    is_private: false,
    source_corpus: "public",
    chunk_text: "A writ petition is maintainable against a summary show cause notice (GST DRC-01) if the notice lacks specific details, computation tables, or is issued without providing the underlying audit report, which effectively denies the tax assessee their right to reply.",
    metadata: {
      id: "pub_chk_6",
      document_id: "pub_doc_5",
      source_corpus: "public",
      case_name: "NKAS Services Private Limited vs State of Jharkhand",
      court: "Jharkhand High Court",
      year: 2021,
      paragraph_reference: "Para 30",
      title: "Vagueness in DRC-01 SCN"
    }
  },
  {
    id: "pub_chk_7",
    document_id: "pub_doc_6",
    is_private: false,
    source_corpus: "public",
    chunk_text: "Under Article 226 of the Constitution, the High Courts can intervene against GST notices that are issued beyond the limitation period prescribed under Section 73(10) of the CGST Act. The department cannot arbitrarily extend deadlines in the absence of fraud or suppression of facts.",
    metadata: {
      id: "pub_chk_7",
      document_id: "pub_doc_6",
      source_corpus: "public",
      case_name: "Oceanic Food Products vs State Tax Officer",
      court: "Gujarat High Court",
      year: 2022,
      paragraph_reference: "Para 12",
      title: "Limitation Period and Writ Jurisdiction"
    }
  },
  {
    id: "pub_chk_8",
    document_id: "pub_doc_7",
    is_private: false,
    source_corpus: "public",
    chunk_text: "The attachment of bank accounts under Section 83 of the CGST Act is a draconian measure. It cannot be exercised in a routine manner. There must be tangible material on record showing that the taxpayer is likely to flee or liquidate assets to evade tax before a provisional attachment is ordered.",
    metadata: {
      id: "pub_chk_8",
      document_id: "pub_doc_7",
      source_corpus: "public",
      case_name: "Radha Krishan Industries vs State of Himachal Pradesh",
      court: "Supreme Court of India",
      year: 2021,
      paragraph_reference: "Para 45",
      title: "Provisional Account Attachment Guidelines"
    }
  },
  {
    id: "pub_chk_9",
    document_id: "pub_doc_8",
    is_private: false,
    source_corpus: "public",
    chunk_text: "Filing an appeal under Section 107 of the CGST Act requires a pre-deposit of 10% of the disputed tax amount. Once this pre-deposit is paid, the recovery proceedings for the remaining 90% of the tax demand are automatically stayed by operation of law under Section 107(7).",
    metadata: {
      id: "pub_chk_9",
      document_id: "pub_doc_8",
      source_corpus: "public",
      case_name: "Saurashtra Calcine vs Union of India",
      court: "Gujarat High Court",
      year: 2019,
      paragraph_reference: "Para 5",
      title: "Pre-deposit and Stay of Recovery"
    }
  },
  {
    id: "pub_chk_10",
    document_id: "pub_doc_9",
    is_private: false,
    source_corpus: "public",
    chunk_text: "Cancellation of GST registration with retrospective effect must not be done arbitrarily. If the taxpayer was active and paying tax during the period, registration cannot be cancelled retroactively simply because they failed to file returns for a subsequent brief period.",
    metadata: {
      id: "pub_chk_10",
      document_id: "pub_doc_9",
      source_corpus: "public",
      case_name: "Anantheshwara Distributors vs Commissioner of Commercial Taxes",
      court: "Karnataka High Court",
      year: 2022,
      paragraph_reference: "Para 22",
      title: "Retrospective GST Registration Cancellation"
    }
  }
];

// 10-15 Private Chamber Documents (confidential and public internal files for the firm)
export const PRIVATE_CORPUS_CHUNKS: TextChunk[] = [
  {
    id: "pri_chk_1",
    document_id: "pri_doc_1",
    is_private: true,
    source_corpus: "private",
    chunk_text: "CONFIDENTIAL CLIENT CASE FILE: Singhania & Partners represented Apex Retailers Ltd. against a DRC-01 ITC mismatch notice. We successfully argued that the buyer paid ₹4,50,000 to supplier Zenith India Ltd., but Zenith failed to file GSTR-1. High Court accepted our CA certificate showing genuine payment and stayed the tax demand.",
    metadata: {
      id: "pri_chk_1",
      document_id: "pri_doc_1",
      source_corpus: "private",
      title: "Apex Retailers SCN S-73 Case Notes",
      is_private: true
    }
  },
  {
    id: "pri_chk_2",
    document_id: "pri_doc_1",
    is_private: true,
    source_corpus: "private",
    chunk_text: "MEMO TO FILE: For Apex Retailers, do not file the reply until Zenith India Ltd. provides their supplier declaration signed by their director. The declaration must state that the tax of ₹4,50,000 has been paid via GSTR-3B under Challan No. GST-22441.",
    metadata: {
      id: "pri_chk_2",
      document_id: "pri_doc_1",
      source_corpus: "private",
      title: "Apex Retailers Strategy Memo",
      is_private: true
    }
  },
  {
    id: "pri_chk_3",
    document_id: "pri_doc_2",
    is_private: false, // Internal template but NOT private (accessible by interns)
    source_corpus: "private",
    chunk_text: "STANDARD CHAMBER TEMPLATE: Written Reply against Section 73 Show Cause Notice. The reply must outline (1) Verification of the invoice, (2) Reconciliation sheet showing payment through bank channel, (3) Request for cross-examination of the supplier, and (4) Reference to Kerala HC judgment in Diya Agencies.",
    metadata: {
      id: "pri_chk_3",
      document_id: "pri_doc_2",
      source_corpus: "private",
      title: "Chamber Template - Section 73 SCN Reply",
      is_private: false
    }
  },
  {
    id: "pri_chk_4",
    document_id: "pri_doc_3",
    is_private: true,
    source_corpus: "private",
    chunk_text: "CONFIDENTIAL CLIENT STRATEGY: Tax evasion allegations against Matrix Logistics India Pvt. Ltd. SCN issued under Section 74 alleging suppression of facts. Our defense rests on showing that Matrix Logistics had a software error in generating e-way bills and there was zero intent to evade tax. Transcripts of billing logs attached.",
    metadata: {
      id: "pri_chk_4",
      document_id: "pri_doc_3",
      source_corpus: "private",
      title: "Matrix Logistics - Sec 74 Strategy File",
      is_private: true
    }
  },
  {
    id: "pri_chk_5",
    document_id: "pri_doc_4",
    is_private: false, // standard public template
    source_corpus: "private",
    chunk_text: "CHAMBER TEMPLATE: Appeal Letter format under Section 107. Key parts: Statement of facts, Grounds of appeal, Calculation of pre-deposit (10% of disputed tax amount), Verification clause. Ensure bank challan of pre-deposit is attached to Appeal Form GST APL-01.",
    metadata: {
      id: "pri_chk_5",
      document_id: "pri_doc_4",
      source_corpus: "private",
      title: "Chamber Template - Sec 107 Appeal Letter",
      is_private: false
    }
  },
  {
    id: "pri_chk_6",
    document_id: "pri_doc_5",
    is_private: true,
    source_corpus: "private",
    chunk_text: "INTERNAL BILLING & CLIENT AUDIT: Total billing for Apex Retailers case was fixed at ₹1,50,000 plus court filing charges. Senior Advocate Aditya Singhania billed 2 hours at ₹25,000/hr, Associate Advocate Priya Sen billed 6 hours at ₹10,000/hr, and Intern Rohan did 15 hours of legal research (unbilled).",
    metadata: {
      id: "pri_chk_6",
      document_id: "pri_doc_5",
      source_corpus: "private",
      title: "Internal Billing - Apex Retailers",
      is_private: true
    }
  },
  {
    id: "pri_chk_7",
    document_id: "pri_doc_6",
    is_private: true,
    source_corpus: "private",
    chunk_text: "CONFIDENTIAL CASE STUDY: In the matter of Gupta Iron & Steel (2025), our chamber handled bank account freezing under provisional attachment (Sec 83). We filed a writ petition in Delhi HC, proving that the business has a turnover of ₹50 Crore and cannot be shut down provisional to audit. Account was unblocked within 7 days.",
    metadata: {
      id: "pri_chk_7",
      document_id: "pri_doc_6",
      source_corpus: "private",
      title: "Gupta Iron & Steel - Sec 83 Case History",
      is_private: true
    }
  }
];

export const ALL_CHUNKS = [...PUBLIC_CORPUS_CHUNKS, ...PRIVATE_CORPUS_CHUNKS];
