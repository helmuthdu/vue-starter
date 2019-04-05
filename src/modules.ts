import * as authModule from '@/modules/auth';
import * as homeModule from '@/modules/home';

export type State = authModule.State;

export const stores = [authModule.stores];
export const routes = [authModule.routes, homeModule.routes];