// TOAST Message Component. Copied from: https://github.com/zerodevx/svelte-toast
// Copyright (c) 2021, Jason Lee <jason@zerodevx.com>

import { writable } from "svelte/store";

const createToast = () => {
  const { subscribe, update } = writable([]);
  let count = 0;
  let defaults: any = {};
  const push = (msg, opts: any = {}) => {
    const entry = {
      id: ++count,
      msg: msg,
      ...defaults,
      ...opts,
      theme: { ...defaults.theme, ...opts.theme },
    };
    update((n) => (entry.reversed ? [...n, entry] : [entry, ...n]));
    return count;
  };
  const pop = (id) => {
    update((n) => (id ? n.filter((i) => i.id !== id) : n.splice(1)));
  };
  const set = (id, obj) => {
    update((n) => {
      const idx = n.findIndex((i) => i.id === id);
      if (idx > -1) {
        n[idx] = { ...n[idx], ...obj };
      }
      return n;
    });
  };
  const _opts = (obj: any = {}) => {
    defaults = {
      ...defaults,
      ...obj,
      theme: { ...defaults.theme, ...obj.theme },
    };
    return defaults;
  };
  return { subscribe, push, pop, set, _opts };
};

export const toast = createToast();
