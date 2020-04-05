(function () {

  var bv = new Bideo();
  bv.init({
    // Video element
    videoEl: document.querySelector('#background_video'),

    // Container element
    container: document.querySelector('body'),

    // Resize
    resize: true,

    // autoplay: false,

    isMobile: window.matchMedia('(max-width: 768px)').matches,

    // Array of objects containing the src and type
    // of different video formats to add
    src: [{
        src: 'night.mp4',
        type: 'video/mp4'
      },
      {
        src: 'night.webm',
        type: 'video/webm;codecs="vp8, vorbis"'
      }
    ],

    // What to do once video loads (initial frame)
    onLoad: function () {
      document.querySelector('#video_cover').style.display = 'none';
    }
  });
}());


// Tippy
tippy('[data-tippy-content]', {
  theme: 'tooltip',
  content: "Hejehej",
  animation: 'scale',
});

// Pass the button, the tooltip, and some options, and Popper will do the
// magic positioning for you:


// import Typed from 'typed.js';

let head = document.querySelector(".head")
let name = document.querySelector(".name")
head.addEventListener("click", fadeOut)

function fadeOut() {
  head.classList.add("slide-top")
  setTimeout(function () {
    head.remove();
  }, 1500);
  setTimeout(function () {
    write();
  }, 2000);
  setTimeout(function () {
    input();
  }, 8000);
  slideTop()
}

function remove() {
  head.remove()
}

function write() {
  let div = document.createElement("div");
  document.querySelector('.name').appendChild(div);

  var typewriter = new Typewriter(div, {
    loop: false
  });

  typewriter.pauseFor(0)
    .typeString("Hey stranger, what's your name?")
    .pauseFor(2500)
    .start();
}

function input() {
  let input = document.createElement("input");
  input.type = "text";
  input.className = "player-name"
  input.placeholder = "Enter your name"
  document.querySelector('.name').appendChild(input).classList.add("scale-up-bottom");
  input.addEventListener("input", addButton, {
    once: true
  })

  function addButton() {
    let button = document.createElement("button");
    button.id = "next"
    button.innerHTML = "NEXT";
    document.querySelector('.name').appendChild(button).classList.add("scale-up-bottom")
  }
}

function slideTop() {
  let button = document.querySelector("#next")
  button.addEventListener("click", button.classList.add("slide-top"))
  console.log("Hej")
}

// Game functionality

const textElement = document.getElementById("text")
const optionButtonsElement = document.getElementById('option-buttons')

//Håller koll på spelet
let state = {}

function startGame() {
  state = {}
  showTextNode(1)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  textElement.innerHTML = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement("button")
      button.innerText = option.text
      // lägg till styling här
      button.addEventListener("click", () => selectOption(option))
      optionButtonsElement.appendChild(button)

    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

const textNodes = [{
    id: 1,
    text: "You find yourself out partying with your friends. What will you order at the bar?",
    options: [{
        text: "Margarita",
        setState: {
          margarita: true
        },
        nextText: 2
      },
      {
        text: "Water please",
        setState: {
          water: true
        },
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    text: "Nice choice!",
    options: [{
        text: "Go dance",
        requiredState: (currentState) => currentState.margarita,
        setState: {
          margarita: false,
          sword: true
        },
        nextText: 3
      },
      {
        text: "Flirt",
        setState: {
          water: true
        },
        nextText: 2
      }
    ]
  },

]

startGame()