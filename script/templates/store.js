import { skrapi } from '$lib/utils';
import { writable } from 'svelte/store';

export const $ROUTE = {
  ...writable({
    data: []
  }),

  async load() {
    const res = await skrapi.get('$ROUTE');
    if (res?.data) {
      this.update(current => ({ ...current, data: res?.data || [] }));
    }
  },

  async post($INSTANCE) {
    const res = await skrapi.post('$ROUTE', $INSTANCE);
    return res?.data;
  },

  async get(id) {
    const res = await skrapi.get('$ROUTE/' + id);
    return res?.data;
  },

  async patch(id, props) {
    const res = await skrapi.patch('$ROUTE/' + id, props);
    return res?.data;
  },

  async delete(id) {
    const res = await skrapi.delete('$ROUTE/' + id);
    return res?.data;
  }
};
