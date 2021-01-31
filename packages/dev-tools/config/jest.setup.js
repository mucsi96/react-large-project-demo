import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { enableNodeMockApi } from 'dev-tools';

configure({ adapter: new Adapter() });
enableNodeMockApi();
