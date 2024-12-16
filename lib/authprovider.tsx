import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';


type Auth = {
  session: Session | null;
};

const UserAuthContext = createContext<Auth>({
   session: null
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    // const [user, setUser] = useState<Database['public']['Tables']['user']['Row'] | null>(null);

  useEffect(() => {
     supabase.auth.getSession().then( async ({ data: { session } }) => {
        setSession(session)   
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  }, [])
    
  return (
    <UserAuthContext.Provider value={{ session }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export const useAuth = () => useContext<Auth>(UserAuthContext);