### 1. Problem Analysis

1. **Define the core purpose of your website before writing any code.**

* The core purpose of the web application is to migrate the analog, print-only operations of the Nigerian Journal of Polymer Science and Technology (NJPST) into a digitized, self-funding, globally indexed Open Journal Systems (OJS) platform hosted on a secure subdomain (`journal.polymerinstitute.org.ng`).




2. **Identify target audience: Know exactly who will use your website.**
* **Academic Authors & Researchers:** Nigerian and international polymer scientists, chemists, and materials engineers looking to submit high-quality manuscripts to satisfy institutional or National Universities Commission (NUC) peer-reviewed publication requirements.


* **Editorial Board & Reviewers:** Prof. S. M. Gumel and the PIN editorial team who need an automated backend interface to manage submissions, coordinate blind peer reviews, and assign rights.


* **Global Scientific Readers:** Institutions, indexers (Google Scholar, Scopus, Web of Science), and researchers searching for crawlable metadata and downloadable open-access PDFs on regional polymer and mineral data.


* **Corporate Sponsors & Industry Partners:** Chemical distributors (e.g., Somochem) and plastic manufacturers looking for targeted sidebar advertising or sponsored special industrial issues.




3. **Define user pain points: Discover what problems your users face.**
* **The "Visibility Gap" & Indexing Failures:** Authors cannot get their published papers recognized on global platforms because the current site completely lacks machine-readable Highwire Press or Dublin Core meta tags, resulting in failed Google Scholar indexing crawls.


* **Unsearchable Legacy PDF Data:** 30 years of deep historical research on local rubber latex and geopolymers are trapped in raw image/print formats that automated web-crawling robots cannot extract or index without Optical Character Recognition (OCR).


* **Fragmented Email Workflows:** Reviewers and editors currently track article statuses manually through disparate email chains, leading to slow turnaround times and a lack of publication transparency required by Scopus.


* **Financial Instability:** The mother organization (Polymer Institute of Nigeria) faces continuous capital drain from subsidizing physical printing costs instead of leveraging automated digital revenue.




4. **Formulate the solution: Outline how your website solves those problems.**
* **OJS Platform Deployment:** Install a Linux-based OJS software architecture (paired with PHP/MySQL) that automatically bakes persistent metadata tags into the HTML landing pages of every unique article URL.


* **Automated Indexing Integration:** Implement specialized OJS plugins to ping Google Scholar, integrate Crossref DOI registration APIs, and synchronize full-text searchable PDFs directly with African Journals Online (AJOL).


* **Role-Based Workflow Automation:** Build an explicit, trackable web engine that separates views and permissions cleanly for Authors, Reviewers, and Editors to pass Scopus Content Selection board evaluations.


* **Digital Revenue Engine:** Integrate a tiered programmatic payment gateway directly into the author submission funnel to process Article Processing Charges (APCs) natively (e.g., NGN 35,000 to NGN 55,000 based on PIN membership).




5. **Establish business goals: Determine if the site generates leads, sells products, or informs.**

* **Achieve Complete Financial Self-Sustainability:** Eliminate dependence on PIN grants within Year 1 by processing APCs online across two annual issues, aiming for a minimum 100%+ ROI (N1,500,000+ projected annual revenue) to fully cover OJS hosting and Crossref membership fees.


* **Secure Grant Leads via Technical Compliance:** Structure the portal’s open-access policies and transparency markers to successfully qualify for and unlock the N5,000,000 TETFund Academic Research Journal intervention grant.


* **Drive Commercial Ad Monetization:** Utilize sidebar banner ad widgets and directory spaces to secure paid corporate sponsorship packages with local polymer industrial giants.


* **Scale Citation Impact:** Inform the global community to rapidly increase the journal's CiteScore metrics, building a two-year record of on-time digital issues to secure formal Scopus and Web of Science indexation.


Perfect. Thank you for these precise clarifications. Now that we have mapped out exactly how the system needs to function, we can formally detail the **Functional Requirements** for your software blueprint.

Here is the structured breakdown for the first part of your Software Requirements Specification (SRS), incorporating your project parameters and the business workflow of the Polymer Institute of Nigeria (PIN).

---

### 2. Software Requirements Specification (SRS)

#### Functional Requirements

The NJPST web application must provide a trackable, automated, and secure multi-tier workflow dividing operations between Readers, Authors, Reviewers, and Editors. The system must execute the following specific features:

##### 1. User Authentication & Role-Based Access Control (RBAC)

* 
**Multi-Role Registration:** The system must provision explicit dashboards, permissions, and views for four distinct user roles: Readers, Authors, Reviewers, and Editors.


* 
**Double-Blind Review Enforcement:** The system must programmatically scrub author names, institutional affiliations, and metadata from manuscripts and review portals during the evaluation stage to ensure absolute anonymity.



##### 2. Author Submission & Integrity Funnel

* 
**Manuscript Upload Pipeline:** Authors must be able to upload manuscripts along with corresponding metadata fields (e.g., Title, Abstract, Keywords, References).


