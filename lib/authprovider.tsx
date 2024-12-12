import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';
import { Database } from '@/database.types';

type Auth = {
  user: any;
  session: Session | null;
};

const UserAuthContext = createContext<Auth>({
   user: '',
   session: null
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<Database['public']['Tables']['user']['Row'] | null>(null);

  useEffect(() => {
     supabase.auth.getSession().then( async ({ data: { session } }) => {
        setSession(session)   
       
        if (session) {
          const { data, error } = await supabase
            .from("user")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            throw new Error(error.message);
          }

          if (data) {
            setUser(data);
          }
        }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
  }, [])
    
  return (
    <UserAuthContext.Provider value={{ session, user }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export const useAuth = () => useContext<Auth>(UserAuthContext);