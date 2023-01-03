import i18n from '@/locales';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import HomeRoute from '../home.route.vue';

describe('Route -> Home', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(HomeRoute, { global: { plugins: [i18n] } });
  });

  it('should renders with props', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
