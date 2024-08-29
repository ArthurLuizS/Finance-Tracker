<template>
    <section class="flex items-center justify-between">
        <h1 class="text-4xl font-extrabold">Sumary</h1>
        <div>
            <USelectMenu  v-model="selectedView" :options="transactionViewOptions" />
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend title="inCome" :amount="0" :last-amount="3000" :loading="false" color="green" />
        <Trend title="inCome" :amount="400" :last-amount="3000" :loading="false" color="red" />
        <Trend title="inCome" :amount="400" :last-amount="3000" :loading="false" color="green" />
        <Trend title="inCome" :amount="400" :last-amount="3000" :loading="false" color="red" />
    </section>

    <section>
        <Transaction v-for="transaction in transactions" :key="transaction" :transaction="transaction"/>
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants'
const selectedView = ref(transactionViewOptions[1])

const transactions = ref([])

const supabase = useSupabaseClient()

const { data } = await useAsyncData('transactions', async () => {
  const { data, error } = await supabase
  .from('transactions')
  .select()
	if(error) return []
	return data
}
)
transactions.value = data.value
</script>