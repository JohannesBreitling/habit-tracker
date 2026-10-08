<script setup>
import InputColor from 'primevue/inputcolor'
import InputColorArea from 'primevue/inputcolorarea'
import InputColorAreaBackground from 'primevue/inputcolorareabackground'
import InputColorAreaHandle from 'primevue/inputcolorareahandle'
import InputColorSlider from 'primevue/inputcolorslider'
import InputColorSliderTrack from 'primevue/inputcolorslidertrack'
import InputColorSliderHandle from 'primevue/inputcolorsliderhandle'
import InputColorTransparencyGrid from 'primevue/inputcolortransparencygrid'
import InputColorSwatch from 'primevue/inputcolorswatch'
import InputColorSwatchBackground from 'primevue/inputcolorswatchbackground'
import InputColorInput from 'primevue/inputcolorinput'

import { ref, watch } from 'vue'

const emit = defineEmits(['color-change'])

const props = defineProps(['initial_color'])

const color = ref(props.initial_color)

watch(color, () => {
  emit('color-change', color.value)
})

</script>

<template>
    <InputColor format="hex" v-model="color" >
        <InputColorArea>
            <InputColorAreaBackground />
            <InputColorAreaHandle />
        </InputColorArea>
        <InputColorSlider>
            <InputColorTransparencyGrid />
            <InputColorSliderTrack />
            <InputColorSliderHandle />
        </InputColorSlider>
        <div class="flex items-center gap-2 mt-2">
            <InputColorSwatch>
                <InputColorTransparencyGrid />
                <InputColorSwatchBackground />
            </InputColorSwatch>
            <InputColorInput channel="hex" placeholder="Color in hex" class="w-full"  />
        </div>
    </InputColor>
</template>
