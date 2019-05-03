<template>
  <v-layout>
    <v-flex xs12>
      <!-- menu ( xl, lg, md, sm) -->
      <v-list class="hidden-xs-only pt-5" style="max-width: 250px;">
        <template v-for="(item, index) in mypageItems">
          <v-list-tile
            :class="{ 'teal lighten-5': path.includes('user/' + item.value) }"
            :to="'/user/' + item.value"
          >
            <v-list-tile-content>
              <v-list-tile-title
                :class="{
                  'body-2': $vuetify.breakpoint.smOnly,
                }"
              >
                {{ item.title }}
              </v-list-tile-title>
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
