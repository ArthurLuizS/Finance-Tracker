<template>
    <section class="flex items-center justify-between">
        <h1 class="text-4xl fontSize-extrabold">Sumary</h1>

        <div>
            <USelect v-model="selectedView" :options="transactionViewOptions" />
        </div>
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants'
const selectedView = [transactionViewOptions[0]]
</script>