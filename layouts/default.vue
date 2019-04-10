<template>
  <v-app light>
    <drawer v-if="path.includes('/recruiter') || path.includes('/users')"></drawer>
    <toolbar></toolbar>
    <v-content class="white">
      <v-container fluid pa-0 fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <!-- <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import Toolbar from '~/components/Toolbar'
import Drawer from '~/components/Drawer'
export default {
  components: {
    Toolbar,
    Drawer
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
    path() {
      return this.$route.path
    },
  },
}
</script>

<style>
.toolbar-title {
  color: inherit;
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
  font-size: 16px;
}
.textColor {
  color: #555555;
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
.border-left {
  border-left: 1px solid;
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
