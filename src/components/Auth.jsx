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
        className='flex max-w-sm flex-col gap-8 rounded-lg border px-8 py-4'
      >
        <h1 className='text-xl font-bold'>Supabase + React</h1>
        <p>Sign in via magic link with your email below</p>
        {loading ? (
          'Sending magic link...'
        ) : (
          <form onSubmit={handleLogin} className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <label htmlFor='email' className='font-semibold'>
                Email
              </label>
              <input
                id='email'
                type='email'
                placeholder='Your email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full rounded-full border-2 border-gray-50 px-4 py-2 text-sm'
              />
            </div>
            <button
              aria-live='polite'
              className='w-full rounded-full bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100'
            >
              Send magic link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
