import './style.css';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Auth from './components/Auth';
import Account from './components/Account';
import TaskList from './components/TaskList';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        // <Account key={session.user.id} session={session} />
        <>
          <header className='flex justify-end'>
            <Account key={session.user.id} session={session} />
          </header>
          <TaskList session={session} />
        </>
      )}
    </div>
  );
}
