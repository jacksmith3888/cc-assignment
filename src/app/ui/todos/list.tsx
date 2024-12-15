'use client'
import { useState, useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { Task } from '@/app/lib/actions'

export default function TodoList() {
  const storedTasks = localStorage.getItem('tasks')
  const [tasks, setTasks] = useState<Task[]>((storedTasks && JSON.parse(storedTasks)) || [])

  // when new task was created, update tasks to local storage
  // 新しいタスクが作成された時に、タスクをローカルストレージに更新する
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const deleteTask = (id: string) => {
    // filter out the selected task by id
    // 選択されたタスクをIDで外す
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    // if the task's id matches the selected task's id, toggle the completed state.Otherwise, return the task as is
    // タスクのIDが選択されたタスクのIDと一致する場合、完了状態を切り替えます
    // それ以外の場合は、タスクをそのまま返します
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)
  }

  return (
    <table className="min-w-full bg-white">
      <thead className="border-b border-gray-900">
        <tr>
          <th className="py-2">完了</th>
          <th className="py-2">タスク</th>
          <th className="py-2">状態</th>
          <th className="py-2">日付</th>
          <th className="py-2">ゴミ箱へ</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className={`border-b ${task.completed ? 'line-through text-gray-500' : ''}`}>
            <td className="py-2 text-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className="cursor-pointer"
              />
            </td>
            <td className="py-2 text-center">{task.title}</td>
            <td className="py-2 text-center">{task.completed ? '完了' : '未完了'}</td>
            <td className="py-2 text-center">{task.createdAt}</td>
            <td className="py-2 text-center">
              <button onClick={() => deleteTask(task.id)} className="text-red-500">
                <TrashIcon className="w-6 h-6" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
