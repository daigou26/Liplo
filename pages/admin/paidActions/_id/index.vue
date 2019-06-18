<template>
  <v-layout
    row
    white
    wrap
  >
    <!-- loading -->
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="isLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="uid && uid != ''" xs12 class="py-3 break">
      <!-- 企業ページ -->
      <v-btn class="ml-3 mt-3" outline color="teal" :to="'/admin/companies/' + companyId">企業ページ</v-btn>
      <!-- 企業の請求一覧 -->
      <v-btn class="mt-3" outline color="teal" :to="'/admin/companies/' + companyId + '/invoice'">企業の請求一覧</v-btn>
      <div  class="pt-4" :class="{'px-5': $vuetify.breakpoint.smAndUp}">
        <div class="pt-4">
          <div>
            <span class="text-color font-weight-bold">
              企業名:
            </span>
            <span class="light-text-color pl-3">{{ companyName }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              請求先メールアドレス:
            </span>
            <span class="light-text-color pl-3">{{ invoiceEmail }}</span>
          </div>
        </div>
        <div class="pt-4">
          <div>
            <span class="text-color font-weight-bold">
              日時:
            </span>
            <span class="light-text-color pl-3">{{ timestamp }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              type:
            </span>
            <span class="light-text-color pl-3">{{ type }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              無料枠:
            </span>
            <span class="light-text-color pl-3">{{ isFree }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              プラン:
            </span>
            <span class="light-text-color pl-3">{{ planText }}</span>
          </div>
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
    isQueried: false,
    windowHeight: 0,
  }),
  computed: {
    planText() {
      if (this.plan == 0) {
        return '採用報酬型'
      } else if (this.plan == 1) {
        return 'アルファ（掲載課金型）'
      } else if (this.plan == 2) {
        return 'ベータ（掲載課金型）'
      }
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isAdmin: state => state.profile.isAdmin,
      isRefreshing: state => state.isRefreshing,
      isLoading: state => state.paidAction.isLoading,
      companyId: state => state.paidAction.companyId,
      companyName: state => state.paidAction.companyName,
      companyImageUrl: state => state.paidAction.companyImageUrl,
      invoiceEmail: state => state.paidAction.invoiceEmail,
      type: state => state.paidAction.type,
      isFree: state => state.paidAction.isFree,
      plan: state => state.paidAction.plan,
      timestamp: state => state.paidAction.timestamp,
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 30

    if (this.isAdmin) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryPaidAction(this.$route.params.id)
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions({
      queryPaidAction: 'paidAction/queryPaidAction',
      updateIsLoading: 'paidAction/updateIsLoading',
      resetState: 'paidAction/resetState',
    }),
  }
}
</script>
