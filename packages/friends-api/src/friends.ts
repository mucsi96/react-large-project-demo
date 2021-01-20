export type Friend = {
  firstName: string;
  lastName: string;
};

export async function getFriends(): Promise<Friend[]> {
  const response = await window.fetch('/friends');
  return (await response.json()) as Friend[];
}
