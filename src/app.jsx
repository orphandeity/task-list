import './style.css';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Auth from './components/Auth';
import Account from './components/Account';
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
            <Account key={session.user.id} session={session} />
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
