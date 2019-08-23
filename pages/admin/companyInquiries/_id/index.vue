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
      <!-- 新規作成 -->
      <div class="pr-3 pt-3 text-xs-right">
        <v-btn @click="dialog = true">企業作成</v-btn>
      </div>
      <div :class="{'px-5': $vuetify.breakpoint.smAndUp}">
        <div class="pt-3 text-color">
          {{ timestamp }}
        </div>
        <!-- company -->
        <div class="pt-4">
          <div>
            <span class="text-color font-weight-bold">
              企業名:
            </span>
            <span class="light-text-color pl-3">{{ companyName }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              部署:
            </span>
            <span class="light-text-color pl-3">{{ department }}</span>
          </div>
        </div>
        <!-- recruiter -->
        <div class="pt-4">
          <div>
            <span class="text-color font-weight-bold">
              担当者名:
            </span>
            <span class="light-text-color pl-3">{{ userName }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              担当者メールアドレス:
            </span>
            <span class="light-text-color pl-3">{{ email }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              役職:
            </span>
            <span class="light-text-color pl-3">{{ position }}</span>
          </div>
        </div>
        <!-- 問い合わせ -->
        <div class="pt-4">
          <span class="text-color font-weight-bold pr-3">
            問い合わせ:
          </span>
          <span v-if="type == 0" class="teal--text font-weight-bold">資料請求したい</span>
          <span v-else-if="type == 1" class="green--text font-weight-bold">詳しく聞きたい</span>
          <span v-else-if="type == 2" class="orange--text font-weight-bold">すぐに導入したい</span>
          <span v-else-if="type == 3" class="orange--text font-weight-bold">その他</span>
          <div v-if="content" class="pt-3 font-weight-bold text-color">内容：</div>
          <div v-if="content" class="return light-text-color">{{ content }}</div>
        </div>
      </div>
    </v-flex>
    <!-- 企業作成 dialog -->
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      width="500"
    >
      <v-card>
        <v-toolbar flat color="white">
          <v-btn class="hidden-sm-and-up" icon @click="dialog=false">
            <v-icon>close</v-icon>
          </v-btn>
          <span
            class="pl-3 text-color font-weight-bold"
            :class="{
              'title': $vuetify.breakpoint.smAndUp,
              'subheading': $vuetify.breakpoint.xsOnly
            }"
          >
            企業作成
          </span>
        </v-toolbar>
        <v-flex
          xs12
          py-3
          class="light-text-color"
          :class="{'px-4': $vuetify.breakpoint.smAndUp, 'px-4 mt-4': $vuetify.breakpoint.xsOnly}"
        >
          <v-form v-model="valid" @submit.prevent="">
            <v-container>
              <v-layout
                column
                justify-center
              >
                <v-flex xs12>
                  <!-- プラン -->
                  <v-select
                    v-model="plan"
                    :items="planItems"
                    label="プラン"
                  ></v-select>
                </v-flex>
                <!-- 作成ボタン -->
                <v-btn
                  :disabled="!valid"
                  class="teal"
                  @click="addCompanyButtonClicked"
                >
                  <span
                    class="font-weight-bold body-1"
                    style="color: #ffffff;"
                  >
                    作成
                  </span>
                </v-btn>
              </v-layout>
            </v-container>
          </v-form>
        </v-flex>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: '企業お問い合わせ',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    dialog: false,
    valid: true,
    plan: 'ベーシック',
    planItems: [
      'ベーシック',
      'スタンダード',
      'アドバンス'
    ]
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isAdmin: state => state.profile.isAdmin,
      isRefreshing: state => state.isRefreshing,
      isLoading: state => state.companyInquiry.isLoading,
      companyName: state => state.companyInquiry.companyName,
      department: state => state.companyInquiry.department,
      userName: state => state.companyInquiry.userName,
      email: state => state.companyInquiry.email,
      position: state => state.companyInquiry.position,
      type: state => state.companyInquiry.type,
      content: state => state.companyInquiry.content,
      timestamp: state => state.companyInquiry.timestamp,
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
      this.queryInquiry(this.$route.params.id)
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    addCompanyButtonClicked() {
      let plan
      if (this.plan == 'ベーシック') {
        plan = 0
      } else if (this.plan == 'スタンダード') {
        plan = 1
      } else if (this.plan == 'アドバンス') {
        plan = 2
      }
      this.addCompany({
        router: this.$router,
        companyName: this.companyName,
        userName: this.userName,
        email: this.email,
        position: this.position,
        plan: plan
      })
    },
    ...mapActions({
      queryInquiry: 'companyInquiry/queryInquiry',
      updateIsLoading: 'companyInquiry/updateIsLoading',
      resetState: 'companyInquiry/resetState',
      addCompany: 'admin/addCompany'
    }),
  }
}
</script>
