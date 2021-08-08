import React, { FC } from 'react';
import { FriendsList } from 'friends';
import { fetchJSON } from 'core';

import './App.css';

const App: FC = () => <FriendsList callApi={fetchJSON} />;

export default App;
