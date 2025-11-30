# Personal Decision-Making App - Step 1: UI Setup, Basic Input Handling and Modular Output

## Description
This app will help me decide and analyze a new hobby based on various factors. 
This step sets up the basic look and structure of the application. This includes:
* Setting the HTML and CSS forms for the basic user interface
* User input is set to capture and read back the given data
* A set of rules was implemented to ensure that inputs would count towards a decision	
* Outputting a final decision on whether the user should or should not try the selected hobby

This project utilizes JavaScript to create the various files necessary to ensure the app is set up correctly.

## My Decision Focus
This app is specifically designed to help me decide which new hobby to take on based on several carefully chosen factors, including:
* The Selected Hobby: this determines how difficult the hobby itself is 
* Available Time: how much leisure time is available to put into the hobby
* Available Funding: how much is needed for initial tools, machines, and supplies, as well as later on when these run low
* Sociability: is this an activity that requires being around other people, as well as one’s own tolerance of groups
* Dedication Level: is this something one can actually see themselves repeatedly doing?

## My Decision Logic
A system of points has been configured to help determine outcomes based on specific answers.

**Hobby Type Logic:**
Certain hobbies are easier than others and offer more points than a more difficult one. Some require more brain power, cash, or a full tank for those who want to travel. The harder the task, the fewer points are given

* Traveling: 2 pts
* Learning a Language: 4 pts
* Learning an Instrument: 6 pts
* Camping/Hiking: 8 pts
* Woodwork: 10 pts
* Fishing: 12 pts
* Exercise/Sports: 14 pts
* Gardening: 16 pts
* Board/Tabletop Roleplaying Games: 18 pts
* Cooking/Baking: 20 pts
* Sewing/Embroidery: 22 pts
* Photography: 24 pts
* Writing/Poetry: 26 pts
* Drawing/Painting: 28 pts
* Reading: 30 pts

**Time Logic:** 
Same as hobby selection, the more time available per week for an activity, the higher the points
* If 1 hour per week is inputted, 4 points are granted
* If 2 hours are inputted, 6 points are granted
* If 3 hours are inputted, 8 points are granted
* If 4 hours are inputted, 10 points are granted
* If 5 hours are inputted, 12 points are granted
* If more than 5 hours are inputted, 14 points are granted

**Funding Logic:**
Fewer points are given if less is reserved for needed supplies, such as a table saw or vegetable seeds
* If $1 to $9 is available: 5 pts are given 
* If $10 to $29 is available: 10 points are given
* If $30 to $49 is available: 20 points are given
* If $50 to $99 is available: 25 points are given
* If $100 or more is available: 30 points are given

**Social Logic:**
One’s desire for others around vs solitude can also affect whether the selected hobby is a good fit.
* If Gardening, Sewing/Embroidery, Photography, Writing/Poetry, or Reading are selected with no social interaction, 10 points are received 
* If Gardening, Sewing/Embroidery, Photography, Writing/Poetry, or Reading are selected with low social interaction, 8 points are received
* If Gardening, Sewing/Embroidery, Photography, Writing/Poetry, or Reading are selected with high social interaction, 4 points are received
* If Learning a Language, Instrument, Woodwork, Drawing/Painting, or Cooking/Baking is selected with no social interaction, 4 points are received
* If Learning a Language, Instrument, Woodwork, Drawing/Painting, or Cooking/Baking is selected with low social interaction, 10 points are received
* If Learning a Language, Instrument, Woodwork, Drawing/Painting, or Cooking/Baking is selected with high social interaction, 8 points are received
* If Traveling, Camping/Hiking, Exercise/Sports, Board/Tabletop Roleplaying Games, or Fishing are selected with no social interaction, 4 points are received
* If Traveling, Camping/Hiking, Exercise/Sports, Board/Tabletop Roleplaying Games, or Fishing are selected with low social interaction, 8 points are received
* If Traveling, Camping/Hiking, Exercise/Sports, Board/Tabletop Roleplaying Games, or Fishing are selected with high social interaction, 10 points are received

**Dedication Logic:**
A major part is one’s interest in the hobby itself. If there is little interest, then it is not a good fit.
* If "Hell Yeah!" is selected: 16 pts are rewarded
* If "Hard to Say" is selected: 8 pts are rewarded
* If “Meh…": 4 pts are rewarded

