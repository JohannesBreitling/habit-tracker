import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';

import Aura from '@primeuix/themes/aura';

import App from './App.vue'

import './index.css'

import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { seedExampleData } from './seed';

seedExampleData()

const app = createApp(App)

app.use(createPinia())
app.use(ConfirmationService);
app.use(DialogService);

app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  license: 'eyJpZCI6IjdiMTlhZTg0LTI5N2QtNGM3Ny1iMDM1LTBiM2FjNGQ3MGI0MCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODY2MTM2MTYsImV4cCI6MTgxODE0OTYxNn0.js2L6RbLb_Z9sCJDdvNSCADUo-2xBWyzLjIZri6UB8QcijZHexIqw4OJgXXmwsWQdTQUk2OvOwSWXsubSayGBw',
})

app.mount('#app')
