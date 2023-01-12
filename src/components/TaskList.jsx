import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import Task from './Task';

export default function TaskList({ session }) {
  const [taskList, setTaskList] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getTasks();
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

  async function getTasks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('id, task, is_complete')
        .order('id', { ascending: false });
      if (data) {
        setTaskList(data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    const { error } = await supabase
      .from('todos')
      .insert([{ user_id: session.user.id, task: newTask }]);
    setNewTask('');
    getTasks();
  }

  const tabStyles =
    'px-4 py-2 text-white text-sm font-medium ui-selected:bg-blue-300 ui-not-selected:bg-gray-300 rounded-full';

  return (
    <div className='mx-auto flex max-w-lg flex-col gap-8 rounded-lg border p-8'>
      <h2 className='text-5xl font-bold'>{username}'s Todo List</h2>
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
      <Tab.Group>
        <Tab.List className='flex items-center justify-around'>
          <Tab className={tabStyles}>All Tasks</Tab>
          <Tab className={tabStyles}>Incomplete</Tab>
          <Tab className={tabStyles}>Completed</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ul className='flex flex-col gap-2'>
              {taskList?.map(task => (
                <Task key={task.id} task={task} getTasks={getTasks} />
              ))}
            </ul>
          </Tab.Panel>
          <Tab.Panel>
            <ul className='flex flex-col gap-2'>
              {taskList
                .filter(task => !task.is_complete)
                .map(task => (
                  <Task key={task.id} task={task} getTasks={getTasks} />
                ))}
            </ul>
          </Tab.Panel>
          <Tab.Panel>
            <ul className='flex flex-col gap-2'>
              {taskList
                .filter(task => task.is_complete)
                .map(task => (
                  <Task key={task.id} task={task} getTasks={getTasks} />
                ))}
            </ul>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
