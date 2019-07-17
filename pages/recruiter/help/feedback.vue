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
        フィードバックについて
      </div>
      <div class="pt-5 subheading font-weight-bold">
        フィードバックとは？
      </div>
      <div class="pt-3">
        フィードバックは、候補者のインターン終了後に、候補者に対して企業が送ることが出来ます。
        <div>
          インターン中の候補者の良かった点、アドバイスなどの項目があります。
          フィードバックの記入率はダッシュボードに表示されます。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        フィードバックを送るには？
      </div>
      <div class="pt-3">
        候補者のステータスをインターンから変更するときに、フィードバックのフォームが表示されるので、
        そこに入力することで、ステータスの変更と共に送信されます。
        <div>
          後から入力する場合は、サイドバーのフィードバックから送信することが出来ます。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        送ったフィードバックを確認するには？
      </div>
      <div class="pt-3">
        サイドバーのフィードバックから確認が出来ます。
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
      title: 'フィードバック - ヘルプ',
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
