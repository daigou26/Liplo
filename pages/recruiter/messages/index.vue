<template>
  <v-layout
    row
    wrap
  >
    <!-- loading -->
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="isInitialLoading"
      xs12
      :style="{ height: windowHeight + 'px' }"
    >
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <!-- chatがない場合 -->
    <v-flex
      v-else-if="chats.length == 0"
      xs12
      :style="{ height: windowHeight + 'px' }"
    >
      <v-layout align-center justify-center row wrap fill-height>
        <v-flex sm8 class="border">
          <v-card flat class="pa-3 border">
            <div class="text-xs-center">
              <div class="headline textColor">メッセージがありません</div>
              <div class="pt-3 light-text-color">
                候補者から連絡がある場合はこちらに表示されます
              </div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex
      v-else
      xs12
      sm10
      offset-sm1
      :class="{
        'py-3': $vuetify.breakpoint.smAndUp,
      }"
    >
      <v-card :flat="$vuetify.breakpoint.xsOnly">
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
              <v-list-tile-action class="pt-3" style="padding-bottom: 12px;">
                <v-list-tile-action-text>{{ chat.timestamp }}</v-list-tile-action-text>
                <v-avatar
                  v-show="chat.picUnreadCount && chat.picUnreadCount != 0"
                  size="24"
                  color="orange"
                >
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
    windowHeight: 0,
    isQueried: false,
    showInfiniteLoading: false,
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      chats: state => state.chats.chats,
      isInitialLoading: state => state.chats.isInitialLoading,
      isLoading: state => state.chats.isLoading,
      allChatsQueried: state => state.chats.allChatsQueried,
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 30
    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryChats({uid: null, companyId: this.companyId, chats: this.chats})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.resetState()
        this.isQueried = true
        this.updateIsInitialLoading(true)
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
      updateIsInitialLoading: 'chats/updateIsInitialLoading',
      updateIsLoading: 'chats/updateIsLoading',
      resetState: 'chats/resetState',
    }),
  }
}
</script>
