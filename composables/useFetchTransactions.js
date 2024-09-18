export const useFetchTransactions = () => {
  const supabase = useSupabaseClient();
  const toast = useToast();

  const transactions = ref([]);
  const pending = ref(false);

  const income = computed(() =>
    transactions.value.filter((t) => t.type === 'Renda')
  );
  const expense = computed(() =>
    transactions.value.filter((t) => t.type === 'Despesa')
  );

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

  const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const fetchTransactions = async () => {
    const { data } = await useAsyncData('transactions', async () => {
      pending.value = true;
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select()
          .order('created_at', { ascending: false });
        if (error) return [];
        return data;
      } catch (error) {
      } finally {
        pending.value = false;
      }
    });
    transactions.value = data.value;
  };

  // const refresh = async () => (transactions.value = await fetchTransactions());

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};
    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    }
    // Ordenação de datas
    // const sortedKeys = Object.keys(grouped).sort().reverse();
    // const sortedGroup = {};
    // for (const key of sortedKeys) {
    //   sortedGroup[key] = grouped[key];
    // }
    // return sortedGroup;
    return grouped;
  });

  const onDeleteTransaction = async (transactionId) => {
    pending.value = true;
    try {
      const response = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      toast.add({
        title: 'Transação Deletada.',
        icon: 'i-heroicons-check-circle'
      });
      await fetchTransactions();
    } catch (error) {
      toast.add({
        title: 'Transação Deletada.',
        icon: 'i-heroicons-exclamation-circle'
      });
    } finally {
      pending.value = false;
    }
  };
  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount
    },
    pending,
    fetchTransactions,
    onDeleteTransaction
  };
};
