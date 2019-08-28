<template>
  <v-layout>
    <v-flex xs12>
      <!-- menu ( xl, lg, md, sm) -->
      <v-navigation-drawer
        v-if="breakpoint != 'xs'"
        class="hidden-xs-only"
        app
        width="280"
        permanent
        :mini-variant="mini"
        mini-variant-width="48"
        id="drawer"
        :class="{
          'drawer-mini': $vuetify.breakpoint.smAndDown,
        }"
      >
        <v-toolbar flat>
          <v-list-tile to="/">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-medium hidden-sm-and-down" style="font-size: 18px">Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list class="hidden-xs-only py-0" id="my-page-menu">
          <template v-for="(item, index) in mypageItems">
            <v-list-tile
              :class="{ 'teal lighten-5': path.includes('user/' + item.url) }"
              @click="menuButtonClicked(item.url)"
            >
              <v-list-tile-action>
                <v-icon
                  :class="{
                    'teal--text': $route.path.includes('/user/' + item.url),
                  }"
                >
                  {{ item.icon }}
                </v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title
                  :class="{
                    'body-2': $vuetify.breakpoint.smOnly,
                    'teal--text': $route.path.includes('/user/' + item.url),
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
      </v-navigation-drawer>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data: () => ({
    dropdownText: '',
    mypageItems: [
      {
        title: 'パス',
        url: 'passes',
        icon: 'card_giftcard'
      },
      {
        title: 'キャリア',
        url: 'career',
        icon: 'work_outline'
      },
      {
        title: 'フィードバック',
        url: 'feedbacks',
        icon: 'chat_bubble_outline'
      },
      {
        title: 'レビュー',
        url: 'reviews',
        icon: 'bar_chart'
      },
    ],
  }),
  computed: {
    mini() {
      return (this.breakpoint == 'sm' || this.breakpoint == 'xs') ? true : false
    },
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
      this.dropdownText = 'パス'
    }
  },
  methods: {
    menuButtonClicked(url) {
      if (url == 'feedbacks' && this.$route.name != 'user-feedbacks') {
        this.resetFeedbacksState()
      }

      this.$router.push('/user/' + url)
    },
    ...mapActions({
      resetFeedbacksState: 'feedbacks/resetState',
    }),
  }
}
</script>
<style>
#my-page-menu a.v-list__tile {
  height: 56px;
}
</style>
