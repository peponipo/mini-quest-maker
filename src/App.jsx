import React, { useState } from 'react';
import { Download, Plus, Trash2, Play, Upload, Save, AlertCircle, Trophy, MapPin } from 'lucide-react';

export default function MiniQuestMaker() {
  const [mode, setMode] = useState('edit'); // 'edit' or 'play'
  const [gameTitle, setGameTitle] = useState('The Mini Mundane Quest');
  const [gameIcon, setGameIcon] = useState('🍕');
  const [scenarios, setScenarios] = useState({
    start: {
      id: 'start',
      text: "You're hungry. It's 9pm. Your quest: Decide what to eat.\n\nYour fridge is mostly empty. Your willpower is questionable. What do you do?",
      location: "🏠 Home - Kitchen",
      choices: [
        { text: "Order pizza (the safe choice)", next: 'pizza_ending' },
        { text: "Eat cereal", next: 'cereal_ending' },
        { text: "Just go to sleep hungry", next: 'sleep_ending' }
      ],
      ending: false,
      achievement: '',
      endingText: ''
    },
    pizza_ending: {
      id: 'pizza_ending',
      text: "You order pizza. The estimated time: 45 minutes.\n\nThe pizza arrives in 20 minutes. It's hot, delicious, and exactly what you needed.",
      location: "🍕 Home - Pizza Victory",
      choices: [
        { text: "Start Over", next: 'start' }
      ],
      ending: true,
      achievement: 'PIZZA CHAMPION',
      endingText: '✨ PERFECT ENDING: You eat pizza and watch TV. Life is good. You made the right choice. Tomorrow you\'ll eat vegetables. Probably.'
    },
    cereal_ending: {
      id: 'cereal_ending',
      text: "You pour cereal. The box is almost empty. You get mostly crumbs and that weird cereal dust.\n\nThe milk expires tomorrow. You're living on the edge.",
      location: "🥣 Home - Kitchen Table",
      choices: [
        { text: "Start Over", next: 'start' }
      ],
      ending: true,
      achievement: 'EFFICIENCY EXPERT',
      endingText: '✨ ENDING: You finished dinner in 3 minutes. You saved money. You also feel empty inside, but that might not be related to the cereal. Tomorrow will be better. Probably.'
    },
    sleep_ending: {
      id: 'sleep_ending',
      text: "You decide food is overrated and go to bed.\n\nYour stomach disagrees. It makes whale sounds. You regret everything.",
      location: "🛏️ Home - Bedroom",
      choices: [
        { text: "Start Over", next: 'start' }
      ],
      ending: true,
      achievement: 'HUNGER STRIKE',
      endingText: '💀 ENDING: You wake up at 3am absolutely starving. You eat an entire bag of chips in the dark. This was not your best decision.'
    }
  });
  const [selectedScenario, setSelectedScenario] = useState('start');

  // Game state for play mode
  const [gameState, setGameState] = useState('start');
  const [stateHistory, setStateHistory] = useState(['start']);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [visitedStates, setVisitedStates] = useState(new Set(['start']));
  const [achievements, setAchievements] = useState([]);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState('');

  const addScenario = () => {
    const newId = `scenario_${Date.now()}`;
    setScenarios({
      ...scenarios,
      [newId]: {
        id: newId,
        text: 'New scenario text here...',
        location: '📍 New Location',
        choices: [
          { text: 'Choice 1', next: 'start' }
        ],
        ending: false,
        achievement: '',
        endingText: ''
      }
    });
    setSelectedScenario(newId);
  };

  const deleteScenario = (id) => {
    if (id === 'start') {
      alert("Cannot delete the start scenario!");
      return;
    }
    const newScenarios = { ...scenarios };
    delete newScenarios[id];
    setScenarios(newScenarios);
    setSelectedScenario('start');
  };

  const updateScenario = (field, value) => {
    setScenarios({
      ...scenarios,
      [selectedScenario]: {
        ...scenarios[selectedScenario],
        [field]: value
      }
    });
  };

  const renameScenario = (oldId, newId) => {
    // Validate new ID
    if (!newId || newId.trim() === '') {
      alert('Scenario ID cannot be empty!');
      return false;
    }
    
    if (newId === oldId) {
      return true; // No change needed
    }
    
    if (scenarios[newId]) {
      alert(`Scenario ID "${newId}" already exists! Choose a different name.`);
      return false;
    }
    
    // Create new scenarios object with renamed key
    const newScenarios = {};
    Object.keys(scenarios).forEach(key => {
      if (key === oldId) {
        newScenarios[newId] = { ...scenarios[key], id: newId };
      } else {
        newScenarios[key] = { ...scenarios[key] };
      }
    });
    
    // Update all choices that reference the old ID
    Object.keys(newScenarios).forEach(key => {
      newScenarios[key].choices = newScenarios[key].choices.map(choice => ({
        ...choice,
        next: choice.next === oldId ? newId : choice.next
      }));
    });
    
    setScenarios(newScenarios);
    setSelectedScenario(newId);
    return true;
  };

  const addChoice = () => {
    const currentChoices = scenarios[selectedScenario].choices || [];
    updateScenario('choices', [
      ...currentChoices,
      { text: 'New choice', next: 'start' }
    ]);
  };

  const updateChoice = (index, field, value) => {
    const newChoices = [...scenarios[selectedScenario].choices];
    newChoices[index] = { ...newChoices[index], [field]: value };
    updateScenario('choices', newChoices);
  };

  const deleteChoice = (index) => {
    const newChoices = scenarios[selectedScenario].choices.filter((_, i) => i !== index);
    updateScenario('choices', newChoices);
  };

  const getAllAchievements = () => {
    return Object.values(scenarios)
      .filter(s => s.achievement)
      .map(s => s.achievement);
  };

  const exportGame = () => {
    const gameData = {
      title: gameTitle,
      icon: gameIcon,
      scenarios: scenarios
    };
    const dataStr = JSON.stringify(gameData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameTitle.toLowerCase().replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importGame = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const gameData = JSON.parse(e.target.result);
          setGameTitle(gameData.title);
          setGameIcon(gameData.icon);
          setScenarios(gameData.scenarios);
          setSelectedScenario('start');
          alert('Game loaded successfully!');
        } catch (error) {
          alert('Error loading game file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be imported again
    event.target.value = '';
  };

  const importHTML = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const htmlContent = e.target.result;
          
          // Extract scenarios from the HTML
          const scenariosMatch = htmlContent.match(/const scenarios = ({[\s\S]*?});[\s\S]*?const allAchievements/);
          if (!scenariosMatch) {
            alert('Could not find game data in HTML file. Make sure this is a valid game file.');
            return;
          }
          
          // Parse the scenarios object
          const scenariosStr = scenariosMatch[1];
          const parsedScenarios = eval('(' + scenariosStr + ')');
          
          // Extract title
          const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
          const title = titleMatch ? titleMatch[1] : 'Imported Game';
          
          // Extract icon (look for the snack-icon span)
          const iconMatch = htmlContent.match(/<span class="snack-icon">(.*?)<\/span>/);
          const icon = iconMatch ? iconMatch[1] : '🎮';
          
          setGameTitle(title);
          setGameIcon(icon);
          setScenarios(parsedScenarios);
          setSelectedScenario('start');
          alert('HTML game imported successfully!');
        } catch (error) {
          alert('Error parsing HTML file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be imported again
    event.target.value = '';
  };

  const generateHTML = () => {
    const achievementsList = getAllAchievements();
    const scenariosJSON = JSON.stringify(scenarios, null, 12);
    const achievementsJSON = JSON.stringify(achievementsList, null, 12);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${gameTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, #4c1d95 0%, #1e3a8a 50%, #312e81 100%);
            min-height: 100vh;
            padding: 1rem 2rem;
            color: #e0e7ff;
        }

        .container {
            max-width: 56rem;
            margin: 0 auto;
        }

        .achievement-popup {
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            z-index: 50;
            border: 4px solid;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease-out;
            background-color: #eab308;
            border-color: #facc15;
            color: #000;
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }

        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        .achievement-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
        }

        .achievement-content div:first-child {
            font-weight: bold;
            font-size: 0.875rem;
        }

        .achievement-content div:last-child {
            font-family: 'Courier New', monospace;
            font-size: 0.75rem;
        }

        .main-box {
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 0.5rem;
            padding: 2rem;
            margin-bottom: 1rem;
            border: 4px solid #22c55e;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }

        .header {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        @media (min-width: 640px) {
            .header {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
        }

        .title {
            font-size: 1.875rem;
            font-weight: bold;
            color: #4ade80;
            font-family: 'Courier New', monospace;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        @media (min-width: 640px) {
            .title {
                font-size: 2.25rem;
            }
        }

        .snack-icon {
            display: inline-block;
            animation: bounce 0.6s ease-in-out infinite;
        }

        .button-group {
            display: flex;
            gap: 0.5rem;
        }

        .nav-button {
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }

        .nav-button:disabled {
            background-color: #374151;
            color: #9ca3af;
            cursor: not-allowed;
        }

        .nav-button:not(:disabled) {
            background-color: #16a34a;
            color: #000;
        }

        .nav-button:not(:disabled):hover {
            background-color: #22c55e;
        }

        .location-box {
            margin-bottom: 1rem;
            padding: 0.75rem;
            background-color: #1f2937;
            border-radius: 0.25rem;
            border: 1px solid #22c55e;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .location-icon {
            color: #4ade80;
            flex-shrink: 0;
        }

        .location-text {
            color: #4ade80;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
        }

        .location-text strong {
            font-weight: bold;
        }

        .achievements-box {
            margin-bottom: 1rem;
            padding: 0.75rem;
            background-color: rgba(180, 83, 9, 0.3);
            border-radius: 0.25rem;
            border: 1px solid #eab308;
        }

        .achievements-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }

        .achievements-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .achievements-title-text {
            color: #facc15;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            font-weight: bold;
        }

        .achievements-count {
            color: #fef3c7;
            font-family: 'Courier New', monospace;
            font-size: 0.75rem;
        }

        .achievements-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .achievement-badge {
            font-size: 0.75rem;
            font-family: 'Courier New', monospace;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            background-color: #b45309;
            color: #fef3c7;
        }

        .ending-warning {
            margin-bottom: 1rem;
            padding: 0.75rem;
            background-color: rgba(127, 29, 29, 0.5);
            border-radius: 0.25rem;
            border: 2px solid #ef4444;
            animation: pulse 0.5s ease-in-out infinite;
        }

        .ending-warning-text {
            color: #fca5a5;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            font-weight: bold;
            text-align: center;
        }

        .scenario-box {
            background-color: #111827;
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 2px solid #22c55e;
            margin-bottom: 1.5rem;
            min-height: 200px;
        }

        .scenario-text {
            color: #86efac;
            font-family: 'Courier New', monospace;
            font-size: 1rem;
            white-space: pre-wrap;
            line-height: 1.5;
        }

        @media (max-width: 640px) {
            .scenario-text {
                font-size: 0.875rem;
            }
        }

        .ending-text {
            color: #fef08a;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            white-space: pre-wrap;
            line-height: 1.5;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #15803d;
        }

        @media (max-width: 640px) {
            .ending-text {
                font-size: 0.75rem;
            }
        }

        .choices-container {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .choice-button {
            width: 100%;
            background-color: #16a34a;
            color: #000;
            font-weight: bold;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            border: 2px solid #4ade80;
            cursor: pointer;
            transition: all 0.2s;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            text-align: left;
        }

        @media (min-width: 640px) {
            .choice-button {
                padding: 1rem 1.5rem;
                font-size: 1rem;
            }
        }

        .choice-button:hover {
            background-color: #22c55e;
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        .choice-button:active {
            transform: scale(0.98);
        }

        .history-box {
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 2px solid #374151;
        }

        .history-title {
            color: #4ade80;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }

        @media (min-width: 640px) {
            .history-title {
                font-size: 1rem;
            }
        }

        .history-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .history-button {
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }

        .history-button.current {
            background-color: #16a34a;
            color: #000;
            font-weight: bold;
            transform: scale(1.1);
        }

        .history-button.visited {
            background-color: #374151;
            color: #4ade80;
        }

        .history-button.visited:hover {
            background-color: #4b5563;
        }

        .history-button.unvisited {
            background-color: #1f2937;
            color: #6b7280;
        }

        .history-hint {
            color: #86efac;
            font-family: 'Courier New', monospace;
            font-size: 0.75rem;
            margin-top: 0.75rem;
            opacity: 0.7;
        }

        @media (max-width: 640px) {
            .main-box {
                padding: 1rem;
            }

            .title {
                font-size: 1.5rem;
            }

            .header {
                flex-direction: column;
                gap: 0.75rem;
            }

            .button-group {
                width: 100%;
            }

            .nav-button {
                flex: 1;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="achievementPopup" class="achievement-popup" style="display: none;">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <div id="achievementTitle">🎉 ACHIEVEMENT UNLOCKED!</div>
                <div id="achievementName"></div>
            </div>
        </div>

        <div class="main-box">
            <div class="header">
                <h1 class="title">
                    <span class="snack-icon">${gameIcon}</span>
                    ${gameTitle.toUpperCase()}
                </h1>
                <div class="button-group">
                    <button class="nav-button" id="backBtn" onclick="goBack()" title="Go back">← Back</button>
                    <button class="nav-button" id="forwardBtn" onclick="goForward()" title="Go forward">Forward →</button>
                </div>
            </div>

            <div class="location-box">
                <span class="location-icon">📍</span>
                <p class="location-text"><strong>LOCATION:</strong> <span id="location"></span></p>
            </div>

            <div id="achievementsBox" class="achievements-box" style="display: none;">
                <div class="achievements-header">
                    <div class="achievements-title">
                        <span>✨</span>
                        <p class="achievements-title-text">ACHIEVEMENTS (<span id="achievementCount">0</span>/<span id="totalAchievements">${achievementsList.length}</span>)</p>
                    </div>
                    <p class="achievements-count"><span id="achievementsLeft">${achievementsList.length}</span> left to unlock</p>
                </div>
                <div class="achievements-list" id="achievementsList"></div>
            </div>

            <div id="endingWarning" class="ending-warning" style="display: none;">
                <p class="ending-warning-text">⚠️ ENDING REACHED ⚠️</p>
            </div>

            <div class="scenario-box">
                <p class="scenario-text" id="scenarioText"></p>
                <p class="ending-text" id="endingText" style="display: none;"></p>
            </div>

            <div class="choices-container" id="choicesContainer"></div>
        </div>

        <div id="historyBox" class="history-box" style="display: none;">
            <h3 class="history-title">
                <span>🔄</span>
                JOURNEY HISTORY (<span id="historyIndex">1</span>/<span id="historyLength">1</span>)
            </h3>
            <div class="history-buttons" id="historyButtons"></div>
            <p class="history-hint">Click any number to jump to that point in your journey</p>
        </div>
    </div>

    <script>
        const scenarios = ${scenariosJSON};
        const allAchievements = ${achievementsJSON};

        let gameState = 'start';
        let stateHistory = ['start'];
        let currentHistoryIndex = 0;
        let visitedStates = new Set(['start']);
        let achievements = [];

        function init() {
            updateDisplay();
        }

        function updateDisplay() {
            const currentScenario = scenarios[gameState];
            document.getElementById('location').textContent = currentScenario.location;
            document.getElementById('scenarioText').textContent = currentScenario.text;

            const endingTextEl = document.getElementById('endingText');
            if (currentScenario.endingText) {
                endingTextEl.textContent = currentScenario.endingText;
                endingTextEl.style.display = 'block';
            } else {
                endingTextEl.style.display = 'none';
            }

            const endingWarning = document.getElementById('endingWarning');
            if (currentScenario.ending) {
                endingWarning.style.display = 'block';
            } else {
                endingWarning.style.display = 'none';
            }

            const choicesContainer = document.getElementById('choicesContainer');
            choicesContainer.innerHTML = '';
            currentScenario.choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = '→ ' + choice.text;
                button.onclick = () => handleChoice(choice.next);
                choicesContainer.appendChild(button);
            });

            updateAchievementsDisplay();
            updateHistoryDisplay();

            document.getElementById('backBtn').disabled = currentHistoryIndex === 0;
            document.getElementById('forwardBtn').disabled = currentHistoryIndex === stateHistory.length - 1;
        }

        function handleChoice(nextState) {
            if (currentHistoryIndex < stateHistory.length - 1) {
                stateHistory = stateHistory.slice(0, currentHistoryIndex + 1);
            }

            stateHistory.push(nextState);
            currentHistoryIndex++;
            visitedStates.add(nextState);

            const nextScenario = scenarios[nextState];
            if (nextScenario && nextScenario.achievement) {
                unlockAchievement(nextScenario.achievement);
            }

            gameState = nextState;

            if (nextState === 'start') {
                stateHistory = ['start'];
                currentHistoryIndex = 0;
                visitedStates = new Set(['start']);
                achievements = [];
            }

            updateDisplay();
        }

        function unlockAchievement(achievement) {
            if (!achievements.includes(achievement)) {
                achievements.push(achievement);
                showAchievementPopup(achievement);
            }
        }

        function showAchievementPopup(achievement) {
            const popup = document.getElementById('achievementPopup');
            document.getElementById('achievementTitle').textContent = '🎉 ACHIEVEMENT UNLOCKED!';
            document.getElementById('achievementName').textContent = achievement;

            popup.style.display = 'flex';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 3000);
        }

        function updateAchievementsDisplay() {
            const achievementsBox = document.getElementById('achievementsBox');

            if (achievements.length > 0) {
                achievementsBox.style.display = 'block';
                document.getElementById('achievementCount').textContent = achievements.length;
                document.getElementById('totalAchievements').textContent = allAchievements.length;
                document.getElementById('achievementsLeft').textContent = allAchievements.length - achievements.length;

                const achievementsList = document.getElementById('achievementsList');
                achievementsList.innerHTML = '';
                achievements.forEach(ach => {
                    const badge = document.createElement('span');
                    badge.className = 'achievement-badge';
                    badge.textContent = '🏆 ' + ach;
                    achievementsList.appendChild(badge);
                });
            } else {
                achievementsBox.style.display = 'none';
            }
        }

        function updateHistoryDisplay() {
            const historyBox = document.getElementById('historyBox');
            if (stateHistory.length > 1) {
                historyBox.style.display = 'block';
                document.getElementById('historyIndex').textContent = currentHistoryIndex + 1;
                document.getElementById('historyLength').textContent = stateHistory.length;

                const historyButtons = document.getElementById('historyButtons');
                historyButtons.innerHTML = '';
                stateHistory.forEach((state, idx) => {
                    const button = document.createElement('button');
                    button.className = 'history-button';
                    if (idx === currentHistoryIndex) {
                        button.classList.add('current');
                    } else if (visitedStates.has(state)) {
                        button.classList.add('visited');
                    } else {
                        button.classList.add('unvisited');
                    }
                    button.textContent = idx + 1;
                    button.title = scenarios[state] ? scenarios[state].location : state;
                    button.onclick = () => jumpToState(idx);
                    historyButtons.appendChild(button);
                });
            } else {
                historyBox.style.display = 'none';
            }
        }

        function goBack() {
            if (currentHistoryIndex > 0) {
                currentHistoryIndex--;
                gameState = stateHistory[currentHistoryIndex];
                updateDisplay();
            }
        }

        function goForward() {
            if (currentHistoryIndex < stateHistory.length - 1) {
                currentHistoryIndex++;
                gameState = stateHistory[currentHistoryIndex];
                updateDisplay();
            }
        }

        function jumpToState(index) {
            currentHistoryIndex = index;
            gameState = stateHistory[index];
            updateDisplay();
        }

        init();
    </script>
</body>
</html>`;
  };

  const downloadGame = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${gameTitle.toLowerCase().replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Play mode functions
  const startPlayMode = () => {
    setGameState('start');
    setStateHistory(['start']);
    setCurrentHistoryIndex(0);
    setVisitedStates(new Set(['start']));
    setAchievements([]);
    setMode('play');
  };

  const handlePlayChoice = (nextState) => {
    // Safety check - make sure the next scenario exists
    if (!scenarios[nextState]) {
      alert(`Error: Scenario "${nextState}" does not exist!`);
      return;
    }
    
    let newHistory = [...stateHistory];
    if (currentHistoryIndex < newHistory.length - 1) {
      newHistory = newHistory.slice(0, currentHistoryIndex + 1);
    }
    newHistory.push(nextState);
    
    const newVisited = new Set(visitedStates);
    newVisited.add(nextState);

    const nextScenario = scenarios[nextState];
    if (nextScenario && nextScenario.achievement && !achievements.includes(nextScenario.achievement)) {
      const newAchievements = [...achievements, nextScenario.achievement];
      setAchievements(newAchievements);
      setCurrentAchievement(nextScenario.achievement);
      setShowAchievementPopup(true);
      setTimeout(() => setShowAchievementPopup(false), 3000);
    }

    if (nextState === 'start') {
      setStateHistory(['start']);
      setCurrentHistoryIndex(0);
      setVisitedStates(new Set(['start']));
      setAchievements([]);
    } else {
      setStateHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
      setVisitedStates(newVisited);
    }

    setGameState(nextState);
  };

  const goPlayBack = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setGameState(stateHistory[currentHistoryIndex - 1]);
    }
  };

  const goPlayForward = () => {
    if (currentHistoryIndex < stateHistory.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setGameState(stateHistory[currentHistoryIndex + 1]);
    }
  };

  const jumpToPlayState = (index) => {
    setCurrentHistoryIndex(index);
    setGameState(stateHistory[index]);
  };

  // Render play mode
  if (mode === 'play') {
    const currentScenario = scenarios[gameState];
    
    // Safety check - if scenario doesn't exist, go back to start
    if (!currentScenario) {
      setGameState('start');
      return null;
    }
    
    const allAchievements = getAllAchievements();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Achievement Popup */}
          {showAchievementPopup && (
            <div className="fixed top-4 right-4 bg-yellow-500 border-4 border-yellow-400 rounded-lg p-4 flex items-center gap-3 shadow-2xl animate-[slideIn_0.3s_ease-out] z-50">
              <div className="text-2xl">🏆</div>
              <div className="text-black">
                <div className="font-bold text-sm">🎉 ACHIEVEMENT UNLOCKED!</div>
                <div className="font-mono text-xs">{currentAchievement}</div>
              </div>
            </div>
          )}

          {/* Main Game Box */}
          <div className="bg-black/50 rounded-lg border-4 border-green-500 p-4 sm:p-8 mb-4 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-green-400 font-mono flex items-center gap-3">
                <span className="text-4xl animate-bounce">{gameIcon}</span>
                {gameTitle.toUpperCase()}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={goPlayBack}
                  disabled={currentHistoryIndex === 0}
                  className="px-3 py-2 bg-green-600 text-black font-bold rounded font-mono text-sm hover:bg-green-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={goPlayForward}
                  disabled={currentHistoryIndex === stateHistory.length - 1}
                  className="px-3 py-2 bg-green-600 text-black font-bold rounded font-mono text-sm hover:bg-green-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  Forward →
                </button>
                <button
                  onClick={() => setMode('edit')}
                  className="px-3 py-2 bg-blue-600 text-white rounded font-mono text-sm hover:bg-blue-500 transition-all"
                >
                  Exit Game
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="mb-4 p-3 bg-gray-800 rounded border border-green-500 flex items-center gap-2">
              <span className="text-green-400">📍</span>
              <p className="text-green-400 font-mono text-sm">
                <strong>LOCATION:</strong> {currentScenario.location}
              </p>
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-900/30 rounded border border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    <p className="text-yellow-400 font-mono text-sm font-bold">
                      ACHIEVEMENTS ({achievements.length}/{allAchievements.length})
                    </p>
                  </div>
                  <p className="text-yellow-200 font-mono text-xs">
                    {allAchievements.length - achievements.length} left to unlock
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((ach, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-yellow-700 text-yellow-100">
                      🏆 {ach}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ending Warning */}
            {currentScenario.ending && (
              <div className="mb-4 p-3 bg-red-900/50 rounded border-2 border-red-500 animate-pulse">
                <p className="text-red-300 font-mono text-sm font-bold text-center">
                  ⚠️ ENDING REACHED ⚠️
                </p>
              </div>
            )}

            {/* Scenario Text */}
            <div className="bg-gray-900 p-6 rounded-lg border-2 border-green-500 mb-6 min-h-[200px]">
              <p className="text-green-300 font-mono text-base whitespace-pre-wrap leading-relaxed">
                {currentScenario.text}
              </p>
              {currentScenario.endingText && (
                <p className="text-yellow-300 font-mono text-sm whitespace-pre-wrap leading-relaxed mt-4 pt-4 border-t border-green-800">
                  {currentScenario.endingText}
                </p>
              )}
            </div>

            {/* Choices */}
            <div className="flex flex-col gap-3">
              {currentScenario.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePlayChoice(choice.next)}
                  className="w-full bg-green-600 text-black font-bold p-4 rounded-lg border-2 border-green-400 font-mono text-sm sm:text-base text-left hover:bg-green-500 hover:scale-105 active:scale-98 transition-all shadow-lg"
                >
                  → {choice.text}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {stateHistory.length > 1 && (
            <div className="bg-black/50 rounded-lg border-2 border-gray-600 p-6">
              <h3 className="text-green-400 font-mono font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
                <span>🔄</span>
                JOURNEY HISTORY ({currentHistoryIndex + 1}/{stateHistory.length})
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {stateHistory.map((state, idx) => {
                  const stateScenario = scenarios[state];
                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToPlayState(idx)}
                      className={`px-3 py-1 rounded font-mono text-sm transition-all ${
                        idx === currentHistoryIndex
                          ? 'bg-green-600 text-black font-bold scale-110'
                          : visitedStates.has(state)
                          ? 'bg-gray-700 text-green-400 hover:bg-gray-600'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                      title={stateScenario ? stateScenario.location : state}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <p className="text-green-300 font-mono text-xs opacity-70">
                Click any number to jump to that point in your journey
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit mode
  const currentScenario = scenarios[selectedScenario];
  const scenarioList = Object.keys(scenarios);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/50 rounded-lg border-4 border-green-500 p-6 mb-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h1 className="text-3xl font-bold text-green-400 font-mono flex items-center gap-3">
              <span className="text-4xl">🎮</span>
              MINI QUEST GAME MAKER
            </h1>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={startPlayMode}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded font-mono text-sm hover:bg-purple-500 transition-all"
              >
                <Play className="w-4 h-4" />
                Play Game
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-black font-bold rounded font-mono text-sm hover:bg-yellow-500 transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={importGame}
                  className="hidden"
                />
              </label>
              <label className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded font-mono text-sm hover:bg-orange-500 transition-all cursor-pointer">
                <Upload className="w-4 h-4" />
                Import HTML
                <input
                  type="file"
                  accept=".html"
                  onChange={importHTML}
                  className="hidden"
                />
              </label>
              <button
                onClick={exportGame}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-mono text-sm hover:bg-blue-500 transition-all"
              >
                <Save className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={downloadGame}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-black font-bold rounded font-mono text-sm hover:bg-green-500 transition-all"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-green-400 font-mono text-sm mb-1">Game Title</label>
              <input
                type="text"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                className="w-full bg-gray-900 border-2 border-green-500 rounded px-3 py-2 text-green-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-green-400 font-mono text-sm mb-1">Game Icon (emoji)</label>
              <input
                type="text"
                value={gameIcon}
                onChange={(e) => setGameIcon(e.target.value)}
                className="w-full bg-gray-900 border-2 border-green-500 rounded px-3 py-2 text-green-400 font-mono text-2xl"
                maxLength={2}
              />
            </div>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3 mb-4">
            <div className="flex items-start gap-2">
              <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-yellow-200 font-mono text-xs">
                <strong>Achievements Found:</strong> {getAllAchievements().length} total
                {getAllAchievements().length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {getAllAchievements().map((ach, i) => (
                      <span key={i} className="bg-yellow-700 px-2 py-0.5 rounded text-yellow-100">
                        🏆 {ach}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Scenario List */}
          <div className="bg-black/50 rounded-lg border-2 border-gray-600 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-green-400 font-mono font-bold text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                SCENARIOS ({scenarioList.length})
              </h2>
              <button
                onClick={addScenario}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-black text-xs font-mono rounded hover:bg-green-500"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {scenarioList.map((id) => (
                <div
                  key={id}
                  className={`p-2 rounded border-2 cursor-pointer transition-all ${
                    selectedScenario === id
                      ? 'bg-green-600 border-green-400 text-black font-bold'
                      : 'bg-gray-800 border-gray-600 text-green-400'
                  }`}
                  onClick={() => setSelectedScenario(id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold">{id}</span>
                    {id !== 'start' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteScenario(id);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-xs font-mono opacity-70 truncate">
                    {scenarios[id].location}
                  </div>
                  {scenarios[id].ending && (
                    <div className="text-xs font-mono text-yellow-400 mt-1">
                      🏁 ENDING
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scenario Editor */}
          <div className="lg:col-span-2 bg-black/50 rounded-lg border-2 border-green-500 p-4">
            <div className="mb-4">
              <label className="block text-green-400 font-mono text-xs mb-1">Scenario ID</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={selectedScenario}
                  key={selectedScenario}
                  onBlur={(e) => {
                    const newId = e.target.value.trim().replace(/[^a-zA-Z0-9_]/g, '');
                    if (newId && newId !== selectedScenario) {
                      renameScenario(selectedScenario, newId);
                    } else if (!newId) {
                      e.target.value = selectedScenario;
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.target.blur();
                    }
                  }}
                  disabled={selectedScenario === 'start'}
                  className="flex-1 bg-gray-900 border-2 border-green-500 rounded px-3 py-2 text-green-400 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="scenario_id"
                />
                {selectedScenario === 'start' && (
                  <span className="text-yellow-400 text-xs font-mono">
                    (start cannot be renamed)
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs font-mono mt-1">
                Type a new ID and press Enter or click away to save. Only letters, numbers, and underscores.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-green-400 font-mono text-xs mb-1">Location</label>
                <input
                  type="text"
                  value={currentScenario.location}
                  onChange={(e) => updateScenario('location', e.target.value)}
                  className="w-full bg-gray-900 border border-green-500 rounded px-3 py-2 text-green-400 font-mono text-sm"
                  placeholder="📍 Location Name"
                />
              </div>

              <div>
                <label className="block text-green-400 font-mono text-xs mb-1">Scenario Text</label>
                <textarea
                  value={currentScenario.text}
                  onChange={(e) => updateScenario('text', e.target.value)}
                  className="w-full bg-gray-900 border border-green-500 rounded px-3 py-2 text-green-400 font-mono text-sm h-32"
                  placeholder="Enter the scenario description..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-green-400 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentScenario.ending}
                    onChange={(e) => updateScenario('ending', e.target.checked)}
                    className="w-4 h-4"
                  />
                  Is this an ending?
                </label>
              </div>

              {currentScenario.ending && (
                <>
                  <div>
                    <label className="block text-yellow-400 font-mono text-xs mb-1">
                      Achievement Name (optional)
                    </label>
                    <input
                      type="text"
                      value={currentScenario.achievement}
                      onChange={(e) => updateScenario('achievement', e.target.value)}
                      className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 text-yellow-400 font-mono text-sm"
                      placeholder="ACHIEVEMENT NAME"
                    />
                  </div>

                  <div>
                    <label className="block text-yellow-400 font-mono text-xs mb-1">
                      Ending Text
                    </label>
                    <textarea
                      value={currentScenario.endingText}
                      onChange={(e) => updateScenario('endingText', e.target.value)}
                      className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 text-yellow-400 font-mono text-sm h-24"
                      placeholder="✨ ENDING: What happens in this ending..."
                    />
                  </div>
                </>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-green-400 font-mono text-xs font-bold">
                    Choices ({currentScenario.choices.length})
                  </label>
                  <button
                    onClick={addChoice}
                    className="flex items-center gap-1 px-2 py-1 bg-green-600 text-black text-xs font-mono rounded hover:bg-green-500"
                  >
                    <Plus className="w-3 h-3" />
                    Add Choice
                  </button>
                </div>

                <div className="space-y-3">
                  {currentScenario.choices.map((choice, idx) => (
                    <div key={idx} className="bg-gray-900 border border-green-500 rounded p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={choice.text}
                            onChange={(e) => updateChoice(idx, 'text', e.target.value)}
                            className="w-full bg-gray-800 border border-green-500 rounded px-2 py-1 text-green-400 font-mono text-sm"
                            placeholder="Choice text"
                          />
                          <select
                            value={choice.next}
                            onChange={(e) => updateChoice(idx, 'next', e.target.value)}
                            className="w-full bg-gray-800 border border-green-500 rounded px-2 py-1 text-green-400 font-mono text-sm"
                          >
                            {scenarioList.map((id) => (
                              <option key={id} value={id}>
                                → {id} {scenarios[id].ending ? '(ENDING)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => deleteChoice(idx)}
                          className="text-red-400 hover:text-red-300 mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gray-900/50 rounded-lg border border-gray-600 p-4">
          <div className="flex items-start gap-2 text-gray-400 font-mono text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-green-400">Tips:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Click "Play Game" to test your game with full functionality</li>
                <li>Import JSON to load saved game data, or Import HTML to extract data from exported games</li>
                <li>Export as JSON to save your work and import it later</li>
                <li>Download HTML for a standalone game file</li>
                <li>Create scenarios with unique IDs (they link together via choices)</li>
                <li>Mark endings with achievements for unlockable badges</li>
                <li>Use emojis in locations for visual flair (📍🏠🍕🎮)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
