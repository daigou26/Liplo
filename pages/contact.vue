<template>
  <v-layout
    row
    white
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
    <v-flex xs12 sm8 md6 offset-sm2 offset-md3 pb-4>
      <v-card :flat="breakpoint == 'xs'">
        <v-toolbar flat color="white" class="hidden-xs-only">
          <span class="text-color font-weight-bold subheading">お問い合わせ</span>
        </v-toolbar>
        <v-flex
          xs12
          class="text-xs-center"
          py-3
          :class="{'px-4': $vuetify.breakpoint.smAndUp, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
        >
          <!-- フォーム -->
          <div>
            <v-form v-model="valid">
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <v-flex xs12>
                    <!-- 氏名 -->
                    <v-text-field
                      v-model="name"
                      class="py-2"
                      :rules="nameRules"
                      label="氏名（必須）"
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
                    <!-- 内容 -->
                    <v-textarea
                      v-model="content"
                      class="py-2"
                      :rules="contentRules"
                      label="お問い合わせ内容（必須）"
                      required
                    ></v-textarea>
                  </v-flex>
                  <!-- 送信ボタン -->
                  <v-btn
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
    name: '',
    nameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
    content: '',
    contentRules: [
      v => !!v || '内容を入力してください',
      v => (v && v.length <= 1000) || '1000文字を超えています'
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
      this.sendContact({
        name: this.name,
        email: this.email,
        content: this.content,
      })
      this.valid = false
      this.snackbar = true
      this.snackbarText = `お問い合わせありがとうございます。こちらからメールをお送りしますので、少々お待ちください。`
    },
    ...mapActions({
      sendContact: 'sendContact',
    }),
  }
}
</script>
