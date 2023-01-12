import './style.css';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Auth from './Auth';
import Account from './Account';
import TaskList from './components/TaskList';

export default function App() {
  const [session, setSession] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    getTasks();
  }, []);

  async function getTasks() {
    const { data, error } = await supabase
      .from('todos')
      .select('id, task, is_complete');

    setTaskList(data);
  }

  async function handleAddTask(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('todos')
      .insert([{ user_id: session.user.id, task: newTask }]);
    setNewTask('');
    getTasks();
  }

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        // <Account key={session.user.id} session={session} />
        <>
          <header className='flex justify-end'>
            <svg
              role='button'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='m-2 h-6 w-6 hover:text-gray-500'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </header>
          <div className='mx-auto flex max-w-lg flex-col gap-8 rounded-lg border p-8'>
            <h2 className='text-5xl font-bold'>Task List</h2>
            <form className='flex items-center gap-2' onSubmit={handleAddTask}>
              <input
                type='text'
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                className='flex-1 rounded-lg border-2 border-gray-100'
              />
              <button
                type='submit'
                className='rounded-lg bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100'
              >
                add
              </button>
            </form>
            <TaskList taskList={taskList} />
          </div>
        </>
      )}
    </div>
  );
}
