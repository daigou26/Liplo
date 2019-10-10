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
        募集について
      </div>
      <div class="pt-5 subheading font-weight-bold">
        募集を作成するには？
      </div>
      <div class="pt-3">
        募集管理画面の右上の新規作成ボタンから作成することが出来ます。
        <div>
          公開される募集には、作成時にフォームに入力した内容と企業情報が表示されるので、
          企業情報の入力もお願いします。企業情報は、サイドバーの企業・社員から編集出来ます。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        募集を編集するには？
      </div>
      <div class="pt-3">
        募集管理画面に募集の一覧が表示されていて、一番右に編集ボタンがあります。
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
      title: '募集 - ヘルプ',
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
