<template>
  <v-flex
    xs12
    pt-5
  >
    <v-divider></v-divider>
    <v-flex xs8 offset-xs2 py-5 id="footer">
      <v-layout row wrap pb-4>
        <v-flex xs6>
          <div class="pb-2">
            <nuxt-link to="/company_registration" class="font-weight-bold textColor">採用担当者様はこちら</nuxt-link>
          </div>
          <div class="pb-2">
            <nuxt-link to="/contact" class="font-weight-bold textColor">お問い合わせ</nuxt-link>
          </div>
          <div class="pb-2">
            <nuxt-link to="/" class="font-weight-bold textColor">運営会社</nuxt-link>
          </div>
        </v-flex>
        <v-flex xs6>
          <div class="pb-3 textColor">
            <v-btn flat small icon color="grey" class="ma-0 mr-3">
              <v-icon>fab fa-facebook</v-icon>
            </v-btn>
            <v-btn flat small icon color="grey" class="ma-0">
              <v-icon>fab fa-twitter</v-icon>
            </v-btn>
          </div>
          <div class="pb-2">
            <nuxt-link to="/" class="font-weight-bold textColor">利用規約</nuxt-link>
          </div>
          <div class="pb-2">
            <nuxt-link to="/" class="font-weight-bold textColor">プライバシー</nuxt-link>
          </div>
        </v-flex>
      </v-layout>
      <v-divider class="py-3"></v-divider>
      <span >&copy; 2019 All rights reserved.</span>
    </v-flex>
  </v-flex>
</template>

<script>
export default {
  computed: {
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
  },
}
</script>
