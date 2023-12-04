class System {
  constructor({ pg }) {
    this.pg = pg;
    this.inkAreaRatio = 0;
  }

  static isColorMatch(r1, g1, b1, a1, r2, g2, b2, a2, threshold) {
    return (
      Math.abs(r1 - r2) <= threshold &&
      Math.abs(g1 - g2) <= threshold &&
      Math.abs(b1 - b2) <= threshold &&
      Math.abs(a1 - a2) <= threshold
    );
  }

  calculateInkAreaRatio() {
    console.log("calculateInkAreaRatio");
    pg.loadPixels();

    let totalPixels = pg.pixels.length / 4;
    let inkedPixels = 0;

    for (let i = 0; i < pg.pixels.length; i += 4) {
      let r = pg.pixels[i];
      let g = pg.pixels[i + 1];
      let b = pg.pixels[i + 2];
      let a = pg.pixels[i + 3];

      // 특정 색상 (rgb(255,78,202))이면 inkedPixels를 증가
      if (System.isColorMatch(r, g, b, a, 255, 78, 202, 255, 100)) {
        inkedPixels++;
      }
    }
    pg.updatePixels();

    // inkAreaRatio를 100이 넘지 않도록 조정
    inkAreaRatio = min((inkedPixels / totalPixels) * 100, 100);

    // inkAreaRatio를 0 미만으로 되지 않도록 조정
    inkAreaRatio = max(inkAreaRatio, 0);

    this.inkAreaRatio = inkAreaRatio;
  }
}
