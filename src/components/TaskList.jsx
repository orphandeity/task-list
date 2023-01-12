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
  const [taskListImage, setTaskListImage] = useState(null);

  useEffect(() => {
    getTasks();
    getProfile();
  }, [session]);

  useEffect(() => {
    if (avatar_url) getAvatar();
  }, [avatar_url]);

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

  async function getAvatar() {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(avatar_url);
      if (error) throw error;
      if (data) {
        const url = URL.createObjectURL(data);
        setTaskListImage(url);
      }
    } catch (error) {
      console.log('error downloading image: ', error.message);
    } finally {
      setLoading(false);
    }
  }

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
    'px-4 py-2 text-gray-700 flex-1 text-sm font-medium ui-selected:bg-gray-200 ui-not-selected:bg-gray-50 rounded-lg';

  return (
    <div className='mx-auto flex max-w-lg flex-col gap-8 rounded-lg border p-8'>
      <div className='flex items-center gap-2'>
        {taskListImage && (
          <img
            src={taskListImage}
            alt='Avatar'
            style={{ height: 75, width: 75 }}
            className='rounded-full'
          />
        )}
        <h2 className='text-5xl font-bold'>{username}'s Task List</h2>
      </div>
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
        <Tab.List className='flex items-center justify-between gap-2'>
          <Tab className={tabStyles}>All</Tab>
          <Tab className={tabStyles}>To Do</Tab>
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
