import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async path => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  };

  const uploadAvatar = async event => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div aria-live='polite' className='w-full'>
      <img
        src={avatarUrl ? avatarUrl : `https://place-hold.it/${size}x${size}`}
        alt={avatarUrl ? 'Avatar' : 'No image'}
        style={{ height: size, width: size }}
        className='mx-auto rounded-full'
      />
      {uploading ? (
        'Uploading...'
      ) : (
        <>
          <label htmlFor='single' className='text-sm font-medium'>
            Upload an avatar
          </label>
          <div>
            <input
              type='file'
              id='single'
              accept='image/*'
              onChange={uploadAvatar}
              disabled={uploading}
              className='rounded-lg px-3 py-2 text-xs text-neutral-500 file:rounded-full file:border-0 file:bg-neutral-50 file:p-3 file:py-2 file:font-medium hover:file:bg-neutral-100'
            />
          </div>
        </>
      )}
    </div>
  );
}
