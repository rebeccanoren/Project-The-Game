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

    // isMobile: window.matchMedia('(max-width: 768px)').matches,

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

// Howler Music
let backgroundMusic = new Howl({
  src: ['./assets/music.mp3', './assets/music.mp3'],
  volume: 0.2,
});

let buttonSound = new Howl({
  src: ['./assets/button-sound.mp3', './assets/button-sound.mp3']
});

let partySound = new Howl({
  src: ['./assets/party-noise.mp3', './party-noise.mp3'],
  loop: true,
  volume: 0,
});

let gameOverSound = new Howl({
  src: ['./assets/game-over.m4a', './assets/game-over.m4a'],
  loop: false,
  volume: 0,
});

let scream = new Howl({
  src: ['./assets/scream.mp3', './assets/scream.mp3'],
  loop: false,
  volume: 0.5,
});

// Tippy
tippy('[data-tippy-content]', {
  theme: 'tooltip',
  animation: 'scale',
});

let head = document.querySelector(".head")
let startAdventureButton = document.querySelector("#start")
let name = document.querySelector(".name")
let soundOnoff = document.querySelector(".mute-btn")
let soundSpan = document.querySelector(".mute-btn span")
let soundImg = document.querySelector(".mute-btn img")
let playerName = ""

soundOnoff.addEventListener("click", checkSound)

function checkSound() {
  let sound = document.createElement('img');
  sound.src = "./assets/sound.svg"
  if (soundSpan.innerText === "Sound on") {
    Howler.volume(0.0);
    soundImg.src = "./assets/muted.svg"
    soundSpan.innerText = "Muted"
    soundOnoff.classList.add("sound-on")
  } else if (soundSpan.innerText === "Muted") {
    Howler.volume(0.2);
    soundImg.src = "./assets/sound.svg"
    soundSpan.innerText = "Sound on"
    soundOnoff.classList.remove("sound-on")
  }
}

startAdventureButton.addEventListener("click", introInput)

backgroundMusic.play()

function introInput() {
  head.classList.add('animated', "fadeOutUp")
  buttonSound.play();
  setTimeout(function () {
    remove(head);
  }, 0);
  write(input);
}

function remove(element) {
  element.remove()
}

function write(callback) {
  let div = document.createElement("div");
  document.querySelector('.name').appendChild(div);

  var typewriter = new Typewriter(div, {
    loop: false
  });

  typewriter
    .pauseFor(0)
    .typeString("Hey stranger, what's your name?")
    .pauseFor(2500)
    .start()
    .callFunction(callback)
}

function doneWriting() {
  alert("Writing is done!");
}


function input() {
  let input = document.createElement("input");
  input.type = "text";
  input.class = "input";
  input.className = "player-name"
  input.placeholder = "Enter your name"
  document.querySelector('.name').appendChild(input).classList.add("scale-up-bottom");
  input.addEventListener("input", addButton, {
    once: true
  })


  function addButton() {
    let buttonStart = document.createElement("button");
    buttonStart.id = "next"
    buttonStart.innerHTML = "NEXT";
    document.querySelector('.name').appendChild(buttonStart).classList.add("scale-up-bottom")
    buttonStart.addEventListener("click", function () {
      name.classList.add("slide-top")
      playerName = input.value
      setTimeout(function () {
        startGame();
      }, 3000);
    })
  }
}
// Game functionality

const textElement = document.getElementById("text")
const optionButtonsElement = document.getElementById('option-buttons')
const restart = document.getElementById('restart')

//Håller koll på spelet
let state = {}
let stateGame = {}

function startGame() {
  backgroundMusic.fade(0.4, 0, 3000);
  partySound.play()
  partySound.fade(0, 0.4, 20000);
  document.querySelector(".questions-container").classList.remove("hidden");
  document.querySelector(".name").remove()
  state = {}
  setTimeout(function () {
    showTextNode(1.1);
  }, 500);
}

function reStart() {
  partySound.play()
  partySound.fade(0, 0.4, 20000);
  state = {}
  showTextNode(1.1)
}

restart.addEventListener("click", function () {
  head.remove()
  name.remove()
  document.querySelector(".questions-container").classList.remove("hidden");
  reStart()
})

