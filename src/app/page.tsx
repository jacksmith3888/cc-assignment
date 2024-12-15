'use client'
import { useState, useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '新しいタスクを入力してください'),
  completed: z.boolean().default(false),
  createdAt: z.string(),
})

type Task = z.infer<typeof taskSchema>

export default function TODO() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskContent, setTaskContent] = useState('')
  const [error, setError] = useState<string>('')

  // read tasks from local storage when component is mounted
  // コンポーネントがマウントされたときにローカルストレージからタスクを読み込む
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // when new task was created, update tasks to local storage
  // 新しいタスクが作成された時に、タスクをローカルストレージに更新する
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const resetError = () => {
    if (error) setError('')
  }

  const addTask = () => {
    try {
      const newTask = taskSchema.parse({
        id: uuidv4(),
        title: taskContent,
        completed: false,
        createdAt: new Date().toLocaleString(),
      })
      setTasks([...tasks, newTask])
      setTaskContent('')
      resetError()
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors.map((err) => err.message).join(', '))
      }
    }
  }

  const deleteTask = (id: string) => {
    // filter out the selected task by id
    // 選択されたタスクをIDで外す
    setTasks(tasks.filter((task) => task.id !== id))
    resetError()
  }

  const toggleTaskCompletion = (id: string) => {
    // if the task's id matches the selected task's id, toggle the completed state.Otherwise, return the task as is
    // タスクのIDが選択されたタスクのIDと一致する場合、完了状態を切り替えます
    // それ以外の場合は、タスクをそのまま返します
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)
    resetError()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">CrowdChem ToDo App</h1>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          placeholder="新しいタスクを入力してください"
          className="border p-2 mr-2 w-1/2 border-gray-300 rounded-md"
        />
        <button onClick={addTask} className="text-white bg-blue-500 px-4 py-2 rounded-md">
          追加
        </button>
      </div>
      <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
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
    </div>
  )
}
