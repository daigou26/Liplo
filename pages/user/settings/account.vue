<template>
  <v-layout
    white
    row
    wrap
  >
    <v-snackbar
      v-model="snackbar"
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
    <!-- loading -->
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid && uid != ''"
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md, sm)-->
        <v-flex
          sm4
          hidden-xs-only
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <settings-menu/>
        </v-flex>
        <!-- settings -->
        <v-flex
          sm8
          xs12
          class="py-3"
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex xs10 offset-xs1>
            <!-- スカウト設定 -->
            <div v-if="type == 'user'" class="pt-5">
              <div class="title text-color pb-4">
                スカウトについて
              </div>
              <v-checkbox
                v-model="tempAcceptScout"
                label="企業からのスカウトを受け取る"
                color="info"
              ></v-checkbox>
              <div class="text-xs-right pb-3">
                <v-btn @click="updateButtonClicked">
                  更新
                </v-btn>
              </div>
            </div>

            <!-- メアド変更 -->
            <div class="title text-color pt-5">
              メールアドレスを変更する
            </div>
            <div class="text-color pt-4">
              現在のメールアドレス： {{ currentEmail }}
            </div>
            <div class="pt-3 light-text-color">
              メールアドレスが正常に変更された場合、変更確認メールが元のメールアドレスに届きます。
              <div class="pt-3">
                ※ メールアドレスを戻したい場合は、まず、届いた確認メールのリンクをクリックしてください。
                次に、サービスに戻り、一度ログアウトしてから元のメールアドレスで再ログインすることで、
                メールアドレスのリセットが完了します。
              </div>
            </div>
            <div class="text-xs-right pt-4 pb-3">
              <v-btn @click="changeEmailButtonClicked">
                メールアドレスを変更する
              </v-btn>
            </div>
            <!-- アカウント削除 -->
            <div class="title text-color pt-5">
              アカウントの削除
            </div>
            <div class="text-xs-left pt-4">
              <v-btn @click="deleteAccountButtonClicked">
                アカウントを削除する
              </v-btn>
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
                新しいメールアドレスとパスワードを入力してください。
              </div>
              <v-form v-model="changeEmailValid" @submit.prevent="">
                <v-container>
                  <v-layout
                    column
                    justify-center
                  >
                    <v-flex xs12>
                      <!-- Error Message -->
                      <v-alert
                        :value="authError != null && authError != ''"
                        type="error"
                        class="mb-5"
                        outline
                      >
                        {{ authError }}
                      </v-alert>
                      <!-- メールアドレス -->
                      <v-text-field
                        v-model="newEmail"
                        :rules="emailRules"
                        label="新しいメールアドレス"
                        append-icon="mail_outline"
                        solo
                        required
                      ></v-text-field>
                      <!-- パスワード -->
                      <v-text-field
                        v-model="password"
                        :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                        :rules="passwordRules"
                        :type="passwordShow ? 'text' : 'password'"
                        label="パスワード"
                        solo
                        required
                        @click:append="passwordShow = !passwordShow"
                      ></v-text-field>
                    </v-flex>
                    <!-- 変更ボタン -->
                    <v-btn
                      :disabled="!changeEmailValid || loading"
                      class="teal lighten-1"
                      @click="changeEmailDialogButtonClicked"
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
        <!-- deleteAccountDialog -->
        <v-dialog
          v-model="deleteAccountDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="500"
        >
          <v-card>
            <v-toolbar flat>
              <span class="text-color font-weight-bold subheading">本当に削除しますか？</span>
            </v-toolbar>
            <div class="pa-4">
              <div v-if="type == 'user'" class="pb-4">
                一度アカウントを削除すると復元することができなくなります。 削除する場合は、パスワードを入力してください。
              </div>
              <div v-else class="pb-4">
                一度アカウントを削除すると復元することができなくなります。 削除する場合は、パスワードを入力してください。
                <div class="pt-3">
                  <div>注意：</div>
                  <div class="red--text">
                    企業メンバーが1人の状態で、アカウントが削除されると、企業アカウントも削除されます。
                    企業アカウントを残す場合は、メンバーを2人以上にしてから削除してください。
                  </div>
                </div>
              </div>
              <v-form
                v-model="deleteAccountValid"
                @submit.prevent=""
              >
                <v-container>
                  <v-layout
                    column
                    justify-center
                  >
                    <v-flex xs12>
                      <!-- Error Message -->
                      <v-alert
                        :value="authError != null && authError != ''"
                        type="error"
                        class="mb-5"
                        outline
                      >
                        {{ authError }}
                      </v-alert>
                      <!-- パスワード -->
                      <v-text-field
                        v-model="password"
                        :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                        :rules="passwordRules"
                        :type="passwordShow ? 'text' : 'password'"
                        label="パスワード"
                        solo
                        required
                        @click:append="passwordShow = !passwordShow"
                      ></v-text-field>
                    </v-flex>
                    <!-- 削除ボタン -->
                    <v-btn
                      :disabled="!deleteAccountValid || loading"
                      class="teal lighten-1"
                      @click="deleteAccountDialogButtonClicked"
                    >
                      <span
                        class="font-weight-bold body-1"
                        style="color: #ffffff;"
                      >
                        アカウントを削除
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
import SettingsMenu from '~/components/SettingsMenu'

