// Placeholder card data structure for future expansion.
export interface CardDef {
  id: string;
  name: string;
  cost: number;
  text: string;
  // Effects would be defined here later
}

export const starterCards: CardDef[] = [
  { id: 'TD-001', name: 'Temporal Needle', cost: 1, text: 'Deal 1 damage and apply Time Damage +1.' },
];
