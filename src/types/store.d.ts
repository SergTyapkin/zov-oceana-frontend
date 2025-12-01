import { type Store as VuexStore } from 'vuex';
import App from '~/App.vue';
import { type Commit, type Dispatch } from 'vuex';
import { Goods, User } from '~/utils/models';

interface Store extends VuexStore<any> {
  $app: App;
  readonly state: any;
  dispatch: Dispatch;
  commit: Commit;
}

// declare my own store state
interface State {
  user: User;
  cart: Goods[];
  commit: (event: string, data?: any) => void;
  globals: Globals;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: Store;
    $user: User;
    $cart: Goods[];
    $globals: Globals;
  }
}
