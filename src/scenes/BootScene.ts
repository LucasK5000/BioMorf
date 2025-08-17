import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Generate simple placeholder textures for tokens and UI.
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Blue token
    g.fillStyle(0x4cc9f0, 1);
    g.fillCircle(24, 24, 24);
    g.lineStyle(2, 0x1b3a4b, 1);
    g.strokeCircle(24, 24, 24);
    g.generateTexture('token_blue', 48, 48);
    g.clear();

    // Red token
    g.fillStyle(0xf94144, 1);
    g.fillCircle(24, 24, 24);
    g.lineStyle(2, 0x7f1d1d, 1);
    g.strokeCircle(24, 24, 24);
    g.generateTexture('token_red', 48, 48);
    g.clear();

    // Button
    g.fillStyle(0x222222, 1);
    g.fillRoundedRect(0, 0, 220, 52, 10);
    g.lineStyle(2, 0xffffff, 0.2);
    g.strokeRoundedRect(0, 0, 220, 52, 10);
    g.generateTexture('btn', 220, 52);
    g.destroy();
  }

  create() {
    this.scene.start('MainMenu');
  }
}
