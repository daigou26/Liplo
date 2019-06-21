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
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else xs12>
      <v-flex xs12>
        <!-- 見出し -->
        <v-layout
          align-center
          row
          :style="{ height: windowHeight + 'px' }"
          style="
            background-color: #e0f7fa;
            background-image: linear-gradient(315deg, #e0f7fa 0%, #009688 73%);
          "
        >
          <v-flex
            xs12
            sm9
            md7
            class=" text-xs-center"
            :class="{
              'px-3': $vuetify.breakpoint.xsOnly,
              'padding-left-sm': $vuetify.breakpoint.smOnly,
              'padding-left-md': $vuetify.breakpoint.mdOnly,
              'padding-left-lg': $vuetify.breakpoint.lgOnly,
            }"
          >
            <div class="text-xs-left white--text">
              <h1 class="headline font-weight-bold mb-3">LightHouse</h1>
              <h1
                class="pt-4 font-weight-bold mb-3"
                :class="{
                  'eading-font-size-xs': $vuetify.breakpoint.xsOnly,
                  'heading-font-size-sm': $vuetify.breakpoint.smAndUp,
                }"
                style="max-width: 500px;"
              >
                <div>
                  長期インターンで
                </div>
                <div>
                  採用に変化を
                </div>
              </h1>
              <h4 class="pt-4 subheading font-weight-bold" style="max-width: 500px">
                LightHouse は長期インターンを通して、
                求人者と求職者をマッチングする
                採用プラットフォームです。
                企業の雰囲気や文化、求職者の働き方や性格など
                実際に働いてみないと分からないことをお互いが知ることで、
                ミスマッチを減らし、より良い採用が出来るようサポートをします。
              </h4>
            </div>
          </v-flex>
          <!-- <v-flex xs5>
            <v-img max-width="400" v-bind:src="require('@/assets/images/aurora.png')"/>
          </v-flex> -->
        </v-layout>
        <!-- 機能 -->
        <div class="py-5">
          <div class="text-xs-center font-weight-bold headline text-color">
            機能・特徴
          </div>
          <v-flex xs12 sm8 offset-sm2 class="pt-2">
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs10 sm8 md6 offset-xs1 offset-sm2 offset-md3 class="pt-4">
            <div class="py-4 text-color">
              <div class="font-weight-bold subheading text-color">
                1. 募集
              </div>
              <div class="pt-2">
                募集を作成して企業や仕事の魅力を伝えましょう。
              </div>
            </div>
            <div class="py-4 text-color">
              <div class="font-weight-bold subheading text-color">
                2. スカウト
              </div>
              <div class="pt-2">
                気になる求職者がいたらスカウトをしてアプローチしましょう。
              </div>
            </div>
            <div class="py-4 text-color">
              <div class="font-weight-bold subheading text-color">
                3. レビュー
              </div>
              <div class="pt-2">
                インターン後、候補者にレビューをしてもらえます。これにより、候補者から見た
                企業の良い点や改善すべき点などを知ることが出来ます。また、良いレビューをもらえると
                検索で上位に表示されるため、求職者に認知されやすくなります。
              </div>
            </div>
            <div class="py-4 text-color">
              <div class="font-weight-bold subheading text-color">
                4. パス
              </div>
              <div class="pt-2">
                インターン後、企業が採用したいと思う候補者にパスを渡すことが出来ます。
                パスを発行することで、候補者に入社や内定取得の権利を与えることができます。
                これにより、優秀な求職者の採用機会を増やすことが出来ます。
              </div>
            </div>
          </v-flex>
        </div>
        <!-- 料金 -->
        <div class="py-5">
          <div class="pb-3 text-xs-center font-weight-bold headline text-color">
            料金プラン
          </div>
          <v-flex xs12 sm8 md6 offset-sm2 offset-md3>
            <v-card class="text-xs-center ma-2">
              <div class="py-3 font-weight-bold text-color">
                成功報酬型
              </div>
              <v-divider class="mx-3"></v-divider>
              <div class="py-4 text-color">
                <div>
                  採用人数に応じて
                </div>
                <div>
                  費用が発生します
                </div>
              </div>
              <v-divider class="mx-3"></v-divider>
              <div class="py-4 text-color">
                <div>
                  募集作成やスカウトなど
                </div>
                <div>
                  すべての機能を制限なく使用できます
                </div>
              </div>
              <v-divider class="mx-3"></v-divider>
              <div class="py-4 text-color">
                掲載期間は6ヶ月（自動更新）
              </div>
            </v-card>
            <div class="pt-2 light-text-color text-xs-right">
              ※ 料金プランは今後増える予定です。
            </div>
          </v-flex>
        </div>
      </v-flex>
      <v-flex xs12 sm8 md6 offset-sm2 offset-md3 class="py-5">
        <!-- フォーム -->
        <div class="pb-3 text-xs-center font-weight-bold headline text-color">
          資料請求・お問い合わせ
        </div>
        <v-card class="ma-2">
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
                        placeholder="例）採用担当、CEOなど"
                        required
                      ></v-text-field>
                      <!-- 要望 -->
                      <v-select
                        v-model="type"
                        class="py-2"
                        :items="typeItems"
                        label="お問い合わせの種類"
                      ></v-select>
                      <!-- 内容 -->
                      <v-textarea
                        v-model="content"
                        class="py-2"
                        :rules="contentRules"
                        label="お問い合わせ内容"
                        placeholder="何かございましたらご記入ください。"
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
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    windowHeight: 0,
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
    type: '資料請求',
    typeItems: [
      '資料請求',
      '質問がしたい',
      'すぐにサービスを導入したい'
    ],
    content: '',
    contentRules: [
      v => (v.length <= 300) || '300文字以内でお願いします'
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
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight
  },
  methods: {
    sendButtonClicked() {
      let type
      if (this.type == '資料請求') {
        type = 0
      } else if (this.type == '質問がしたい') {
        type = 1
      } else if (this.type == 'すぐにサービスを導入したい') {
        type = 2
      }

      this.addInquiry({
        companyName: this.companyName,
        companyEmail: this.companyEmail,
        userName: this.lastName + ' ' + this.firstName,
        email: this.email,
        position: this.position,
        type: type,
        content: this.content
      })
      this.valid = false
      this.snackbar = true
      this.snackbarText = `送信が完了しました。こちらからメールをお送りしますので、少々お待ちください。`
    },
    ...mapActions({
      addInquiry: 'inquiry/addInquiry',
    }),
  }
}
</script>
<style>
.padding-left-lg {
  padding-left: 120px;
}
.padding-left-md {
  padding-left: 100px;
}
.padding-left-sm {
  padding-left: 80px;
}
.heading-font-size-sm {
  font-size: 40px;
}
.heading-font-size-xs {
  font-size: 30px;
}
</style>
