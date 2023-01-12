import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Task({ task }) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    async function updateTask() {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: isComplete })
        .eq('id', task.id);
    }
    updateTask();
  }, [isComplete]);

  return (
    <li className='flex items-center justify-between rounded-lg py-2 px-4 shadow'>
      <p className={isComplete ? 'line-through' : ''}>{task.task}</p>
      <input type='checkbox' onChange={() => setIsComplete(!isComplete)} />
    </li>
  );
}
