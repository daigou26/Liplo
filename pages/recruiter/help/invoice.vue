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
        請求書について
      </div>
      <div class="pt-5 subheading font-weight-bold">
        請求書の送信について
      </div>
      <div class="pt-3">
        請求書は、候補者をインターンに採用した際（候補者ステータスがインターンに変更された際）
        または、正社員として雇用契約した際（候補者ステータスが入社予定に変更された際）の翌月に、
        請求書の送信先として設定してあるメールアドレスに送信致します。
      </div>
      <div class="pt-5 subheading font-weight-bold">
        請求書の送信先を変更するには？
      </div>
      <div class="pt-3">
        請求書の送信先の変更は、サイドバーの設定から行うことが出来ます。
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
