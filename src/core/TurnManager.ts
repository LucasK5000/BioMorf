import { GameState } from './GameState';
import { PlayerId } from '../utils/types';

export class TurnManager {
  private idx = 0;
  constructor(private state: GameState) {}

  get currentPlayer(): PlayerId {
    return this.state.players[this.idx]!;
  }

  next() {
    this.idx = (this.idx + 1) % this.state.players.length;
  }
}
