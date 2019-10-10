<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="isInitialLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid && uid != ''"
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- notifications -->
        <v-flex
          sm8
          xs12
          offset-sm2
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
            'py-4': $vuetify.breakpoint.smAndUp,
            'py-0': $vuetify.breakpoint.xsOnly,
          }"
        >
          <div class="text-color title pb-4 hidden-xs-only">
            通知
          </div>
          <div class="text-xs-right">
            <v-btn small flat color="teal" @click="updateAllIsUnread(uid)">すべて既読にする</v-btn>
          </div>
          <v-divider
            v-if="breakpoint == 'xs'"
          ></v-divider>
          <!-- notifications -->
          <v-list
            v-if="notifications && notifications.length > 0"
            three-line
            class="py-0"
            :class="{
              'border': $vuetify.breakpoint.smAndUp,
            }"
          >
            <template v-for="(notification, index) in notifications">
              <v-card
                flat
                @click="notificationClicked({url: notification.url, notificationId: notification.notificationId})"
              >
                <div class="text-color text-xs-right caption pr-2 pt-2">
                  {{ notification.isUnread ? '未読' : '既読' }}
                </div>
                <div class="text-color return px-3 py-2">{{ notification.content }}</div>
                <div class="text-color caption text-xs-right pr-2 pb-2">
                  {{ notification.timestamp }}
                </div>
              </v-card>
              <v-divider
                v-if="notifications.length != index + 1"
              ></v-divider>
            </template>
          </v-list>
          <v-card
            v-else
            class="px-3 py-4"
            :class="{
              'mx-3 my-5': $vuetify.breakpoint.xsOnly,
              'mt-4': $vuetify.breakpoint.mdAndUp,
            }"
          >
            <div class="text-xs-center">
              <div class="headline text-color">通知がありません</div>
              <div class="pt-3 light-text-color">
                通知がある場合はこちらに表示されます
              </div>
              <v-btn class="mt-3 font-weight-bold" color="warning" to="/">募集を探す</v-btn>
            </div>
          </v-card>
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

export default {
  middleware: 'auth',
  head () {
    return {
      title: '通知',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    count: 0,
    showInfiniteLoading: false,
    windowHeight: 0,
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
      isRefreshing: state => state.isRefreshing,
      notifications: state => state.notifications.notifications,
      isInitialLoading: state => state.notifications.isInitialLoading,
      isLoading: state => state.notifications.isLoading,
      allNotificationsQueried: state => state.notifications.allNotificationsQueried,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight

    if (
      this.uid != null &&
      this.uid != '' &&
      !this.isQueried &&
      (!this.notifications || (this.notifications != null && this.notifications.length == 0))
    ) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryNotifications(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryNotifications(uid)
      }
    }
  },
  methods: {
    notificationClicked({url, notificationId}) {
      this.updateIsUnread({uid: this.uid, notificationId: notificationId})
      this.$router.push(url)
    },
    infiniteHandler($state) {
      if (!this.allNotificationsQueried) {
        if (!this.isLoading && this.uid != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryNotifications(this.uid)
        }
        if (this.count > 30) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      updateAllIsUnread: 'notifications/updateAllIsUnread',
      updateIsUnread: 'notifications/updateIsUnread',
      queryNotifications: 'notifications/queryNotifications',
      updateIsInitialLoading: 'notifications/updateIsInitialLoading',
      updateIsLoading: 'notifications/updateIsLoading',
      resetState: 'notifications/resetState',
    }),
  }
}
</script>