function showTextNode(textNodeIndex) {
  const textNode = getTextNodes(playerName).find(textNode => textNode.id === textNodeIndex)
  setTimeout(function () {
    textElement.innerHTML = textNode.text
    textElement.classList.remove('animated', "fadeOutUp");
    textElement.classList.add('animated', "fadeInUp");
  }, 1000);
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    textElement.innerHTML = ""
  }
  setTimeout(function () {
    textNode.options.forEach(option => {
      if (showOption(option)) {
        const button = document.createElement("button")
        button.innerText = option.text
        button.classList.add('animated', "fadeInUp");
        button.addEventListener("click", function () {
          buttonSound.play()
          textElement.classList.remove('animated', "fadeInUp");
          textElement.classList.add('animated', "fadeOutUp");
          button.classList.remove('animated', "fadeInUp");
          button.classList.add('animated', "fadeOutUp");
          setTimeout(function () {
            selectOption(option)
            updateInventory()
            renderInventory()
          }, 1000);
        })
        optionButtonsElement.appendChild(button)
      }
    })
  }, 3000);

  function updateInventory() {
    for (let key in state) {
      state[key] ? inventory[key].status = true : inventory[key].status = false
    }
  }

  function checkIfDead() {
    if (stateGame.dead == true) {
      partySound.volume(0.0)
      gameOverSound.play()
      gameOverSound.fade(0, 0.6, 3000);
      scream.play()
    }
  }

  function showOption(option) {
    return option.requiredState == null || option.requiredState(state)
  }

  function selectOption(option) {
    const nextTextNodeId = option.nextText
    if (nextTextNodeId <= 0) {
      return reStart()
    }
    if (nextTextNodeId == 1.15) {
      document.querySelector(".questions-container").classList.add("test");
    }

    state = Object.assign(state, option.setState)
    stateGame = Object.assign(stateGame, option.setStateGame)
    checkIfDead()
    showTextNode(nextTextNodeId)
  }
}

// Is updating and showing active items from inventory each question
function renderInventory() {
  document.getElementById('inventory').innerHTML = ''
  Object.keys(inventory).forEach(item => {
    if (inventory[item].status === true) {
      let inventoryDiv = document.getElementById('inventory')
      let newDiv = document.createElement('div')
      let img = document.createElement('img');
      let description = document.createElement('span');
      img.src = inventory[item].image;
      description.innerHTML = inventory[item].name
      newDiv.appendChild(img)
      newDiv.appendChild(description)
      inventoryDiv.appendChild(newDiv)
    }
  })

  // Update inventory emptystate if there are no items
  let inventoryDiv = document.getElementById('inventory')
  if (!inventoryDiv.hasChildNodes()) {
    let emptyState = document.createElement("span")
    emptyState.innerHTML = "You have no items :("
    emptyState.classList.add("empty-state")
    inventoryDiv.appendChild(emptyState)
  }
}

const inventory = {
  margarita: {
    name: "Margarita",
    image: "./assets/margarita.png",
    status: false,
  },
  beer: {
    name: "Beer",
    image: "./assets/beer.png",
    status: false,
  },
  water: {
    name: "Water",
    image: "./assets/water.png",
    status: false,
  },
  baloon: {
    name: "Bird baloon",
    image: "./assets/baloon.png",
    status: false,
  },
  number: {
    name: "Jessies Number",
    image: "./assets/number.png",
    status: false,
  },

}

