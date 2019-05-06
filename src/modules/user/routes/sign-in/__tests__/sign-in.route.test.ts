import SignInRoute from '@/modules/auth/routes/sign-in/sign-in.route.vue';
import { UserActionTypes, State } from '../../../stores/modules/user';
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';

const localVue = createLocalVue();

localVue.use(Vuex);
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
