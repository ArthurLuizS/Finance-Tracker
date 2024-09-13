<template>
	<section class="flex items-center justify-between">
    <h1 class="text-4xl font-extrabold">Sumary</h1>
    <div>
      <USelectMenu  v-model="selectedView" :options="transactionViewOptions" />
    </div>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend title="Rendas" :amount="incomeTotal" :last-amount="3000" :loading="loadingTransactions" color="green" />
    <Trend title="Despesas" :amount="expenseTotal" :last-amount="3000" :loading="loadingTransactions" color="red" />
    <Trend title="Investimento" :amount="400" :last-amount="3000" :loading="loadingTransactions" color="green" />
    <Trend title="inCome" :amount="400" :last-amount="3000" :loading="loadingTransactions" color="red" />
  </section>

	<section class="flex justify-between mb-10"> 
		<div>
			<h2 class="text-2xl font-extrabold">Transações</h2>
			<div class="text-gray-500 dark:text-gray-400">Você tem {{ incomeCount }} registro de Renda e {{ expenseCount }} registro de Despesa nesse periodo</div>
		</div>
		<div>
			<TransactionModal v-model="isOpen"/>
			<UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
		</div>
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
const isOpen = ref(false)

const income = computed(() => transactions.value.filter(t => t.type === 'Renda'))
const expense = computed(() => transactions.value.filter(t => t.type === 'Despesa'))

const incomeCount = computed(()=> income.value.length)
const expenseCount = computed(()=> expense.value.length)

const incomeTotal = computed(
  () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const expenseTotal = computed(
  () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

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