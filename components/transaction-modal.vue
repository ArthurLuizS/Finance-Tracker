<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Adicionar Transação </template>

      <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
        <UFormGroup
          :required="true"
          label="Tipo de Transação"
          name="type"
          class="mb-4"
        >
          <USelect
            placeholder="Selecione o tipo de transação"
            :options="types"
            v-model="state.type"
          />
        </UFormGroup>

        <UFormGroup label="Valor" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Quantia"
            v-model.number="state.amount"
          />
        </UFormGroup>

        <UFormGroup
          label="Data da Transação"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UFormGroup
          label="Descrição"
          hint="Opcional"
          name="description"
          class="mb-4"
        >
          <UInput placeholder="Descrição" v-model="state.description" />
        </UFormGroup>

        <UFormGroup
          :required="true"
          label="Categoria"
          name="category"
          class="mb-4"
          v-if="state.type === 'Despesa'"
        >
          <USelect
            placeholder="Categoria"
            :options="categories"
            v-model="state.category"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Salvar"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, types } from '~/constants';
import { z } from 'zod';

const supabase = useSupabaseClient();
const toast = useToast();

const form = ref();
const isLoading = ref(false);

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('O Valor precisa ser maior que 0'),
});

const incomeSchema = z.object({
  type: z.literal('Renda'),
});

const expenseSchema = z.object({
  type: z.literal('Despesa'),
  category: z.enum(categories),
});

const investmentSchema = z.object({
  type: z.literal('Investimento'),
});

const savingSchema = z.object({
  type: z.literal('Economia'),
});

const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema,
);

const save = async () => {
  form.value.validate();
  if (form.value.errors.length) return;
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from('transactions')
      .upsert({ ...state.value });

    if (!error) {
      toast.add({
        title: 'Transação salva',
        icon: 'i-heroicons-check-circle',
      });
      isOpen.value = false;
      emit('saved');
      return;
    }
    throw Error;
  } catch (error) {
    console.log('teste');
    console.error(error);
    toast.add({
      title: 'Erro ao salvar Transação',
      description: error.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    });
  } finally {
    isLoading.value = false;
  }
};

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};

const state = ref({ ...initialState });

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'saved']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit('update:modelValue', value);
  },
});

const resetForm = () => {
  Object.assign(state.value, initialState);
};
</script>
