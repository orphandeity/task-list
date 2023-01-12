import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Task({ task, getTasks }) {
  const [isComplete, setIsComplete] = useState(task.is_complete);

  async function handleCompleteTask(id) {
    setIsComplete(!isComplete);
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !isComplete })
      .eq('id', id);
    getTasks();
  }

  async function handleDeleteTask(id) {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    console.log('task deleted');
    getTasks();
  }

  return (
    <li className='flex items-center justify-between rounded-lg py-2 px-4 shadow'>
      <div className='flex items-center gap-2'>
        <svg
          role='button'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={
            task.is_complete
              ? 'h-6 w-6 hover:text-red-500'
              : 'h-6 w-6 text-green-700 hover:text-green-500'
          }
          onClick={() => handleCompleteTask(task.id)}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M4.5 12.75l6 6 9-13.5'
          />
        </svg>

        <p className={task.is_complete ? 'line-through' : ''}>{task.task}</p>
      </div>
      <div className='flex items-center gap-2'>
        <svg
          role='button'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-6 w-6 hover:text-red-500'
          onClick={() => handleDeleteTask(task.id)}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
          />
        </svg>
      </div>
    </li>
  );
}
