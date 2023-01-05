document.querySelector('.start-btn').addEventListener('click', () => {
    startGame();
})

function startGame() {
  document.querySelector('.first-screen').classList.add('display_none');
  const game = document.querySelector('.game');
  const gameBox = document.querySelector('.game-box');
  const timer = document.querySelector('.timer');
  const yellowClock = document.querySelector('.clock-yellow');
  const redClock = document.querySelector('.clock-red');
  const pieces = document.querySelectorAll('.piece');
  const fog = document.querySelector('.fog');

  yellowClock.classList.remove('display_none');
  redClock.style.animation = 'clock 0.8s linear infinite';
  redClock.classList.add('display_none');

  let freePuzzles = 16;
  let timerValue = 90;
  timer.textContent = timerValue;

  game.classList.remove('display_none');
  
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const gifBox =  document.querySelector('.gif-box');
  gifBox.classList.remove('display_none');
  gifBox.style.top = `${document.querySelector('.field').getBoundingClientRect().top}px`;

  let intervalID = setInterval(reduseTimer, 1000);
  
  for (let p of pieces) {
    gameBox.append(p);
    p.style.pointerEvents = "auto";
    p.setAttribute('data-angle', p.getAttribute('data-angle-start'))
    p.style.transform = `rotate(${p.getAttribute('data-angle-start')}deg)`;
    p.style.top = `${p.getAttribute('data-top')}%`;
    p.style.left = `${p.getAttribute('data-left')}%`;

    p.onpointerdown = function(event) {
      
      if (event.isPrimary === true) {
        let shiftX;

        if (document.documentElement.clientWidth > 800) {
          shiftX = (document.documentElement.clientWidth - 800) /2 + event.clientX - p.getBoundingClientRect().left;
        }

        else {
          shiftX = event.clientX - p.getBoundingClientRect().left; 
        }
      
        let shiftY = event.clientY - p.getBoundingClientRect().top;
      
        function moveAt(pageX, pageY) {

          p.style.left = pageX - shiftX + 'px';
          p.style.top = pageY - shiftY + 'px';

          if (p.getBoundingClientRect().top <= 100) {
            p.style.top = '100px';
          } 

          if (p.getBoundingClientRect().bottom >= (gameBox.getBoundingClientRect().bottom + 40)) {
            p.style.top = `${screenHeight-40}px`;
          }

          if (p.getBoundingClientRect().left <= (gameBox.getBoundingClientRect().left - 40)) {
            p.style.left = '-40px';
          } 

          if (p.getBoundingClientRect().right >= (gameBox.getBoundingClientRect().right + 40)) {
            p.style.left = `${screenWidth-40}px`;
          } 
        }
      
        function onpointerMove(event) {
            p.style.zIndex = 1000;
            moveAt(event.pageX, event.pageY);
        }
      
        document.addEventListener('pointermove', onpointerMove);

        p.onpointerup = function(event) {
          document.removeEventListener('pointermove', onpointerMove);

          toFix(p, event);
        }

        p.ondragstart = function() {
          return false;
        }
      }
    }

    p.onclick = function(event) {
      let newAngle = Number(p.getAttribute('data-angle'))+90;
      if (newAngle === 360) {
        newAngle = 0;
      }

      p.setAttribute('data-angle', newAngle); 
      p.style.transform = `rotate(${newAngle}deg)`;
      
      toFix(p, event);
    }
  }

  function toFix(p, event) {
    p.hidden = true; 
    let placeBelow = document.elementFromPoint(event.clientX, event.clientY);
    p.hidden = false;

    if (placeBelow.getAttribute('class').includes('place')) {
      let pieceNum = Number(p.getAttribute('class').split('-')[1]);
      let placeNum = Number(placeBelow.getAttribute('class').split('-')[1]);

      if ((pieceNum === placeNum) && (Number(p.getAttribute('data-angle')) === 0)) {
        placeBelow.append(p);
        p.style.position = 'absolute';
        p.style.top = `0px`;
        p.style.left = `0px`;
        p.style.pointerEvents = 'none';
        freePuzzles--;

        if (freePuzzles === 0) {
          clearInterval(intervalID);
          youWin(pieces, fog);
        }
      } 
    }
  }

  function reduseTimer(){
    timerValue -=1;
    timer.textContent = timerValue;

    if (timerValue === 10) {
      yellowClock.classList.add('display_none');
      redClock.classList.remove('display_none');
    }

    if (timerValue === 0) {
      clearInterval(intervalID);

      if ((document.querySelector('.gif-success')).classList.contains('display_none')) {
        youLose(pieces, redClock, fog); 
      }   
    }
  }
}

function youLose(pieces, redClock, fog) { 

    for (let p of pieces) {
      p.classList.add('display_none')
    }
    document.querySelector('.gif-fail').classList.remove('display_none');
    redClock.style.animation = "none";

    setTimeout( () => {
      fog.classList.remove('display_none');
    }, 5000)

    setTimeout( () => {
      showResult('fail');
    }, 5500)

    setTimeout( () => {
      let againBtn = document.querySelector('.try-again-fail');
      againBtn.addEventListener('click', () => {
        tryAgain('fail', pieces);
      });
    }, 6000)
}

function youWin(pieces, fog) {
    for (let p of pieces) {
      p.classList.add('display_none')
    }
     
    document.querySelector('.gif-success').classList.remove('display_none');
    document.querySelector('.timer-box').style.visibility = 'hidden';
    setTimeout( () => {
      fog.classList.remove('display_none');
    }, 6000)
    setTimeout( () => {
      showResult('success', pieces);
    }, 6500) 
}

function showResult(result) {
  document.querySelector('.last-screen').classList.remove('display_none');
  document.querySelector(`.smile-${result}`).classList.remove('display_none');
  document.querySelector(`.cream-text-${result}`).classList.remove('display_none');
  document.querySelector(`.pop-up-content-${result}`).classList.remove('display_none');
}

function tryAgain(result, pieces) {
  for (let p of pieces) {
    p.classList.remove('display_none')
  }

  document.querySelector(`.gif-${result}`).classList.add('display_none');
  document.querySelector('.gif-box').classList.add('display_none');
  document.querySelector('.fog').classList.add('display_none');
  document.querySelector('.last-screen').classList.add('display_none');
  document.querySelector(`.smile-${result}`).classList.add('display_none');
  document.querySelector(`.cream-text-${result}`).classList.add('display_none');
  document.querySelector(`.pop-up-content-${result}`).classList.add('display_none');
  startGame();
}