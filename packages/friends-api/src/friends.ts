export type Friend = {
  firstName: string;
  lastName: string;
};

export async function getFriends(): Promise<Friend[]> {
  console.log('fetching friends....');
  const response = await window.fetch('/api/friends');

  if (!response.ok) {
    throw new Error('Failed to load friends');
  }

  return (await response.json()) as Friend[];
}
