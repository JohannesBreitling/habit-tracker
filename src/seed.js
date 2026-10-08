import exampleHabits from './assets/example_habits.json'

export function seedExampleData() {
  localStorage.removeItem('habits')
  localStorage.setItem('habits', JSON.stringify(exampleHabits))
}
