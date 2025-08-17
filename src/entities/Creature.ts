import { PlayerId, Point } from '../utils/types';

let nextId = 1;

export interface CreatureModel {
  id: string;
  owner: PlayerId;
  name: string;
  hp: number;
  atk: number;
  pos: Point;
  timeDamage: number; // counts down at end of owner's turn
}

export function createCreature(owner: PlayerId, name: string, pos: Point, hp = 5, atk = 2): CreatureModel {
  return {
    id: `C${nextId++}`,
    owner,
    name,
    hp,
    atk,
    pos: { ...pos },
    timeDamage: 0,
  };
}
