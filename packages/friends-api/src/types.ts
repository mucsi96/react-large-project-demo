export type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
};

export type FriendsResponse = {
  _embedded: Friend[];
};
