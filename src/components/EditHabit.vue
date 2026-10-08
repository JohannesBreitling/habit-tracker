<script setup>

import { useHabitStore } from '@/stores/habits'

import { useDialog } from 'primevue/usedialog'
import DynamicDialog from 'primevue/dynamicdialog'

import HabitForm from './HabitForm.vue'

const habit_store = useHabitStore()
const edit_dialog = useDialog()

const open_dialog = (habit) => {
  edit_dialog.open(HabitForm, {
    props: {
      header: 'Edit Habit',
      modal: true,
      draggable: false,
      style: { width: '40vw' }
    },
    data: {
      buttonText: 'Update Habit',
      habit: habit,
    },
    onClose: (opts) => {
      const result = opts.data

      if (result && result.type == 'finalize') {
        // Update habit
        habit_store.update_habit(result.payload.id, result.payload.name, result.payload.rythm, result.payload.color, result.payload.start)
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
