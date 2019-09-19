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
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else xs12>
      <v-flex xs12>
        <!-- 見出し -->
        <v-layout
          class="main-boder main-bg"
          row
          wrap
          justify-center
          align-center
          px-3
          :class="{
            'main-padding-top-sm': $vuetify.breakpoint.smAndDown,
            'main-padding-top-md': $vuetify.breakpoint.mdOnly,
            'main-padding-top-lg': $vuetify.breakpoint.lgAndUp,
          }">
          <v-flex xs12>
            <div class="white--text font-weight-bold text-xs-center pb-5 display-3 hidden-xs-only">
              Liplo
            </div>
            <div class="white--text font-weight-bold text-xs-left pl-3 display-2 hidden-sm-and-up">
              Liplo
            </div>
          </v-flex>
          <v-flex white--text xs12 hidden-sm-and-up class="pt-4 px-3">
            <h1
              class="pt-4 font-weight-bold mb-3"
              :class="{
                'heading-font-size-xs': $vuetify.breakpoint.xsOnly,
                'heading-font-size-sm': $vuetify.breakpoint.smAndUp,
              }"
              style="max-width: 500px; padding:0 0 20px 0"
            >
              <div>
                長期インターンで
              </div>
              <div>
                採用に変化を
              </div>
            </h1>
            Liplo は長期インターンを通して、 求人者と求職者をマッチングする 採用プラットフォームです。
            企業の雰囲気や文化、求職者の働き方や性格など実際に働いてみないと分からないことをお互いが知ることで、
            ミスマッチを減らし、より良い採用が出来るようサポートします。
          </v-flex>
          <v-flex xs10 sm4 class="pt-4 hidden-sm-and-up img-shadow">
            <v-img
              max-height="500"
              v-bind:src="require('@/assets/images/inquiry/liplo_desktop.png')"
            ></v-img>
          </v-flex>
          <v-img
            class="mr-5 hidden-xs-only img-shadow"
            max-height="500"
            max-width="500"
            v-bind:src="require('@/assets/images/inquiry/liplo_desktop.png')"
          ></v-img>
          <v-flex white--text sm6 md4 hidden-xs-only class="pt-4 pl-5">
              <h1
                class="pt-4 font-weight-bold mb-3"
                :class="{
                  'heading-font-size-xs': $vuetify.breakpoint.xsOnly,
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
            Liplo は長期インターンを通して、 求人者と求職者をマッチングする 採用プラットフォームです。 企業の雰囲気や文化、求職者の働き方や性格など 実際に働いてみないと分からないことをお互いが知ることで、 ミスマッチを減らし、より良い採用が出来るようサポートします。
          </v-flex>
        </v-layout>
        <!-- メリット -->
        <div style="padding-top: 150px">
          <div
            class="text-xs-center font-weight-bold text-color"
            :class="{
              'headline': $vuetify.breakpoint.smAndDown,
              'title-font-size-md': $vuetify.breakpoint.mdAndUp,
            }"
          >
            なぜ Liplo なのか
          </div>
          <v-layout row wrap justify-center align-center style="padding-top: 100px">
            <v-flex xs10 hidden-sm-and-up>
              <div class="title font-weight-bold teal--text">
                企業にマッチした学生を採用できる
              </div>
              <div class="subheading light-text-color pt-4">
                独自のパス制度により、長期インターンを終えた魅力的な学生の採用機会を
                増やすことが出来ます。
              </div>
            </v-flex>
            <v-img
              class="mr-5 hidden-xs-only"
              max-height="100"
              max-width="100"
              v-bind:src="require('@/assets/images/inquiry/handshake.png')"
            ></v-img>
            <v-flex sm6 md4 hidden-xs-only class="pt-4 pl-5">
              <div
                class="title font-weight-bold teal--text"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                企業にマッチした学生を採用できる
              </div>
              <div
                class="subheading light-text-color pt-4"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                独自のパス制度により、
                長期インターンを終えた魅力的な学生の採用機会を増やすことが出来ます。
              </div>
            </v-flex>
          </v-layout>
          <!-- パス -->
          <v-layout row wrap justify-center align-center style="padding-top: 100px">
            <v-flex xs10 hidden-sm-and-up>
              <div class="title font-weight-bold teal--text">
                パスとは
              </div>
              <div class="subheading light-text-color pt-4">
                インターン後、企業が採用したいと思う候補者にパスを渡すことが出来ます。
                パスを発行することで、候補者に入社や内定取得の権利を与えることができます。
                （有効期間などは設定可能）
              </div>
            </v-flex>
            <v-flex sm6 md4 hidden-xs-only class="pt-4 pr-5">
              <div
                class="title font-weight-bold teal--text"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                パスとは
              </div>
              <div
                class="subheading light-text-color pt-4"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                インターン後、企業が採用したいと思う候補者にパスを渡すことが出来ます。
                <div class="pt-3">
                  パスを発行することで、候補者に入社や内定取得の権利を与えることができます。
                  （有効期間などは設定可能）
                </div>
              </div>
            </v-flex>
            <v-icon
              class="ml-5 material-icons-outlined hidden-xs-only"
              style="font-size: 100px"
              color="teal lighten-1"
            >
              style
            </v-icon>
          </v-layout>
        </div>
        <!-- 機能 -->
        <div style="padding-top: 150px">
          <div
            class="text-xs-center font-weight-bold text-color"
            :class="{
              'headline': $vuetify.breakpoint.smAndDown,
              'title-font-size-md': $vuetify.breakpoint.mdAndUp,
            }"
          >
            機能・特徴
          </div>
          <!-- 募集 -->
          <v-layout row wrap justify-center align-center pt-5>
            <v-flex xs10 hidden-sm-and-up>
              <div class="title font-weight-bold teal--text">
                募集
              </div>
              <div class="subheading light-text-color pt-4">
                募集を作成して企業や仕事の魅力を伝えましょう。
              </div>
            </v-flex>
            <v-flex xs10 sm4 class="pt-4">
              <v-card
                elevation="3"
              >
                <v-img
                  max-height="400"
                  v-bind:src="require('@/assets/images/inquiry/job_view.png')"
                ></v-img>
              </v-card>
            </v-flex>
            <v-flex sm6 md4 hidden-xs-only class="pt-4 pl-5">
              <div
                class="title font-weight-bold teal--text"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                募集
              </div>
              <div
                class="subheading light-text-color pt-4"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                募集を作成して企業や仕事の魅力を伝えましょう。
              </div>
            </v-flex>
          </v-layout>
          <!-- スカウト -->
          <v-layout row wrap justify-center align-center pt-5>
            <v-flex xs10 pt-5 hidden-sm-and-up>
              <div class="title font-weight-bold teal--text">
                スカウト
              </div>
              <div class="subheading light-text-color pt-4">
                気になる求職者がいたらスカウトをしてアプローチすることが出来ます。
              </div>
            </v-flex>
            <v-flex sm6 md4 hidden-xs-only class="pt-4 pr-5">
              <div
                class="title font-weight-bold teal--text"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                スカウト
              </div>
              <div
                class="subheading light-text-color pt-4"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                気になる求職者がいたらスカウトをしてアプローチすることが出来ます。
              </div>
            </v-flex>
            <v-flex xs10 sm4 class="pt-4">
              <v-card
                elevation="3"
              >
                <v-img
                  max-height="400"
                  v-bind:src="require('@/assets/images/inquiry/scout_view.png')"
                ></v-img>
              </v-card>
            </v-flex>
          </v-layout>
          <!-- レビュー -->
          <v-layout row wrap justify-center align-center pt-5>
            <v-flex xs10 pt-5 hidden-sm-and-up>
              <div class="title font-weight-bold teal--text">
                レビュー
              </div>
              <div class="subheading light-text-color pt-4">
                インターン後、候補者にレビューをしてもらえます。これにより、候補者から見た
                企業の良い点や改善すべき点などを知ることが出来ます。また、良いレビューをもらえると
                検索で上位に表示されるため、求職者に認知されやすくなります。
              </div>
            </v-flex>
            <v-flex xs10 sm4 class="pt-4">
              <v-card
                elevation="3"
              >
                <v-img
                  max-height="400"
                  v-bind:src="require('@/assets/images/inquiry/review_view.png')"
                ></v-img>
              </v-card>
            </v-flex>
            <v-flex sm6 md4 hidden-xs-only class="pt-4 pl-5">
              <div
                class="title font-weight-bold teal--text"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                レビュー
              </div>
              <div
                class="subheading light-text-color pt-4"
                :class="{
                  'px-4': $vuetify.breakpoint.smOnly,
                  'px-5': $vuetify.breakpoint.mdAndUp,
                }"
              >
                インターン後、候補者にレビューをしてもらえます。これにより、候補者から見た
                企業の良い点や改善すべき点などを知ることが出来ます。また、良いレビューをもらえると
                検索で上位に表示されるため、求職者に認知されやすくなります。
              </div>
            </v-flex>
          </v-layout>
        </div>
        <!-- 料金 -->
        <div style="padding-top: 150px">
          <div
            class="pb-3 text-xs-center font-weight-bold text-color"
            :class="{
              'headline': $vuetify.breakpoint.smAndDown,
              'title-font-size-md': $vuetify.breakpoint.mdAndUp,
            }"
          >
            料金プラン
          </div>
          <v-flex xs12 sm8 offset-sm2 hidden-sm-and-up>
            <v-img v-bind:src="require('@/assets/images/inquiry/fee_basic.svg')"></v-img>
          </v-flex>
          <v-flex xs12 sm8 offset-sm2 hidden-sm-and-up>
            <v-img v-bind:src="require('@/assets/images/inquiry/fee_standard.svg')"></v-img>
          </v-flex>
          <v-flex xs12 sm8 offset-sm2 hidden-sm-and-up>
            <v-img v-bind:src="require('@/assets/images/inquiry/fee_advanced.svg')"></v-img>
          </v-flex>
          <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
            <v-img class="hidden-xs-only" v-bind:src="require('@/assets/images/inquiry/fee_all.svg')"></v-img>
            <div
              class="text-color pt-2"
              :class="{
                'caption pl-3': $vuetify.breakpoint.smAndDown,
              }"
            >
              ※ 料金について詳しく知りたい方は、資料請求をお願いします。
            </div>
          </v-flex>
        </div>
        <!-- ビジョン -->
        <div style="padding-top: 150px">
          <div
            class="text-xs-center font-weight-bold text-color"
            :class="{
              'headline': $vuetify.breakpoint.smAndDown,
              'title-font-size-md': $vuetify.breakpoint.mdAndUp,
            }"
          >
            Liplo が実現したいこと
          </div>
          <v-flex xs12 sm8 md6 offset-sm2 offset-md3 pt-5
            :class="{
              'px-4': $vuetify.breakpoint.xsOnly,
            }"
          >
            <div class="text-color subheading">
              現在、新卒で入社した人の３割が３年以内に離職していると言われています。
              努力して入社した企業でも、人間関係や仕事内容、企業の雰囲気などが理由で、 離職する人が多いのが現状です。
            </div>
            <div class="pt-5 text-color subheading">
              私たちは、そういった問題をこのサービスで解決し、多くの人が自分に合った仕事、企業に就き、
              生き生きと働ける社会を創りたいと思っています。
            </div>
          </v-flex>
        </div>
      </v-flex>
      <v-flex xs12 sm8 md6 offset-sm2 offset-md3 style="padding-top: 150px">
        <!-- フォーム -->
        <div
          class="pb-3 text-xs-center font-weight-bold text-color"
          :class="{
            'headline': $vuetify.breakpoint.smAndDown,
            'title-font-size-md': $vuetify.breakpoint.mdAndUp,
          }"
        >
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
              <v-form v-model="valid" @submit.prevent="">
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
                      <!-- 部署名 -->
                      <v-text-field
                        v-model="department"
                        class="py-2"
                        :rules="departmentRules"
                        label="部署名"
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
                        label="担当者メールアドレス（必須）"
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
                      class="teal lighten-1"
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
const baseUrl = process.env.BASE_URL || 'https://liplo.jp'
export default {
  head () {
    return {
      title: '採用担当者様はこちら',
      meta: [
        { hid: 'description', name: 'description', content: '採用担当者様はこちら' },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: '採用担当者様はこちら' + ' - Liplo' },
        { hid: 'og:description', property: 'og:description', content: '採用担当者様はこちら' },
        { hid: 'og:url', property: 'og:url', content: baseUrl + this.$route.path },
        { hid: 'twitter:title', name: 'twitter:title', content: '採用担当者様はこちら' + ' - Liplo' },
        { hid: 'twitter:description', name: 'twitter:description', content: '採用担当者様はこちら' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp'
        }
      ]
    }
  },
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
    department: '',
    departmentRules: [
      v => (v.length <= 30) || '30文字を超えています'
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
    type: '資料請求したい',
    typeItems: [
      '資料請求したい',
      'Liploの導入を検討しており、サービスについて詳しく聞きたい',
      'すぐにサービスを導入したい',
      'その他'
    ],
    content: '',
    contentRules: [
      v => (v.length <= 3000) || '3000文字以内でお願いします'
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
      if (this.type == '資料請求したい') {
        type = 0
      } else if (this.type == 'Liploの導入を検討しており、サービスについて詳しく聞きたい') {
        type = 1
      } else if (this.type == 'すぐにサービスを導入したい') {
        type = 2
      } else if (this.type == 'その他') {
        type = 3
      }

      this.addInquiry({
        companyName: this.companyName,
        department: this.department,
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
      addInquiry: 'companyInquiry/addInquiry',
    }),
  }
}
</script>
<style>
.main-bg{
  background-color:rgba(255, 90, 95,0.9);
}
.img-shadow{
  filter: drop-shadow(10px 10px 10px rgba(0,0,0,0.6));
}
.main-boder{
  border-radius: 60px 60px 60px 60px / 60px 60px 60px 60px;
}
.main-padding-top-sm{
  padding:90px 0;
}
.main-padding-top-md{
  padding:100px 0;
}
.main-padding-top-lg{
  padding:180px 0;
}
.title-font-size-md {
  font-size: 30px;
}
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
