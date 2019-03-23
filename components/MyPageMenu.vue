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
          <v-list dense>
            <v-list-tile
              v-for="item in mypageItems"
              :key="item"
              :class="{ 'teal lighten-5': path.includes('user/' + item) }"
              :to="'/user/' + item"
            >
              <v-list-tile-title
                v-text="item"
              />
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
      <!-- menu ( xl, lg, md) -->
      <v-list class="border hidden-sm-and-down">
        <template v-for="(item, index) in mypageItems">
          <v-list-tile
            :class="{ 'teal lighten-5': path.includes('user/' + item) }"
            :to="'/user/' + item"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ item }}</v-list-tile-title>
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
      'passes',
      'career',
      'feedbacks',
      'reviews'
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
    if (this.path.includes('user/career')) {
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
