
#TODO: in the text area, white space is sometimes stripped by (?) pylatex, test this out and fix it so that what the user types is used

#TODO: in the text area, there is an error in displaying the pdf if the user presses enter in between two lines of text, not sure why, was probably me trying to refresh the page while the pdf was being rendered... 
# probably need to save each addition (i.e. any time a new pdf is made) as a new filename (and then delete old pdf) to avoid any lapses like this because can't control when the user refreshes the screen

#TODO: text and symbols in PDF not wrapping to next line when I type a really long word, is this expected?

#TODO: if you draw too soon, then the models aren't trained, so train them beforehand, on a different page

#TODO: docuemnt is "not found" at the beginning if there is not already a PDF made...

#TODO: pylatex has issues with a document that has nothing in it and a document that only consists of a space so avoid these cases with undo and redo

#TODO: limit number of latex characters for mathjax display to reduce memory usage and slowdown

#TODO: undefined in mathjax display when working on navigation between pages, probably because NOT running flask with python

# LOGIN FUNCTIONALITY
#TODO: redirects to login screen upon no authorization are janky because I can see the "secured" page temporarily
#TODO: XMLHttpRequest error in console sometimes
#TODO: user-friendly error messages for the login page
#TODO: use and understand email format validation for login functionality
#TODO: error upon logging out, probably too quick, propbably need an await

# NAVIGATION
#TODO: If click on 'new document' too quickly, "Unhandled Promise Rejection: TypeError: Load failed"

# MATHJAX
# TODO: mathjax display is 'undefined' after pressing 'New Document' probably because the HTML is undefined... find out where, how, when this display is set, especially from /documents to /create
# TODO: machine learning buttons not appearing after pressing 'New Document' probably because something isn't set up quite right when going from /documents to /create instead of just loading and staying on /create
# TODO: possible bug is that the mathjax states look the same as the tex states after refresh; maybe localstorage doesn't know the difference between double backticks and an empty string
# note that documents.html adjusts localstorage when a new document is created so this behavior can be tracked starting from documents.html
# TODO: numbers cutoff on buttons and on mathjax display
# TODO: make images for all symbols
# TODO: test all symbols -- ensure they appear on buttons, are displayed on mathjax, and get propagated to tex document 
# TODO: Sometimes I can't remove the first character when using the find feature and the delete button but the clear button works, not sure what the cause of this is
# Top-right buttons collapse when the width of the screen is reduced

# PYLATEX
# TODO: Files/updated/review.tex was not generated the first time I logged in, pressed new document, made a character, and pressed 'add to document' and the file itself wasn't created the first time but the second time the file was created and no error
# So, make sure Files/updated/review.tex is made when intended and is the correct file via get modified before trying to send it or could get a fetch error as described above; it's possible the pylatex document didn't have any text in it at the time so investigate that option
# basically it could be a timing issue; I think the tex file is created/updated way after it is sent so need to wait with a while loop in the python/flask function
# Found the error: AttributeError: 'NoneType' object has no attribute 'generate_tex' -- why is it none?? refresh so document manager instance is reset!?? probably.
# need to save document manager before refreshing and after refreshing, I think it's called unload and reload and I think this can be done in flask if not already implemented below
# in conclusion there might be two or more issues going on here
# TODO: setup tex file as soon as possible after user has pressed the 'new document' button, don't want the user writing to a file that doesn't exist yet! can use a while loop and when files were last modified
# TODO: similar requirement for editing a document

# LOGIC
# TODO: I think there is an issue with the texstate and the mathstates even without refresh because I think I saw text overwriting symbols and things being printed out of order so check the global arrays and see what is going on by printing to the console
# It's probably a good idea to alternate between text and math symbols to really see what is happening, and do this when refresh is involved and when refresh is not involved
# I also am doing imports and exports of these arrays so that might have contributed to what I am seeing, as I don't remember seeing this before moving the import and export of global arrays (i.e. texStates, mathjaxStates) around
# definitely want to check the pylatex document object as well during refresh and no-refresh situations and see how the object's textstates is affected

# STORAGE
# TODO: a ton of new folders are created based on the current time instead of overwriting the single tex file for a given filename so need to get one filename maybe based on iniital creation date and stick with it
# and when things are working I can figure out how to allow the users to change the filename 
# TODO: got unauthorized when creating a new account, signing in, and creating a new document, but then later didn't get unauthorized -- either authorization error, importing or using too much firebase in certain JS files, and/or timing error
# TODO: the uploaded tex file is looking quite bad with way too much information, with the actual classes

