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
        レビューについて
      </div>
      <div class="pt-5 subheading font-weight-bold">
        レビューとは？
      </div>
      <div class="pt-3">
        レビューは、候補者がインターン後に入力する企業の評価のことです。
        <div>
          この評価によって、トップページの並び替えを評価順にした時に表示される募集一覧での表示順位が変動します。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        レビューを確認するには？
      </div>
      <div class="pt-3">
        サイドバーのレビューから確認が出来ます。
        <div>
          ※ レビューは、匿名で表示されます。
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
