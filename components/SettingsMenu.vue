<template>
  <v-layout>
    <v-flex xs12>
      <!-- menu (sm, xs) -->
      <v-menu
        content-class="dropdown-menu"
        transition="slide-y-transition"
        class="pt-2 pb-4 hidden-md-and-up"
        style="width: 200px;"
      >
        <v-btn
          slot="activator"
          flat
          block
          style="border-bottom: 1px dashed; border-color: #E0E0E0;"
        >
          {{ dropdownText }}
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-card>
          <v-list dense class="py-0">
            <v-list-tile
              v-for="item in mypageItems"
              :key="item.value"
              :class="{ 'teal lighten-5': path.includes('user/settings/' + item.value) }"
              :to="'/user/settings/' + item.value"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
      <!-- menu ( xl, lg, md) -->
      <v-list class="hidden-sm-and-down pt-5">
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
