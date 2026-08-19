notes

Make provision for editor board with pictures 

site to check when building 
https://academicjournals.org/
https://www.tandfonline.com/
https://doaj.org/
https://themes.ojs-services.com/index.php/pub/index

plan a different login/signup page for larger screens

Now i want test the NJPST Workspace (Submit Manuscript,Editorial Dashboard,Reviewer Portal pages) locally 

But there are a few adjustment to the page 

1. tip for each field to show what is expected in the field (hover over the information icon [i] plan for mobile to ) this icon should replace the * at the end of the field name 

2. The pdf url field should be a file upload field instead of a text field. (it should accept only documents and pdf files)

3. remove Author id & APC Waiver fields

Make a well laid plan for this also ask clarafying questions

All toast and alert messages should at the buttom right corner of the screen for large screens while bottom center for mobile devices and should be dismissable by the user. (color coded & icon based on the type of message, success, error, warning, info)

for upload progress, show a progress bar below the file upload field with percentage and file name being uploaded.

# After login there will be the author dashboard page with the following sections (will have a sidebar on the left for navigation to each section for moblie devices the sidebar will be a hamburger menu)

Welcome message with the author's name and a profile picture (if available).

## 1. status cards : New Submission, Under Review, Accepted, Rejected, Published.

## 2. Submit Manuscript : 
   this page will have steps/phases for submission of the manuscript.

there will be a card-like progress bar 
- (if the user is on step 1, the card for step 1 will be highlighted and the rest will be greyed out,
if the user clicks on card/next 2 or 3 before completing the current step the card in question will change to a warning icon&color
if the user completes a step, the card will change to a success icon&color) with the following steps:

before the form fields, there will be a section with  information about the step to guide the author on what is expected in each step;



1. Manuscript Details (title, abstract, keywords.)

