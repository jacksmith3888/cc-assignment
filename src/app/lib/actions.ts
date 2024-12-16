'use server'

import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export type State = {
  errors?: {
    title?: string[]
  }
  task?: Task | null
  message?: string | null
}

const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '新しいタスクを入力してください'),
  completed: z.boolean().default(false),
  createdAt: z.string(),
})

export type Task = z.infer<typeof TaskSchema>

const CreateTask = TaskSchema.omit({ id: true, createdAt: true })

export async function addTask(prevState: State, formData: FormData) {
  const validatedFields = CreateTask.safeParse({
    title: formData.get('task'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Task.',
    }
  }

  const { title, completed } = validatedFields.data
  const date = new Date().toLocaleString()
  const newTask = {
    id: uuidv4(),
    title: title,
    completed: completed,
    createdAt: date,
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      errors: undefined,
      message: null,
      task: newTask,
    }
  } catch (error) {
    console.log(error)
    return {
      message: 'Database Error: Failed to Create Task.',
    }
  }
}
