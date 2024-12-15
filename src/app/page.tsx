import TodoList from '@/app/ui/todos/list'
import TodoForm from '@/app/ui/todos/form'

export default function TodoApp() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">CrowdChem ToDo App</h1>
      <TodoForm />
      <TodoList />
    </div>
  )
}
