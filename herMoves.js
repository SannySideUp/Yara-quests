// --- CONFIGURE HER NAME HERE ---
const HER_NAME = "HerName"; // e.g. "Yara"

// --- GAME STATE ---

let stats = {
    comfort: 0,
    chaos: 0,
    romance: 0
};

let soundEnabled = true;

// --- DOM ELEMENTS ---

const textElement = document.getElementById("text");
const buttonsElement = document.getElementById("buttons");
const sceneLabelElement = document.getElementById("scene-label");
const metaLineElement = document.getElementById("meta-line");
const speakerLabelElement = document.getElementById("speaker-label");

const comfortValueElement = document.getElementById("comfort-value");
const chaosValueElement = document.getElementById("chaos-value");
const romanceValueElement = document.getElementById("romance-value");

const comfortBarElement = document.getElementById("comfort-bar");
const chaosBarElement = document.getElementById("chaos-bar");
const romanceBarElement = document.getElementById("romance-bar");

const startOverlay = document.getElementById("start-overlay");
const startButton = document.getElementById("start-button");
const muteToggle = document.getElementById("mute-toggle");
const resetButton = document.getElementById("reset-btn");

const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");

// --- STORY DATA ---

/**
 * Each node:
 *  id: number
 *  label: string (scene label)
 *  speaker: "Narrator" | "You" | "Him"
 *  text: string or () => string
 *  choices: [
 *    {
 *      label: "Choice A",
 *      text: string,
 *      nextId: number | "ENDING",
 *      effects?: {comfort?: number, chaos?: number, romance?: number}
 *    }
 *  ]
 */
const storyNodes = [
    {
        id: 1,
        label: "Scene 1 – The Text",
        speaker: "Narrator",
        text: () =>
            `It is a calm evening. Your phone lights up.\n\n` +
            `"Hey ${HER_NAME}, I have a tiny secret quest for you.\n\n` +
            `Open this little site and choose wisely.\nNo pressure... mostly."`,
        choices: [
            {
                label: "Choice A",
                text: "Reply instantly: \"I'm in. What are we doing?\"",
                nextId: 2,
                effects: { romance: 1 }
            },
            {
                label: "Choice B",
                text: "Tease: \"Hmm, do I get snacks on this quest?\"",
                nextId: 2,
                effects: { chaos: 1 }
            }
        ]
    },
    {
        id: 2,
        label: "Scene 2 – The Plan",
        speaker: "Him",
        text: () =>
            `"The quest is simple: spend time with me.\n"` +
            + `"You get to choose how our next date begins."`,
        choices: [
            {
                label: "Choice A",
                text: "Start soft and cozy at home.",
                nextId: 3,
                effects: { comfort: 1 }
            },
            {
                label: "Choice B",
                text: "Go outside for an adventure.",
                nextId: 4,
                effects: { chaos: 1 }
            }
        ]
    },
    {
        id: 3,
        label: "Scene 3 – Cozy Start",
        speaker: "Narrator",
        text: () =>
            `You choose the cozy start.\n\n` +
            `He shows up with snacks, something suspiciously close to your favourite drink,\n` +
            `and a playlist already prepared.\n\n` +
            `"Okay ${HER_NAME}," he smiles, "you pick how we begin."`,
        choices: [
            {
                label: "Choice A",
                text: "Movie, blanket, and constant commentary.",
                nextId: 5,
                effects: { comfort: 1, romance: 1 }
            },
            {
                label: "Choice B",
                text: "Cook together and probably mess up the recipe.",
                nextId: 6,
                effects: { chaos: 1, comfort: 1 }
            }
        ]
    },
    {
        id: 4,
        label: "Scene 3 – Adventure Start",
        speaker: "Narrator",
        text: () =>
            `You pick adventure.\n\n` +
            `"Dress comfortably and trust me," he texts.\n\n` +
            `When you step outside, the air feels like it is planning something.\n` +
            `Lights, music, and the sound of the city become the background to your own story.`,
        choices: [
            {
                label: "Choice A",
                text: "Walk side by side and just talk.",
                nextId: 5,
                effects: { romance: 1 }
            },
            {
                label: "Choice B",
                text: "Insist on hunting for the best snack first.",
                nextId: 6,
                effects: { chaos: 2 }
            }
        ]
    },
    {
        id: 5,
        label: "Scene 4 – The Talk",
        speaker: "Him",
        text: () =>
            `The conversation drifts from random jokes to real feelings.\n\n` +
            `"So ${HER_NAME}," he says, trying to sound casual,\n` +
            `"honest question... do you want this to be a nice memory,\n` +
            `or one of many?"`,
        choices: [
            {
                label: "Choice A",
                text: "Admit softly: \"I want many.\"",
                nextId: "ENDING",
                effects: { romance: 2, comfort: 1 }
            },
            {
                label: "Choice B",
                text: "Deflect with a joke, but smile so he gets the message.",
                nextId: "ENDING",
                effects: { chaos: 1, romance: 1 }
            }
        ]
    },
    {
        id: 6,
        label: "Scene 4 – The Chaos",
        speaker: "Narrator",
        text: () =>
            `Food becomes a full comedy.\n\n` +
            `Something sizzles too much, something spills, and at one point\n` +
            `you both nearly burn something you definitely should not burn.\n\n` +
            `You are laughing too hard to care.\n\n` +
            `"If our dates are always this messy," he grins,\n` +
            `"I think I'm completely okay with that."`,
        choices: [
            {
                label: "Choice A",
                text: "Throw a tiny bit of flour at him.",
                nextId: "ENDING",
                effects: { chaos: 2 }
            },
            {
                label: "Choice B",
                text: "Take a photo of the disaster as 'evidence' for the future.",
                nextId: "ENDING",
                effects: { comfort: 1, romance: 1 }
            }
        ]
    },

    // --- ENDINGS: computed based on stats ---

    {
        id: 100,
        label: "Golden Ending – Romance",
        speaker: "Narrator",
        text: () =>
            `You did not really hide how you feel.\n\n` +
            `At some point the jokes soften, the room goes quiet in that safe way,\n` +
            `and he looks at you like you are already home.\n\n` +
            `"Good," he says quietly.\n` +
            `"Because this whole silly little quest was just an excuse\n` +
            `to say that with you, normal days already feel like something special."`,
        choices: [
            {
                label: "Again",
                text: "Play again and see if you can change the mood.",
                nextId: -1
            }
        ]
    },
    {
        id: 101,
        label: "Soft Ending – Comfort",
        speaker: "Narrator",
        text: () =>
            `Nothing dramatic happens.\nNo big speech. No movie moment.\n\n` +
            `Just a comfortable, familiar feeling of being exactly where you are supposed to be.\n` +
            `He knows how you like your snacks, you know when he is about to make a terrible joke,\n` +
            `and somehow that quiet understanding feels louder than any confession.\n\n` +
            `Sometimes, the safest place is simply next to the right person.`,
        choices: [
            {
                label: "Again",
                text: "Play again with different choices.",
                nextId: -1
            }
        ]
    },
    {
        id: 102,
        label: "Chaotic Ending – Beautiful Mess",
        speaker: "Narrator",
        text: () =>
            `Is it perfectly planned? Absolutely not.\nIs it a little chaotic? Absolutely yes.\n\n` +
            `There is flour in the wrong places, too much noise, not enough coordination,\n` +
            `and two people who somehow keep choosing each other anyway.\n\n` +
            `"We are kind of a disaster," he laughs.\n` +
            `"But you know what? I like our kind of disaster."`,
        choices: [
            {
                label: "Again",
                text: "Replay and see what a softer path looks like.",
                nextId: -1
            }
        ]
    }
];

