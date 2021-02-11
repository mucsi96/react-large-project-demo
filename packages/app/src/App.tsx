import React, { FC } from 'react';
import { FriendsList } from 'friends';
import './App.css';

const App: FC = () => <FriendsList fetch={fetch} />;

export default App;
