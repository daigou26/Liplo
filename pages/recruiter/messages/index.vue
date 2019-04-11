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
        <v-list
          v-if="chats != null && chats.length != 0"
          two-line
          class="pa-2"
        >
          <template v-for="(chat, index) in chats">
            <v-list-tile
              avatar
              :to="'/recruiter/messages/' + chat.chatId"
            >
              <v-list-tile-avatar>
                <v-avatar
                  class="grey lighten-3"
                  :size="40"
                >
                  <img v-if="chat.profileImageUrl" :src="chat.profileImageUrl">
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ chat.userName }}</v-list-tile-title>
                <v-list-tile-sub-title >{{ chat.lastMessage }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="chat.picUnreadCount && chat.picUnreadCount != 0">
                <v-avatar size="30" color="red">
                  <span class="white--text" style="font-size: 14px">{{ chat.picUnreadCount > 99 ? '99+' : chat.picUnreadCount }}</span>
                </v-avatar>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider
              v-if="chats.length != index + 1"
              :inset="true"
            ></v-divider>
          </template>
        </v-list>
        <infinite-loading
          v-if="showInfiniteLoading && chats && chats.length >= 10 && !isLoading"
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
    count: 0,
    isQueried: false,
    showInfiniteLoading: false,
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      companyId: state => state.profile.companyId,
      chats: state => state.chats.chats,
      isLoading: state => state.chats.isLoading,
      allChatsQueried: state => state.chats.allChatsQueried,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryChats({uid: null, companyId: this.companyId, chats: this.chats})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
        this.updateIsLoading(true)
        this.queryChats({uid: null, companyId: companyId, chats: this.chats})
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allChatsQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryChats({uid: null, companyId: this.companyId, chats: this.chats})

          if (this.count > 20) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }
      } else {
        $state.complete()
      }

    },
    ...mapActions({
      queryChats: 'chats/queryChats',
      updateIsLoading: 'chats/updateIsLoading',
      resetState: 'chats/resetState',
    }),
  }
}
</script>
