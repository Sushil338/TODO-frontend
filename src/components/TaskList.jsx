import TaskItem from "./TaskItem";

function TaskList({ tasks, deleteTask, updateTask, toggleComplete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="mt-4 text-center text-gray-400">
        No tasks found
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          updateTask={updateTask}
          toggleComplete={toggleComplete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