* 
**Automated Anti-Plagiarism Check:** The submission engine must natively interface with a server-side anti-plagiarism API (such as Crossref Similarity Check/iThenticate) to scan manuscripts and generate an originality report for editors prior to peer-review assignment.



##### 3. Automated Metadata, DOIs, & Indexing Pipelines

* 
**Persistent Article Metadata:** The platform must automatically generate and embed machine-readable Highwire Press and Dublin Core meta tags into the unique HTML landing page of every single published article.


* 
**Instant Crossref DOI Minting:** The system must execute synchronous REST API calls to Crossref to register and activate a unique Digital Object Identifier (DOI) the exact second an editor transitions an issue's status to "Published".


* 
**AJOL OAI-PMH Harvesting Protocol:** The portal must expose an Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) XML feed configured to securely transmit data payloads to African Journals Online (AJOL) servers.



##### 4. Financial Engine & Tiered APC Processing

* 
**Tiered Pricing Portal:** The checkout interface must dynamically adjust Article Processing Charges (APCs) based on author input:


* 
*PIN Members:* ₦35,000 


* 
*Non-Member Nigerian Authors:* ₦55,000 


* 
*International Authors:* $150 




* **Coupon/Verification Engine (Option B):** To process PIN Member discounts, the system must validate a unique, single-use administrator-issued verification token at the billing step before modifying the total fee.
* 
**Payment Gateway Integration:** The system must integrate a secure payment gateway API (such as Flutterwave or Paystack) capable of processing split local Naira (NGN) and international USD card transactions.



##### 5. Front-End Reader Portal & Corporate Monetization

* 
**Faceted Advanced Search Engine:** Readers must be able to search the entire 30-year digitized archive via a search bar with metadata filtering capabilities, allowing users to isolate papers by author, publication year, volume, and highly specific domain keywords (e.g., *indigenous minerals*, *tropical fibers*).


* 
**Corporate Self-Service Ad Portal:** The system must feature a restricted vendor backend where industrial sponsors (e.g., Somochem, PerkinElmer) can register, pay for ad space, and upload graphic banner assets directly to a database queue for sidebar widget rotation.





#### Non-Functional Requirements

To prevent search engine crawlers from de-indexing the platform and to secure sensitive payment transactions, the system must meet strict operational, performance, and security thresholds.

##### 1. Performance and Scalability Goals

* **Page Loading Speed:** To maintain optimal search engine crawl efficiency, the core article landing pages and search result views must have a Time to First Byte (TTFB) under **800ms**, with a total page load time not exceeding **2.5 seconds** under normal traffic conditions.
* **Concurrency Handling:** The backend database and web server must comfortably support at least **100 concurrent active sessions** (authors submitting manuscripts, reviewers evaluating papers, and readers downloading PDFs) without degradation in system performance.

##### 2. Reliability and Availability

* **Uptime Target:** The platform must achieve a minimum **99.9% runtime availability** on its designated subdomain (`journal.polymerinstitute.org.ng`), ensuring that automated web-crawlers (such as Google Scholar or Scopus indexers) can access article metadata at any time.
* **Fault Tolerance:** Database transaction rollbacks must be programmatically enforced during checkout sequences to ensure zero corrupted states if a payment gateway handshake drops.

##### 3. Security Measures and Data Integrity

* **Transport Encryption:** Force strict **HTTPS SSL/TLS 1.3 encryption** across all routing paths to secure transmission of manuscripts, reviewer critiques, and financial data.
* **Payment Security:** The system must remain **PCI-DSS compliant** by offloading actual credit card processing directly to the native payment gateway inline frames (e.g., Paystack/Flutterwave popups), preventing raw card data from touching the journal's application server.
* **Automated Data Protection:** Execute **automated daily server-side database backups** paired with weekly file attachments snapshots (for PDFs and manuscripts) pushed to a separate secure off-site cloud storage bucket for disaster recovery.

##### 4. Compliance and Standards

* **Crawlability Compliance:** The HTML structures must output valid machine-readable metadata schema templates to seamlessly comply with indexer requirements from Scopus Content Selection Advisory Board (CSAB) and the Directory of Open Access Journals (DOAJ).

---

#### Scope Boundaries (Version 1) 

To ensure rapid development, clean deployment, and immediate alignment with Google Scholar indexing requirements, the platform will focus exclusively on a robust web-based publishing, metadata delivery, and billing architecture.

The following boundaries are explicitly established for the system version one build:

* **Automated Multi-Language Translation:** The site will operate strictly in English, satisfying basic international indexing constraints without real-time translation layers.
* **Rich Media and Video Abstracts:** Support for author-uploaded video presentations, interactive 3D chemical structures, or audio abstracts on landing pages will not be included.
* **Internal Real-Time Messaging Systems:** Communication between editors, authors, and reviewers will occur via automated transactional emails triggered by system state changes, rather than a live web-chat interface.
* **Automated Institutional IP Authentication:** Library-wide access configurations via institutional IP ranges will be omitted, as the platform operates on a strict Gold Open Access model where published content is globally free to read.

