<template>
  <header class="flex justify-between mt-10">
    <NuxtLink to="/"> Finance Tracker </NuxtLink>
    <UDropdown
      :items="items"
      :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
      v-if="user"
    >
      <UAvatar
        src="https://avatars.githubusercontent.com/u/739984?v=4"
        alt="Avatar"
      />
      <template #account="{ item }">
        <div class="text-left">
          <p>Logado com</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
        </div>
      </template>
      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>
        <UIcon
          :name="item.icon"
          class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
        />
      </template>
    </UDropdown>
  </header>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const items = [
  [
    {
      label: user.value?.email,
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Configurações',
      icon: 'i-heroicons-cog-8-tooth',
      click: () => console.log('Link to settings in the future')
    },
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: async () => {
        await supabase.auth.signOut();
        return navigateTo('/login');
      }
    }
  ]
];
</script>
