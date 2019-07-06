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
        候補者管理について
      </div>
      <div class="pt-5 subheading font-weight-bold">
        候補者のステータスを変更するには？
      </div>
      <div class="pt-3">
        候補者管理画面のステータスタブから変更することが出来ます。
        <div>
          ステータスには、応募、スカウト、選考、インターン、パス、入社予定、入社、不採用があります。
          ステータスを入社、または、不採用にすると、候補者一覧にその候補者が表示されなくなります。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        インターンを延長するには？
      </div>
      <div class="pt-3">
        候補者のステータスがインターンに変更された時点で、候補者管理画面に、インターン延長の項目が表示されます。
        インターン延長の編集ボタンから設定することが出来ます。
        <div class="pt-3">
          <span class="font-weight-bold">パスを発行する場合</span>は、ステータスをパスに変更した後、インターン延長の設定をしてください。
          インターンの延長を終了する場合は、インターン延長の編集ボタンから終了するを選択して下さい。
        </div>
        <div class="pt-3">
          <span class="font-weight-bold">パスを発行しない場合</span>は、ステータスはインターンのままで、インターン延長の設定をしてください。
          インターンの延長を終了する場合は、ステータスを不採用に変更してください。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        候補者管理画面にあるタグとは？
      </div>
      <div class="pt-3">
        タグは、候補者の情報を付け加えるための機能です。
        <div>
          例えば、候補者の職種などを入力しておくと便利です。
          タグは複数入力可能です。
        </div>
      </div>
      <div class="pt-5 subheading font-weight-bold">
        候補者の評価を共有するには？
      </div>
      <div class="pt-3">
        候補者管理画面のレビュータブから、候補者の評価を記入することが出来ます。
        ここには、他の担当者のレビューも表示されるので、評価を共有することが出来ます。
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
