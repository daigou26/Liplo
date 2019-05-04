<template>
  <v-layout>
    <v-flex xs12>
      <!-- menu ( xl, lg, md, sm) -->
      <v-list class="hidden-xs-only pt-5">
        <template v-for="(item, index) in mypageItems">
          <v-list-tile
            :class="{ 'teal lighten-5': path.includes('user/settings/' + item.value) }"
            :to="'/user/settings/' + item.value"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider
            v-if="mypageItems.length != index + 1"
          ></v-divider>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dropdownText: '',
    mypageItems: [
      {
        title: 'メール通知',
        value: 'notifications'
      },
      {
        title: 'アカウント設定',
        value: 'account'
      },
    ],
  }),
  computed: {
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
  },
  mounted() {
    if (this.path.includes('user/settings/notifications')) {
      this.dropdownText = 'メール通知'
    } else if (this.path.includes('user/settings/account')) {
      this.dropdownText = 'アカウント設定'
    }
  },
}
</script>
