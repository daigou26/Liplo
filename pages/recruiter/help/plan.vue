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
        料金プランについて
      </div>
      <div class="pt-5 subheading font-weight-bold">
        プランの種類は？
      </div>
      <div class="pt-3">
        現在3つのプランがあります。詳細は、
        <nuxt-link
          color="teal"
          to="/inquiry_for_recruiter"
        >
          こちら
        </nuxt-link>
        から確認が出来ます。
      </div>
      <div class="pt-5 subheading font-weight-bold">
        プランを変更、解約するには？
      </div>
      <div class="pt-3">
        support@liplo.jp までご連絡ください。
        <div>
          現在契約しているプランがある場合は、契約期間が終わった後に変更・解約が可能になります。
        </div>
        <div class="pt-3">
          ※ 解約されますと、候補者を採用することが出来なくなるため、採用する予定の候補者がいる場合は、
          採用した後にご解約をお願いします。 また、パスを出している場合は、パスの有効期間が終了するかパスが使用されるまで原則、解約が出来ません。
          <div>
            現在、ベーシック以外のプランを契約していて、今後インターンを採用しないという場合は、
            ベーシックプランに変更していただくと、掲載料金がかからなくなります。
            （本採用の料金は、インターン採用時に加入していたプランの料金となります）
          </div>
          <div class="pt-3">
            どうしても解約せざるを得ない場合は、解約後パスの使用や候補者のステータスの変更などが出来なくなるため、
            候補者の方とメッセージにてやり取りをして頂き、解約前にパスを使用して頂くか、
            両者合意の上で取り消しして頂くことになります。
          </div>
          何か不明な点がございましたら、お問い合わせ又はメールにてご連絡ください。
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
      title: 'プラン - ヘルプ',
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
