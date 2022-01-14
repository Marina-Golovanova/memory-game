class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, value) {
    super(scene, 0, 0, "card");
    this.scene = scene;
    this.value = value;
    this.scene.add.existing(this);
    this.opened = false;
    this.setInteractive();
  }

  init(position) {
    this.position = position;
    this.close();
    this.setPosition(-this.width, -this.height);
  }

  flip(callback) {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Liner",
      duration: 300,
      onComplete: () => {
        this.show(callback);
      },
    });
  }

  show(callback) {
    const texture = this.opened ? `card${this.value}` : "card";
    this.setTexture(texture);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: "Liner",
      duration: 300,
      onComplete: () => {
        if (callback) {
          callback();
        }
      },
    });
  }

  open(callback) {
    this.opened = true;
    this.flip(callback);
  }

  move(params) {
    this.scene.tweens.add({
      targets: this,
      ease: "Liner",
      x: params.x,
      y: params.y,
      delay: params.delay,
      duration: 250,
      onComplete: () => {
        if (params.callback) {
          params.callback();
        }
      },
    });
  }

  close() {
    if (this.opened) {
      this.opened = false;
      this.flip();
    }
  }
}
