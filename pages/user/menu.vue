<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex xs10 offset-xs1 v-if="uid && uid != ''">
      <!-- user name, image -->
      <v-card flat class="pb-4 pt-5">
        <v-list-tile to="/user/profile">
          <v-list-tile-avatar color="grey darken-3">
            <v-img
              color="grey darken-3"
              v-if="profileImageUrl"
              :src="profileImageUrl"
            ></v-img>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title
              class="text-color font-weight-bold"
            >
              {{ lastName + ' ' + firstName }}
            </v-list-tile-title>
            <v-list-tile-sub-title class="caption text-color">
              プロフィールを確認＆編集
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-card>
      <!-- mypage menu -->
      <v-list>
        <template v-for="(item, index) in items">
          <v-divider></v-divider>
          <!-- ログアウト -->
          <v-card
            v-if="item.title == 'ログアウト'"
            flat
            @click="signOut"
            class="clickable py-2"
          >
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title
                  style="font-size: 14px;"
                  class="light-text-color font-weight-bold"
                >
                  {{ item.title }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon class="material-icons-outlined" style="font-size: 18px">{{ item.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-card>
          <!-- ログアウト以外 -->
          <v-card
            v-else
            flat
            @click="menuButtonClicked(item.url)"
            class="clickable py-2"
          >
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title
                  style="font-size: 14px;"
                  class="light-text-color font-weight-bold"
                >
                  {{ item.title }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon class="material-icons-outlined" style="font-size: 18px">{{ item.icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-card>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>


<script>
import { mapActions, mapState } from 'vuex'
export default {
  middleware: 'auth',
  head () {
    return {
      title: 'メニュー',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp'
        }
      ]
    }
  },
  data() {
    return {
      windowHeight: 0,
      items: [
        { title: 'パス', icon: 'card_giftcard', url: '/user/passes' },
        { title: 'キャリア', icon: 'work_outline', url: '/user/career' },
        { title: 'レビュー', icon: 'bar_chart', url: '/user/reviews' },
        { title: 'フィードバック', icon: 'chat_bubble_outline', url: '/user/feedbacks' },
        { title: 'アカウント設定', icon: 'settings', url: '/user/settings/account' },
        { title: '通知設定', icon: 'settings', url: '/user/settings/notifications' },
        { title: 'サービスの使い方', icon: 'help_outline', url: '/how_to_use' },
        { title: 'お問い合わせ', icon: 'email', url: '/contact' },
        { title: 'フィードバックを送る', icon: 'send', url: '/feedback' },
        { title: '利用規約', icon: 'assignment', url: '/terms' },
        { title: 'プライバシーポリシー ', icon: 'assignment', url: '/privacy_policy' },
        { title: 'ログアウト', icon: 'person_outline', url: null },
      ],
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      profileImageUrl: state => state.profile.imageUrl,
    })
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 48 - 30
  },
  methods: {
    menuButtonClicked(url) {
      if (url == '/user/feedbacks' && this.$route.name != 'user-feedbacks') {
        this.resetFeedbacksState()
      } else if (url == '/user/reviews' && this.$route.name != 'user-reviews') {
        this.resetReviewsState()
        this.resetCareerState()
      } else if (url == '/user/career' && this.$route.name != 'user-career') {
        this.resetCareerState()
      }

      this.$router.push(url)
    },
    ...mapActions({
      resetFeedbacksState: 'feedbacks/resetState',
      resetReviewsState: 'reviews/resetUserReviewsState',
      resetCareerState: 'career/resetState',
      signOut: 'signOut',
    }),
  }
}
</script>
