const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scene: new GameScene(),
  rows: 2,
  cols: 5,
  cards: [1, 2, 3, 4, 5],
  timeout: 30,
  sounds: ["card", "complete", "success", "theme", "timeout"],
};

const game = new Phaser.Game(config);
