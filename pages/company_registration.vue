<template>
  <v-layout
    row
    white
    wrap
  >
    <v-snackbar
      v-model="snackbar"
      color="orange lighten-2"
      :multi-line="true"
      :timeout="6000"
      :top="true"
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
    <v-flex xs12 sm8 md6 offset-sm2 offset-md3>
      <v-card>
        <v-toolbar flat color="white">
          <span class="textColor font-weight-bold subheading">資料請求・お問い合わせ</span>
        </v-toolbar>
        <v-flex
          xs12
          class="text-xs-center"
          py-3
          :class="{'px-4': $vuetify.breakpoint.smAndUp, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
        >
          <!-- 登録フォーム -->
          <div>
            <v-form v-model="valid">
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <v-flex xs12>
                    <!-- 企業名 -->
                    <v-text-field
                      v-model="companyName"
                      class="py-2"
                      :rules="companyNameRules"
                      label="企業名（必須）"
                      required
                    ></v-text-field>
                    <!-- 企業メールアドレス -->
                    <v-text-field
                      v-model="companyEmail"
                      class="py-2"
                      :rules="emailRules"
                      label="企業メールアドレス（必須）"
                      required
                    ></v-text-field>
                    <!-- 苗字 -->
                    <v-text-field
                      v-model="lastName"
                      class="py-2"
                      :rules="lastNameRules"
                      label="姓（必須）"
                      required
                    ></v-text-field>
                    <!-- 名前 -->
                    <v-text-field
                      v-model="firstName"
                      class="py-2"
                      :rules="firstNameRules"
                      label="名（必須）"
                      required
                    ></v-text-field>
                    <!-- メールアドレス -->
                    <v-text-field
                      v-model="email"
                      class="py-2"
                      :rules="emailRules"
                      label="メールアドレス（必須）"
                      required
                    ></v-text-field>
                    <!-- 役職 -->
                    <v-text-field
                      v-model="position"
                      class="py-2"
                      :rules="positionRules"
                      label="役職（必須）"
                      required
                    ></v-text-field>
                    <!-- 要望 -->
                    <v-select
                      v-model="inquiry"
                      class="py-2"
                      :items="inquiryItems"
                      label="お問い合わせ内容"
                    ></v-select>
                  </v-flex>
                  <!-- 送信ボタン -->
                  <v-btn
                    block
                    :disabled="!valid"
                    class="orange darken-1"
                    @click="sendButtonClicked"
                  >
                    <span
                      class="font-weight-bold body-1"
                      style="color: #ffffff;"
                    >
                      送信する
                    </span>
                  </v-btn>
                </v-layout>
              </v-container>
            </v-form>
          </div>
        </v-flex>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    snackbar: false,
    snackbarText: '',
    valid: true,
    companyName: '',
    companyNameRules: [
      v => !!v || '企業名を入力してください',
      v => (v && v.length <= 100) || '100文字を超えています'
    ],
    companyEmail: '',
    companyEmailRules: [
      v => !!v || '企業のメールアドレスを入力してください',
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
    firstName: '',
    lastName: '',
    firstNameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    lastNameRules: [
      v => !!v || '苗字を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
    position: '',
    positionRules: [
      v => !!v || '入力されていません',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    inquiry: '資料請求',
    inquiryItems: [
      '資料請求',
      'すぐにサービスを導入したい'
    ],
  }),
  computed: {
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
  },
  methods: {
    sendButtonClicked() {
      this.addCompany({
        companyName: this.companyName,
        companyEmail: this.companyEmail,
        userName: this.lastName + ' ' + this.firstName,
        email: this.email,
        position: this.position,
        inquiry: this.inquiry,
      })
      this.valid = false
      this.snackbar = true
      this.snackbarText = `送信が完了しました。こちらからメールをお送りしますので、少々お待ちください。`
    },
    ...mapActions({
      addCompany: 'company/addCompany',
    }),
  }
}
</script>
