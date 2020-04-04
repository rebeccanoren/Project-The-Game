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

      playButton: document.querySelector('#play'),
      pauseButton: document.querySelector('#pause'),

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
      console.log("Hej")
      let button = document.createElement("button");
      button.innerHTML = "NEXT";
      document.querySelector('.name').appendChild(button).classList.add("scale-up-bottom")
      button.addEventListener("click", name.classList.add("slide-top"))
    }
  }