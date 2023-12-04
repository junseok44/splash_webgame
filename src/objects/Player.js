class Player {
  constructor({
    x,
    y,
    width,
    height,
    bullets,
    color,
    l,
    r,
    u,
    d,
    rotate_l,
    rotate_r,
    attack,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.lcode = l;
    this.rcode = r;
    this.ucode = u;
    this.dcode = d;
    this.rotate_lcode = rotate_l;
    this.rotate_rcode = rotate_r;
    this.attackcode = attack;
    this.deg = 0;

    this.bullets = bullets;
    this.color = color;
    this.isAttacked = false;
    this.isHit = false;

    this.life = Player.playerLife;
    this.isDead = false;

    this.collisionSide = null;
  }

  static coolTimeAfterHit = 500;
  static respawnTime = 5000;
  static playerLife = 5;

  static rotatePoint(x, y, angle, center_x, center_y) {
    const sin_a = Math.sin(angle);
    const cos_a = Math.cos(angle);
    x -= center_x;
    y -= center_y;
    const new_x = x * cos_a - y * sin_a + center_x;
    const new_y = x * sin_a + y * cos_a + center_y;
    return { x: new_x, y: new_y };
  }

  // 추상메서드. 자식 클래스에서 반드시 구현해야 함.
  attack() {
    throw Error("this method must be implemented");
  }

  // 플레이어는 사각형이고 충돌체는 원이라고 가정하고 충돌 판정을 하는 함수.
  isCollidedWithCircle(circle) {
    let square_rotation = this.deg;
    let square_x = this.x;
    let square_y = this.y;
    let square_side = this.width;
    let circle_x = circle.coordX;
    let circle_y = circle.coordY;
    let circle_radius = circle.width / 2;

    // Find the center of the square
    const square_center_x = square_x;
    const square_center_y = square_y;

    // Rotate the circle center point by the negative square rotation
    const { x: rotated_circle_x, y: rotated_circle_y } = Player.rotatePoint(
      circle_x,
      circle_y,
      -square_rotation,
      square_center_x,
      square_center_y
    );

    // Find the closest point on the square to the rotated circle center
    const closest_x = Math.max(
      Math.abs(rotated_circle_x - square_center_x) - square_side / 2,
      0
    );
    const closest_y = Math.max(
      Math.abs(rotated_circle_y - square_center_y) - square_side / 2,
      0
    );

    // Calculate the distance between the closest point on the square and the rotated circle center
    const distance_to_closest = Math.sqrt(closest_x ** 2 + closest_y ** 2);

    // Check if the distance to the closest point on the square is less than the circle's radius
    return distance_to_closest <= circle_radius;
  }

  // 두 플레이어 모두 원이라고 가정하고 충돌 판정을 하는 함수.
  isCollidedWithPlayer(otherCircle) {
    this.radius = this.width / 2;

    const dx = otherCircle.x - this.x;
    const dy = otherCircle.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius + otherCircle.radius) {
      const angle = Math.atan2(dy, dx);

      if (angle > -Math.PI / 4 && angle <= Math.PI / 4) {
        this.collisionSide = "right";
      } else if (angle > Math.PI / 4 && angle <= (3 * Math.PI) / 4) {
        this.collisionSide = "bottom";
      } else if (angle >= (Math.PI / 4) * 3 || angle <= (-Math.PI / 4) * 3) {
        this.collisionSide = "left";
      } else if (angle > (-3 * Math.PI) / 4 && angle <= -Math.PI / 4) {
        this.collisionSide = "top";
      }
    } else {
      this.collisionSide = null;
    }
  }

  move() {
    let diagonal = (this.width / 2) * Math.sqrt(2);
    let uiHeight = 48;

    if (keyIsDown(this.lcode)) {
      if (this.x <= diagonal || this.collisionSide == "left") return;
      this.x -= 5;
    }
    if (keyIsDown(this.rcode)) {
      if (this.x >= width - diagonal || this.collisionSide == "right") return;
      this.x += 5;
    }
    if (keyIsDown(this.ucode)) {
      if (this.y <= diagonal + uiHeight || this.collisionSide == "top") return;
      this.y -= 5;
    }
    if (keyIsDown(this.dcode)) {
      if (this.y >= height - diagonal || this.collisionSide == "bottom") return;
      this.y += 5;
    }
    if (keyIsDown(this.rotate_lcode)) {
      this.deg -= 0.1;
    }
    if (keyIsDown(this.rotate_rcode)) {
      this.deg += 0.1;
    }
  }

  // 맞앗을때
  hit() {
    if (!this.isHit) {
      this.life -= 1;
      this.isHit = true;
      setTimeout(() => {
        this.isHit = false;
      }, Player.coolTimeAfterHit);
    }
  }

  // 죽었을때
  dead() {
    this.isDead = true;
    setTimeout(() => {
      this.respawn();
    }, Player.respawnTime);
  }

  respawn() {
    this.isDead = false;
    this.life = Player.playerLife;
  }

  display() {
    push();

    if (this.isDead) {
      push();
      fill(0);
      translate(this.x, this.y);
      rotate(this.deg);
      rect(0, 0, this.width, this.height);
      pop();
      return;
    }

    fill(255);

    translate(this.x, this.y);
    rotate(this.deg);

    if (this.isHit) {
      push();
      fill(255, 0, 0);
      rect(0, 0, this.width, this.height);
      pop();
    } else {
      rect(0, 0, this.width, this.height);
      ellipse(0, -20, 10, 10);
    }

    fill(0);
    pop();
  }

  //REVISED
  changeControls(l, r, u, d, rotate_l, rotate_r, attack) {
    this.lcode = l;
    this.rcode = r;
    this.ucode = u;
    this.dcode = d;
    this.rotate_lcode = rotate_l;
    this.rotate_rcode = rotate_r;
    this.attackcode = attack;
  }
}

// 회전을 고려하지 않은 함수 예제.
// checkCollision2(circleX, circleY, radius) {
//   let squareX = this.x;
//   let squareY = this.y;
//   let squareSide = this.width;

//   let closestX = Math.max(
//     squareX - squareSide / 2,
//     Math.min(circleX, squareX + squareSide / 2)
//   );

//   let closestY = Math.max(
//     squareY - squareSide / 2,
//     Math.min(circleY, squareY + squareSide / 2)
//   );

//   let dist = Player.distance(circleX, circleY, closestX, closestY);

//   console.log(circleX, circleY);

//   if (dist <= radius / 2) {
//     console.log("hit");
//     return true;
//   } else {
//     return false;
//   }
// }
