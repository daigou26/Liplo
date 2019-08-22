<template>
  <v-navigation-drawer
    v-if="showDrawer"
    permanent
    app
    width="280"
    :mini-variant="mini"
    mini-variant-width="48"
    id="drawer"
    :class="{
      'drawer-mini': $vuetify.breakpoint.smAndDown,
    }"
  >
    <v-toolbar flat class="white">
      <v-list-tile @click.native="homeButtonClicked">
        <v-list-tile-action>
          <img src="/icon.png" width="34" height="34"/>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="font-weight-medium hidden-sm-and-down" style="font-size: 22px; color: #FF5A5F">Liplo</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list
      dense
      class="pt-0"
      id="dashboard-menu"
    >
      <v-list-tile
        v-for="item in items"
        :key="item.title"
        :to="'/recruiter/' + item.url"
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="font-weight-medium text-color" style="font-size: 15px">{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      showDrawer: false,
      items: [
        { title: 'ダッシュボード', icon: 'dashboard', url: 'dashboard' },
        { title: '企業・社員', icon: 'business', url: 'company' },
        { title: '募集管理', icon: 'assignment', url: 'jobs' },
        { title: '候補者管理', icon: 'assignment_ind', url: 'candidates' },
        { title: 'パス', icon: 'style', url: 'passes' },
        { title: 'メッセージ', icon: 'chat_bubble', url: 'messages' },
        { title: 'レビュー', icon: 'bar_chart', url: 'reviews' },
        { title: 'フィードバック', icon: 'create', url: 'feedbacks' },
        { title: '設定', icon: 'settings', url: 'company_settings' },
        { title: 'ヘルプ', icon: 'help', url: 'help' },
      ],
    }
  },
  computed: {
    mini() {
      return (this.breakpoint == 'sm' || this.breakpoint == 'xs') ? true : false
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
  },
  mounted() {
    this.showDrawer = true
  },
  methods: {
    homeButtonClicked() {
      if (this.$route.name != 'index') {
        this.resetJobsState()
        this.$router.push('/')
      }
    },
    ...mapActions({
      resetJobsState: 'jobs/resetState',
    }),
  }
}
</script>

<style>
#dashboard-menu a.v-list__tile {
  height: 56px;
}
#drawer div.v-toolbar__content {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
