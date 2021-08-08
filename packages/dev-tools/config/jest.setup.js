import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { clearMockDB, clearMockSwitches } from 'mock-api';

configure({ adapter: new Adapter() });

beforeEach(() => {
  clearMockDB();
  clearMockSwitches();
});
