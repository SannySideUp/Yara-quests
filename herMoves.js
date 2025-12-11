// Change this to your girlfriend's name
const HER_NAME = "Yara";

const storyNodes = [
    {
        id: 1,
        label: "Scene 1 – The Text",
        text: () =>
            `It is a calm evening. Your phone lights up.\n\n` +
            `"Hey ${HER_NAME}, I have a tiny secret quest for you.\n\n` +
            `Open this website and choose wisely. No pressure... mostly."`,
        choices: [
            { label: "Choice A", text: "Reply instantly: \"I'm in. What are we doing?\"", nextId: 2 },
            { label: "Choice B", text: "Tease: \"Hmm, do I get snacks on this quest?\"", nextId: 2 }
        ]
    },
    {
        id: 2,
        label: "Scene 2 – The Plan",
        text: () =>
            `"The quest is simple: spend time with me.\n` +
            `You get to choose how our next date begins."`,
        choices: [
            { label: "Choice A", text: "Start soft and cozy at home.", nextId: 3 },
            { label: "Choice B", text: "Go outside for an adventure.", nextId: 4 }
        ]
    },
    {
        id: 3,
        label: "Scene 3 – Cozy Start",
        text: () =>
            `He shows up with snacks, a drink you like,\n` +
            `and a playlist ready.\n\n` +
            `"Okay ${HER_NAME}, pick how we begin."`,
        choices: [
            { label: "Choice A", text: "Movie, blanket, and commentary.", nextId: 5 },
            { label: "Choice B", text: "Cook together and mess up the recipe.", nextId: 6 }
        ]
    },
    {
        id: 4,
        label: "Scene 3 – Adventure Start",
        text: () =>
            `"Dress comfortably," he texts.\n\n` +
            `You step outside and the air feels like it is planning something.`,
        choices: [
            { label: "Choice A", text: "Walk and talk.", nextId: 5 },
            { label: "Choice B", text: "Find the best snack first.", nextId: 6 }
        ]
    },
    {
        id: 5,
        label: "Scene 4 – The Talk",
        text: () =>
            `The conversation drifts from jokes to real feelings.\n\n` +
            `"So ${HER_NAME}," he says, "honest question...\n` +
            `Want this to be a one-time memory, or one of many?"`,
        choices: [
            { label: "Choice A", text: "Softly admit: \"I want many.\"", nextId: 7 },
            { label: "Choice B", text: "Deflect with a joke, but smile.", nextId: 8 }
        ]
    },
    {
        id: 6,
        label: "Scene 4 – Chaos",
        text: () =>
            `Food becomes chaos.\nFlour everywhere.\nLaughter everywhere.\n\n` +
            `"If our dates are always this messy," he says,\n` +
            `"I think I'm okay with that."`,
        choices: [
            { label: "Choice A", text: "Throw flour at him.", nextId: 8 },
            { label: "Choice B", text: "Take a photo of the disaster.", nextId: 7 }
        ]
    },
    {
        id: 7,
        label: "Final Scene – Golden Ending",
        text: () =>
            `You don't hide how you feel.\n\n` +
            `"Good," he says softly.\n` +
            `"Because this whole little quest\nwas just an excuse to say\nthat with you, normal days feel special."`,
        choices: [
            { label: "Play again", text: "Restart", nextId: -1 }
        ]
    },
    {
        id: 8,
        label: "Final Scene – Soft Ending",
        text: () =>
            `You joke, but your eyes say everything.\n\n` +
            `"I can read you better than that," he laughs.\n\n` +
            `No drama. No big speech.\nJust two people quietly choosing each other.`,
        choices: [
            { label: "Play again", text: "Restart", nextId: -1 }
        ]
    }
];

const textElement = document.getElementById("text");
const buttonsElement = document.getElementById("buttons");
const sceneLabelElement = document.getElementById("scene-label");
const metaLineElement = document.getElementById("meta-line");

function startGame() {
    showTextNode(1);
}

function showTextNode(nodeId) {
    if (nodeId <= 0) return startGame();

    const node = storyNodes.find(n => n.id === nodeId);
    if (!node) return;

    sceneLabelElement.textContent = node.label;
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

        button.addEventListener("click", () => showTextNode(choice.nextId));
        buttonsElement.appendChild(button);
    });

    metaLineElement.textContent = "Your choices shape the story.";
}

startGame();
