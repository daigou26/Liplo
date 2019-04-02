<template>
  <v-layout
    row
    white
    wrap
    align-start
    align-content-start
  >
    <v-flex xs12 class="break">
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
              <img v-if="imageUrl" :src="imageUrl" alt="avatar">
              <v-icon v-else :size="60">person</v-icon>
            </v-avatar>
            <div class="title textColor font-weight-bold break pl-4 ">
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
              <div class="textColor font-weight-bold">志望する職種</div>
            </v-flex>
            <v-flex
              v-if="desiredOccupations"
              xs7
              px-2
              :class="{'pb-4': $vuetify.breakpoint.xsOnly}"
            >
              <v-chip>
                <span v-if="desiredOccupations.engineer">エンジニア</span>
              </v-chip>
              <v-chip>
                <span v-if="desiredOccupations.designer">デザイナー</span>
              </v-chip>
              <v-chip v-if="desiredOccupations.sales">
                <span>営業</span>
              </v-chip>
              <v-chip v-if="desiredOccupations.others">
                <span>その他</span>
              </v-chip>
            </v-flex>
          </v-layout>
          <div class="hidden-sm-and-up pl-4">
            <div class="textColor font-weight-bold">志望する職種</div>
            <div>
              <v-chip>
                <span v-if="desiredOccupations.engineer">エンジニア</span>
              </v-chip>
              <v-chip>
                <span v-if="desiredOccupations.designer">デザイナー</span>
              </v-chip>
              <v-chip v-if="desiredOccupations.sales">
                <span>営業</span>
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
              <v-card-title class="title font-weight-bold">やりたいこと・実現したいこと</v-card-title>
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
            <v-list class="pl-4">
              <template v-for="(item, index) in portfolio">
                  <div class="d-flex pb-3">
                    <v-flex xs4 sm3 lg2>
                      <v-img :src="item.imageUrl" height="100"></v-img>
                    </v-flex>
                    <v-flex xs8 sm9 lg10 class="px-4 break">
                      <div>
                        <span class="font-weight-bold subheading textColor">{{ item.title }}</span>
                      </div>
                      <p　class="textColor return">{{ item.content }}</p>
                      <a :href="item.url">{{ item.url }}</a>
                    </v-flex>
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
                <div class="py-2">
                  <div class="font-weight-bold body-2 textColor">
                    {{ item.title }}
                  </div>
                  <p class="return">{{ item.content }}</p>
                </div>
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
                  <div class="font-weight-bold body-2 textColor">
                    {{ item.title }}
                  </div>
                  <a :href="item.url">{{ item.url }}</a>
                </div>
              </template>
            </v-list>
          </v-flex>
        </div>
        <!-- 基本情報 -->
        <div>
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
              <div class="pb-2">
                <span>生年月日:</span>
                <span class="pl-2">{{ birthDate }}</span>
              </div>
            </v-list>
          </v-flex>
        </div>
      </div>
      <v-card v-if="type == 'recruiter'" class="text-xs-right py-2">
          <v-btn
            large
            class="warning"
            id="user-scout"
          >
            <span class="font-weight-bold">
              スカウトを送る
            </span>
          </v-btn>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { auth } from '@/plugins/firebase'

export default {
  data: () => ({
    isQueried: false,
    avatarSize: 50,
  }),
  computed: {
    name: function() {
      if (this.lastName && this.firstName) {
        return this.lastName + ' ' + this.firstName
      }
    },
    birthDate: function() {
      if (this.birthTimestamp) {
        const date = new Date( this.birthTimestamp * 1000 )
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
      type: state => state.profile.type,
      companyId: state => state.profile.companyId,
      imageUrl: state => state.user.imageUrl,
      firstName: state => state.user.firstName,
      lastName: state => state.user.lastName,
      selfIntro: state => state.user.selfIntro,
      whatWantToDo: state => state.user.whatWantToDo,
      portfolio: state => state.user.portfolio,
      skills: state => state.user.skills,
      links: state => state.user.links,
      email: state => state.user.email,
      university: state => state.user.university,
      faculty: state => state.user.faculty,
      department: state => state.user.department,
      birthTimestamp: state => state.user.birthTimestamp,
      desiredOccupations: state => state.user.desiredOccupations,
    }),
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user && this.params.id) {
        this.resetState()
        this.queryUser(this.params.id)
      }
    })
  },
  methods: {
    ...mapActions({
      queryUser: 'user/queryUser',
      resetState: 'user/resetState',
    }),
  }
}
</script>
