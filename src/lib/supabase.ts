import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spbszwdlcedeanvpsmpa.supabase.co';
const supabaseKey = 'sb_publishable_PUr7qZ5OhSgsLNcZ6WLlgQ_Z1XPpN_m';

let clientPromise: Promise<SupabaseClient> | null = null;

function getClient(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(supabaseUrl, supabaseKey)
    );
  }
  return clientPromise;
}

function createQueryChain(calls: Array<{ prop: string; args: unknown[] }>): any {
  return new Proxy(
    {},
    {
      get(_target, prop: string) {
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          const promise = getClient().then((client) => {
            let cur: any = client;
            for (const c of calls) {
              cur = cur[c.prop](...c.args);
            }
            return cur;
          });
          return (promise as any)[prop].bind(promise);
        }
        return (...args: unknown[]) => createQueryChain([...calls, { prop, args }]);
      },
    }
  );
}

export const supabase: SupabaseClient = {
  from: (table: string) => createQueryChain([{ prop: 'from', args: [table] }]),
  rpc: (fn: string, args?: unknown, options?: unknown) =>
    createQueryChain([{ prop: 'rpc', args: [fn, args, options] }]),
  functions: {
    invoke: (fnName: string, options?: any) =>
      getClient().then((c) => c.functions.invoke(fnName, options)),
  },
  auth: {
    getSession: () => getClient().then((c) => c.auth.getSession()),
    signInWithPassword: (credentials: any) =>
      getClient().then((c) => c.auth.signInWithPassword(credentials)),
    signOut: () => getClient().then((c) => c.auth.signOut()),
    onAuthStateChange: (callback: any) => {
      let realSub: { unsubscribe: () => void } | null = null;
      let cancelled = false;
      getClient().then((c) => {
        if (cancelled) return;
        const { data } = c.auth.onAuthStateChange(callback);
        realSub = data.subscription;
      });
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              cancelled = true;
              realSub?.unsubscribe();
            },
          },
        },
      };
    },
  },
} as unknown as SupabaseClient;
