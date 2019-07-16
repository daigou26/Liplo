<template>
  <v-layout
    white
    row
    wrap
  >
    <v-snackbar
      v-model="snackbar"
      class="px-5"
      color="teal lighten-1"
      :multi-line="true"
      :timeout="6000"
      :left="true"
      :bottom="true"
    >
      {{ snackbarText }}
      <v-btn
        color="white"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-flex
      v-if="uid && uid != ''"
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- settings (lg, md) -->
        <v-flex
          md10
          xs12
          class="py-3"
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex md10 sm8 xs10 offset-md1 offset-sm2 offset-xs1 class="text-color">
            <!-- メアド変更 -->
            <div class="pt-5">
              <div
                class="title font-weight-bold">
                企業メールアドレスを変更する
              </div>
              <div class="pt-3">
                現在のメールアドレス： {{ email }}
              </div>
              <div class="text-xs-right pt-4">
                <v-btn @click="changeEmailDialog = true">
                  メールアドレスを変更する
                </v-btn>
              </div>
            </div>
            <!-- 請求書を送るメアド変更 -->
            <div class="py-5">
              <div
                class="title font-weight-bold">
                請求書を送るメールアドレスを変更する
              </div>
              <div class="pt-3">
                現在のメールアドレス： {{ invoiceEmail }}
              </div>
              <div class="text-xs-right pt-4">
                <v-btn @click="changeInvoiceEmailDialog = true">
                  メールアドレスを変更する
                </v-btn>
              </div>
            </div>
            <!-- プラン変更 -->
            <div class="py-5">
              <div
                class="title font-weight-bold">
                プランについて
              </div>
              <div class="pt-3">
                現在のプラン：
                <span v-if="planText" class="light-text-color font-weight-bold">{{ planText }}</span>
              </div>
              <div class="pt-3">
                <div v-if="plan == 0">
                  このプランは、6ヶ月ごとに自動更新されます。
                </div>
                自動更新の停止やプランの変更、解約などは、お手数ですが、support@liplo.jp までご連絡ください。
                <div v-if="plan != null" class="light-text-color pt-3">
                  ※ 解約されますと、候補者を採用することが出来なくなるため、採用する予定の候補者がいる場合は、
                  採用した後にご解約をお願いします。
                  また、パスを出している場合は、有効期間が終了するかパスが使用されるまで原則、解約が出来ません。
                  <div>
                    現在、採用報酬型以外のプランを契約していて、今後インターンを採用しないという場合は、
                    採用報酬型プランに変更していただくと、掲載料金がかからなくなります。
                    （本採用の料金は、インターン採用時のプランの料金となります）
                  </div>
                  <div>
                    どうしても解約せざるを得ない場合は、解約後パスの使用や候補者のステータスの変更などが出来なくなるため、
                    候補者の方とメッセージにてやり取りをして頂き、解約前にパスを使用して頂くか、
                    両者合意の上で取り消しして頂くことになります。
                    何か不明な点がございましたら、お問い合わせよりご連絡ください。
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
        </v-flex>
        <!-- changeEmailDialog -->
        <v-dialog
          v-model="changeEmailDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="500"
        >
          <v-card>
            <v-toolbar flat>
              <span class="text-color font-weight-bold subheading">メールアドレス変更</span>
            </v-toolbar>
            <div class="pa-4">
              <div class="pb-4">
                新しいメールアドレスを入力してください。
              </div>
              <v-form v-model="emailValid">
                <v-container>
                  <v-layout
                    column
                    justify-center
                  >
                    <v-flex xs12>
                      <!-- メールアドレス -->
                      <v-text-field
                        v-model="newEmail"
                        :rules="emailRules"
                        label="新しいメールアドレス"
                        append-icon="mail_outline"
                        solo
                        required
                      ></v-text-field>
                    </v-flex>
                    <!-- 変更ボタン -->
                    <v-btn
                      :disabled="!emailValid"
                      class="teal"
                      @click="changeEmailButtonClicked"
                    >
                      <span
                        class="font-weight-bold body-1"
                        style="color: #ffffff;"
                      >
                        メールアドレス変更
                      </span>
                    </v-btn>
                  </v-layout>
                </v-container>
              </v-form>
            </div>
          </v-card>
        </v-dialog>
        <!-- changeInvoiceEmailDialog -->
        <v-dialog
          v-model="changeInvoiceEmailDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="500"
        >
          <v-card>
            <v-toolbar flat>
              <span class="text-color font-weight-bold subheading">請求書の送信先変更</span>
            </v-toolbar>
            <div class="pa-4">
              <div class="pb-4">
                新しいメールアドレスを入力してください。
              </div>
              <v-form v-model="emailValid">
                <v-container>
                  <v-layout
                    column
                    justify-center
                  >
                    <v-flex xs12>
                      <!-- メールアドレス -->
                      <v-text-field
                        v-model="newEmail"
                        :rules="emailRules"
                        label="新しいメールアドレス"
                        append-icon="mail_outline"
                        solo
                        required
                      ></v-text-field>
                    </v-flex>
                    <!-- 変更ボタン -->
                    <v-btn
                      :disabled="!emailValid"
                      class="teal"
                      @click="changeEmailButtonClicked"
                    >
                      <span
                        class="font-weight-bold body-1"
                        style="color: #ffffff;"
                      >
                        メールアドレス変更
                      </span>
                    </v-btn>
                  </v-layout>
                </v-container>
              </v-form>
            </div>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: '企業設定',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    snackbar: false,
    snackbarText: '',
    changeEmailDialog: false,
    changeInvoiceEmailDialog: false,
    emailValid: true,
    newEmail: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
  }),
  computed: {
    planText() {
      if (this.plan == 0) {
        return '採用報酬型'
      } else if (this.plan == 1) {
        return 'アルファ（掲載課金型）'
      } else if (this.plan == 2) {
        return 'ベータ（掲載課金型）'
      } else if (this.plan == null) {
        return '未契約'
      }
    },
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
      uid: state => state.uid,
      type: state => state.profile.type,
      companyId: state => state.profile.companyId,
      companyName: state => state.company.companyName,
      email: state => state.company.email,
      plan: state => state.company.plan,
      invoiceEmail: state => state.company.invoiceEmail,
    }),
  },
  mounted() {
    if (this.companyId != null && !this.isQueried) {
      this.queryCompanyInfo(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.queryCompanyInfo(companyId)
      }
    },
  },
  methods: {
    changeEmailButtonClicked() {
      if (this.changeEmailDialog) {
        this.updateCompanyEmail({companyId: this.companyId, companyName: this.companyName, email: this.newEmail})
        this.changeEmailDialog = false
      } else if (this.changeInvoiceEmailDialog) {
        this.updateInvoiceEmail({companyId: this.companyId, companyName: this.companyName, email: this.newEmail})
        this.changeInvoiceEmailDialog = false
      }
      this.newEmail = ''
      this.snackbar = true
      this.snackbarText = 'メールアドレスを更新しました！ 変更完了メールが届いているかご確認ください。（届くのに少々時間がかかる場合がございます）'
    },
    ...mapActions({
      queryCompanyInfo: 'company/queryCompanyInfo',
      updateCompanyEmail: 'company/updateCompanyEmail',
      updateInvoiceEmail: 'company/updateCompanyInvoiceEmail',
    }),
  }
}
</script>
