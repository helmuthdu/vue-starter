import { mount, VueWrapper } from '@vue/test-utils';
import HomeRoute from '../home.route.vue';

describe('Route -> Home', () => {
  global.URL.createObjectURL = jest.fn();
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(HomeRoute, {
      global: {
        mocks: { $t: (t: string) => t, $i18n: {} }
      }
    });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
