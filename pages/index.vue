<template>
    <section class="flex items-center justify-between">
        <h1 class="text-4xl font-extrabold">Sumary</h1>
        <div>
            <USelectMenu  v-model="selectedView" :options="transactionViewOptions" />
        </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend title="inCome" :amount="0" :last-amount="3000" :loading="loadingTransactions" color="green" />
        <Trend title="inCome" :amount="400" :last-amount="3000" :loading="loadingTransactions" color="red" />
        <Trend title="inCome" :amount="400" :last-amount="3000" :loading="loadingTransactions" color="green" />
        <Trend title="inCome" :amount="400" :last-amount="3000" :loading="loadingTransactions" color="red" />
    </section>

    <section>
        <div v-for="(transactionOnDay, date) in transactionsGroupedByDate" :key="date" class="mb-10" v-if="!loadingTransactions">
					<DayliTransactionSumary :transactions="transactionOnDay" :date="date" />
					<Transaction v-for="transaction in transactionOnDay" :key="transaction" :transaction="transaction" @delete-transaction="onDeleteTransaction" :is-loading="deleteLoading"/>
				</div>
				<div v-else>
					<USkeleton v-for="i in 4" :key="i" class="h-8 mb-2 w-full"/>
				</div>
    </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants'

const supabase = useSupabaseClient()
const toast = useToast()

const selectedView = ref(transactionViewOptions[1])
const transactions = ref([])
const loadingTransactions = ref(false)
const deleteLoading = ref(false)

const fetchTransactions = async () => {
	const { data } = await useAsyncData('transactions', async () => {
		loadingTransactions.value = true
		try {
			const { data, error } = await supabase
			.from('transactions')
			.select()
			if(error) return []
			return data
		} catch (error) {
		} finally {
			loadingTransactions.value = false
		}
	})
	transactions.value = data.value
} 

await fetchTransactions();

const transactionsGroupedByDate = computed(() => {
	let grouped = {}
	for(const transaction of transactions.value) {
		const date = new Date(transaction.created_at).toISOString().split('T')[0]
		if(!grouped[date]){
			grouped[date] = []
		}
		grouped[date].push(transaction)
	}
	return grouped
})


const onDeleteTransaction = async (transactionId) => {
	deleteLoading.value = true
	try {
		const response = await supabase
		.from('transactions')
		.delete()
		.eq('id', transactionId);

		toast.add({
		title: 'Transação Deletada.',
		icon: 'i-heroicons-check-circle',
		})
		await fetchTransactions();
	} catch (error) {
		toast.add({
		title: 'Transação Deletada.',
		icon: 'i-heroicons-exclamation-circle',
		})
		
	} finally {
		deleteLoading.value = false
	}
}
</script>