function getTextNodes(playerName) {
  return [{
      id: 1.1,
      text: `You find yourself out partying with your friends. What will you order at the bar?`,
      options: [{
          text: "Margarita 🍸",
          setState: {
            margarita: true
          },
          nextText: 1.2
        },
        {
          text: "Water please 💦",
          setState: {
            water: true,
          },
          setStateGame: {
            boring: true,
          },
          nextText: 1.2
        },
        {
          text: "Beer 🍺",
          setState: {
            beer: true,
          },
          nextText: 1.2
        }
      ]
    },
    {
      id: 1.2,
      text: "You notice that someone is looking at you and smile. What do you do?",
      options: [{
          text: "Say something",
          nextText: 1.3
        },
        {
          text: "Keep sipping on your drink",
          setState: {
            boring2: true
          },
          nextText: 1.19
        },
        {
          text: "Look around for your friend Julie",
          nextText: 1.16
        },
      ]
    },

    {
      id: 1.3,
      text: " What do you say?",
      options: [{
          text: "What’s your name?",
          nextText: 1.4
        },
        {
          text: "What are you drinking?",
          requiredState: (currentState) => !currentState.askedForDrink,
          setStateGame: {
            askedForDrink: true
          },
          nextText: 1.17
        },
      ]
    },

    {
      id: 1.4,
      text: `<i>Jessie, what is your name?</i><br><br> What is your reply?`,
      options: [{
        text: `My name is ${playerName}`,
        nextText: 1.5
      }, ]
    },

    {
      id: 1.5,
      text: `<i>Nice to meet you ${playerName}, Jessie responds.</i><br><br> What do want to do next?`,
      options: [{
        text: "Ask what Jessie is doing for a living",
        nextText: 1.6
      }, ]
    },

    {
      id: 1.6,
      text: "Jessie is working at the city’s health centre. You tell him about your work as a...",
      options: [{
          text: "Conversation Architect",
          nextText: 1.7
        },
        {
          text: "Director of Banana Polishing",
          nextText: 1.7
        },
        {
          text: "Teddy Bear Surgeon",
          nextText: 1.7
        },
        {
          text: "Head of Potato",
          nextText: 1.7
        },
      ]
    },

    {
      id: 1.7,
      text: `You really get the feeling that Jessie is impressed by you.
      <br><br>What do you do next?`,
      options: [{
          text: "Tell Jessie that you are here visiting your friend Julie over the weekend",
          nextText: 1.9
        },
        {
          text: "Buy Jessie a drink",
          nextText: 1.8
        },
      ]
    },

    {
      id: 1.8,
      text: "You’ve got the bartenders attention. What do you want to order?",
      options: [{
          text: "Two beers",
          nextText: 1.10
        },
        {
          text: "Two shots",
          nextText: 1.10
        },
      ]
    },

    {
      id: 1.9,
      text: `Speaking of Julie... where is she? You haven't seen her for a while.<br><br> What do you want to do?`,
      options: [{
          text: "Leave Jessie and look for Julie",
          nextText: 2.1
        },
        {
          text: "Buy Jessie a drink",
          nextText: 1.8
        },
      ]
    },

    {
      id: 1.10,
      text: "This seems to be a person that likes to have fun. Jessie offers to pay for the next round. What's your reply?",
      options: [{
          text: "No more drinks for me",
          nextText: 1.11
        },
        {
          text: "HELL YES",
          nextText: 1.14
        },
      ]
    },

    {
      id: 1.11,
      text: `<i>I’m sorry but I've to go now. It has been nice hanging out with you, Jessie responds.</i><br><br> What do you say?`,
      options: [{
          text: "Ask for Jessies number",
          setState: {
            number: true
          },
          nextText: 1.12
        },
        {
          text: "Say goodbye and go to the dancefloor",
          nextText: 2.1
        },
      ]
    },

    {
      id: 1.12,
      text: `<i>Here is my number, call me whenever you like.</i><br><br> What's your respond?`,
      options: [{
        text: "Say thanks, and go to the dancefloor",
        nextText: 2.1
      }, ]
    },

    {
      id: 13,
      text: "They are playing really great music in this club!",
      options: [{
        text: "Dance",
        nextText: 100
      }, ]
    },

    {
      id: 1.14,
      text: "You are taking a shot with Jessie. What’s next?",
      options: [{
          text: "Challenge Jessie for a drinking contest",
          nextText: 1.15
        },
        {
          text: "Ask for Jessies number",
          nextText: 1.12
        },
      ]
    },

    {
      id: 1.15,
      text: "Are you sure that was a great idea?",
      options: [{
        text: "No, go to the dancefloor like a BOSS",
        setState: {
          drunk: true
        },
        nextText: 2.3
      }, ]
    },

    {
      id: 1.16,
      text: "You look around but can’t seem to find her. Where could she be?",
      options: [{
          text: "Look in the bathroom",
          setStateGame: {
            dead: true,
          },
          nextText: 1.23
        },
        {
          text: "Look on the balcony",
          nextText: 1.21
        },
      ]
    },

    {
      id: 1.17,
      text: "A Moscow Mule and how about you? The person responds.",
      options: [{
          text: "A Beer",
          requiredState: (currentState) => currentState.beer,
          nextText: 1.18
        },
        {
          text: "A Margarita",
          requiredState: (currentState) => currentState.margarita,
          nextText: 1.18
        },
        {
          text: "Water",
          requiredState: (currentState) => currentState.water,
          nextText: 1.18
        },
      ]
    },

    {
      id: 18,
      text: "This seems like a nice person! What’s next?",
      options: [{
        text: "Ask for the persons name",
        nextText: 1.4
      }, ]
    },


    {
      id: 1.19,
      text: "This feels a bit weird. Don't you think? What do you do now?",
      options: [{
          text: "Go to the dancefloor",
          nextText: 2.1
        },
        {
          text: "Say something",
          nextText: 1.3
        },
        {
          text: "Look around for your friend Julie",
          nextText: 1.16
        },
      ]
    },

    {
      id: 1.20,
      text: `<i>Let’s do it another time.</i><br><br> What’s your reply?`,
      options: [{
        text: "Yes, for sure!",
        nextText: 1.11
      }, ]
    },

    {
      id: 1.21,
      text: `You walk through the club and can’t seem to find her anywere. But on your way you found a helium balloon shaped as a bird. It sees cool.`,
      options: [{
        text: "Pick it up and go back to the bar",
        setState: {
          baloon: true
        },
        nextText: 1.22
      }, ]
    },


    {
      id: 1.22,
      text: "Someone is still looking at you and smile.",
      options: [{
          text: "Say something",
          nextText: 1.3
        },
        {
          text: "Keep sipping on your drink",
          nextText: 1.19
        },
      ]
    },

    {
      id: 1.23,
      text: "You enter the bathroom. The door shuts behind you with a bang. Slightly panicked you turn the handle. The door is stuck. You’ve managed to lock yourself in and the music is too loud for anyone to hear your screams for help. Good job.",
      options: [{
        text: "Try again!",
        nextText: -1
      }, ]
    },

    {
      id: 2.1,
      text: "On your way you see a girl. She’s sniffing and does not look like she’s feeling well. What do you do?",
      options: [{
          text: "Walk up to her and ask how she is feeling",
          nextText: 2.2
        },
        {
          text: "Comfort the girl with a friendly hug",
          setState: {
            virus: true
          },
          nextText: 2.2
        },
        {
          text: "Walk past her",
          nextText: 2.3
        },
      ]
    },



    {
      id: 100,
      text: "The story is currently under construction 🤪",
      options: [{
        text: "Play again!",
        nextText: -1
      }]
    },

  ]
}