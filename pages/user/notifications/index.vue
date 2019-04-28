<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md)-->
        <v-flex
          md4
          hidden-sm-and-down
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <my-page-menu/>
        </v-flex>
        <!-- notifications -->
        <v-flex
          sm8
          xs12
          offset-sm2
          offset-md0
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
            'py-4': $vuetify.breakpoint.smAndUp,
            'py-0': $vuetify.breakpoint.xsOnly,
          }"
        >
          <!-- notifications -->
          <v-list
            v-if="notifications"
            three-line
            class="py-0"
            :class="{
              'border': $vuetify.breakpoint.smAndUp,
            }"
          >
            <template v-for="(notification, index) in notifications">
              <v-card
                flat
                :to="notification.url ? notification.url : ''"
                @click="updateIsUnread({uid: uid, notificationId: notification.notificationId})"
              >
                <div class="textColor text-xs-right caption pr-2 pt-2">
                  {{ notification.isUnread ? '未読' : '既読' }}
                </div>
                <div class="textColor return px-3 py-2">{{ notification.content }}</div>
                <div class="textColor caption text-xs-right pr-2 pb-2">
                  {{ notification.timestamp }}
                </div>
              </v-card>
              <v-divider
                v-if="notifications.length != index + 1"
              ></v-divider>
            </template>
          </v-list>
          <infinite-loading
            v-if="showInfiniteLoading && notifications && notifications.length >= 10 && !isLoading"
            :distance="50"
            spinner="waveDots"
            @infinite="infiniteHandler">
            <div slot="no-results"></div>
          </infinite-loading>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MyPageMenu from '~/components/MyPageMenu'

export default {
  components: {
    MyPageMenu
  },
  data: () => ({
    isQueried: false,
    count: 0,
    showInfiniteLoading: false,
  }),
  computed: {
    params() {
      return this.$route.params
    },
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      notifications: state => state.notifications.notifications,
      isLoading: state => state.notifications.isLoading,
      allNotificationsQueried: state => state.notifications.allNotificationsQueried,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryNotifications(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryNotifications(uid)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allNotificationsQueried) {
        if (!this.isLoading && this.uid != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryNotifications(this.uid)
        }
        if (this.count > 20) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      updateIsUnread: 'notifications/updateIsUnread',
      queryNotifications: 'notifications/queryNotifications',
      updateIsLoading: 'notifications/updateIsLoading',
      resetState: 'notifications/resetState',
    }),
  }
}
</script>
