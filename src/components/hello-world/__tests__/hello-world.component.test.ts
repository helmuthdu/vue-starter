import { shallowMount } from '@vue/test-utils';
import HelloWorld from '../hello-world.component.vue';

describe('HelloWorld component', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
