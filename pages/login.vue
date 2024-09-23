<template>
  <UCard v-if="!success">
    <template #header> Entrar no Mapa de Finanças </template>

    <form @submit.prevent="handleLogin">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        help="Você receberá um email com um link de confirmação"
      >
        <UInput type="email" placeholder="Email" required v-model="email" />
      </UFormGroup>

      <UButton
        type="submit"
        variant="solid"
        color="black"
        :loading="pending"
        :disabled="pending"
      >
        Enivar
      </UButton>
    </form>
  </UCard>

  <UCard v-else>
    <template #header> Email enviado com sucesso! </template>
    <div class="text-center">
      <p class="mb-4">
        Enviamos um email para: <strong> {{ email }} </strong> com o link de
        autenticação.
      </p>
      <p><strong>Importante:</strong> o link expira em 5 minutos.</p>
    </div>
  </UCard>
</template>

<script setup>
const success = ref(false);
const email = ref('');
const pending = ref(false);
const toast = useToast();
const supabase = useSupabaseClient();

useRedirectIfAuthenticated();

const handleLogin = async () => {
  pending.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm'
      }
    });
    if (error) {
      toast.add({
        title: 'Erro ao Autenticar email',
        icon: 'i-heroicons-exlamation-circle',
        description: error.message,
        color: 'red'
      });
    } else {
      success.value = true;
    }
  } finally {
    pending.value = false;
  }
};
</script>
