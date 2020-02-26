import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vuex, { Store } from 'vuex';
import { State, UserActionTypes } from '../../../stores/modules/user';
import SignInRoute from '../sign-in.route.vue';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Vuetify);

describe('Auth/Route -> SignIn', () => {
  let store: Store<State>;
  let wrapper: Wrapper<SignInRoute>;

  beforeEach(() => {
    store = new Vuex.Store({
      actions: {
        [UserActionTypes.LOGIN]: jest.fn()
      }
    });
    wrapper = shallowMount(SignInRoute, {
      store,
      localVue
    });
  });

  it('should renders with props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});