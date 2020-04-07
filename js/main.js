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
  volume: 0.3,
});

let buttonSound = new Howl({
  src: ['./assets/button-sound.mp3', './assets/button-sound.mp3']
});

let partySound = new Howl({
  src: ['./assets/party-noise.mp3', './party-noise.mp3'],
  loop: true,
  volume: 0,
});

// Tippy
tippy('[data-tippy-content]', {
  theme: 'tooltip',
  animation: 'scale',
});

let head = document.querySelector(".head")
let startAdventureButton = document.querySelector("#start")
let name = document.querySelector(".name")
let playerName = ""

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

function startGame() {
  backgroundMusic.fade(0.4, 0, 3000);
  partySound.play()
  partySound.fade(0, 0.2, 20000);
  document.querySelector(".questions-container").classList.remove("hidden");
  document.querySelector(".name").remove()
  state = {}
  setTimeout(function () {
    showTextNode(1);
  }, 500);
}

function reStart() {
  state = {}
  showTextNode(1)
}

restart.addEventListener("click", function () {
  if (document.contains(head)) {
    head.remove()
  } else if (document.contains(name)) {
    name.remove
  }
  startGame()
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

  // function updateInventory() {
  //   if (state.margarita == true) {
  //     inventory.margarita.status = true
  //   }
  //   if (state.margarita == false) {
  //     inventory.margarita = false;
  //   }
  //   // for (let key in state) {
  //   //   if state.key == true ?
  //   //   inventory[key].status
  //   // }
  // }


  function showOption(option) {
    return option.requiredState == null || option.requiredState(state)
  }

  function selectOption(option) {
    const nextTextNodeId = option.nextText
    if (nextTextNodeId <= 0) {
      return reStart()
    }
    if (nextTextNodeId == 15) {
      document.querySelector(".questions-container").classList.add("test");
    }
    state = Object.assign(state, option.setState)
    showTextNode(nextTextNodeId)
    console.log(state)
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
  number: {
    name: "Jessies Number",
    image: "./assets/number.png",
    status: false,
  },
  margarita: {
    name: "Margarita",
    image: "./assets/drink.png",
    status: false,
  },
}

function getTextNodes(playerName) {
  return [{
      id: 1,
      text: `You find yourself out partying with your friends. What will you order at the bar?`,
      options: [{
          text: "Margarita 🍸",
          setState: {
            margarita: true
          },
          nextText: 2
        },
        {
          text: "Water please 💦",
          setState: {
            water: true
          },
          nextText: 2
        },
        {
          text: "Beer 🍺",
          setState: {
            water: true
          },
          nextText: 2
        }
      ]
    },
    {
      id: 2,
      text: "You notice that someone is looking in your direction. What do you do?",
      options: [{
          text: "Say something",
          setState: {
            margarita: true
          },
          nextText: 3
        },
        {
          text: "Keep sipping on your drink",
          nextText: 19
        },
      ]
    },

    {
      id: 3,
      text: "You turn towards the person. What do you say?",
      options: [{
          text: "What’s your name?",
          nextText: 4
        },
        {
          text: "What are you drinking?",
          requiredState: (currentState) => !currentState.askedForDrink,
          setState: {
            askedForDrink: true
          },

          nextText: 17
        },
        {
          text: "Change your mind and quickly look down",
          nextText: 18
        },
      ]
    },

    {
      id: 4,
      text: `<i>Jessie, what is your name?</i><br><br> What is your reply?`,
      options: [{
        text: `My name is ${playerName}`,
        nextText: 5
      }, ]
    },

    {
      id: 5,
      text: `<i>Nice to meet you ${playerName} Jessie responds.</i><br><br> What do want to do next?`,
      options: [{
        text: "Continue talk to Jessie",
        nextText: 6
      }, ]
    },

    {
      id: 6,
      text: "You find out that Jessie is here with friends from college",
      options: [{
          text: "Talk some more with Jessie",
          nextText: 7
        },
        {
          text: "Buy Jessie a drink",
          nextText: 8
        },
      ]
    },

    {
      id: 7,
      text: "Jessie is working at the city’s health centre. What is your respond?",
      options: [{
          text: "Tell Jessie that you are here with Julie",
          nextText: 9
        },
        {
          text: "Buy Jessie a drink",
          nextText: 8
        },
      ]
    },

    {
      id: 8,
      text: "You’ve got the bartenders attention. What do you want to order?",
      options: [{
          text: "Two beers",
          nextText: 10
        },
        {
          text: "Two shots",
          nextText: 10
        },
      ]
    },

    {
      id: 9,
      text: "Speaking of Julie... where is she? You realise you haven't seen her for a while...",
      options: [{
          text: "Look for Julie",
          nextText: 21
        },
        {
          text: "Stay with Jessie",
          nextText: 11
        },
      ]
    },

    {
      id: 10,
      text: "This seems to be a person that likes to have fun. Jessie offers to pay for the next round. What to you reply?",
      options: [{
          text: "No more drinks for me",
          nextText: 11
        },
        {
          text: "HELL YES",
          nextText: 14
        },
      ]
    },

    {
      id: 11,
      text: `<i>I’m sorry but I've to go now. It has been nice hanging out with you, Jessie responds.</i><br><br> What do you say?`,
      options: [{
          text: "Ask for Jessies number",
          setState: {
            number: true
          },
          nextText: 12
        },
        {
          text: "Say goodbye and go to the dancefloor",
          nextText: 13
        },
      ]
    },

    {
      id: 12,
      text: "Here is my number, call me whenever you like. Bye!",
      options: [{
        text: "Say thanks, and go to the dancefloor",
        nextText: 13
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
      id: 14,
      text: "You are taking a shot with Jessie. What’s next?",
      options: [{
          text: "Challenge Jessie for a drinking contest",
          nextText: 15
        },
        {
          text: "Go to the dancefloor",
          nextText: 13
        },
        {
          text: "Ask for Jessies number",
          nextText: 12
        },
      ]
    },

    {
      id: 15,
      text: "Are you sure that was a great idea?",
      options: [{
        text: "No, go to the dancefloor like a BOSS",
        setState: {
          drunk: true
        },
        nextText: 13
      }, ]
    },

    {
      id: 16,
      text: "Lorem ipsum",
      options: [{
        text: "Lorem ipsum",
        nextText: 13
      }, ]
    },

    {
      id: 17,
      text: "A Moscow Mule and how about you? The person responds.",
      options: [{
          text: "A Beer",
          requiredState: (currentState) => currentState.beer,
          nextText: 18
        },
        {
          text: "A Margarita",
          requiredState: (currentState) => currentState.margarita,
          nextText: 18
        },
        {
          text: "Water",
          requiredState: (currentState) => currentState.water,
          nextText: 18
        },
      ]
    },

    {
      id: 18,
      text: "This seems like a nice person! What’s next?",
      options: [{
          text: "Talk some more",
          nextText: 3
        },
        {
          text: "Go to the dancefloor",
          nextText: 13
        },
      ]
    },


    {
      id: 19,
      text: "This feels a bit weird. Don't you think? What do you do now?",
      options: [{
          text: "Go to the dancefloor",
          nextText: 13
        },
        {
          text: "Look up and say something",
          nextText: 3
        },
      ]
    },

    {
      id: 20,
      text: `<i>Let’s do it another time.</i><br><br> What’s your reply?`,
      options: [{
        text: "Yes, for sure!",
        nextText: 11
      }, ]
    },

    {
      id: 21,
      text: `Lorem`,
      options: [{
        text: "Yes, for sure!",
        nextText: 100
      }, ]
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