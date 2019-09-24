<template>
  <v-app light>
    <no-ssr>
      <admin-drawer v-if="path.includes('/admin')"></admin-drawer>
      <drawer v-if="path.includes('/recruiter') || path.includes('/users')"></drawer>
      <toolbar></toolbar>
    </no-ssr>
    <v-content class="white">
      <v-container fluid pa-0>
        <nuxt />
      </v-container>
      <no-ssr>
        <footer-content
          v-if="
            (!uid && routeName == 'index') ||
            routeName == 'jobs-id' ||
            routeName == 'companies-id' ||
            routeName == 'inquiry_for_recruiter' ||
            routeName == 'how_to_use' ||
            routeName == 'terms' ||
            routeName == 'privacy_policy' ||
            routeName == 'contact' ||
            routeName == 'feedback' ||
            (routeName == 'user-profile' && uid) ||
            (path.includes('/user/settings') && uid)
          "
          class="hidden-xs-only"
        ></footer-content>
      </no-ssr>
      <v-footer
        v-if="
          uid &&
          type == 'user' &&
          (
            path == '/' ||
            routeName == 'user-notifications' ||
            routeName == 'messages' ||
            routeName == 'user-menu'
          )
        "
        class="shadow-top hidden-sm-and-up"
        fixed
        app
        color="white"
        height="56"
      >
        <v-bottom-nav
          :value="true"
          absolute
          color="transparent"
          id="bottom-nav"
        >
          <!-- 募集一覧 -->
          <v-btn
            color="teal"
            class="font-weight-bold"
            flat
            @click.native="homeButtonClicked"
          >
            <span v-if="routeName != 'index'" style="font-size: 10px;">探す</span>
            <span v-else class="teal--text" style="font-size: 10px;">探す</span>
            <v-icon v-if="routeName != 'index'">search</v-icon>
            <v-icon v-else class="teal--text">search</v-icon>
          </v-btn>
          <!-- 通知 -->
          <v-btn
            color="teal"
            class="font-weight-bold"
            flat
            @click="allNotificationsButtonClicked('/user/notifications')"
          >
            <span v-if="!hasNewNotification" style="font-size: 10px;">通知</span>
            <v-icon v-if="!hasNewNotification">notifications_none</v-icon>
            <v-badge v-if="hasNewNotification" color="red">
              <template v-slot:badge>
                <span></span>
              </template>
              <div class="text-xs-center">
                <v-icon>notifications_none</v-icon>
                <span style="font-size: 10px; display: block;">通知</span>
              </div>
            </v-badge>
          </v-btn>
          <!-- メッセージ -->
          <v-btn
            color="teal"
            class="font-weight-bold"
            flat
            to="/messages"
          >
            <span v-if="!hasNewMessage" style="font-size: 10px;">メッセージ</span>
            <v-icon v-if="!hasNewMessage">chat_bubble_outline</v-icon>
            <v-badge v-if="hasNewMessage" color="red">
              <template v-slot:badge>
                <span></span>
              </template>
              <div class="text-xs-center">
                <v-icon>chat_bubble_outline</v-icon>
                <span style="font-size: 10px; display: block;">メッセージ</span>
              </div>
            </v-badge>
          </v-btn>
          <!-- プロフィール -->
          <v-btn
            color="teal"
            class="font-weight-bold"
            flat
            to="/user/menu"
          >
            <span style="font-size: 10px;">プロフィール</span>
            <v-icon>person_outline</v-icon>
          </v-btn>
        </v-bottom-nav>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Toolbar from '~/components/Toolbar'
import Drawer from '~/components/Drawer'
import AdminDrawer from '~/components/AdminDrawer'
import FooterContent from '~/components/FooterContent'

export default {
  components: {
    Toolbar,
    AdminDrawer,
    Drawer,
    FooterContent
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    path() {
      return this.$route.path
    },
    routeName() {
      return this.$route.name
    },
    ...mapState({
      uid: state => state.uid,
      type: state => state.profile.type,
      hasNewNotification: state => state.notifications.hasNewNotification,
      hasNewMessage: state => state.chats.hasNewMessage,
    })
  },
  methods: {
    allNotificationsButtonClicked(url) {
      if (this.$route.name != 'user-notifications') {
        this.resetNotificationsState()
        this.$router.push(url)
      }
    },
    homeButtonClicked() {
      if (this.$route.name != 'index') {
        this.resetJobsState()
        this.$router.push('/')
      }
    },
    ...mapActions({
      resetJobsState: 'jobs/resetState',
      resetNotificationsState: 'notifications/resetState',
    }),
  }
}
</script>

<style>
.avatar-border {
  border-radius: 50%;
  border: solid 1px #EEEEEE;
}
#footer a{
  text-decoration: none;
}
.link-text {
  text-decoration: none;
}
.toolbar-title {
  color: #555555;
  text-decoration: inherit;
  font-size: 22px;
}
.toolbar-title-small {
  color: #555555;
  text-decoration: inherit;
  font-size: 14px;
}
.help-link {
  color: #555555;
  text-decoration: inherit;
}
.job-title {
  font-size: 30px;
}
.job-sub-title {
  font-size: 18px;
}
.body-text {
  color: #555555;
  font-size: 15px;
  font-weight: 400;
}
.caption-2 {
  font-size: 13px;
}
.text-color {
  color: #555555;
}
.light-text-color {
  color: #777777;
}
.white-text-color {
  color: #ffffff;
}
.teal-text-color {
  color: #00897B;
}
.warning-text-color {
  color: #E53935;
}
.break {
  word-break: break-all;
}
.return {
  white-space: pre-wrap;
}
.shadow-top {
  box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.14);
}
.clickable {
  cursor: pointer;
}
.border {
  border: 1px solid;
  border-color: #E0E0E0;
}
.border-top {
  border-top: 1px solid;
  border-color: #E0E0E0;
}
.border-right {
  border-right: 1px solid;
  border-color: #E0E0E0;
}
.border-left {
  border-left: 1px solid;
  border-color: #E0E0E0;
}
.border-y {
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: #E0E0E0;
}
.border-side {
  border-left: 1px solid;
  border-right: 1px solid;
  border-color: #E0E0E0;
}
.border-bottom {
  border-bottom: 1px solid;
  border-color: #E0E0E0;
}
.message-border-radius {
  border-radius: 12px 12px 12px 12px;
}
.toolbar-fixed {
  position: sticky !important;
  top: 0px !important;
  z-index: 10 !important;
}
.job-bottom-fixed {
  position:absolute;
  bottom:0;
}
.mypage-left-section-fixed {
  position:fixed;
  top:50;
}
.overflow-hidden {
  overflow: hidden;
}
.horiz-scroll {
  overflow-y: hidden;
  overflow-x: auto;
}
.message-right {
  margin-right: 0px;
  margin-left: auto;
}
div.v-toolbar__content {
  border-bottom: 0.1px solid;
  border-color: #E0E0E0;
}
div.v-toolbar__extension {
  height: 48px !important;
  border-bottom: 1px solid;
  border-color: #E0E0E0;
}
i.v-icon {
  padding: 0px !important;
}
.drawer-mini .v-list__tile {
  padding-left: 0px;
  padding-right: 0px;
}
#toolbar span.v-badge__badge {
  width: 5px;
  height: 5px;
  top: -4px;
  right: -8px;
}
#bottom-nav span.v-badge__badge {
  width: 5px;
  height: 5px;
  top: 0px;
  right: -4px;
}
@media screen and (min-width: 600px) {
  #job-apply.v-btn {
    width: 200px;
  }
  #user-scout.v-btn {
    width: 200px;
  }
}
</style>
