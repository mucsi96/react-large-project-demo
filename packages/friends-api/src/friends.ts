import { fetchJSON } from 'core';
import { Friend } from './types';

export function getFriends(): Promise<Friend[]> {
  return fetchJSON('/api/friends');
}
