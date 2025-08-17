import { GameState } from '../../core/GameState';
import { PlayerId } from '../../utils/types';
import { events, GameEvents } from '../../utils/events';

export function timeDamageTick(state: GameState, playerEndedTurn: PlayerId) {
  for (const c of state.creatures.values()) {
    if (c.owner !== playerEndedTurn) continue; // Damage applies at the end of the affected owner's turn
    if (c.timeDamage > 0 && c.hp > 0) {
      c.hp -= 1;
      c.timeDamage -= 1;
      events.emit(GameEvents.Log, `${c.name} takes 1 Time Damage (${c.hp} HP left).`);
      if (c.hp <= 0) {
        c.hp = 0;
        events.emit(GameEvents.Log, `${c.name} succumbs to Time Damage.`);
      }
    }
  }
}