# ENCRYPTION: 
# TODO: need to make sure I can't see everyone's documents; I probably need to encrypt the folders or files or something like that

# PDF Display:
# TODO: it APPEARS that the blank pdf gets overwritten, so more than one 'new document' doesn't actually show a blank document so need a different solution to getting a blank pdf every time 'new document' is pressed
# TODO: set up pdf file so that it displays as soon as possible after user has pressed the 'new document' button, can use a while loop and look at when files were last modified
# TODO: similar requirement for editing a docuemnt

# Other
# TODO: get_new_tex_file and get_new_tex_file fail when 'new document' is clicked for the second time, probably because the files are being created after the python function ends so nothing is being sent even though the files are being created
# TODO: current user is null when switching between pages
# TODO: is the authentication remaining when switching between pages
# TODO: disable back button when there are updates, uploading
# TODO: cleanup working directory for a given user and project at appropriate times
# TODO: when do os.mkdir, os.makedirs, and shutil.rmtree fail?
# TODO: Text area actually strips leasing spaces but not new lines maybe can enable an option to not strip white space or add in a character analogous to \n for a space or maybe can use \ or r"" or some combination of these
# TODO: It seems like functions for updating the pdf and updating the tex file are called twice, especially when doing the undo and redo
# TODO: What happens when buttons are pressed in succession too quickly? Need to prevent crashes and data loss and bad project names.
# TODO: Sometimes the auth fails and there is a null value, so check for that whenever auth is needed, especially in documents.js 
# TODO: adding just an "enter" to a new document causes pylatex issues
# TODO: Unhandled Promise Rejection: TypeError: Load failed for documents.js when removing directory upon signing out
# TODO: Ensure compatibility with mobile devices
# TODO: Comment out print statements so that people can't see those
# TODO: Code Organization
# TODO: Manage Firebase Login and Register error messages better, don't want raw firebase messages to appear as alerts, those error messages are cryptic
# TODO: Better error handling 

# SAVING; UPLOADING TO FIREBASE STORAGE
# TODO: Is work lost after refresh? What if redo and undo is happening as well?
# TODO: Is work lost after waiting? What if redo and undo is happening as well?
# TODO: Sometimes the folder in Google Storage is [object Promise] which is problematic because this could cause projects to combine and overwrite because this isn't a unique name; first saw this during undoing and redoing
# TODO: Somestimes files are saved out of the intended folder, probably because the project name is temporarily "" or something
# TODO: the filepath is in uploadUpdatedPDFFile() is: "users/Oys0XSCJ6Qe18UiN7xaSpGQtRE23/loading/review.pdf" -- NEED to make an async function that waits for project name to be available, the project name cannot be "loading" nor "new" nor one of those promises -- why is that happening by the way?

# MULTIPLE USERS
# each file that is saved needs to be specific to the user, especially the pdfs and tex files, or else they will overwrite, so really need to reorganize the file structure based on the user, probably the user's id
# then need to upload the file to the cloud just the like the tex file in order to display it so that I don't have millions of folders, the folders need to be on the server, can consider making a folder in the code to
# compile the pdf and then removing that data right after the file is uploaded, need to figure out how to scale this in the best way, maybe don't even make the pdf on the backend, just compile it based on the tex 
# on the front end, hopefully pylatex can do this, I think it can with 'append' or something' so then I don't need to save pdfs, just tex, can save pdf that was compiled to a private folder specific to the active user
# and then when the user is not actively using the project, can delete the folder, as the pdfs are specific to a user's project

# UNDO AND REDO
# TODO: Can get errors if press undo and redo too quickly so may need to disable buttons until processes are complete
# TODO: What happens if these buttons are pressed in succession too quickly? Crash? Need to prevent crashes. 

# EDITING: 
# TODO: When there is nothing in the review.bin file because no edits were made, there is a EOFError: Ran out of input on the Flask side

# TESTING
# TODO: prevent people from pressing buttons too quickly with async and await and enable/disable
# TODO: multi-account and multi-user and multi-IP and mult-device testing
# TODO: there appears to be a way to lose the pdf by pressing undo and redo too quickly and the pdf can't be recovered, at least easily, by user so that's a problem
# FUTURE: Allow compatibility with apple pencil
# TODO: Allow users to opt-in to improve image recognition, sending images that are selected from automatic suggestions/predictions to Firebase for later training