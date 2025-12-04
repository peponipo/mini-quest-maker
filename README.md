# Mini Quest Maker

#### Video Demo: [URL HERE]

#### Description:

Mini Quest Maker is a web tool that allows anyone to create interactive story games without coding. Users can easily build "Choose Your Own Adventure" style stories where readers make choices that change what happens next. It achieves this by being very EASY to use (for THAT is its main purpose, accessibility!) and also minimizing or outright REMOVING any requirements such as installation or server dependencies. You will see as you check it!

## What It Does

The app runs in your browser using React. It has TWO modes: Edit Mode, where you create your story by adding scenarios and connecting them with choices, and Play Mode, where you can test your game to see if everything works correctly while having fun.

Users can add achievement badges that unlock when players reach certain endings. The history feature lets players go back and try different choices, just like a browser's back button. It is very easy to use.

## Main File

Everything is contained in one big, beautiful file called `App.jsx`, which has exactly 1,490 lines of code (on VScode). The file is kept together to make reviewing and fixing issues for CS50 easier, even though React apps are usually split into smaller components. There is a special beauty in having it all connected in one monolith!

## Key Features

**Scenario Renaming:** When you rename a story section, the app automatically updates every link pointing to it so nothing breaks. Short, to the point, efficiency at its finest.

**File Handling:** You can save your project as JSON to edit later, or download it as HTML to share with others. The HTML version is a complete game that works anywhere without installation. You can even import HTML files back into the editor to recover lost projects.

**History System:** The app remembers every choice players make, not just their current position. This enables the back and forward buttons and shows their complete journey.

## How It Works

The app stores game data in 13 different state variables. Scenarios are stored as objects instead of arrays because it is faster to look up items by name. When you export to HTML, the app creates a complete webpage with all the game code, styling, and data embedded, so no external files are required.

Everything runs SAFELY in your browser with no server required, keeping your work private and free to use.
