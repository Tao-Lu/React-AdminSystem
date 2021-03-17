import store from 'store';

const USER_KEY = 'user_key';

export default {
  // save a user
  saveUser(user) {
    store.set(USER_KEY, user);
  },
  // get a user
  getUser() {
    return store.get(USER_KEY) || {};
  },
  // remove a user
  removeUser() {
    store.remove(USER_KEY);
  },
};
