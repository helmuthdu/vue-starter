import { mount } from '@vue/test-utils';
import HelloWorld from '../hello-world.component.vue';

describe('HelloWorld component', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = mount(HelloWorld, {
      props: { msg }
    });
    expect(wrapper.html()).toContain(msg);
  });
});
