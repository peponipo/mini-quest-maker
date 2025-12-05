# Mini Quest Maker

#### Video Demo: [https://youtu.be/sTZfbh0Cgj0]

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


Video Demo: [https://youtu.be/sTZfbh0Cgj0]
Description:
Mini Quest Maker is a web tool that allows anyone to create interactive story games without coding. Users can easily build "Choose Your Own Adventure" style stories where readers make choices that change what happens next. It achieves this by being very EASY to use (for THAT is its main purpose, accessibility!) and also minimizing or outright REMOVING any requirements such as installation or server dependencies. You will see as you check it!

What It Does
The app runs in your browser using React. It has TWO modes: Edit Mode, where you create your story by adding scenarios and connecting them with choices, and Play Mode, where you can test your game to see if everything works correctly while having fun.

Users can add achievement badges that unlock when players reach certain endings. The history feature lets players go back and try different choices, just like a browser's back button. It is very easy to use.

Main File
Everything is contained in one big, beautiful file called App.jsx, which has exactly 1,490 lines of code (on VScode). The file is kept together to make reviewing and fixing issues for CS50 easier, even though React apps are usually split into smaller components. There is a special beauty in having it all connected in one monolith!

Key Features
Scenario Renaming: When you rename a story section, the app automatically updates every link pointing to it so nothing breaks. Short, to the point, efficiency at its finest.

File Handling: You can save your project as JSON to edit later, or download it as HTML to share with others. The HTML version is a complete game that works anywhere without installation. You can even import HTML files back into the editor to recover lost projects.

History System: The app remembers every choice players make, not just their current position. This enables the back and forward buttons and shows their complete journey.

How It Works
The app stores game data in 13 different state variables. Scenarios are stored as objects instead of arrays because it is faster to look up items by name. When you export to HTML, the app creates a complete webpage with all the game code, styling, and data embedded, so no external files are required.

Everything runs SAFELY in your browser with no server required, keeping your work private and free to use.

// THE EXPERIENCE!

## What I Learned and How This Project Connects to CS50

This project taught me practical state management at scale, the importance of immutability in React, browser File APIs for import/export, and user-centered design. 

Building tools for non-programmers requires thinking from their PERSPECTIVE. 

Most importantly, I learned that solving real problems often means adding features you didn't originally plan (like HTML import) based on actual use cases!

 The project took approximately more than 4 weeks and draws on CS50's lessons: state management mirrors database concepts, the scenario graph applies algorithms thinking, and immutability principles connect to C's memory concepts.

### Balancing Creativity and Code

Building Mini Quest Maker taught me that programming ISN'T JUST about algorithms, it's about EMPOWERING CREATIVITY. 

Watching someone who's never coded before light up when they create their first branching story reminded me why I started programming in the first place. 

The technical challenges were real: managing 13 interconnected states, implementing history branching, generating standalone HTML files. But the creative challenges were EQUALLY IMPORTANT. 

How do I make renaming scenarios intuitive? What colors create a "retro game" feeling? How do I explain achievements to a writer, NOT a programmer?

CS50's lessons proved foundational in unexpected ways. C's memory management taught me React's immutability. 

Both require understanding that data lives somewhere and careless modification BREAKS THINGS. 

SQL's foreign keys mirror my choice system. Rename a scenario, update ALL references automatically. The graph algorithms from Week 5 became my scenario connections, each choice an edge between story nodes.

The iterative process surprised me most. 

I didn't plan the HTML import feature at first. I put myself in the users' shoes and thought "What if I lose my save file?" So I built it. 

Real software EVOLVES from real needs, not perfect upfront designs. 

This blend of technical problem-solving and creative empowerment made Mini Quest Maker MORE THAN CODE. 

It became a tool that unlocks stories for people who thought game-making wasn't for them. 

Every design choice, from the bouncing emoji icon to the pulsing "ENDING REACHED" warning, serves STORYTELLING FIRST and technical elegance second. The purple-blue gradient background wasn't random. 

It creates that nostalgic, CLASSIC 90s game aesthetic while being easy on the eyes for long writing sessions.
