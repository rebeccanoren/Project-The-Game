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
let background = document.querySelector(".overlay")
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
  window.location.reload();
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
      let background = document.querySelector(".overlay")
      background.classList.remove("overlay")
      background.classList.add("gameover")
      let gameOverTitle = document.createElement('h1')
      gameOverTitle.classList.add("neon-first")
      gameOverTitle.classList.add("gameover-title")
      gameOverTitle.innerText = "GAMEOVER"
      document.querySelector(".questions-container").appendChild(gameOverTitle)
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
      text: "You notice that someone is smiling at you. They look friendly enough. What do you do?",
      options: [{
          text: "Strike up a conversation",
          nextText: 1.3
        },
        {
          text: "Keep sipping on your drink",
          setGame: {
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
      text: "What do you say?",
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
      options: [{
        text: "Ask what Jessie is doing for a living",
        nextText: 1.6
      }, ]
    },

    {
      id: 1.6,
      text: "Jessie is working at the city’s health centre. You tell him about you work as a...",
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
          text: "Head of Potatoes",
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
          nextText: 1.12
        },
        {
          text: "Say goodbye and go to the dance floor",
          nextText: 2.1
        },
      ]
    },

    {
      id: 1.12,
      text: `<i>Here is my number, call me whenever you like.</i><br><br> What's your respond?`,
      options: [{
        text: "Say thanks, and go to the dancefloor",
        setState: {
          number: true
        },
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
          text: "No, go to the dance floor like a BOSS",
          setStateGame: {
            drunk: true
          },
          nextText: 2.3
        },
        {
          text: "Ask for Jessies number",
          nextText: 1.12
        },
      ]
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
        },

      ]
    },


    {
      id: 1.19,
      text: "This feels a bit weird. Don't you think? What do you do now?",
      options: [{
          text: "Go to the dance floor",
          nextText: 2.1
        },
        {
          text: "Strike up a conversation",
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
      text: `You walk through the club and can’t seem to find her anywhere. But on your way you found a helium balloon shaped as a bird. It sees cool.`,
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
      text: "Perhaps the stranger in the bar could be interesting?",
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


    // SCENARIO 2

    {
      id: 2.1,
      text: "On your way you see a girl. She’s sniffing and does not look like she’s feeling well. What do you do?",
      options: [{
          text: "Walk up to her and ask her how she is feeling",
          nextText: 2.2
        },
        {
          text: "Comfort the girl with a friendly hug",
          setStateGame: {
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
      id: 2.2,
      text: `The girl is thanking you for caring. She shows you a phone she has found on the floor and asks you to take care of it.<br><br>

      What’s your response?`,
      options: [{
          text: "Accept",
          setState: {
            phone: true
          },
          nextText: 2.3
        },
        {
          text: "Decline",
          nextText: 2.3
        },
      ]
    },

    {
      id: 2.3,
      text: `In the corner of your eye you see Julie. What do you do?`,
      options: [{
          text: "Follow her",
          nextText: 2.6
        },
        // {
        //   text: "Go to the dance floor",
        //   requiredState: (currentState) => currentState.water && !currentState.phone,
        //   nextText: 2.5
        // },
        {
          text: "Go to the dance floor",
          nextText: 2.10
        },
      ]
    },

    {
      id: 2.4,
      text: `You are a mess. While walking back to the dance floor you trip on a straw and hit your head against the bar. You are dead.`,
      options: [{
        text: "Play again!",
        nextText: -1
      }, ]
    },

    {
      id: 2.5,
      text: `You are so boring that on your way back to the dance floor you choke on your water and die. Why are you even playing this game? Try again.`,
      options: [{
        text: "Play again!",
        nextText: -1
      }, ]
    },

    {
      id: 2.6,
      text: `You go outside and can’t see Julie anywhere. However, you find two strangers hanging around.`,
      options: [{
        text: "Ask them if they have seen Julie",
        nextText: 2.7
      }, ]
    },


    {
      id: 2.7,
      text: `<i>The girl with a red jacket? I saw her turn right.</i><br><br>

      Where do you want to go?`,
      options: [{
          text: "Go left",
          nextText: 2.9
        },
        {
          text: "Go right",
          nextText: 2.14
        },
      ]
    },

    {
      id: 2.8,
      text: `Being the drunk skunk that you are, you forget what the girl just said and turn left. Only problem is that turning left doesn’t actually lead to a road, but to a river. You somehow manage to fall over the railing and down to your death. Oh dear, you really are a lightweight.`,
      options: [{
        text: "Play again!",
        nextText: -1
      }]
    },

    {
      id: 2.9,
      text: `You seems to have trouble with following simple instructions. You are given a second chance. Try again.`,
      options: [{
        text: "Thanks for the opportunity",
        nextText: 2.7
      }]
    },

    {
      id: 2.10,
      text: `Back at the dance floor you are dancing like there’s no tomorrow for a couple of hours. You’ve had so much fun that the urgency of finding Julie has left your mind. You start feeling exhausted.`,
      options: [{
          text: "Find Julie",
          nextText: 2.11
        },
        {
          text: "Keep on dancing",
          nextText: 2.11
        }
      ]
    },

    {
      id: 2.11,
      text: `Julie is gone. You really need to find her since you’re staying at her place for the weekend while visiting this town. You remember that this isn’t 1964 and you do actually own a phone.`,
      options: [{
        text: "Call Julie",
        nextText: 2.13
      }, ]
    },

    {
      id: 2.13,
      text: `Julie doesn’t answer her phone. It’s not really a surprise since she’s the worst person you know at remembering to charge her phone.
      Not having any more options, you lay down on the floor and just fade away. You’re dead.`,
      options: [{
        text: "Play again!",
        nextText: -1
      }]
    },

    {
      id: 2.14,
      text: `You see her just across the road. She seems to be on her way to jump into a car.`,
      options: [{
          text: "Run towards her",
          nextText: 2.15
        },
        {
          text: "Stop and look for cars",
          nextText: 2.16
        }
      ]
    },

    {
      id: 2.15,
      text: `You run as fast as you can. You get there just as Julie enters the car and the door shuts behind her.  You knock on the window and the door opens.`,
      options: [{
        text: "Enter the car",
        nextText: 3.1
      }]
    },

    {
      id: 2.16,
      text: `It is night – there are no cars at this time of the day. While waiting for a green light you see Julie enter the car. The car is about to drive off.`,
      options: [{
        text: "Try to stop the car",
        nextText: 2.11
      }]
    },


    // SCENARIO 2

    {
      id: 3.1,
      text: `Entering the car, you see Julie sitting inside looking upset.
      What do you do?`,
      options: [{
          text: "Ask her why she’s sad",
          nextText: 3.2
        },
        {
          text: "Give her a comforting hug",
          nextText: 3.2
        }
      ]
    },


    {
      id: 3.2,
      text: `Julie tells you that she got a call from the hospital and that her mom is very sick. The doctors don’t know how to help since it’s an unknown virus.`,
      options: [{
          text: "Tell Julie everything is going to be fine",
          nextText: 3.3
        },
        {
          text: "Ask Julie what she knows so far ",
          nextText: 3.3
        }
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