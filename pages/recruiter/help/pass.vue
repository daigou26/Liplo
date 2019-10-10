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
        パスとは、企業がインターン終了後の候補者に送ることのできるもので、
        内定取得や入社の権利を与えることが出来ます。（有効期限は企業が自由に設定出来ます）
        <div>
          パスの種類は現在、以下の３種類です。
          一度パスを発行すると、取り消すことが出来ないのでご注意ください。
          （有効期限などの変更は可能です）
        </div>
        <div class="pt-3">
          <div class="font-weight-bold text-color">
            1. 入社パス
          </div>
          <div class="pt-2">
            卒業後の一定期間、入社する権利を与えるパスです（候補者が卒業前に使用した場合は、原則、卒業後に入社という形になります）。
            卒業と同時に入社してもらいたい場合は内定パスを発行してください。
            <div>
              有効期限は、卒業から1,2年を推奨しています。
            </div>
            <div>
              入社パスでの入社月日は、候補者の希望を聞いていただき、すり合わせを行ってください。
              （入社年度に関しては、候補者がパスの使用時に指定します）
            </div>
            <div>
              このパスを発行しすぎると、採用予定人数を上回ってしまう可能性があるため、
              対象者を厳選して発行することを推奨しています。
            </div>
          </div>
        </div>
        <div class="pt-3">
          <div class="font-weight-bold text-color">
            2. 内定パス
          </div>
          <div class="pt-2">
            内定を取得する権利を与えるパスです。
            <div>
              有効期限は、候補者の卒業時期付近を推奨しています。
              （期限を早くしすぎてしまうと、候補者を採用できる可能性が低くなります）
            </div>
            <div>
              内定パスでの入社時期は、候補者の卒業年度に合わせて企業が設定します。
              （例えば、卒業年度が2019年であれば、2020年度と設定して下さい）
            </div>
            <div>
              このパスも入社パス同様、発行しすぎると採用予定人数を上回ってしまう可能性があるため、
              対象者を厳選して発行することを推奨しています。
            </div>
          </div>
        </div>
        <div class="pt-3">
          <div class="font-weight-bold text-color">
            3. 先着パス
          </div>
          <div class="pt-2">
            このパスは、内定パスに使用上限数がついたものです。
            <div>
              使用上限数は企業が設定することが出来ます。
            </div>
            <div>
              先着パスの使用数が、設定した使用上限数に達した場合、候補者は先着パスを使用出来なくなります。
            </div>
            <div>
              入社パスや内定パスは性質上、パスを使う人数が予想しにくいため、あまり発行することが出来ませんが、
              先着パスは使用上限数を自由に設定することが出来るため、数を気にせず発行することができます。
            </div>
            <div>
              先着パスの使用上限数は、サイドバーのパスから設定できます。
            </div>
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
  head () {
    return {
      title: 'パス - ヘルプ',
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
