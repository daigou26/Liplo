<template>
  <v-layout
    row
    white
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
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 pt-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else xs12 sm8 md6 offset-sm2 offset-md3 pb-4>
      <v-card :flat="$vuetify.breakpoint.xsOnly">
        <v-toolbar flat color="white" class="hidden-xs-only">
          <span class="text-color font-weight-bold subheading">フィードバックを送る</span>
        </v-toolbar>
        <v-flex
          xs12
          class="text-xs-center"
          py-3
          :class="{
            'px-4': $vuetify.breakpoint.smAndUp,
            'px-3 mt-4': $vuetify.breakpoint.xsOnly
          }"
        >
          <div class="text-color text-xs-left px-2">
            <div>
              サービスの質をより良くしていくため、利用していてお気づきになった良い点や改善すべき点について、ご意見をお聞かせください。
            </div>
            <div class="pt-3">
              このフォームはお問い合わせフォームではありません。個別対応は出来かねます。
              ご質問やサポートが必要な方は、
              <nuxt-link to="/contact" class="teal--text">お問い合わせ</nuxt-link>でご対応させて頂きます。
            </div>
          </div>
          <!-- フォーム -->
          <div class="pt-3">
            <v-form v-model="valid">
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <v-flex xs12>
                    <v-select
                      v-model="type"
                      :items="items"
                      class="pt-3"
                      solo
                      required
                    ></v-select>
                    <!-- 内容 -->
                    <v-textarea
                      v-model="content"
                      class="py-2"
                      :rules="contentRules"
                      label="内容（必須）"
                      required
                    ></v-textarea>
                  </v-flex>
                  <!-- 送信ボタン -->
                  <v-btn
                    :disabled="!valid"
                    class="teal"
                    @click="sendButtonClicked"
                  >
                    <span
                      class="font-weight-bold body-1"
                      style="color: #ffffff;"
                    >
                      送信する
                    </span>
                  </v-btn>
                  <div v-if="errorMessage" class="red--text text-xs-left pt-2">
                    エラーが発生しました。もう一度、送信してください。
                  </div>
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
    type: 'バグの報告',
    items: [
      'バグの報告',
      'ご要望',
      '感想',
      'その他'
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
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      isLoading: state => state.appFeedback.isLoading,
      errorMessage: state => state.appFeedback.errorMessage,
    })
  },
  watch: {
    isLoading(isLoading) {
      if (isLoading == false) {
        if (this.errorMessage) {
          this.valid = true
        } else {
          this.snackbar = true
          this.snackbarText = `フィードバックを送信しました。ありがとうございます！`
        }
      }
    },
  },
  methods: {
    sendButtonClicked() {
      this.updateIsLoading(true)
      var type
      'バグの報告',
      'ご要望',
      '感想',
      'その他'
      if (this.type == 'バグの報告') {
        type = 'bugs'
      } else if (this.type == 'ご要望') {
        type = 'requests'
      } else if (this.type == '感想') {
        type = 'comments'
      } else {
        type = 'other'
      }

      this.sendFeedback({
        type: type,
        content: this.content,
      })
      this.valid = false
    },
    ...mapActions({
      sendFeedback: 'appFeedback/sendFeedback',
      updateIsLoading: 'appFeedback/updateIsLoading',
    }),
  }
}
</script>
