<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        Adicionar Transação
      </template>

      <UForm :state="state">
        
        <UFormGroup :required="true" label="Tipo de Transação" name="type" class="mb-4">
          <USelect placeholder="Selecione o tipo de transação" :options="types" v-model="state.type" />
        </UFormGroup>
        
        <UFormGroup label="Valor" :required="true" name="amount" class="mb-4">
          <UInput type="number" placeholder="Quantia"  v-model.number="state.amount" />
        </UFormGroup>
        
        <UFormGroup label="Data da Transação" :required="true" name="created_at" class="mb-4">
          <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
        </UFormGroup>
        
        <UFormGroup label="Descrição" hint="Opcional" name="description" class="mb-4">
          <UInput placeholder="Descrição"  v-model="state.description" />
        </UFormGroup>
        
        <UFormGroup :required="true" label="Categoria" name="category" class="mb-4">
          <USelect placeholder="Categoria" :options="categories" v-model="state.category" />
        </UFormGroup>
        
      </UForm>
        <UButton type="submit" color="black" variant="solid" label="Salvar" />
      </UCard>
    </UModal>
</template>

<script setup>

import { categories, types } from '~/constants'

const state = ref({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined
})

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

</script>