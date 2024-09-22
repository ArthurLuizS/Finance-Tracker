<template>
  <section class="flex items-center justify-between">
    <h1 class="text-4xl font-extrabold">Sumary</h1>
    <div>
      <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      title="Rendas"
      :amount="incomeTotal"
      :last-amount="prevIncomeTotal"
      :loading="pending"
      color="green"
    />
    <Trend
      title="Despesas"
      :amount="expenseTotal"
      :last-amount="prevExpenseTotal"
      :loading="pending"
      color="red"
    />
    <Trend
      title="Investimento"
      :amount="400"
      :last-amount="3000"
      :loading="pending"
      color="green"
    />
    <Trend
      title="Economia"
      :amount="400"
      :last-amount="3000"
      :loading="pending"
      color="red"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transações</h2>
      <div class="text-gray-500 dark:text-gray-400">
        Você tem {{ incomeCount }} registro de Renda e
        {{ expenseCount }} registro de Despesa nesse periodo
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="fetchTransactions" />
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section>
    <div
      v-for="(transactionOnDay, date) in byDate"
      :key="date"
      class="mb-10"
      v-if="!loadingTransactions"
    >
      <DayliTransactionSumary :transactions="transactionOnDay" :date="date" />
      <Transaction
        v-for="transaction in transactionOnDay"
        :key="transaction"
        :transaction="transaction"
        @delete-transaction="onDeleteTransaction"
        :is-loading="pending"
      />
    </div>
    <div v-else>
      <USkeleton v-for="i in 4" :key="i" class="h-8 mb-2 w-full" />
    </div>
  </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';

const selectedView = ref(transactionViewOptions[1]);
const isOpen = ref(false);

const { current, previous } = useSelectedTimePeriod(selectedView);

const {
  pending,
  fetchTransactions,
  onDeleteTransaction,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate }
  }
} = useFetchTransactions(current);

const {
  refresh: refreshPrevious,
  transactions: { incomeTotal: prevIncomeTotal, expenseTotal: prevExpenseTotal }
} = useFetchTransactions(previous);

await Promise.all([refresh(), refreshPrevious()]);
</script>
