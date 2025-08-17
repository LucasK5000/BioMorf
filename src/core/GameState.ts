import { CreatureModel, createCreature } from '../entities/Creature';
import { BasicMap, basicMap } from '../data/maps/basicMap';
import { PlayerId } from '../utils/types';

export interface GameState {
  map: BasicMap;
  creatures: Map<string, CreatureModel>;
  players: PlayerId[];
}

export function createInitialState(cols: number, rows: number): GameState {
  const map = basicMap(cols, rows);
  const creatures = new Map<string, CreatureModel>();

  const p1a = createCreature('P1', 'Sentinel', { x: 1, y: Math.floor(rows / 2) }, 7, 2);
  const p2a = createCreature('P2', 'Ravager', { x: cols - 2, y: Math.floor(rows / 2) }, 7, 2);

  creatures.set(p1a.id, p1a);
  creatures.set(p2a.id, p2a);

  return {
    map,
    creatures,
    players: ['P1', 'P2'],
  };
}
