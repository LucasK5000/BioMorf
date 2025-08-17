import { GameState } from '../core/GameState';
import { CreatureModel } from '../entities/Creature';
import { events, GameEvents } from '../utils/events';

export function resolveAttack(state: GameState, attacker: CreatureModel, defender: CreatureModel) {
  if (attacker.hp <= 0 || defender.hp <= 0) return;

  defender.hp -= attacker.atk;
  if (defender.hp <= 0) {
    defender.hp = 0;
    events.emit(GameEvents.Log, `${defender.name} is defeated!`);
  }

  // Example: apply 1 stack of Time Damage to defender
  defender.timeDamage = Math.min(defender.timeDamage + 1, 3);
  events.emit(GameEvents.Log, `${defender.name} gains Time Damage (now ${defender.timeDamage}).`);
}
