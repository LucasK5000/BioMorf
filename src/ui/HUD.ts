import Phaser from 'phaser';
import { TurnManager } from '../core/TurnManager';
import { GameState } from '../core/GameState';
import { events, GameEvents } from '../utils/events';

export class HUD extends Phaser.GameObjects.Container {
  logText!: Phaser.GameObjects.Text;
  turnText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, private turns: TurnManager, private state: GameState) {
    super(scene, 1040, 40);

    // Turn label
    this.turnText = scene.add.text(0, 0, '', { fontFamily: 'sans-serif', fontSize: '18px', color: '#a8dadc' });
    this.add(this.turnText);
    this.updateTurn();

    // End Turn button
    const btn = scene.add.image(0, 40, 'btn').setOrigin(0, 0).setInteractive({ useHandCursor: true });
    const label = scene.add.text(110, 66, 'End Turn', { fontFamily: 'sans-serif', fontSize: '18px', color: '#e9ecef' }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setTint(0x457b9d));
    btn.on('pointerout', () => btn.clearTint());
    btn.on('pointerdown', () => events.emit(GameEvents.EndTurn));
    this.add([btn, label]);

    // Log
    const logBg = scene.add.rectangle(-960, 560, 1200, 120, 0x000000, 0.25).setOrigin(0, 0);
    this.add(logBg);
    this.logText = scene.add.text(-950, 570, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#dcdcdc',
      wordWrap: { width: 1180 },
      lineSpacing: 4,
    });
    this.add(this.logText);

    events.on(GameEvents.Log, (msg: string) => this.pushLog(msg));
  }

  updateTurn() {
    this.turnText.setText(`Turn: ${this.turns.currentPlayer}`);
  }

  log(msg: string) {
    this.pushLog(msg);
  }

  private pushLog(msg: string) {
    const current = this.logText.text ? this.logText.text + '\n' : '';
    this.logText.setText(current + '• ' + msg);
  }

  destroy(fromScene?: boolean): void {
    events.off(GameEvents.Log);
    super.destroy(fromScene);
  }
}
