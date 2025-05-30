import React, { useState } from 'react';
import { ChevronRight, Plus, MoreHorizontal } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  color: string;
}

const initialTasks = {
  todo: [
    {
      id: 'task-1',
      title: 'Dashboard',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      color: 'border-red-500',
    },
    {
      id: 'task-2',
      title: 'New project',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      color: 'border-red-500',
    },
  ],
  inProgress: [
    {
      id: 'task-3',
      title: 'New Code Update',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      color: 'border-yellow-500',
    },
    {
      id: 'task-4',
      title: 'Meeting',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      color: 'border-yellow-500',
    },
  ],
  completed: [
    {
      id: 'task-5',
      title: 'Job title',
      description: 'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.',
      color: 'border-green-500',
    },
  ],
};

const TasksBoard: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Tasks Board</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="Todos"
            tasks={tasks.todo}
            color="text-red-500"
            columnKey="todo"
          />
          <TaskColumn
            title="In Progress"
            tasks={tasks.inProgress}
            color="text-yellow-500"
            columnKey="inProgress"
          />
          <TaskColumn
            title="Completed"
            tasks={tasks.completed}
            color="text-green-500"
            columnKey="completed"
          />
        </div>
      </div>
    </div>
  );
};

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  columnKey: string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks, color, columnKey }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-medium ${color}`}>{title}</h3>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${task.color}`}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-gray-800">{task.title}</h4>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">{task.description}</p>
          </div>
        ))}

        <button className="w-full flex items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TasksBoard;