**Final Decision Logic:**
After which all points are combined to give users a calculated recommendation
* If the combined points are between 70 and 100, then the user will receive a “Go for it!” message. This indicates the selected hobby is likely a good match
* If the combined points are between 41 and 69, then the user will receive a “Give it a try” message. This indicates the selected hobby may or may not be a good match. Best to try it out before buying all the needed supplies
* If the combined points are between 0 and 40, then the user will receive a “Save for later!” message. This indicates the selected hobby is not a good match for the time being. But this does not mean it will remain so in a month or year.

## Example Output
Here are a few examples how the different inputs create different results:

**Example 1: Fitting Hobby**

If the following is selected…
* Hobby: Reading
* Time: more than 5 hours per week
* Cost: $100 or more available
* Sociability: Solo
* Dedication: Hell Yeah!

…the app produces this specific output:
    
    Go for it!	
    Based on the selected options, this activity is a good fit. Enjoy your new hobby
**Example 2: A Maybe**

If the following is selected…
* Hobby: Exercise/Sports
* Time: 3 hours per week
* Cost: $49
* Sociability: Friends Only
* Dedication: Hard to Say

… the app produces this specific output:
    
    Give it a try
	Based on the selected options, this activity could go either way. Try it for a few days and decide afterward.
**Example 3: Try Again**

If the following is selected…
* Hobby: Traveling
* Time: 1 hour per week
* Cost: $5 per week
* Sociability: Solo
* Dedication: Meh…

… the app produces this specific output:

	Save for Later
    Based on the selection options, this activity is not the best fit for the moment. Select another and try this hobby again at a later time.

## Input Types Used
This application uses the following inputs to record user inputs:
* Drop Down Select for "Choose a Hobby": condenses a large list of hobbies rather than listing them all in a radial form
* Number Input for "Time" and “Monthly/Annual Cost": allows users to choose how many hours and dollars to add
* Radio for "Sociability" and "Dedication": both only need 1 answer and the selections to choose from are much smaller. Dropdown is not needed

## Color Palette
I chose a palette called "Dark Sunset" which includes a calming teal color background, light yellows for the container colors, and a contrasting dark red for the texts.

    * Main Background: #335c67 (Ash Cyan)
    * Container Background: #f0eddd (Eggshell) 
    * Paragraph and Results Text Color: #9e2a2b (Dull Red)  
    * Dropdown Background Color: #e7dbc8 (Bone)
    * Fieldsets Background Color: #f7b55170 (Dull Gold)
    * Boarders, Text Headings and Button/Accent Color: #540b0e (Very Dark Red)
Dark Sunset can be viewed at [Coolors - Palette URL](https://coolors.co/palette/335c67-fff3b0-e09f3e-9e2a2b-540b0e)

 ## Step 4
 **Functionality**

    * Hobby Comparison: compare two different entries to better decide which hobby works best

**Required Inputs**

    * Code Input for UI controls and containers 
    * Data Input for existing data entries for additional comparison ()
    * User Interaction Inputs to trigger the selected functionality

**Code Changes**

app.js

    * declares comparing section
    * updates display to ui.js
    * selected and resetting event listeners added
    * adding result coding comparison with Google Search's help and Gemini's corrections
data-store.js

    * IDs for compared results to be recalled and cleared
table-renderer.js

    * adding compareButton and connected actions 
    * adding event listeners
ui.js

    * importing compare results with corrections from Gemini
    * updates comparison panels with help from Gemini
    * Displays results of comparison with Google Search's help
decision.js

    * calculations between two results found with help from Google Search
style.css

    * tables and buttons match remainder of app with Google Search's help
index.html

    * compare section created with titles and headings with Gemini's corrections

## Step 5
**FV Rules**

    Rule 1: Please select a hobby from the dropdown list

    Rule 2: Available time cannot be a negative number

            Checkbox will be added to the Time Form: "No Time Available"
            The following message will then pop up: "Why are you here then? 
            Come back when you have time."
    Rule 3: A social level must be selected

    Rule 4: A dedication level must be selected

## Corrections
**Gemini**

    * Rule 1
    * entriesToCompare 
    * import compareHobbyResult 
    * timeDisplay.innerHTML 
    * for(let i =0)
    * totalElement.textContent 
    * Suggested - noTimeAvailable 
    * getCompareButtonText 
    * compareDisplay 
    * compareSection 
**Google Research**

    * compareHobbyResults 
    * compareResultContainer 
    * updateCompareDisplay 
    * If (selectedCount === 2 { 