2. Author Details (name, email, affiliation, country.) [this will be prefilled with the logged in author's details but the author can edit it if they want to, provision for multiple authors to be added]

3. Upload files (Show preview of the uploaded files with the option to remove them if the author wants to, the author can upload multiple files but there should be a limit(50mb) to the number of files that can be uploaded, the following files are required for submission:)
 - manuscript file 
 - cover letter file
 - supplementary files (optional)

4. Review & Submit (show a summary of the submission with the option to edit any of the previous steps, the author can also add a comment to the editor in this step)

After the author has completed all the steps and submitted the manuscript, they will be redirected to a confirmation page with a message confirming that their submission has been received and is under review. The author will also receive an email notification confirming their submission.

## 3. My Manuscripts : 
   this page will show a list of all the manuscripts submitted by the author with the following details:
   - Manuscript title
   - Submission date
   - Status (New Submission, Under Review, Accepted, Rejected, Published)
   - Action (View,delete,download)

   
-  first section will be status cards showing the number of manuscripts in each status (New Submission, Under Review, Accepted, Rejected, Published) with the option to click on each card to filter the list of manuscripts by status.

- second section search bar to search for manuscripts by title, author name, or keywords.(not a wide site search but a search for the author's manuscripts only)

- third section will be a list of manuscripts with the following details:(will be in grid view showing the cover letter for larger screens and list view for mobile devices)
   - Cover letter 
   - Manuscript title
   - Submission date
   - Status (New Submission, Under Review, Accepted, Rejected, Published)
   - Action (View,delete,download) (icons at the bottom of each manuscript card for larger screens[eye, trash-can, download] and clickable icon [three dots] which will modal showing the manuscript cover letter title then action button below  for mobile devices)

work on the hamburger menu in the site dashboard

noticed there were two navbar [NJPST Workspace
Submit Manuscript
Editorial Dashboard
Reviewer Portal] and the author sidebar remove the  NJPST Workspace navbar 

also noticed that the dashboard tab in authors sidebar is always highlighted even when the cusor is on another tab, fix this issue

the field tip/info that is in localhost:3001/submit page should be added in the localhost:3001/dashboard/author/submit page and the localhost:3001/submit page should be deleted and the localhost:3001/dashboard/author/submit page should be the only page for submission of manuscripts

reviewer1@academic.net

author.test@university.edu

Plan to a upload a profile picture for the author in the author dashboard page under a settings tab and replaces the login button in the app journal dashboard (the profile picture should be displayed in the welcome message section of the author dashboard page and also in the submission page)

*The settings tab will have the following fields:

- name field (prefilled with the logged in author's name but can be edited)
- email field (prefilled with the logged in author's email but can be edited)
- phone number field (user inputs their phone number)
- affiliation field (prefilled with the logged in author's affiliation but can be edited)
- country field (prefilled with the logged in author's country but can be edited)
- password field (Hidden by default but can be shown when the author clicks on the "Change Password" button)

This will be broken into three cards at the top with the following titles:
Name & Contact Info, Affiliation & Country, Change Password

I thought the auth was handleing this{Reviewer Portal
No reviewer ID provided.

Append your reviewer UUID to the URL to view your assignments:

/reviewer?id=<your-reviewer-uuid>}

In the manuscript submission form, the cover letter and supplementary files sections should allow users to upload images.

Also Plan for this  the cards in the manuscript submission form should be have increased height to for design(for step 1 a big clipboard icon at the background, for step 2 a big user icon at the background, for step 3 a big files icon at the background, for step 4 a big check icon at the background).

add logout and delete account 

for small screens use the C:\Users\zabdiel\Desktop\PIN\public\logo-mobile.png logo in the navbar and for larger screens use the C:\Users\zabdiel\Desktop\PIN\public\logo.png logo in the navbar

## Footer
Add   Contact Us page to the footer
Address
Mobile number
Email address

Details for the contact us page should be as follows:
[Physical Address:

National Headquarters:
Suite 29 & 30, Decent Plaza, Behind G.S.S. Gwarimpa, Life camp, Abuja, FCT.
Tel: +2348035472743
Email: emailus@polymerinstitute.org.ng]

## News & Events (new page)
Recent News
Upcoming Events

# Guidelines for Reviewers & Authors

## Reviewers Guidelines
[Introduction
The review process is an important aspect of the publication process of an article. It helps an editor in making decision on an article and also enables the author to improve the manuscript.
Academic journal operates a blind peer review system.
 
Before accepting to review a manuscript reviewers should ensure that:
• the manuscript is within their area of expertise.
• they can dedicate the appropriate time to conduct a critical review of the manuscript.
 
Conflict of Interest
“Conflict of interest (COI) exists when there is a divergence between an individual’s private interests (competing interests) and his or her responsibilities to scientific and publishing activities such that a reasonable observer might wonder if the individual’s behavior or judgment was motivated by considerations of his or her competing interests” WAME.
 
”Reviewers should declare their conflicts of interest and recuse themselves from the peer-review process if a conflict exists”. ICMJE
 
 
Confidentiality
Manuscripts are confidential materials given to a reviewer in trust for the sole purpose of critical evaluation. Reviewers should ensure that the review processes is confidential. Details of the manuscript and the review process should remain confidential during and after the review process.
 
Plagiarism
‘The practice of taking someone else’s work or ideas and passing them off as one’s own’ Oxford Dictionaries
 
It is unethical for reviewers to “use information obtained during the peer-review process for their own or any other person’s or organization’s advantage, or to disadvantage or discredit others” COPE
 
Fairness
Reviews should be honest and objective. Reviewers should not be influenced by:
• The origin of the manuscript
• Religious, political or cultural viewpoint of the author
• Gender, race, ethnicity or citizenry of the author
 
Review reports
In evaluating a manuscript, reviewers should focus on the following:
• Originality
• Contribution to the field
• Technical quality
• Clarity of presentation
• Depth of research
 
Reviewers should also:
• Observe that the author(s) have followed the instruction for authors, editorial policies and publication ethics.
• Observe that the appropriate journal’s reporting guidelines is followed
The report should be accurate, objective, constructive and unambiguous.  Comments should be backed by facts and constructive arguments with regards to the content of the manuscript. Reviewers should avoid using “hostile, derogatory and accusatory comments” PIE.
 
Reviewers should not rewrite the manuscript; however necessary corrections and suggestions for improvements should be made.
 
Timeliness
Reviewers should only accept manuscript that they are confident that they can dedicate appropriate time in reviewing. Thus, reviewers should review and return manuscripts in a timely manner.
 
Recommendations
Reviewers’ recommendation should be either:
• Accept
• Requires minor corrections
• Requires moderate revision
• Requires major revision
• Not suitable for the journal. Submit to another publication such as (suggest a journal):
• Reject
 
Recommendation should be backed with constructive arguments and facts based on the content of the manuscript.
 
Resources
• COPE Ethical Guidelines for Peer Reviewers
• ICMJE - Responsibilities in the Submission and Peer-Review Process
• WAME - Conflict of Interest in Peer-Reviewed Medical Journals]

## Authors Guidelines
[Preparation of Manuscript

Manuscript should be written in the third person in an objective, formal and impersonal style. The SI system should be used for all scientific and laboratory data. The full stop should not be included in abbreviations, e.g. m (not m.) ppm (p.p.m.). All mathematical expression should be included in the manuscript. Care should be taken to distinguish between capital and lowercase letters, between zero (0) and letter (O), between the numeral (1) and letter (I), etc. Mathematical expressions should fit into a single column when set in type. Fractional powers are preferred to root signs and should always be used in more elaborate formulas. The solids (/) should be used instead of the horizontal lines for fractions whenever possible. Numbers that identify mathematical expressions should be enclosed in parentheses. Refer to equations in the text as “Eq. (1)”, etc., or “Equation (1)”, etc., at the beginning of a sentence.

Content

All pages must be numbered consecutively. A manuscript would normally include a title, abstract, keywords, introduction, materials and methods, results and discussion, conclusions and references.

Title page. A short title which should be concise but informative must be provided. This should be followed by the names and full addresses of all authors. Telephone number and e-mail addresses of the corresponding authors must be included.
The abstract should not be more than 220 words. It should give concise factual information about the objectives of the work, the methods used, the results obtained and the conclusions reached.
Contributors should list below the abstract keywords for information retrieval purposes. The keywords should identify with main point in the paper.
Abbreviations and Notations. Nomenclature must be listed at the beginning of the paper and should conform to the system of standard SI units. Acronyms and abbreviations should be spelt out in full at their first occurrence in the text.
Papers should be typed single column, with double line spacing on one side of the paper only with ample margins on all sides. The text should be divided into sections each with a separate heading, numbered consecutively. The section heading be typed on a separate line and should be underlined.
Conclusions and Recommendations. The conclusions should summarize the findings, clearly stating the contributions and their relevance. Recommendations for implementation or for areas of further work on the subject matter should be made.
These should be brief and relevant. The names of funding organizations should be written in full. Dedications are not permitted.
References to publish work should be indicated at the appropriate place in the text, according to the Harvard system (i.e. using author(s)’ name(s) and date), with a reference list in alphabetical order, at the end of the paper. All references in this list should be indicated at some point in the text and vice versa. Papers by more than two authors but with same first author should be listed by year sequence and alphabetically within each year.
Examples of layout of reference are given below.

Book

Onyeyili, I.O. (2003) Analysis of Statistically Determine Structures. El’ Demak Publishers, Enugu.

Thesis

Ihueze, C.C. (2005) Optimum Buckling Response Model of GRP Composites. PhD Thesis, University of Nigeria, Nsukka.

Journal

Umerie, S.C., Ogbuagu, A.S., Ogbuagu, J.O. (2004) Stabilisation of palm oils by using Ficus exasprata leaves in local processing methods. Bioresource Technology, 94: 307-310.

Conference

Menkiti, M.C., Ugodulunwa, F.X.O., Onukwuli, O.D. (2007) Studies on the coagulation and flocculation of coal washery effluent. Proceedings of the 37th annual conference of the Nigerian Society of Chemical Engineers, Enugu, 22-24 November, pp169-184.]

## Policies & Guidelines (new page)
[Scope of the Journal

The Journal is devoted to publishing original research and short communications in all aspects of Polymer Science and Technology (Engineering). Articles in the related discipline of materials science technology and application will also be considered for publication.]


[Copyright: By submitting a manuscript, the authors agree that the copyright for the article is transferred to the Polymer Institute of Nigeria, if and when the article is accepted for publication.]

Terms of Use
[Terms and Conditions (Replace AJOL with NJPST)
Any uses and/or copies of the content of participating AJOL journals in whole or in part must include the customary bibliographic citation, including author attribution, date and article title. Use may also require permission from the relevant publisher.

AJOL accepts content from journals in good faith, with the understanding that the material to be placed on the AJOL website contains nothing that is libellous, illegal, or an infringement of anyone's copyright or other rights. AJOL retains the right to refuse to place any content on the website, and to remove anything that it considers to be unsuitable.

In no event shall AJOL be liable for any special, incidental, indirect, or consequential damages of any kind arising out of or in connection with the use of the articles or other material derived from the AJOL website, whether or not advised of the possibility of damage, and on any theory of liability.

This service is provided "as is" without warranty of any kind, either expressed or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. AJOL makes no warranty of any kind, either express or implied, regarding the quality, accuracy, availability, or validity of the data or information in the website or of any other site to which it may be linked. While every effort is made by AJOL to see that no inaccurate or misleading data, opinion or statement appears on this website, they wish to make it clear that the data and opinions appearing in the articles and advertisements herein are the responsibility of the contributor or advertiser concerned.

The AJOL website is continuously under development and changes may be made in the website and these publications at any time.]

Make the [2. MINIMALIST HERO SECTION] use this image for the background: C:\Users\zabdiel\Desktop\PIN\public\hero-bg.jpg

Fix the spacing issue in the footer from the contact us page to  the Guidelines section 
it should match the spacing of the previous sections in the footer (about us , editorial board. etc )

I Found out why the Osj backend wasnt working, it was because the plan i was using was the free plan which doesnt allow for custom docker images and containers.
So i switched to a different paltform.

Now read the documentation for the new platform to see if it allows for custom docker images and containers. (C:\Users\zabdiel\Desktop\PIN\llms-full.md)

The footer section should have a dark shade backgroung 
Also add another hover effect for the links in the footer section should be added (a ripple line effect extending to both sides when the user hovers over the links in the footer section )

For footer section the links should be in a bold monospace font 
Also list the fonts used in the project and their sources in the footer section (for example: font-family: 'Inter', sans-serif; source: Google Fonts)

Use Plus Jakarta Sans for h1 & h2 in the project

### Plan to mock up the current issue by hardcoding the data for the author dashboard page and the submission page to see how it will look like when the backend is working


C:\Users\zabdiel\Desktop\PIN\public\uploads\a9367e15-9921-4360-badc-d3cafb7dabb8.pdf (use as currrent issue in the featured volume section of the homepage)
C:\Users\zabdiel\Desktop\PIN\public\uploads\b5d87bb0-3dd6-4f22-99fa-f54a33c09f1e.pdf (use as published article in  the published articles section of the homepage)

C:\Users\zabdiel\Desktop\PIN\.agents\skills\idea\SKILL.md

Design for the featured volume section [export default function HomePage() {
  const latestIssue: import('@/lib/ojs/types').NormalizedIssue = {
    id: '1',
    volume: 15,
    issueNumber: 2,
    year: 2026,
    title: 'Volume 15, Issue 2',
    datePublished: '2026-03-15',
    isCurrent: true,
  };] Just this card it will have two sides, the left side will have the cover picture and the right side will have the information about the volume and a download button for the volume. The download button should be centered below the information about the volume.
use (C:\Users\zabdiel\Desktop\PIN\public\uploads\Vol. 15.jpg) as the cover picture for the featured volume section of the homepage
Cover picture (lhs)  Info (rhs)
************          xxxxxx
|           |        xxxxxxx
|           |           xxxxxx           
|           |                  
************               

           Download btn (center)
For the cover give it rounded corners, shadow effect and a hover effect (when the user hovers over the cover picture.

For the design of the published articles section of the homepage.
remove the floating cover-letter badge on the articles card [{/* Cover letter badge — design placeholder (static). */}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-500 ring-1 ring-blue-200 dark:bg-blue-800/50 dark:text-blue-300 dark:ring-blue-700">
                      <FileIcon className="h-3.5 w-3.5" /> Cover Letter
                    </span>]
for the use (C:\Users\zabdiel\Desktop\PIN\public\uploads\article.jpg) as the cover picture for the published articles section of the homepage while keeping the docment icon [{/* Document-style header — bold centered file icon */}
                  <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-blue-100 bg-gradient-to-b from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-900/40 dark:to-blue-950/60">
                    {/* Subtle corner accents */}
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-200/40 dark:bg-blue-800/30" />
                    <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-blue-200/30 dark:bg-blue-800/20" />

                    {/* Bold document icon, centered */}
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-4 ring-white/70 dark:ring-blue-950/40">
                      <FileIcon className="h-10 w-10" strokeWidth={2.5} />
                    </div>]



Plan to implement navgation.tsx
Like a universal funtion just like the footer 

But this will the dynamic : depending on the page this  

add btn for abstract in the Published Articles card section of the homepage[abstract,read,download], when the user clicks on the btn it should open a modal showing the abstract of the article with two actions btn at the end read and download.

mock up data for the abstract of the article in the modal for now until the backend is working, and the modal should include the name of the article, the author(s) name(s) affiliation(s) date published,views,keywords and the abstract of the article.

the search archive what does it query now 

add seacrh to the navbar for larger screens and a search icon for smaller screens, when the user clicks on the search icon it should open a modal with a search input field and a search btn, when the user clicks on the search btn it should query the backend for articles matching the search term and display the results in the modal.

Replace  3. TRUST BANNER BAR with news and events (the topic or header) with an animation right - left, hover effect pauses the animation and clicking on the news and events section should open the news and events page to that new or event.

plan to make the LHS of nav bar compact 