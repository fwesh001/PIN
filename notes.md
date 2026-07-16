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

