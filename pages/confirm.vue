<template>
  <UCard>
    <template #header> Redirecionando... </template>
    Aguarde um momento enquanto o(a) redirecionamos...
  </UCard>
</template>
<script setup>
useRedirectIfAuthenticated();
</script>
