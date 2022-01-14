class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("bg", "assets/sprites/background.png");
    this.load.image("card", "assets/sprites/card.png");

    config.cards.map((id) =>
      this.load.image("card" + id, `assets/sprites/card${id}.png`)
    );

    config.sounds.map((sound) =>
      this.load.audio(sound, `assets/sounds/${sound}.mp3`)
    );
  }

  createText() {
    this.timeoutText = this.add.text(10, 330, "", {
      font: "36px CurseCasual",
      fill: "#fff",
    });
  }

  create() {
    this.createSounds();
    this.createTimer();
    this.createBackground();
    this.createText();
    this.createCards();
    this.start();
  }

  restart() {
    let count = 0;
    const onCardMoveComplete = () => {
      ++count;
      if (count >= this.cards.length) {
        this.start();
      }
    };
    this.cards.forEach((card) =>
      card.move({
        x: this.sys.game.config.width + card.width,
        y: this.sys.game.config.height + card.height,
        delay: card.position.delay,
        callback: onCardMoveComplete,
      })
    );
  }

  start() {
    this.initCardsPositions();
    this.timeout = config.timeout;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.timer.paused = false;
    this.initCards();
    this.showCards();
  }

  initCards() {
    const cardPositions = this.cardPositions;
    this.cards.forEach((card) => {
      card.init(cardPositions.pop());
    });
  }

  showCards() {
    this.cards.forEach((card) => {
      card.depth = card.position.delay;
      card.move({
        x: card.position.x,
        y: card.position.y,
        delay: card.position.delay,
      });
    });
  }

  onTimerTick() {
    this.timeoutText.setText(`Time: ${this.timeout}`);

    if (this.timeout <= 0) {
      this.timer.paused = true;
      this.restart();
      this.sounds.timeout.play();
    } else {
      this.timeout--;
    }
  }

  createSounds() {
    this.sounds = {};
    config.sounds.map((sound) => (this.sounds[sound] = this.sound.add(sound)));
    this.sounds.theme.play({
      volume: 0.1,
    });
  }

  createTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  }

  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }

  createCards() {
    this.cards = [];
    this.initCards();

    for (let value of config.cards) {
      for (let j = 0; j < 2; j++) {
        this.cards.push(new Card(this, value));
      }
    }

    this.input.on("gameobjectdown", this.onCardClicked, this);
  }

  onCardClicked(pointer, card) {
    if (card.opened) {
      return false;
    }

    if (this.openedCard) {
      //открытая карта
      if (this.openedCard.value === card.value) {
        //запомнить
        this.openedCard = null;
        this.openedCardsCount++;
        this.sounds.success.play();
      } else {
        this.openedCard.close();
        this.openedCard = card;
        //скрыть
      }
    } else {
      this.openedCard = card;
    }

    this.sounds.card.play();
    card.open(() => {
      if (this.openedCardsCount === this.cards.length / 2) {
        this.sounds.complete.play();
        this.restart();
      }
    });
  }

  initCardsPositions() {
    const positions = [];
    const cardTexture = this.textures.get("card").getSourceImage();
    const cardWidth = cardTexture.width + 4;
    const cardHeight = cardTexture.height + 4;
    const offsetX =
      (this.sys.game.config.width - config.cols * cardWidth) / 2 +
      cardWidth / 2;
    const offsetY =
      (this.sys.game.config.height - config.rows * cardHeight) / 2 +
      cardHeight / 2;

    let id = 0;

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
          delay: ++id * 100,
        });
      }
    }

    this.cardPositions = Phaser.Utils.Array.Shuffle(positions);
  }
}
