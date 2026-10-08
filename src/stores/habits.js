import { defineStore } from 'pinia'


let isSameDate = (a, b) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: JSON.parse(localStorage.getItem('habits') || '[]')
  }),
  actions: {
    create_habit(id, name, rythm, color, start) {
      console.log(id, name, rythm, color, start)

      this.habits.push({id, name, rythm, color, start, checked: []})
    },

    update_habit(id, name, rythm, color, start) {
      let other_habits = this.habits.filter((h) => { return id != h.id })
      let this_habit = this.habits.filter((h) => { return id == h.id })

      // TODO: Keep the original sorting

      console.log(id)

      if (this_habit.length == 0) {
        alert("Habit not found")
        return
      }

      this_habit[0].name = name
      this_habit[0].rythm = rythm
      this_habit[0].color = color
      this_habit[0].start = start

      this.habits = other_habits
      this.habits.push(this_habit[0])
    },

    delete_habit(id) {
      this.habits = this.habits.filter((h) => { return id != h.id })
      console.log(this.habits)
    },

    complete_habit(id) {
      if (!this.check_complete(id)) {
        return
      }

      let other_habits = this.habits.filter((h) => { return id != h.id })
      let this_habit = this.habits.filter((h) => { return id == h.id })[0]

      this_habit.checked.push(new Date())
      this.habits = other_habits
      this.habits.push(this_habit)
    },

    check_complete(id) {
      let next = this.next_completion(id)
      let today = new Date()
      return isSameDate(today, new Date(next))
    },

    last_completion(id) {
      let this_habit = this.habits.filter((h) => { return id == h.id })[0]

      let last = null
      for (let check_s of this_habit.checked) {

        let check = new Date(check_s)
        if (!last) {
          last = check
          continue
        }

        if (check > last) {
          last = check
        }
      }

      if (last == null) {
        return null
      }
      return last.toISOString()
    },

    next_completion(id) {
      let this_habit = this.habits.filter((h) => { return id == h.id })[0]
      let next = new Date(this.last_completion(id))

      let c = this_habit.rythm.code
      let offset_d = 0
      let offset_m = 0

      if (c == 'd') {
        offset_d = 1
      } else if (c == 'w') {
        offset_d = 7
      } else if (c == 'm') {
        offset_m = 1
      }

      next.setDate(next.getDate() + offset_d)
      next.setMonth(next.getMonth() + offset_m)

      let start = new Date(this_habit.start)
      return Math.max(new Date(), next, start)
    },


    save() {
      localStorage.setItem('habits', JSON.stringify(this.habits))
    }
  }
})
