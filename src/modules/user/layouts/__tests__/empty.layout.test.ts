import { State } from '@/modules/user/stores/modules/user';
import { mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';
import EmptyLayout from '../empty.layout.vue';

describe('User/Layout -> Empty', () => {
  let store: Store<State>;
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(EmptyLayout, { global: { plugins: [store] } });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
