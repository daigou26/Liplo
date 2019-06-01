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
    <v-flex v-else-if="uid" xs12 class="py-3 break">
      <!-- 新規作成 -->
      <div class="pr-3 pt-3 text-xs-right">
        <v-btn @click="dialog = true">企業作成</v-btn>
      </div>
      <div :class="{'px-5': $vuetify.breakpoint.smAndUp}">
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
              企業メールアドレス:
            </span>
            <span class="light-text-color pl-3">{{ companyEmail }}</span>
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
          <span v-if="type == 0" class="teal--text font-weight-bold">資料請求</span>
          <span v-else-if="type == 1" class="green--text font-weight-bold">質問がしたい</span>
          <span v-else-if="type == 2" class="orange--text font-weight-bold">すぐに導入したい</span>
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
          <v-form v-model="valid">
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
                  class="orange darken-1"
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
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    dialog: false,
    valid: true,
    plan: '成功報酬',
    planItems: [
      '成功報酬'
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
      isLoading: state => state.inquiry.isLoading,
      companyName: state => state.inquiry.companyName,
      companyEmail: state => state.inquiry.companyEmail,
      userName: state => state.inquiry.userName,
      email: state => state.inquiry.email,
      position: state => state.inquiry.position,
      type: state => state.inquiry.type,
      content: state => state.inquiry.content,
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
      if (this.plan == '成功報酬') {
        plan = 0
      }
      this.addCompany({
        router: this.$router,
        companyName: this.companyName,
        companyEmail: this.companyEmail,
        userName: this.userName,
        email: this.email,
        position: this.position,
        plan: plan
      })
    },
    ...mapActions({
      queryInquiry: 'inquiry/queryInquiry',
      updateIsLoading: 'inquiry/updateIsLoading',
      resetState: 'inquiry/resetState',
      addCompany: 'admin/addCompany'
    }),
  }
}
</script>
