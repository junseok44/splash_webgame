let player1;
let player2;
let bullets = [];
let pg;
let ink;
let ui;

let phase = "main_game";

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  pg = createGraphics(windowWidth, windowHeight);
  pg.noStroke();
  player1 = new Attacker({
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    bullets: bullets,
    color: "rgb(255,78,202)",
    l: 65,
    r: 68,
    u: 87,
    d: 83,
    rotate_l: 81,
    rotate_r: 69,
    attack: 82,
  });
  player2 = new Defender({
    x: 400,
    y: 400,
    width: 50,
    height: 50,
    bullets: bullets,
    color: "rgb(0,255,125)",
    l: 37,
    r: 39,
    u: 38,
    d: 40,
    rotate_l: 188,
    rotate_r: 190,
    //attack: 191,
    pg: pg,
  });
  ink = new InkPattern(100);
  ui = new UI();
  // setInterval(() => {
  //   calculateInkAreaRatio(); // 잉크 면적 비율 계산
  // }, 3000);
}

let inkAreaRatio = 0;
function calculateInkAreaRatio() {
  let totalPixels = pg.pixels.length / 4;
  let inkedPixels = 0;

  pg.loadPixels();
  for (let i = 0; i < pg.pixels.length; i += 4) {
    let r = pg.pixels[i];
    let g = pg.pixels[i + 1];
    let b = pg.pixels[i + 2];
    let a = pg.pixels[i + 3];

    // 특정 색상 (rgb(255,78,202))이면 inkedPixels를 증가
    if (r === 255 && g === 78 && b === 202 && a === 255) {
      inkedPixels++;
    }
  }
  pg.updatePixels();

  // inkAreaRatio를 100이 넘지 않도록 조정
  inkAreaRatio = min((inkedPixels / totalPixels) * 100, 100);

  // inkAreaRatio를 0 미만으로 되지 않도록 조정
  inkAreaRatio = max(inkAreaRatio, 0);

  return inkAreaRatio;
}

function drawMainGameScreen() {
  textSize(15);
  text(`Attacker: ${inkAreaRatio.toFixed(0)}%`, 10, 60);

  text(`Defender:${100 - inkAreaRatio.toFixed(0)}%`, 10, 80);

  text("플레이어1 이동: wasd 회전 qe 잉크총 발사 r", 10, 20);
  text("플레이어2 이동: 방향키 회전 < > 바닥 청소 /", 10, 40);
}

function draw() {
  background(255);

  ui.drawUI(phase);

  switch (phase) {
    case "intro":
      break;
    case "select_character":
      break;
    case "tutorial":
      break;
    case "main_game":
      drawMainGameScreen(); // 게임 화면 그리기
      // 프로토타입은 여기서만 코드 작성해주세요~

      image(pg, 0, 0);

      player1.display();
      player1.move();
      player1.attack();

      player2.display();
      player2.move();
      player2.attack();

      for (let i = 0; i < bullets.length; i++) {
        bullets[i].display();
      }
      break;
    case "game_result":
      break;
  }
}
