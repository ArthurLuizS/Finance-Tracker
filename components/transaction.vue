<template>
  <div class="grid grid-cols-3 py-4 border-b">
    <div class="flex justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="white" v-if="transaction.category">
          {{ transaction.category }}</UBadge
        >
      </div>
    </div>
    <div class="flex justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isLoading: Boolean,
  transaction: Object,
});

const emit = defineEmits(['DeleteTransaction']);

const { currency } = useCurrency(props.transaction.amount);

const deleteTransaction = () => {
  emit('DeleteTransaction', props.transaction.id);
};
const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit'),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
];

const isInCome = computed(() => props.transaction.type === 'Renda');

const icon = computed(() =>
  isInCome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left',
);

const iconColor = computed(() =>
  isInCome.value ? 'text-green-600' : 'text-red-600',
);
</script>
