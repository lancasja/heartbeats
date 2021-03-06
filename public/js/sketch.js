// --------------------------------------------------------
// Pulse
// --------------------------------------------------------
let socket;
let pulseVal       = 0.0;
let bpm = 0.0;
let count = 0;
let lines = [];

function setup() {
  /**
   * Spotify Setup
   */
  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQBscFt6ZfCQzlQUmW9n31F7WIFQdtYPYfgrRFV2wrTYUkosm56cgkSKUg8PYGWSoDcdD8lYoh2uj0u1sRyJz3Qc3ZKMJntFDN7z2zLTOxBAX4ehmj-Ch9ZtSO_H-eKOsDdcJnvlc-HUdNEeLxN_0cI6IY86vbEXpY7RTmzy';
    
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
    
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  };

  

  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  noStroke();

  // this works if you're running your server on the same port
  // if you're running from a separate server on a different port
  // you'll need to pass in the address to connect()
  socket = io.connect();

  // we listen for message on the socket server called 'data'
  socket.on('data',
    (data) => {
      console.log('Pulse data: ', data.pulseData);
      let vals = data.pulseData;
      let type = vals.split(' ')[0];
      let inputValue = parseInt(vals.split(' ')[1]);
      if (type === 'Signal:' && inputValue != pulseVal) {
        pulseVal = inputValue;
      } else if (type === 'BPM:') {
        bpm = inputValue;
      }
    }
  );

  socket.on('spotifyTracks', (tracks) => {
    console.log(tracks);
    const playFrame = document.getElementById('play-frame');
    const getRandomTrack = (items) => {
      return items[Math.floor(Math.random()*items.length)];
    };
    playFrame.src = `https://open.spotify.com/embed/track/${getRandomTrack(tracks).id}`;
    // playFrame.style.display = 'none';
    console.log(playFrame.contentWindow.document.querySelector('button[title="Play"]'));
  })
}

// --------------------------------------------------------
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// --------------------------------------------------------
function draw() {
  background(bpm-20, 30);

  let hVal = map(pulseVal, 0, 1000, 50, 200);

  if (bpm > 75) {
    high(bpm);
  } else {
    lines = [];
  }

  if (bpm < 55) {
    low(bpm);
  }

  fill(90, 10, 200);
  heart(width/2, height/2, hVal);

  textSize(15);
  fill(255);
  text('BPM: ' + bpm, width-100, height-50);

}

function heart(x, y, size) {
  push();
  noStroke();
  fill(250, 50, 115);
  translate(x, y);
  rotate(PI/4);
  rectMode(CENTER);
  rect(0, 0, size, size);
  ellipse(-size/2, 0, size, size);
  ellipse(0, -size/2, size, size);
  pop();
}

function high(bpm) {
  stroke(255);
  lines.push([random(-height, width-50), height]);
  for (var i = 0; i < lines.length; i++) {
    let diff = random(3);
    line(lines[i][0], lines[i][1], lines[i][0]-150, lines[i][1]+150);
    lines[i][0] += diff;
    lines[i][1] -= diff;
  }
  // count++;
  noStroke();
}

function low(bpm) {
  let c1 = color(127, 109, 168);
  let c2 = color(42, 44, 114);

  setGradient(0, 0, width, height, c1, c2, "Y_AXIS");
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === "Y_AXIS") {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === "X_AXIS") {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}
