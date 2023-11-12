import { autorun, set, toJS } from "mobx";

export function autoSave(_this: any, name: string) {
  const storedJson = localStorage.getItem(name);
  if (storedJson) {
    set(_this, JSON.parse(storedJson));
  }
  autorun(() => {
    // make sure not to store the root in localstorage
    const value = toJS(_this);
    delete value.root;

    localStorage.setItem(name, JSON.stringify(value));
  });
}
