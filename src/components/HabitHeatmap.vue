<script setup>
import { useHabitStore } from '@/stores/habits'
import { computed } from 'vue'

const MS_PER_DAY = 1000 * 60 * 60 * 24

// Whole local calendar days between two dates (DST-safe)
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
  return Math.round((d2 - d1) / MS_PER_DAY)
}

const addMonths = (date, n) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + n)
  return d
}

const habit_store = useHabitStore()

// Read straight from the store: it replaces the array on every update,
// so a ref() copy of it would go stale.
const sorted_habits = computed(() =>
  [...habit_store.habits].sort((a, b) => new Date(a.start) - new Date(b.start))
)

const classify_frac = (f) => {
  if (f == 1) return 1
  if (f >= 0.75) return 2
  if (f >= 0.5) return 3
  if (f >= 0.25) return 4
  return 5
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// getDay(): 0 = Sunday ... 6 = Saturday  ->  grid row 1 = Monday ... 7 = Sunday
const grid_row = (day) => ((day + 6) % 7) + 1

const heat_map = computed(() => {
  if (sorted_habits.value.length === 0) return []

  const first = new Date(sorted_habits.value[0].start)
  const number_of_days = daysBetween(first, new Date()) + 1
  const dayIdx = (date) => daysBetween(first, date)

  const completions = Array.from({ length: number_of_days }, (_, i) => {
    const date = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i)
    return {
      date,
      day: date.getDay(),
      month: date.getMonth(),
      habit_score: 0,
      completion_score: 0,
      frac: 0
    }
  })

  // Day range [from, to) that a single completion of `habit` covers
  const window_of = (habit, completion_date) => {
    const start = new Date(habit.start)
    const start_idx = dayIdx(start)
    const idx = dayIdx(completion_date)
    if (idx < start_idx) return null // completed before the habit started

    switch (habit.rythm.code) {
      case 'd':
        return [idx, idx + 1]
      case 'w': {
        const k = Math.floor((idx - start_idx) / 7)
        return [start_idx + 7 * k, start_idx + 7 * k + 7]
      }
      case 'm': {
        let k = 0
        while (dayIdx(addMonths(start, k + 1)) <= idx) k++
        return [dayIdx(addMonths(start, k)), dayIdx(addMonths(start, k + 1))]
      }
      default:
        return null
    }
  }

  for (const habit of sorted_habits.value) {
    // The habit counts on every day from its start until today
    for (let i = Math.max(dayIdx(new Date(habit.start)), 0); i < number_of_days; i++) {
      completions[i].habit_score += 1
    }

    // Each period (day/week/month) counts at most once per habit
    const seen = new Set()
    for (const checked of habit.checked) {
      const w = window_of(habit, new Date(checked))
      if (!w || seen.has(w[0])) continue
      seen.add(w[0])

      for (let i = Math.max(w[0], 0); i < Math.min(w[1], number_of_days); i++) {
        completions[i].completion_score += 1
      }
    }
  }

  for (const c of completions) {
    c.frac = c.habit_score ? c.completion_score / c.habit_score : 0
  }
  return completions
})
</script>

<template>
  <h1 class="m-2 text-3xl tracking-tight text-heading">Habit Progress</h1>

  <div class="overflow-x-auto m-4">
    <div class="heat-grid">
      <div
        v-for="(label, i) in WEEKDAYS"
        :key="label"
        class="weekday"
        :style="{ gridRow: i + 1 }"
      >{{ label }}</div>

      <div
        v-for="(compl, i) in heat_map"
        :key="i"
        class="habit-box"
        :class="'sat-' + classify_frac(compl.frac)"
        :style="{ gridRow: grid_row(compl.day) }"
        :title="compl.date.toLocaleDateString('de-DE') + ': ' + compl.completion_score + '/' + compl.habit_score"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.heat-grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, 29px);
  grid-template-columns: 3rem; /* weekday labels */
  grid-auto-columns: 29px;     /* one column per week */
}

.weekday {
  line-height: 29px;
}

.habit-box {
  margin: 2px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px #dedede;
}

.sat-1 { background-color: #5da35eFF; }
.sat-2 { background-color: #5da35eBB; }
.sat-3 { background-color: #5da35e77; }
.sat-4 { background-color: #5da35e33; }
.sat-5 { background-color: #ebedf0; }
</style>
