class Attacker extends Player {
  constructor(args) {
    super(args);
    this.deg = PI / 2;
  }

  static attackInterval = 120;

  rangeUp(value) {
    // Attacker.attackInterval -= value;
  }

  attack() {
    // if (keyIsDown(this.attackcode)) {
    push();

    if (!this.isAttacked) {
      let correction = random(-0.3, 0.3);

      this.bullets.push(
        new Bullet(this.x, this.y, this.deg + correction, this.color)
      );
      this.isAttacked = true;
      setTimeout(() => {
        this.isAttacked = false;
      }, Attacker.attackInterval);
    }

    pop();
    // }
  }
}
