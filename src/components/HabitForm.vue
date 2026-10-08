<script setup>

import { Card, InputText, InputGroup, DatePicker, Button, Select, Message } from 'primevue'

import HabitColorPicker from './HabitColorPicker.vue'

import { ref, inject } from 'vue'
import { Habit } from '@/model/habit'

const dialogRef = inject('dialogRef')
const buttonText = dialogRef.value.data.buttonText
const habit = dialogRef.value.data.habit

const id = ref(habit ? habit.id : "")
const name = ref(habit ? habit.name : "")
const rythm = ref(habit ? habit.rythm : "")
const color = ref(habit ? habit.color : "")
const start = ref(habit ? habit.start : "")
const completions = ref(habit ? habit.completions : [])

const invalid_state = ref(false)
const invalid_date = ref(false)

const update_color = (c) => {
  color.value = c
}

const rythms = ref([
  { name: 'Daily', code: 'd' },
  { name: 'Weekly', code: 'w' },
  { name: 'Monthly', code: 'm' },
  { name: 'TODO: Custom', code: 'c' },
]);

const finalize = () => {
  if (name.value == "" || rythm.value == "" || color.value == "" || start.value == "") {
    invalid_state.value = true
    return
  }

  invalid_state.value = false

  if (id.value == "") {
    id.value = crypto.randomUUID()
  }

  let start_date = new Date(start.value)
  let now = new Date()
  let now_strip = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (start_date.getTime() < now_strip.getTime()) {
    invalid_date.value = true
    return
  }

  invalid_date.value = false

  const h = new Habit(id.value, name.value, rythm.value, color.value, start.value, completions.value)

  name.value = ""
  rythm.value = ""
  color.value = ""
  start.value = ""

  dialogRef.value.close({
    type: 'finalize',
    payload: h
  })
}

</script>

<template>
    <div class="gw-full">
        <Card>
            <template #content>
                <InputGroup>
                    <InputText v-model="name" placeholder="Habit Name""></InputText>
                </InputGroup>

                <InputGroup class="mt-2">
                    <Select v-model="rythm" :options="rythms" optionLabel="name" placeholder="Habit Rythm"/>
                </InputGroup>

                <div class="mt-2">
                    <h2>Habit Color</h2>
                    <HabitColorPicker :initial_color="color" @color-change="update_color"></HabitColorPicker>
                </div>

                <div class="mt-2">
                    <DatePicker placeholder="Start Date" class="w-full" v-model="start" />
                </div>

                <div class="mt-2">
                    <Button @click="finalize" class="w-full">{{ buttonText }}</Button>
                </div>

                <Message v-if="invalid_state" class="mt-2" severity="error" variant="simple">Please specify the name, the rythm, a start date and a color for the habit.</Message>
                <Message v-if="invalid_date" class="mt-2" severity="error" variant="simple">Please pick a date that is in the future.</Message>
            </template>
        </Card>
    </div>
</template>

<style scoped>

</style>
