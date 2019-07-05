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
      class="break"
      :class="{
        'px-5': $vuetify.breakpoint.smOnly,
        'px-4': $vuetify.breakpoint.xsOnly,
      }"
    >
      <div class="pt-5 headline font-weight-bold text-color">
        ヘルプ
      </div>
      <div class="pt-5">
        <nuxt-link
          to="/recruiter/help/how_to_use"
          class="help-link teal--text"
          style="font-size: 18px"
        >
          サービスの基本的な使い方
        </nuxt-link>
      </div>
      <div class="title font-weight-bold text-color" style="padding-top: 100px">
        さらに詳しく
      </div>
      <v-divider class="mt-3"></v-divider>
      <v-layout wrap row class="pt-3">
        <v-flex xs6>
          <v-list>
            <template v-for="(item, index) in leftHelpItems">
              <div class="pt-3">
                <nuxt-link
                  :to="item.url"
                  class="help-link teal--text"
                  style="font-size: 16px"
                >
                  {{ item.title }}
                </nuxt-link>
              </div>
            </template>
          </v-list>
        </v-flex>
        <v-flex xs6>
          <v-list>
            <template v-for="(item, index) in rightHelpItems">
              <div class="pt-3">
                <nuxt-link
                  :to="item.url"
                  class="help-link teal--text"
                  style="font-size: 16px"
                >
                  {{ item.title }}
                </nuxt-link>
              </div>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  data: () => ({
    leftHelpItems: [
      {
        title: '募集',
        url: '/recruiter/help/job'
      },
      {
        title: 'スカウト',
        url: '/recruiter/help/scout'
      },
      {
        title: '候補者管理',
        url: '/recruiter/help/candidate'
      },
      {
        title: 'レビュー',
        url: '/recruiter/help/review'
      },
      {
        title: 'フィードバック',
        url: '/recruiter/help/feedback'
      },
      {
        title: 'パス',
        url: '/recruiter/help/pass'
      },
      {
        title: 'メッセージ',
        url: '/recruiter/help/message'
      },
    ],
    rightHelpItems: [
      {
        title: '料金プラン',
        url: '/recruiter/help/plan'
      },
      {
        title: '請求書',
        url: '/recruiter/help/invoice'
      },
    ]
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
<style>
.help-link {
  color: #555555;
  text-decoration: inherit;
}
</style>
