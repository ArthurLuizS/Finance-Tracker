<template>
	<div class="grid grid-cols-2 py-4 border-b">
		<div class="flex justify-between">
			<div class="flex items-center space-x-1">
				<UIcon name="i-heroicons-arrow-up-right" class="text-green-600"/>
				<div>Salário</div>
			</div>
			<div>
				<UBadge color="white">Categoria</UBadge>
			</div>
		</div>
		<div class="flex justify-end space-x-2">
			<div>{{ currency }}</div>
			<div>
				<UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    			<UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
  			</UDropdown>
			</div>
		</div>
	</div>
</template>

<script setup>
const { currency } = useCurrency(300);
const items = [
[
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit')
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => console.log('Delete')
    }
  ]
]
</script>