import { fetchJSON } from 'core';

export type Friend = {
  firstName: string;
  lastName: string;
};

export async function getFriends(): Promise<Friend[]> {
  return await fetchJSON<Friend[]>('/api/friends');
}
