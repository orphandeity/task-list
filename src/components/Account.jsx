import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Dialog } from '@headlessui/react';
import Avatar from './Avatar';

const Account = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className='fixed inset-0 bg-neutral-900/90' aria-hidden='true' />

        {/* Full-screen container to center the panel */}
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          {/* user profile modal */}
          <Dialog.Panel
            aria-live='polite'
            className='flex flex-col gap-8 rounded-lg border bg-white px-16 py-8'
          >
            <Dialog.Title className='text-xl font-bold'>
              User Profile
            </Dialog.Title>
            {loading ? (
              'Saving ...'
            ) : (
              <form onSubmit={updateProfile} className='flex flex-col gap-4'>
                {/* upload image */}

                <Avatar
                  url={avatar_url}
                  size={150}
                  onUpload={url => {
                    setAvatarUrl(url);
                    updateProfile({ username, website, avatar_url: url });
                  }}
                />

                {/* email */}

                <div>
                  <label htmlFor='email' className='text-sm font-semibold'>
                    Email
                  </label>
                  <input
                    id='email'
                    type='text'
                    value={session.user.email}
                    className='w-full rounded-lg border-neutral-700'
                    disabled
                  />
                </div>

                {/* name */}

                <div>
                  <label htmlFor='username' className='text-sm font-semibold'>
                    Name
                  </label>
                  <input
                    id='username'
                    type='text'
                    value={username || ''}
                    onChange={e => setUsername(e.target.value)}
                    className='w-full rounded-lg border-neutral-700'
                  />
                </div>

                {/* website */}

                <div>
                  <label htmlFor='website' className='text-sm font-semibold'>
                    Website
                  </label>
                  <input
                    id='website'
                    type='url'
                    value={website || ''}
                    onChange={e => setWebsite(e.target.value)}
                    className='w-full rounded-lg border-neutral-700'
                  />
                </div>

                {/* update button */}

                <div>
                  <button
                    className='w-full rounded-lg bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100'
                    disabled={loading}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            )}

            {/* action buttons */}

            <div className='flex justify-center gap-2'>
              <button
                className='flex-1 rounded-lg bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100'
                type='button'
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </button>
              <button
                className='flex-1 rounded-lg bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100'
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <svg
        role='button'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='m-2 h-6 w-6 hover:text-neutral-500'
        onClick={() => setIsOpen(true)}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
        />
      </svg>
    </>
  );
};

export default Account;
