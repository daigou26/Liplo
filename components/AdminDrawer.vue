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
    <v-toolbar flat>
      <v-list-tile @click.native="homeButtonClicked">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="font-weight-medium hidden-sm-and-down" style="font-size: 18px">Home</v-list-tile-title>
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
        :to="'/admin/' + item.url"
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
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      showDrawer: false,
      items: [
        { title: '企業', icon: 'business', url: 'companies' },
        { title: '請求', icon: 'payment', url: 'paidActions' },
        { title: '企業問い合わせ', icon: 'call', url: 'companyInquiries' },
        { title: '問い合わせ', icon: 'email', url: 'inquiries' },
        { title: 'フィードバック', icon: 'chat_bubble_outline', url: 'feedbacks' },
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
