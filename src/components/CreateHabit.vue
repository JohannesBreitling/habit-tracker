<script setup>

import { useHabitStore } from '@/stores/habits'

import { useDialog } from 'primevue/usedialog'
import DynamicDialog from 'primevue/dynamicdialog'

import HabitForm from './HabitForm.vue'


const habit_store = useHabitStore()
const create_dialog = useDialog()

const open_dialog = () => {
  create_dialog.open(HabitForm, {
    props: {
      header: 'Create Habit',
      modal: true,
      draggable: false,
      style: { width: '40vw' }
    },
    data: {
      buttonText: 'Create Habit',
    },
    onClose: (opts) => {
      const result = opts.data

      if (result && result.type == 'finalize') {
        // Create habit
        habit_store.create_habit(result.payload.id, result.payload.name, result.payload.rythm, result.payload.color, result.payload.start)
        habit_store.save()
      }
    }
  });
}

defineExpose({
  open_dialog
})

</script>

<template>
    <DynamicDialog class="w-full"></DynamicDialog>
</template>
