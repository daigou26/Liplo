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
      class="py-4 text-color"
      :class="{
        'px-4': $vuetify.breakpoint.smAndDown,
      }"
    >
      <div class="title font-weight-bold">
        パスについて
      </div>
      <div class="pt-5 subheading font-weight-bold">
        パスとは？
      </div>
      <div class="pt-3">
        パスとは、企業がインターン終了後の候補者に送ることのできる、
        内定取得や入社の権利のことです。パスの種類は現在、以下の３種類です。
        一度パスを発行すると、取り消すことが出来ないのでご注意ください。
        （内容の変更は可能です）
        <div class="pt-3">
          <div class="font-weight-bold text-color">
            1. 入社パス
          </div>
          <div class="pt-2">
            卒業後の一定期間、いつでも入社できる権利を与えるパスです。
            卒業後、どれくらい有効かは企業が決めることができます。
            このパスを多く発行すると、採用予定人数を上回ってしまう可能性があるため、
            対象者を厳選して発行することを推奨しています。
          </div>
        </div>
        <div class="pt-3">
          <div class="font-weight-bold text-color">
            2. 内定パス
          </div>
          <div class="pt-2">
            企業が定めた期間内であれば、いつでも内定を取得できる権利を与えるパスです。
            有効期間や入社年度は企業が設定します。
            このパスも入社パス同様、多く発行すると採用予定人数を上回ってしまう可能性があるため、
            対象者を厳選して発行することを推奨しています。
          </div>
        </div>
        <div class="pt-3">
          <div class="font-weight-bold text-color">
            3. 先着パス
          </div>
          <div class="pt-2">
            企業が定めた期間内であり、採用枠にあまりがある場合に限り、
            内定を取得できる権利を与えるパスです。
            有効期間、入社年度および採用予定人数は企業が設定することが出来ます。
            入社パスや内定パスは性質上、パスを使う人数が予想しにくいため、あまり発行することが出来ませんが、
            先着パスは上限を自由に設定することが出来るため、数を気にせず発行することができます。
            先着パスの上限数は、サイドバーのパスから設定できます。
          </div>
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        パスを送るには？
      </div>
      <div class="pt-3">
        候補者管理画面にて、ステータスをインターンからパスに変更することで、
        パスの入力フォームが表示され、種類や有効期限などを入力してからステータスを更新することで、
        候補者にパスが送られます。
      </div>
      <div class="pt-5 subheading font-weight-bold">
        パスの内容を変更するには？
      </div>
      <div class="pt-3">
        パスの内容は、候補者管理画面から編集することが出来ます。
        <div>
          ただし、変更出来るのは、パスの有効期限、入社年度のみで、
          パスの種類は変更することが出来ないのでご注意ください。
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
