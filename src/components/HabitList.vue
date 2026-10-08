<script setup>
import { useHabitStore } from '@/stores/habits';
import { Trash, Pencil, Check, ExclamationTriangle, Clock } from '@primeicons/vue';

import Card from 'primevue/card'
import Button from 'primevue/button'

import { ref, computed } from 'vue'

import { useConfirm } from 'primevue/useconfirm'

import ConfirmDialog from 'primevue/confirmdialog'
import EditHabit from './EditHabit.vue'

const edit_habit_ref = ref()

const edit_habit = (habit) => {
  edit_habit_ref.value.open_dialog(habit)
}

const habit_store = useHabitStore()

const confirm = useConfirm();
const confirmDelete = (id) => {
  confirm.require({
    message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: ExclamationTriangle,
      rejectProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      acceptProps: {
          label: 'Delete'
      },
      accept: () => {
        delete_habit(id)
      },
      reject: () => {}
  });
}

const delete_habit = (id) => {
  habit_store.delete_habit(id)
  habit_store.save()
}

const complete_habit = (id) => {
  habit_store.complete_habit(id)
  habit_store.save()
}

const last_completions = computed(() => {
  const map = {}

  for (const habit of habit_store.habits) {

    const iso = habit_store.last_completion(habit.id)
    if (iso == null) {
      continue
    }

    const date = new Date(iso)

    const formatted = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(date)

    map[habit.id] = formatted
  }

  return map
})

const next_completions = computed(() => {
  const map = {}

  for (const habit of habit_store.habits) {

    const iso = habit_store.next_completion(habit.id)
    const formatted = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(iso))

    map[habit.id] = formatted
  }

  return map
})


const completable = computed(() => {
  const map = {}

  for (const habit of habit_store.habits) {
    map[habit.id] = habit_store.check_complete(habit.id)
  }

  return map
})

const completable_list = computed(() => {
  let list = []

  for (const habit of habit_store.habits) {
    if (habit_store.check_complete(habit.id)) {
      list.push(habit)
    }
  }

  return list
})

const waiting_list = computed(() => {
  let list = []

  for (const habit of habit_store.habits) {
    if (!habit_store.check_complete(habit.id)) {
      list.push(habit)
    }
  }

  return list
})

</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <EditHabit ref="edit_habit_ref"></EditHabit>

    <div class="grid grid-cols-4">

        <div v-for="habit in completable_list" class="m-2 col-span-1 h-full">
            <Card>
                <template #title>
                    <h2>{{habit.name}}</h2>
                    <div class="color-divider" :style="{ backgroundColor: habit.color}"></div>
                </template>
                <template #subtitle>{{habit.rythm.name}}</template>
                <template #content>
                    <Button v-if="!completable[habit.id]" class="w-full my-2" disabled severity="secondary">
                        <Clock></Clock>
                    </Button>

                    <Button v-if="completable[habit.id]" class="w-full my-2" @click="complete_habit(habit.id)">
                        <Check></Check>
                    </Button>
                    <p class="text-gray-400">Last completion: {{ last_completions[habit.id] }}</p>
                    <p class="text-gray-400">Next completion from: {{ next_completions[habit.id] }}</p>

                </template>
                <template #footer>
                    <div class="flex gap-2">
                        <Button variant="text">
                            <Pencil :size="24" color="#f5a442" @click="edit_habit(habit)"></Pencil>
                        </Button>
                        <Button variant="text">
                            <Trash :size="24" color="#e45656" @click="confirmDelete(habit.id)"></Trash>
                        </Button>
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <h1 class="m-2 text-3xl tracking-tight text-heading">Completed habits</h1>
    <div class="grid grid-cols-4">
        <div v-for="habit in waiting_list" class="m-2 col-span-1">
            <Card>
                <template #title>
                    <h2>{{habit.name}}</h2>
                    <div class="color-divider" :style="{ backgroundColor: habit.color}"></div>
                </template>
                <template #subtitle>{{habit.rythm.name}}</template>
                <template #content>
                    <Button v-if="!completable[habit.id]" class="w-full my-2" disabled severity="secondary">
                        <Clock></Clock>
                    </Button>

                    <Button v-if="completable[habit.id]" class="w-full my-2" @click="complete_habit(habit.id)">
                        <Check></Check>
                    </Button>
                    <p class="text-gray-400">Last completion: {{ last_completions[habit.id] }}</p>
                    <p class="text-gray-400">Next completion from: {{ next_completions[habit.id] }}</p>

                </template>
                <template #footer>
                    <div class="flex gap-2">
                        <Button variant="text">
                            <Pencil :size="24" color="#f5a442" @click="edit_habit(habit)"></Pencil>
                        </Button>
                        <Button variant="text">
                            <Trash :size="24" color="#e45656" @click="confirmDelete(habit.id)"></Trash>
                        </Button>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>

.color-divider {
    height: 4px;
    border-radius: 4px;
    width: 100%;
    margin-top: 8px;
}

</style>