export default {
  middleware: 'auth',
  components: {
    SettingsMenu
  },
  head () {
    return {
      title: 'アカウント設定',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    tempAcceptScout: true,
    snackbar: false,
    snackbarText: '',
    changeEmailDialog: false,
    changeEmailValid: true,
    deleteAccountDialog: false,
    deleteAccountValid: true,
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
      isRefreshing: state => state.isRefreshing,
      type: state => state.profile.type,
      currentEmail: state => state.profile.email,
      acceptScout: state => state.settings.acceptScout,
      isLoading: state => state.settings.isLoading,
      authError: state => state.authError,
      loading: state => state.loading,
    }),
  },
  mounted() {
    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.querySettings(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.querySettings(uid)
      }
    },
    acceptScout(acceptScout) {
      if (acceptScout != null) {
        this.tempAcceptScout = acceptScout
      }
    },
    authError(authError) {
      if (authError && authError != '') {
        this.changeEmailValid = true
        this.deleteAccountValid = true
      } else if (authError == '') {
        this.changeEmailDialog = false
        this.deleteAccountDialog = false
      }
    }
  },
  methods: {
    updateButtonClicked() {
      this.updateAcceptScout({
        uid: this.uid,
        acceptScout: this.tempAcceptScout,
      })
      this.snackbar = true
      this.snackbarText = 'アカウント設定を更新しました！'
    },
    changeEmailButtonClicked() {
      this.resetAuthError()
      this.changeEmailDialog = true
    },
    // ダイアログ内のボタン
    changeEmailDialogButtonClicked() {
      this.setLoading()
      this.resetAuthError()
      this.changeEmail({type: this.type, newEmail: this.newEmail, password: this.password})
    },
    deleteAccountButtonClicked() {
      this.resetAuthError()
      this.deleteAccountDialog = true
    },
    // ダイアログ内のボタン
    deleteAccountDialogButtonClicked() {
      this.setLoading()
      this.resetAuthError()
      this.deleteAccount({type: this.type, password: this.password})
    },
    ...mapActions({
      querySettings: 'settings/querySettings',
      updateAcceptScout: 'settings/updateAcceptScout',
      updateIsLoading: 'settings/updateIsLoading',
      resetState: 'settings/resetState',
      changeEmail: 'changeEmail',
      deleteAccount: 'deleteAccount',
      setLoading: 'setLoading',
      resetAuthError: 'resetAuthError',
    }),
  }
}
</script>
