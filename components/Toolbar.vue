<template>
  <v-toolbar>
    <v-toolbar-side-icon　@click="iconClicked"></v-toolbar-side-icon>
    <div class="text-xs-center hidden-sm-and-up">
      <v-dialog
        v-model="dropdownMenu"
        fullscreen
        transition="dialog-bottom-transition"
      >

      <v-layout row class="hidden-sm-and-up" fill-height>
        <v-flex xs12>
          <v-card style="height: 100%;">
            <v-toolbar flat color="white">
              <v-toolbar-side-icon
                @click="iconClicked"
                class="ml-2"
              ></v-toolbar-side-icon>
            </v-toolbar>

            <v-list>
              <v-list-tile
                avatar
                class="px-3"
                to="/"
                @click="dropdownMenu=false"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="textColor">ホーム</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-divider class="mx-4"></v-divider>

              <v-list-tile
                avatar
                class="px-3"
                @click="signUpButtonClicked"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="textColor">登録する</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile
                avatar
                class="px-3"
                @click="signInButtonClicked"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="textColor">ログイン</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
      </v-dialog>
    </div>
    <v-toolbar-title>Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-container fill-height>
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <!-- ログイン中に表示される -->
            <div v-if="user" class="align-center">
              <div class="text-xs-center">
                <v-menu offset-y>
                  <!-- Profile画像 -->
                  <v-btn
                    slot="activator"
                    icon
                    fab
                  >
                    <v-avatar :size="avatarSize">
                      <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                      <v-icon v-else>person</v-icon>
                    </v-avatar>
                  </v-btn>
                  <v-list>
                    <v-list-tile to="/user/profile">
                      <v-list-tile-title>プロフィール</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="signOut">
                      <v-list-tile-title>ログアウト</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </div>
            </div>
            <!-- ログインしていない場合に表示される -->
            <div v-else>
              <v-btn flat @click="signUpButtonClicked">
                <span class="font-weight-bold" style="color: #555555">登録する</span>
              </v-btn>
              <v-btn flat @click="signInButtonClicked">
                <span class="font-weight-bold" style="color: #555555">ログイン</span>
              </v-btn>
              <!-- Auth Dialog -->
              <div class="text-xs-center">
                <v-dialog
                  v-model="dialog"
                  :fullscreen="$vuetify.breakpoint.xsOnly"
                  width="500"
                >
                  <v-card class="pt-5 pb-3 px-3">
                    <v-toolbar flat color="white hidden-sm-and-up">
                      <v-toolbar-side-icon
                        @click="dialog=false"
                      ></v-toolbar-side-icon>
                    </v-toolbar>
                    <v-flex
                      xs12
                      class="text-xs-center"
                      :class="{'px-2': $vuetify.breakpoint.smAndUp, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
                    >
                      <!-- ログインフォーム -->
                      <div v-if="signInDialog">
                        <v-form v-model="valid">
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
                                >
                                  {{ authError }}
                                </v-alert>
                                <!-- メールアドレス -->
                                <v-text-field
                                  v-model="email"
                                  :rules="emailRules"
                                  label="メールアドレス"
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
                              <!-- ログインボタン -->
                              <v-btn
                                block
                                :disabled="!valid || loading"
                                class="orange darken-1"
                                @click="signIn"
                              >
                                <span
                                  class="font-weight-bold body-1"
                                  style="color: #ffffff;"
                                >
                                  ログイン
                                </span>
                              </v-btn>
                            </v-layout>
                          </v-container>
                        </v-form>
                      </div>
                      <!-- 登録フォーム -->
                      <div v-else-if="signUpForm">
                        <v-form v-model="valid">
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
                                >
                                  {{ authError }}
                                </v-alert>
                                <!-- メールアドレス -->
                                <v-text-field
                                  v-model="email"
                                  :rules="emailRules"
                                  label="メールアドレス"
                                  append-icon="mail_outline"
                                  solo
                                  required
                                ></v-text-field>
                                <!-- 名前 -->
                                <v-text-field
                                  v-model="firstName"
                                  :rules="firstNameRules"
                                  label="名"
                                  append-icon="person"
                                  solo
                                  required
                                ></v-text-field>
                                <!-- 苗字 -->
                                <v-text-field
                                  v-model="lastName"
                                  :rules="lastNameRules"
                                  label="姓"
                                  append-icon="person"
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
                              <!-- 登録ボタン -->
                              <v-btn
                                block
                                :disabled="!valid || loading"
                                class="orange darken-1"
                                @click="signUp"
                              >
                                <span
                                  class="font-weight-bold body-1"
                                  style="color: #ffffff;"
                                >
                                  登録する
                                </span>
                              </v-btn>
                            </v-layout>
                          </v-container>
                        </v-form>
                      </div>
                      <!-- 登録方法 -->
                      <div v-else>
                        <!-- メールアドレス登録 -->
                        <v-btn
                          block
                          color="primary"
                          @click="signUpForm=true"
                        >
                          <v-icon>mail_outline</v-icon>
                          <span class="font-weight-bold body-1 ml-2">メールアドレスで登録</span>
                        </v-btn>
                      </div>
                    </v-flex>

                    <v-divider class="mt-4"></v-divider>
                    <!-- アカウントを持っている場合はログイン画面へ -->
                    <v-flex xs12 class="text-xs-center px-2">
                      <div v-if="signInDialog">
                        <span>アカウントをお持ちでない方は</span>
                        <v-btn
                          flat
                          color="primary"
                          @click="signUpButtonClicked"
                        >
                          <span>登録</span>
                        </v-btn>
                      </div>
                      <div v-else>
                        <span>アカウントをお持ちの方は</span>
                        <v-btn
                          flat
                          color="primary"
                          @click="signInButtonClicked"
                        >
                          <span>ログイン</span>
                        </v-btn>
                      </div>
                    </v-flex>
                  </v-card>

                </v-dialog>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { firestore, auth } from '@/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    avatarSize: 40,
    dialog: false,
    signUpDialog: false,
    signUpForm: false,
    signInDialog: false,
    dropdownMenu: false,
    valid: true,
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
    passwordShow: false,
    password: '',
    passwordRules: [
      v => !!v || 'パスワードを入力してください',
      v => (v && v.length >= 8) || '最低8文字必要です'
    ],
  }),
  computed: {
    ...mapGetters([
      'user',
      'imageUrl',
      'authError',
      'loading'
    ])
  },
  mounted() {
    // ログイン時、dbにuser情報保存(localStorageにも保存)
    auth.onAuthStateChanged((user) => {
      console.log('auth state changed')
      if (user) {
        this.$store.dispatch('setUser', user)
        const self = this
        firestore.collection('users').doc(user.uid).get()
          .then(function(doc) {
            if (!doc.exists) {
              const batch = firestore.batch()
              const userRef = firestore.collection('users').doc(user.uid)
              batch.set(userRef, {
                firstName: self.firstName,
                lastName: self.lastName,
              })
              const profileRef = firestore.collection('users')
                .doc(user.uid).collection('profile').doc(user.uid)
              batch.set(profileRef, {
                firstName: self.firstName,
                lastName: self.lastName,
                email: user.email
              })
              batch.commit()
                .then(() => {
                  self.resetData()
                })
                .catch((error) => {
                  console.error("Error adding document: ", error)
                })
            } else {
              console.log('user doc exists')

              self.resetData()
              if (doc.data()['imageUrl'] != null) {
                self.$store.dispatch('setImageUrl', doc.data()['imageUrl'])
              }
            }
          })
      } else {
        this.$store.dispatch('setUser', null)
        if (this.$route.path !== '/' && this.$route.path !== '/posts') {
          this.$router.push('/')
        }
      }
    })
  },
  methods: {
    iconClicked: function() {
      if (this.$vuetify.breakpoint.name == 'xs') {
        this.dropdownMenu = !this.dropdownMenu
      }
    },
    signUpButtonClicked: function() {
      this.dialog = true
      this.signUpDialog = true
      this.signInDialog = false
      this.$store.dispatch('resetAuthError')
    },
    signUp: function() {
      this.$store.dispatch('setLoading')
      this.$store.dispatch('resetAuthError')
      this.$store.dispatch('signUp', {email: this.email, password: this.password})
    },
    signInButtonClicked: function() {
      this.dialog = true
      this.signInDialog = true
      this.signUpDialog = false
      this.$store.dispatch('resetAuthError')
    },
    signIn: function() {
      this.$store.dispatch('setLoading')
      this.$store.dispatch('resetAuthError')
      this.$store.dispatch('signIn', {email: this.email, password: this.password})
    },
    signOut: function() {
      this.$store.dispatch('signOut')
    },
    resetData: function() {
      this.dialog = false
      this.signUpDialog = false
      this.signUpForm = false
      this.signInDialog = false
      this.dropdownMenu = false
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.password = ''
    },
  }
}
</script>

<style>
  .textColor {
    color: #555555;
  }
</style>
