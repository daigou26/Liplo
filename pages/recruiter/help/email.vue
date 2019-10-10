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
        メールアドレスについて
      </div>
      <div class="pt-5 subheading font-weight-bold">
        企業のメールアドレスを変更するには？
      </div>
      <div class="pt-3">
        サイドバーの設定から企業のメールアドレスを変更することが出来ます。
        <div>
          変更が完了したら確認のメールが届きます。もし、時間が経っても届かない場合は、
          指定したメールアドレスが合っているかご確認ください。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        個人のメールアドレスを変更するには？
      </div>
      <div class="pt-3">
        ツールバーのプロフィール画像をクリックし、設定をクリックしてください。
        設定メニューのアカウント設定から変更することが出来ます。
        <div>
          変更が完了したら確認のメールが届きます。もし、時間が経っても届かない場合は、
          指定したメールアドレスが合っているかご確認ください。
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
      title: 'メールアドレス - ヘルプ',
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