// --- CORE FUNCTIONS ---

function initGame() {
    resetStats();
    updateStatsUI();
    showTextNode(1);
    metaLineElement.textContent = "Your choices adjust Comfort, Chaos, and Romance – and the ending.";
}

function resetStats() {
    stats = { comfort: 0, chaos: 0, romance: 0 };
}

function showTextNode(nodeId) {
    if (nodeId <= 0) {
        initGame();
        return;
    }

    const node = storyNodes.find(n => n.id === nodeId);
    if (!node) return;

    sceneLabelElement.textContent = node.label;
    speakerLabelElement.textContent = node.speaker || "Narrator";
    textElement.textContent = typeof node.text === "function" ? node.text() : node.text;

    buttonsElement.innerHTML = "";

    node.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.classList.add("btn");
        if (index === 0) button.classList.add("btn-primary");

        button.innerHTML = `
            <span class="choice-label">${choice.label}</span>
            <span class="choice-text">${choice.text}</span>
        `;

        button.addEventListener("click", () => handleChoice(choice));
        buttonsElement.appendChild(button);
    });
}

function handleChoice(choice) {
    playClickSound();

    // Apply stat effects
    if (choice.effects) {
        stats.comfort += choice.effects.comfort || 0;
        stats.chaos += choice.effects.chaos || 0;
        stats.romance += choice.effects.romance || 0;
        updateStatsUI();
    }

    if (choice.nextId === "ENDING") {
        const endingId = computeEndingId();
        showTextNode(endingId);
    } else {
        showTextNode(choice.nextId);
    }
}

function computeEndingId() {
    const { comfort, chaos, romance } = stats;

    // Determine which stat is highest
    const values = [
        { key: "romance", value: romance, ending: 100 },
        { key: "comfort", value: comfort, ending: 101 },
        { key: "chaos", value: chaos, ending: 102 }
    ];

    // Sort descending by value; in a tie, romance > comfort > chaos (because of ordering above)
    values.sort((a, b) => b.value - a.value);

    return values[0].ending;
}

function updateStatsUI() {
    comfortValueElement.textContent = stats.comfort;
    chaosValueElement.textContent = stats.chaos;
    romanceValueElement.textContent = stats.romance;

    // Scale bars: assume max around 6–8; clamp to 100%
    const scale = 20; // 1 point = 20% (up to 5 = 100)
    comfortBarElement.style.width = Math.min(100, stats.comfort * scale) + "%";
    chaosBarElement.style.width = Math.min(100, stats.chaos * scale) + "%";
    romanceBarElement.style.width = Math.min(100, stats.romance * scale) + "%";
}

// --- AUDIO ---

function playClickSound() {
    if (!soundEnabled || !clickSound) return;
    try {
        clickSound.currentTime = 0;
        clickSound.play();
    } catch (e) {
        // Ignore autoplay errors
    }
}

function startMusic() {
    if (!bgMusic) return;
    if (!soundEnabled) return;
    try {
        bgMusic.volume = 0.4;
        bgMusic.play();
    } catch (e) {
        // Ignore autoplay errors
    }
}

function stopMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
}

// --- UI CONTROLS ---

startButton.addEventListener("click", () => {
    startOverlay.style.display = "none";
    startMusic();
    initGame();
});

muteToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    muteToggle.textContent = soundEnabled ? "Sound: On" : "Sound: Off";
    if (soundEnabled) {
        startMusic();
    } else {
        stopMusic();
    }
});

resetButton.addEventListener("click", () => {
    resetStats();
    updateStatsUI();
    showTextNode(1);
});

// Do NOT start the game automatically – wait for user action (needed for audio)

