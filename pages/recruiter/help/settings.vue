<template>
  <v-layout
    white
    row
    wrap
  >
    <!-- loading -->
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else
      xs12
      md10
      offset-md1
      class="pt-4 text-color"
      :class="{
        'px-4': $vuetify.breakpoint.smAndDown,
      }"
    >
      <div class="title font-weight-bold">
        メール受信設定について
      </div>
      <div class="pt-5 subheading font-weight-bold">
        メールの通知を切るには？
      </div>
      <div class="pt-3">
        ツールバーのプロフィール画像をクリックし、設定をクリックしてください。
        <div>
          メール受信設定の画面になるので、そこからメール受信設定の変更が可能です。
        </div>
      </div>
      <div style="padding: 100px 0;">
        <div>
          <nuxt-link to="/contact" class="help-link font-weight-bold teal--text">お問い合わせ</nuxt-link>
        </div>
        <div class="pt-2">
          <nuxt-link to="/feedback" class="help-link font-weight-bold teal--text">フィードバックを送る</nuxt-link>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: 'メール受信設定 - ヘルプ',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
  }),
  computed: {
    params() {
      return this.$route.params
    },
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      companyId: state => state.profile.companyId,
      isRefreshing: state => state.isRefreshing,
    }),
  },
}
</script>
