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
      v-if="uid"
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
          <v-flex md10 sm8 xs10 offset-md1 offset-sm2 offset-xs1>
            <!-- 請求書を送るメアド変更 -->
            <div
              class="title textColor pt-5">
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
          </v-flex>
        </v-flex>
        <!-- changeInvoiceEmailDialog -->
        <v-dialog
          v-model="changeInvoiceEmailDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="500"
        >
          <v-card>
            <v-toolbar flat color="orange lighten-2">
              <span class="textColor font-weight-bold subheading">メールアドレス変更</span>
            </v-toolbar>
            <div class="pa-4">
              <div class="pb-4">
                新しいメールアドレスを入力してください。
              </div>
              <v-form v-model="changeInvoiceEmailValid">
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
                      block
                      :disabled="!changeInvoiceEmailValid"
                      class="orange darken-1"
                      @click="changeInvoiceEmailButtonClicked"
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
  data: () => ({
    isQueried: false,
    snackbar: false,
    snackbarText: '',
    changeInvoiceEmailDialog: false,
    changeInvoiceEmailValid: true,
    newEmail: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
    passwordShow: false,
    password: '',
    passwordRules: [
      v => !!v || 'パスワードを入力してください',
      v => (v && v.length >= 8) || '最低8文字必要です'
    ],
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
      uid: state => state.uid,
      type: state => state.profile.type,
      companyId: state => state.profile.companyId,
      currentEmail: state => state.profile.email,
      invoiceEmail: state => state.company.invoiceEmail,
    }),
  },
  mounted() {
    if (this.companyId != null && !this.isQueried) {
      this.queryCompanyInvoiceEmail(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.queryCompanyInvoiceEmail(companyId)
      }
    },
  },
  methods: {
    changeInvoiceEmailButtonClicked() {
      this.updateInvoiceEmail({companyId: this.companyId, email: this.newEmail})
      this.changeInvoiceEmailDialog = false
      this.snackbar = true
      this.snackbarText = 'メールアドレスを更新しました！'
    },
    ...mapActions({
      queryCompanyInvoiceEmail: 'company/queryCompanyInvoiceEmail',
      updateInvoiceEmail: 'company/updateCompanyInvoiceEmail',
    }),
  }
}
</script>
