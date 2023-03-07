import { createPiece } from '@activepieces/framework';
import packageJson from '../package.json';
import { createCard } from './lib/actions/create-card';
import { getCard } from './lib/actions/get-card';
import { newCard } from './lib/triggers/new-card';

export const trello = createPiece({
  name: 'trello',
  displayName: 'trello',
  logoUrl: 'https://cdn.activepieces.com/pieces/trello.png',
  version: packageJson.version,
  authors: ['ShayPunter', 'Sabuto'],
  actions: [getCard, createCard],
  triggers: [newCard],
});