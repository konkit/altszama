<template>
  <div class="mb-8 d-flex pt-2">
    <base-avatar
        :icon="icon"
        :outlined="true"
        :size="72"
        class="mb-3"
    />

    <div class="horizontal text-title ml-6">
      <h3 class="text-uppercase text-title font-weight-bold mb-3 text-left">{{title}}</h3>

      <p class="mx-auto base-body text-body-1 mb-10">
        {{description}}
      </p>
    </div>
  </div>
</template>

<script>
  import BaseAvatar from "@/views/landing/components/BaseAvatar";

  export default {
    name: 'AvatarCard',

    props: {
      icon: String,
      title: String,
      description: String,
    },

    components: {
      BaseAvatar
    }
  }
</script>
