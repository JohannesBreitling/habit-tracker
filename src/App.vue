<script setup>
import CreateHabit from './components/CreateHabit.vue'
import HabitList from './components/HabitList.vue'
import HabitHeatmap from './components/HabitHeatmap.vue'

import Menubar from 'primevue/menubar'

import { Home, Plus } from '@primeicons/vue'

import { ref } from 'vue'
import HabitForm from './components/HabitForm.vue'

const create_habit = ref()

const items = ref([
  {
    label: 'Home',
    icon: Home,
    command: () => {
      console.log("HOME")
    }
  },
  {
    label: 'Create Habit',
    icon: Plus,
    command: () => {
      console.log("CREATE")
      create_habit.value.open_dialog()
    }
  },
])



const print_h = (h) => {
  console.log(h)
}

</script>

<template>
    <Menubar :model="items"></Menubar>
    <CreateHabit ref="create_habit"></CreateHabit>
    <HabitList></HabitList>
    <HabitHeatmap></HabitHeatmap>
</template>

<style scoped></style>
