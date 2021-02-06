import { mount, VueWrapper } from '@vue/test-utils';
import UserLayout from '../user.layout.vue';

describe('User/Layout', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(UserLayout);
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
