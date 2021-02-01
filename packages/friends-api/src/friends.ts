import { fetchJSON } from 'core';

export type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
};

export async function getFriends(): Promise<Friend[]> {
  return await fetchJSON<Friend[]>('/api/friends');
}
