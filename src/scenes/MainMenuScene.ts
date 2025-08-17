import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 80, 'BioMorf Online', {
      fontFamily: 'sans-serif',
      fontSize: '48px',
      color: '#e9ecef',
    }).setOrigin(0.5);

    const play = this.add.image(width / 2, height / 2 + 10, 'btn').setInteractive({ useHandCursor: true });
    const label = this.add.text(play.x, play.y, 'Start Prototype', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#e9ecef',
    }).setOrigin(0.5);

    play.on('pointerover', () => play.setTint(0x2a9d8f));
    play.on('pointerout', () => play.clearTint());
    play.on('pointerdown', () => this.scene.start('Game'));
  }
}
