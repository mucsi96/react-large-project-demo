import { fetchJSON } from 'core';
import { FriendsResponse, Link } from './types';

export function getFriends(
  link: Link = { href: '/api/friends' }
): Promise<FriendsResponse> {
  return fetchJSON(link.href);
}
