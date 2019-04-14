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
              :class="{ 'teal lighten-5': path.includes('user/' + item.value) }"
              :to="'/user/' + item.value"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
      <!-- menu ( xl, lg, md) -->
      <v-list class="border hidden-sm-and-down py-0">
        <template v-for="(item, index) in mypageItems">
          <v-list-tile
            :class="{ 'teal lighten-5': path.includes('user/' + item.value) }"
            :to="'/user/' + item.value"
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
        title: '通知',
        value: 'notifications'
      },
      {
        title: '内定パス',
        value: 'passes'
      },
      {
        title: 'キャリア',
        value: 'career'
      },
      {
        title: 'フィードバック',
        value: 'feedbacks'
      },
      {
        title: 'レビュー',
        value: 'reviews'
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
    if (this.path.includes('user/notifications')) {
      this.dropdownText = '通知'
    } else if (this.path.includes('user/career')) {
      this.dropdownText = 'キャリア'
    } else if (this.path.includes('user/reviews')) {
      this.dropdownText = 'レビュー'
    } else if (this.path.includes('user/feedbacks')) {
      this.dropdownText = 'フィードバック'
    } else if (this.path.includes('user/passes')) {
      this.dropdownText = '内定パス'
    }
  },
}
</script>
