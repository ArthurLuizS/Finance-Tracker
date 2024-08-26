<template>
  <div>
		<div class="font-bold" :class="[color]"> {{ title }}</div>

		<div class="text-2xl font-extrabold text-black dark:text-white">
			<USkeleton class="h-8 w-full" v-if="loading" />
			<div v-else>{{ amount }}</div>
		</div>
		
		<div>
			<USkeleton class="h-8 w-full" v-if="loading" />
			<div v-else class="flex space-x-1 items-center text-sm">
				<UIcon :name="color === 'red' ? 'i-heroicons:arrow-trending-down' : 'i-heroicons:arrow-trending-up' " class="w-6 h-6" :class="[color]"/>
				<div class="text-gray-500 dark:text-gray-400">
					30% vs mês anterior
				</div>
			</div>

		</div>

  </div>
</template>

<script setup >
defineProps({
	title: String,
	amount: Number,
	lastAmount: Number,
	color: String,
	loading: Boolean
})
</script>

<style>
.green {
	@apply text-green-700 dark:text-green-400
}

.red {
	@apply text-red-700 dark:text-red-400
}
</style>