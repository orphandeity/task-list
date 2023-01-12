import Task from './Task';

export default function TaskList({ taskList }) {
  return (
    <ul className='flex flex-col gap-2'>
      {taskList?.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </ul>
  );
}
