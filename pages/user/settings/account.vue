<template>
  <v-layout
    white
    row
    wrap
  >
    <v-snackbar
      v-model="snackbar"
      class="px-5"
      color="orange lighten-1"
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
    <v-flex
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md)-->
        <v-flex
          md4
          hidden-sm-and-down
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <settings-menu/>
        </v-flex>
        <!-- settings (lg, md) -->
        <v-flex
          md8
          xs12
          class="py-3"
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex md10 sm6 xs8 offset-md1 offset-sm3 offset-xs2>
            <!-- menu (sm, xs) -->
            <settings-menu class="hidden-md-and-up"></settings-menu>
            <!-- スカウト設定 -->
            <div v-if="type == 'user'" class="pt-5">
              <div class="title textColor pb-4">
                スカウトについて
              </div>
              <v-checkbox
                v-model="tempAcceptScout"
                label="企業からのスカウトを受け取る"
                color="info"
              ></v-checkbox>
              <div class="text-xs-right pb-5">
                <v-btn @click="updateButtonClicked">
                  更新
                </v-btn>
              </div>
            </div>

            <!-- メアド変更 -->
            <div class="title textColor pt-5">
              メールアドレスを変更する
            </div>
            <div class="pt-3">
              現在のメールアドレス： {{ this.currentEmail }}
            </div>
            <div class="text-xs-right pt-4">
              <v-btn @click="changeEmailDialog = true">
                メールアドレスを変更する
              </v-btn>
            </div>
            <!-- アカウント削除 -->
            <div class="title textColor pt-5">
              アカウントの削除
            </div>
            <div class="text-xs-left pt-4">
              <v-btn @click="deleteAccountDialog = true">
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
            <v-toolbar flat color="orange lighten-2">
              <span class="textColor font-weight-bold subheading">メールアドレス変更</span>
            </v-toolbar>
            <div class="pa-4">
              <div class="pb-4">
                新しいメールアドレスとパスワードを入力してください。
              </div>
              <v-form v-model="changeEmailValid">
                <v-container>
                  <v-layout
                    column
                    justify-center
                  >
                    <v-flex xs12>
                      <!-- Error Message -->
                      <v-alert
                        :value="authError != null"
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
                      block
                      :disabled="!changeEmailValid || loading"
                      class="orange darken-1"
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
        <!-- deleteAccountDialog -->
        <v-dialog
          v-model="deleteAccountDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="500"
        >
          <v-card>
            <v-toolbar flat color="orange lighten-2">
              <span class="textColor font-weight-bold subheading">本当に削除しますか？</span>
            </v-toolbar>
            <div class="pa-4">
              <div v-if="type == 'user'" class="pb-4">
                一度アカウントを削除すると復元することができなくなります。 削除する場合は、メールアドレスとパスワードを入力してください。
              </div>
              <div v-else class="pb-4">
                一度アカウントを削除すると復元することができなくなります。 削除する場合は、メールアドレスとパスワードを入力してください。
                <div class="pt-3">
                  <div>注意：</div>
                  <div class="red--text">
                    企業メンバーが1人の状態で、アカウントが削除されると、企業アカウントも削除されます。
                    企業アカウントを残す場合は、メンバーを2人以上にしてから削除してください。
                  </div>
                </div>
              </div>
              <v-form v-model="deleteAccountValid">
                <v-container>
                  <v-layout
                    column
                    justify-center
                  >
                    <v-flex xs12>
                      <!-- Error Message -->
                      <v-alert
                        :value="authError != null"
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
                      block
                      :disabled="!deleteAccountValid || loading"
                      class="orange darken-1"
                      @click="deleteAccountButtonClicked"
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
  components: {
    SettingsMenu
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
      type: state => state.profile.type,
      currentEmail: state => state.profile.email,
      acceptScout: state => state.settings.acceptScout,
      isLoading: state => state.settings.isLoading,
      authError: state => state.authError,
      loading: state => state.loading,
    }),
  },
  mounted() {
    if (this.uid != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.querySettings(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null) {
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
    loading(loading) {
      if (loading == false) {
        this.changeEmailDialog = false
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
      this.setLoading()
      this.resetAuthError()
      this.changeEmail({type: this.type, newEmail: this.newEmail, password: this.password})
    },
    deleteAccountButtonClicked() {
      this.setLoading()
      this.resetAuthError()
      this.deleteAccount(this.password)
      this.deleteAccountDialog = false
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
