<template>
  <v-navigation-drawer v-if="showDrawer" permanent app width="280" :mini-variant="mini">
    <v-toolbar flat>
      <v-list
        :class="{
          'py-0': $vuetify.breakpoint.smAndDown,
        }"
      >
        <v-list-tile>
          <v-list-tile-title class="title">
            <nuxt-link v-if="breakpoint != 'sm'" to="/" class="toolbar-title">Home</nuxt-link>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list dense class="pt-0" id="dashboard-menu">
      <v-list-tile
        v-for="item in items"
        :key="item.title"
        :to="'/recruiter/' + item.url"
      >
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="font-weight-medium" style="font-size: 15px">{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      showDrawer: false,
      items: [
        { title: 'ダッシュボード', icon: 'dashboard', url: 'dashboard' },
        { title: '企業・社員', icon: 'business', url: 'company' },
        { title: '募集管理', icon: 'assignment', url: 'jobs' },
        { title: '候補者管理', icon: 'assignment_ind' },
        { title: 'メッセージ', icon: 'chat_bubble_outline', url: 'messages' },
        { title: 'レビュー', icon: 'bar_chart' },
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
}
</script>

<style>
#dashboard-menu a.v-list__tile {
  height: 56px;
}
</style>
