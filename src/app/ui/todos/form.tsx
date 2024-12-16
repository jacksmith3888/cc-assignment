'use client'
import { useActionState, useEffect } from 'react'
import { addTask, State } from '@/app/lib/actions'
import { redirect } from 'next/navigation'

export default function TodoForm() {
  const initialState: State = { message: null, errors: {}, task: null }
  const [state, formAction] = useActionState(addTask, initialState)

  useEffect(() => {
    if (state.task) {
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        localStorage.setItem('tasks', JSON.stringify([...JSON.parse(storedTasks), state.task]))
      } else {
        localStorage.setItem('tasks', JSON.stringify([state.task]))
      }
      redirect('/')
    }
  }, [state])

  return (
    <form className="mb-4 flex-col" action={formAction}>
      <div className="flex justify-center">
        <input
          id="task"
          name="task"
          type="text"
          placeholder="新しいタスクを入力してください"
          className="border p-2 mr-2 w-1/2 border-gray-300 rounded-md"
          aria-describedby="task-error"
        />
        <button type="submit" className="text-white bg-blue-500 px-4 py-2 rounded-md">
          追加
        </button>
      </div>
      <div id="customer-error" aria-live="polite" aria-atomic="true">
        {state.errors?.title &&
          state.errors.title.map((error: string) => (
            <p className="mt-2 text-sm text-red-500 text-center" key={error}>
              {error}
            </p>
          ))}
      </div>
    </form>
  )
}
