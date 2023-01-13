import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div
        aria-live='polite'
        className='flex max-w-sm flex-col gap-8 rounded-lg border bg-white px-8 py-4 shadow-lg'
      >
        <h1 className='text-3xl font-bold'>Task List</h1>
        <p>Sign in via magic link with your email below</p>
        {loading ? (
          'Sending magic link...'
        ) : (
          <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <div>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <input
                id='email'
                type='email'
                placeholder='Your email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='block w-full rounded-lg border-neutral-300 shadow-sm'
              />
            </div>
            <button
              aria-live='polite'
              className='w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50'
            >
              Send magic link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
