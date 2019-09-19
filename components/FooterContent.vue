<template>
  <v-flex
    v-if="!isRefreshing"
    xs12
    pt-5
  >
    <v-divider></v-divider>
    <v-flex
      xs10
      offset-xs1
      id="footer"
      class="py-4"
      :class="{
        'pa-5': $vuetify.breakpoint.mdAndUp,
        'pa-3': $vuetify.breakpoint.smOnly,
      }"
    >
      <v-layout row wrap pb-4>
        <v-flex md5 sm6>
          <div class="pb-2">
            <nuxt-link to="/inquiry_for_recruiter" class="font-weight-bold text-color">採用担当者様はこちら</nuxt-link>
          </div>
          <div class="pb-2">
            <nuxt-link to="/contact" class="font-weight-bold text-color">お問い合わせ</nuxt-link>
          </div>
          <div class="pb-2">
            <nuxt-link to="/feedback" class="font-weight-bold text-color">フィードバックを送る</nuxt-link>
          </div>
          <div class="pb-2">
            <a href="https://hp.liplo.jp" target="_blank" class="font-weight-bold text-color">運営会社</a>
          </div>
        </v-flex>
        <v-flex md5 sm6>
          <div class="pb-3 text-color">
            <a href="https://twitter.com/liplo_jp" target="_blank"><v-icon color="grey">fab fa-twitter</v-icon></a>
          </div>
          <div class="pb-2">
            <nuxt-link to="/terms" class="font-weight-bold text-color">利用規約</nuxt-link>
          </div>
          <div class="pb-2">
            <nuxt-link to="/privacy_policy" class="font-weight-bold text-color">プライバシー</nuxt-link>
          </div>
        </v-flex>
      </v-layout>
      <v-divider class="py-2"></v-divider>
      <div class="text-xs-right">
        <span>&copy; 2019 Liplo,Inc. All rights reserved.</span>
      </div>
    </v-flex>
  </v-flex>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  computed: {
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
    }),
  },
}
</script>
