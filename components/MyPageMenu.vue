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
              :class="{ 'teal lighten-5': path.includes('user/' + item.value) }"
              :to="'/user/' + item.value"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
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
      </v-navigation-drawer>
      <!-- <v-list class="hidden-xs-only pt-5" style="position: fixed;">
        <template v-for="(item, index) in mypageItems">
          <v-list-tile
            :class="{ 'teal lighten-5': path.includes('user/' + item.value) }"
            :to="'/user/' + item.value"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
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
      </v-list> -->
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
        value: 'passes',
        icon: 'card_giftcard'
      },
      {
        title: 'キャリア',
        value: 'career',
        icon: 'work_outline'
      },
      {
        title: 'フィードバック',
        value: 'feedbacks',
        icon: 'chat_bubble_outline'
      },
      {
        title: 'レビュー',
        value: 'reviews',
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
      this.dropdownText = '内定パス'
    }
  },
}
</script>
<style>
#my-page-menu a.v-list__tile {
  height: 56px;
}
</style>
