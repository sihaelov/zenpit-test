import { mount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

describe('Home.vue', () => {
  it('renders the correct markup', () => {
    const wrapper = mount(Home);
    expect(wrapper.contains('.device-list')).toBe(true);
    expect(wrapper.contains('button')).toBe(true);
    expect(wrapper.findAll('input').length).toBe(2);
  });
});
