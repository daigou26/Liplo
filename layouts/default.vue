<template>
  <v-app light>
    <drawer v-if="path.includes('/recruiter') || path.includes('/users')"></drawer>
    <toolbar></toolbar>
    <v-content class="white">
      <v-container fluid pa-0>
        <nuxt />
      </v-container>
      <footer-content></footer-content>
      <v-footer
        v-if="
          uid &&
          type == 'user' &&
          breakpoint == 'xs' &&
          (
            path == '/' ||
            path == '/user/notifications' ||
            path == '/user/notifications/' ||
            path == '/messages' ||
            path == '/messages/' ||
            path == '/user/menu' ||
            path == '/user/menu/'
          )
        "
        class="shadow-top"
        fixed
        app
        color="white"
        height="56"
      >
        <v-bottom-nav
          :value="true"
          absolute
          color="transparent"
        >
          <!-- 募集一覧 -->
          <v-btn
            color="teal"
            flat
            to="/"
          >
            <span style="font-size: 10px;">探す</span>
            <v-icon>search</v-icon>
          </v-btn>
          <!-- 通知 -->
          <v-btn
            color="teal"
            flat
            to="/user/notifications"
          >
            <span style="font-size: 10px;">通知</span>
            <v-icon>notifications_none</v-icon>
          </v-btn>
          <!-- メッセージ -->
          <v-btn
            color="teal"
            flat
            to="/messages"
          >
            <span style="font-size: 10px;">メッセージ</span>
            <v-icon>chat_bubble_outline</v-icon>
          </v-btn>
          <!-- プロフィール -->
          <v-btn
            color="teal"
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
import FooterContent from '~/components/FooterContent'

export default {
  components: {
    Toolbar,
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
    })
  },
}
</script>

<style>
#job-tags span {
  border: 1px solid;
  border-color: #777777;
  border-radius: 15px;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
}
#footer a{
  text-decoration: none;
}
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
  font-size: 16px;
}
.job-title {
  font-size: 30px;
}
.job-sub-title {
  font-size: 18px;
}
.body-text {
  color: #484848;
  font-size: 15px;
  font-weight: 400;
}
.textColor {
  color: #555555;
}
.light-text-color {
  color: #777777;
}
.whiteTextColor {
  color: #ffffff;
}
.edit-text-color {
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
#toolbar span.v-badge__badge {
  width: 5px;
  height: 5px;
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
