<template>
  <v-layout
    row
    white
    wrap
  >
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 pt-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="isLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex xs12 v-else-if="uid && uid != ''">
      <v-flex xs12 class="break">
        <!-- snackbar -->
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
        <!-- Profile画像 & UserName -->
        <div class="py-4 align-center">
          <v-card flat>
            <v-flex
              layout
              align-center
              px-4
            >
              <v-avatar
                :size="avatarSize"
                class="grey lighten-3"
              >
                <img v-if="userImageUrl" :src="userImageUrl" alt="avatar">
                <v-icon v-else :size="60">person</v-icon>
              </v-avatar>
              <div class="title text-color font-weight-bold break pl-4 ">
                {{ name }}
              </div>
            </v-flex>
          </v-card>
        </div>
        <div
          class="pb-4"
          :class="{'px-5': $vuetify.breakpoint.smAndUp}"
        >
          <!-- 志望する職種 -->
          <div v-if="desiredOccupations">
            <v-layout row wrap hidden-xs-only>
              <!-- 志望する職種 -->
              <v-flex
                v-if="desiredOccupations"
                sm4
                xs4
                :class="{
                  'pl-3': $vuetify.breakpoint.xsOnly,
                  'pl-5': $vuetify.breakpoint.smAndUp
                }"
              >
                <div class="text-color font-weight-bold">志望する職種</div>
              </v-flex>
              <v-flex
                v-if="desiredOccupations"
                xs7
                px-2
                :class="{'pb-4': $vuetify.breakpoint.xsOnly}"
              >
                <v-chip v-if="desiredOccupations.engineer">
                  <span>エンジニア</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.designer">
                  <span>デザイナー</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.sales">
                  <span>営業</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.marketer">
                  <span>マーケター</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.planner">
                  <span>企画</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.writer">
                  <span>ライター</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.others">
                  <span>その他</span>
                </v-chip>
              </v-flex>
            </v-layout>
            <div class="hidden-sm-and-up pl-4">
              <div class="text-color font-weight-bold">志望する職種</div>
              <div>
                <v-chip v-if="desiredOccupations.engineer">
                  <span>エンジニア</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.designer">
                  <span>デザイナー</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.sales">
                  <span>営業</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.marketer">
                  <span>マーケター</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.planner">
                  <span>企画</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.writer">
                  <span>ライター</span>
                </v-chip>
                <v-chip v-if="desiredOccupations.others">
                  <span>その他</span>
                </v-chip>
              </div>
            </div>
          </div>
          <!-- 紹介文 -->
          <div v-if="selfIntro">
            <v-layout
              align-center
              justify-space-between
              row
              class="pt-5"
            >
              <!-- タイトル&編集ボタン -->
              <v-flex xs8 sm10>
                <v-card-title class="title font-weight-bold">紹介文</v-card-title>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm10>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 sm10 class="break">
              <!-- 自己紹介の表示 -->
              <v-card-text>
                <p class="return">{{ selfIntro }}</p>
              </v-card-text>
            </v-flex>
          </div>
          <!-- やりたいこと -->
          <div v-if="whatWantToDo">
            <v-layout
              align-center
              justify-space-between
              row
              class="pt-5"
            >
              <v-flex xs8 sm10>
                <v-card-title class="title font-weight-bold">やりたいこと・興味のあること</v-card-title>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm10>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 sm10 class="break">
              <!-- やりたいことの表示 -->
              <v-card-text>
                <p class="return">{{ whatWantToDo }}</p>
              </v-card-text>
            </v-flex>
          </div>
          <!-- ポートフォリオ -->
          <div v-if="portfolio">
            <v-layout
              align-center
              justify-space-between
              row
              class="pt-5"
            >
              <v-flex xs8 sm10>
                <v-card-title class="title font-weight-bold">ポートフォリオ</v-card-title>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm10>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 sm10>
              <!-- ポートフォリオ表示 -->
              <v-list v-if="portfolio" class="pl-4">
                <template v-for="(item, index) in portfolio">
                  <div v-if="!xsWidth" class="d-flex pt-4">
                    <v-flex xs4 sm3 lg2>
                      <v-img :src="item.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                    </v-flex>
                    <v-flex xs8 sm9 lg10 class="pl-4 break">
                      <div class="font-weight-bold body-text">{{ item.title }}</div>
                      <p　class="text-color return">{{ item.content }}</p>
                      <a v-if="item.url" :href="item.url" target="_blank">{{ item.url }}</a>
                    </v-flex>
                  </div>
                  <div v-else class="pt-4">
                    <v-img :src="item.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                    <div class="font-weight-bold body-text">{{ item.title }}</div>
                    <div　class="text-color return pb-2">{{ item.content }}</div>
                    <a v-if="item.url" :href="item.url" target="_blank">{{ item.url }}</a>
                  </div>
                </template>
              </v-list>
            </v-flex>
          </div>
          <!-- スキル -->
          <div v-if="skills">
            <v-layout
              align-center
              justify-space-between
              row
              class="pt-5"
            >
              <v-flex xs8 sm10>
                <v-card-title class="title font-weight-bold">スキル</v-card-title>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm10>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 sm10 class="break">
              <!-- スキル表示 -->
              <v-list class="pl-4">
                <template v-for="(item, index) in skills">
                  <v-chip>
                    <span>{{ item }}</span>
                  </v-chip>
                </template>
              </v-list>
            </v-flex>
          </div>
          <!-- 関連リンク -->
          <div v-if="links">
            <v-layout
              align-center
              justify-space-between
              row
              class="pt-5"
            >
              <v-flex xs8 sm10>
                <v-card-title class="title font-weight-bold">関連リンク</v-card-title>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm10>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 sm10 class="break">
              <!-- 関連リンク表示 -->
              <v-list class="pl-4">
                <template v-for="(item, index) in links">
                  <div class="py-2">
                    <div class="font-weight-bold body-2 text-color">
                      {{ item.title }}
                    </div>
                    <a :href="item.url" target="_blank">{{ item.url }}</a>
                  </div>
                </template>
              </v-list>
            </v-flex>
          </div>
          <!-- 基本情報 -->
          <div v-if="university || faculty || department || graduationDateText">
            <v-layout
              align-center
              justify-space-between
              row
              class="pt-5"
            >
              <v-flex xs8 sm10>
                <v-card-title class="title font-weight-bold">基本情報</v-card-title>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm10>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12 sm10 class="break">
              <!-- 基本情報の表示 -->
              <v-list class="pl-4">
                <div v-if="university" class="pb-2">
                  <span>大学:</span>
                  <span class="pl-2">{{ university }}</span>
                </div>
                <div v-if="faculty" class="pb-2">
                  <span>学部:</span>
                  <span class="pl-2">{{ faculty }}</span>
                </div>
                <div v-if="department" class="pb-2">
                  <span>学科:</span>
                  <span class="pl-2">{{ department }}</span>
                </div>
                <div v-if="graduationDateText" class="pb-2">
                  <span>卒業予定日:</span>
                  <span class="pl-2">{{ graduationDateText }}</span>
                </div>
                <div v-if="birthDateText" class="pb-2">
                  <span>生年月日:</span>
                  <span class="pl-2">{{ birthDateText }}</span>
                </div>
              </v-list>
            </v-flex>
          </div>
        </div>
        <v-card v-if="type == 'recruiter'" flat class="shadow-top text-xs-right py-2 pr-2">
          <v-btn
            large
            :disabled="(companyId == null || companyId == '') || isCandidate || plan == null"
            color="teal lighten-1"
            class="white--text"
            id="user-scout"
            @click="scoutDialogButtonClicked"
          >
            <span class="font-weight-bold">
              スカウトを送る
            </span>
          </v-btn>
        </v-card>
        <!-- scout dialog -->
        <div class="text-xs-center">
          <v-dialog
            v-model="scoutDialog"
            :fullscreen="$vuetify.breakpoint.xsOnly"
            width="500"
          >
            <v-card class="pt-5 pb-3 px-3">
              <v-toolbar flat color="white hidden-sm-and-up">
                <v-btn icon @click="scoutDialog=false">
                  <v-icon>close</v-icon>
                </v-btn>
                <span
                  class="pl-3 text-color font-weight-bold"
                  :class="{
                    'title': $vuetify.breakpoint.smAndUp,
                    'subheading': $vuetify.breakpoint.xsOnly
                  }"
                >
                  スカウト
                </span>
              </v-toolbar>
              <v-flex
                xs12
                class="text-xs-center"
                :class="{'px-2': $vuetify.breakpoint.smAndUp, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
              >
                <!-- フォーム -->
                  <v-form v-model="valid" @submit.prevent="">
                    <v-container>
                      <v-layout
                        column
                        justify-center
                      >
                        <v-flex xs12>
                          <!-- メッセージ -->
                          <v-textarea
                            v-model="message"
                            :rules="messageRules"
                            label="メッセージ"
                            solo
                            required
                          ></v-textarea>
                        </v-flex>
                        <!-- スカウトボタン -->
                        <v-btn
                          :disabled="!valid || !companyId || plan == null"
                          color="teal lighten-1"
                          @click="scoutButtonClicked"
                        >
                          <span
                            class="font-weight-bold body-1"
                            style="color: #ffffff;"
                          >
                            スカウトを送信
                          </span>
                        </v-btn>
                      </v-layout>
                    </v-container>
                  </v-form>
              </v-flex>
            </v-card>
          </v-dialog>
        </div>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: this.name ? this.name + ' - ' + 'プロフィール' : 'プロフィール',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    windowWidth: 0,
    snackbar: false,
    snackbarText: '',
    xsWidth: false,
    avatarSize: 50,
    scoutDialog: false,
    valid: true,
    message: '',
    messageRules: [
      v => !!v || 'メッセージを入力してください',
      v => (v.length <= 300) || '300字以内で入力してください'
    ],
  }),
  computed: {
    name: function() {
      if (this.userLastName && this.userFirstName) {
        return this.userLastName + ' ' + this.userFirstName
      }
    },
    graduationDateText: function() {
      if (this.graduationDate) {
        const date = new Date( this.graduationDate.seconds * 1000 )
        const year  = date.getFullYear()
        const month = date.getMonth() + 1
        const day  = date.getDate()
        if (year != null && month != null && day!= null) {
          return `${year}/${month}/${day}`
        }
      }
    },
    birthDateText: function() {
      if (this.birthDate) {
        const date = new Date( this.birthDate.seconds * 1000 )
        const year  = date.getFullYear()
        const month = date.getMonth() + 1
        const day  = date.getDate()
        if (year != null && month != null && day!= null) {
          return `${year}/${month}/${day}`
        }
      }
    },
    params() {
      return this.$route.params
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      plan: state => state.profile.plan,
      type: state => state.profile.type,
      companyId: state => state.profile.companyId,
      picUid: state => state.uid,
      picImageUrl: state => state.profile.imageUrl,
      picFirstName: state => state.profile.firstName,
      picLastName: state => state.profile.lastName,
      userImageUrl: state => state.user.imageUrl,
      userFirstName: state => state.user.firstName,
      userLastName: state => state.user.lastName,
      selfIntro: state => state.user.selfIntro,
      whatWantToDo: state => state.user.whatWantToDo,
      portfolio: state => state.user.portfolio,
      skills: state => state.user.skills,
      links: state => state.user.links,
      email: state => state.user.email,
      university: state => state.user.university,
      faculty: state => state.user.faculty,
      department: state => state.user.department,
      graduationDate: state => state.user.graduationDate,
      birthDate: state => state.user.birthDate,
      desiredOccupations: state => state.user.desiredOccupations,
      isCandidate: state => state.user.isCandidate,
      isLoading: state => state.user.isLoading,
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 48 - 30
    this.windowWidth = window.innerWidth

    if (this.companyId != null && this.companyId != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryUser({nuxt: this.$nuxt, uid: this.params.id, companyId: this.companyId})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryUser({nuxt: this.$nuxt, uid: this.params.id, companyId: companyId})
      }
    },
    windowWidth(width) {
      if (width < 450) {
        this.xsWidth = true
      }
    }
  },
  methods: {
    scoutDialogButtonClicked() {
      this.message = ''
      this.scoutDialog = true
    },
    scoutButtonClicked() {
      var user = {
        uid: this.$route.params.id,
        name: this.userLastName + ' ' + this.userFirstName,
      }
      if (this.userImageUrl) {
        user.imageUrl = this.userImageUrl
      }

      var pic = {
        uid: this.picUid,
        name: this.picLastName + ' ' + this.picFirstName
      }
      if (this.picImageUrl) {
        pic.imageUrl = this.picImageUrl
      }

      this.scout({
        user: user,
        pic : pic,
        companyId: this.companyId,
        message: this.message,
      })

      this.snackbarText = 'スカウトしました！'
      this.snackbar = true

      this.scoutDialog = false
    },
    ...mapActions({
      queryUser: 'user/queryUser',
      updateIsLoading: 'user/updateIsLoading',
      resetState: 'user/resetState',
      scout: 'user/scout',
    }),
  }
}
</script>
