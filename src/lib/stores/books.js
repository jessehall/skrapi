import { skrapi } from '$lib/utils';
import { writable } from 'svelte/store';

export const books = {
  ...writable({
    data: []
  }),

  async load() {
    const res = await skrapi.get('books');
    if (res?.data) {
      this.update(current => ({ ...current, data: res?.data || [] }));
    }
  },

  async post(book) {
    const res = await skrapi.post('books', book);
    return res?.data;
  },

  async get(id) {
    const res = await skrapi.get('books/' + id);
    return res?.data;
  },

  async patch(id, props) {
    const res = await skrapi.patch('books/' + id, props);
    return res?.data;
  },

  async delete(id) {
    const res = await skrapi.delete('books/' + id);
    return res?.data;
  }
};
