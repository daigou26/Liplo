<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      sm10
      offset-sm1
      class="py-3"
    >
      <v-card>
        <v-list v-if="notifications" three-line class="border py-0">
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
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
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

    if (this.uid != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryNotifications(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null) {
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
