import Phaser from 'phaser';
import { createInitialState, GameState } from '../core/GameState';
import { TurnManager } from '../core/TurnManager';
import { gridToWorld, drawGrid } from '../utils/grid';
import { CreatureModel } from '../entities/Creature';
import { resolveAttack } from '../systems/CombatSystem';
import { timeDamageTick } from '../systems/status/TimeDamage';
import { events, GameEvents } from '../utils/events';
import { HUD } from '../ui/HUD';

const BOARD_COLS = 8;
const BOARD_ROWS = 5;
const TILE_SIZE = 96;

export default class GameScene extends Phaser.Scene {
  state!: GameState;
  turns!: TurnManager;
  hud!: HUD;

  selected: CreatureModel | null = null;
  tokenMap = new Map<string, Phaser.GameObjects.Image>();

  constructor() {
    super('Game');
  }

  create() {
    // Board
    drawGrid(this, BOARD_COLS, BOARD_ROWS, TILE_SIZE, 80, 80);

    // State + turns
    this.state = createInitialState(BOARD_COLS, BOARD_ROWS);
    this.turns = new TurnManager(this.state);

    // Spawn tokens
    this.spawnTokens();

    // HUD
    this.hud = new HUD(this, this.turns, this.state);
    this.add.existing(this.hud);

    // Interactions
    this.input.on('gameobjectdown', (_, obj: Phaser.GameObjects.GameObject) => {
      const id = (obj as any).getData('id') as string | undefined;
      if (!id) return;
      const creature = this.state.creatures.get(id);
      if (!creature) return;

      if (!this.selected) {
        // Select only if it's your creature
        if (creature.owner === this.turns.currentPlayer) {
          this.select(creature);
        }
      } else if (this.selected.id === creature.id) {
        this.deselect();
      } else {
        // If target is enemy and adjacent, attempt attack
        if (creature.owner !== this.turns.currentPlayer && this.isAdjacent(this.selected, creature)) {
          resolveAttack(this.state, this.selected, creature);
          this.refreshTokens();
          events.emit(GameEvents.Log, `${this.selected.name} hits ${creature.name}!`);
          // Auto-deselect after attack
          this.deselect();
        } else {
          // Switch selection if clicked own creature
          if (creature.owner === this.turns.currentPlayer) this.select(creature);
        }
      }
    });

    // End Turn
    events.on(GameEvents.EndTurn, () => {
      // Status effects
      timeDamageTick(this.state, this.turns.currentPlayer);
      // Next player
      this.turns.next();
      this.hud.updateTurn();
      this.refreshTokens();
    });

    events.on(GameEvents.Log, (msg: string) => this.hud.log(msg));
  }

  spawnTokens() {
    // Create a token sprite for each creature
    for (const c of this.state.creatures.values()) {
      const tex = c.owner === 'P1' ? 'token_blue' : 'token_red';
      const pos = gridToWorld(c.pos.x, c.pos.y, TILE_SIZE, 80, 80);
      const img = this.add.image(pos.x, pos.y, tex).setInteractive({ useHandCursor: true });
      img.setData('id', c.id);
      this.tokenMap.set(c.id, img);
    }
  }

  refreshTokens() {
    // Update positions and remove dead
    for (const [id, img] of this.tokenMap.entries()) {
      const c = this.state.creatures.get(id);
      if (!c || c.hp <= 0) {
        img.destroy();
        this.tokenMap.delete(id);
        if (c) this.state.creatures.delete(id);
        continue;
      }
      const pos = gridToWorld(c.pos.x, c.pos.y, TILE_SIZE, 80, 80);
      img.setPosition(pos.x, pos.y);
      img.clearTint();
    }
  }

  select(c: CreatureModel) {
    this.deselect();
    this.selected = c;
    const img = this.tokenMap.get(c.id);
    img?.setTint(0xffff99);
  }

  deselect() {
    if (this.selected) {
      const img = this.tokenMap.get(this.selected.id);
      img?.clearTint();
    }
    this.selected = null;
  }

  isAdjacent(a: CreatureModel, b: CreatureModel) {
    const dx = Math.abs(a.pos.x - b.pos.x);
    const dy = Math.abs(a.pos.y - b.pos.y);
    return dx + dy === 1;
  }
}
