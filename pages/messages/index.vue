<template>
  <v-layout
    white
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
      v-else-if="(breakpoint == 'xs' || breakpoint == 'sm') && isInitialChatsLoading"
      xs12
      :style="{ height: windowHeight + 'px' }"
    >
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <!-- chatがない場合 -->
    <v-flex
      v-else-if="!isInitialChatsLoading && chats.length == 0"
      xs12
      :style="{ height: windowHeight + 'px' }"
    >
      <v-layout align-center justify-center row wrap fill-height>
        <v-flex sm8 class="border">
          <v-card flat class="pa-3 border">
            <div class="text-xs-center">
              <div class="headline text-color">メッセージがありません</div>
              <div class="pt-3 light-text-color">
                採用担当者から連絡がある場合はこちらに表示されます
              </div>
              <v-btn class="mt-4 font-weight-bold white--text" color="teal lighten-1" to="/">募集を探す</v-btn>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid && uid != ''"
      xs12
      lg10
      offset-lg1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- chat lists (lg, md)-->
        <v-flex
          md4
          hidden-sm-and-down
        >
          <v-flex
            class="scroll-y"
            :class="{
              'border-left': $vuetify.breakpoint.lgAndUp,
            }"
            :style="{ height: windowHeight + 'px' }"
          >
            <v-list
              v-if="!isInitialChatsLoading"
              two-line
              class="py-0"
            >
              <template v-for="(chat, index) in chats">
                <v-list-tile
                  avatar
                  :to="'/messages/' + chat.chatId"
                >
                  <v-list-tile-avatar>
                    <v-avatar
                      class="avatar-border"
                      :size="40"
                    >
                      <img v-if="chat.companyImageUrl" :src="chat.companyImageUrl">
                    </v-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ chat.companyName }}</v-list-tile-title>
                    <v-list-tile-sub-title >{{ chat.lastMessage }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="pt-3" style="padding-bottom: 12px;">
                    <v-list-tile-action-text>{{ chat.timestamp }}</v-list-tile-action-text>
                    <v-avatar
                      v-show="chat.userUnreadCount && chat.userUnreadCount != 0"
                      size="22"
                      color="#FF5A5F"
                    >
                      <span class="white--text" style="font-size: 12px">{{ chat.userUnreadCount > 99 ? '99+' : chat.userUnreadCount }}</span>
                    </v-avatar>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider
                  :inset="true"
                ></v-divider>
              </template>
            </v-list>
            <v-layout v-else align-center justify-center column fill-height>
              Now Loading...
            </v-layout>
            <infinite-loading
              v-if="showInfiniteLoading && chats && chats.length >= 20 && !isChatsLoading"
              :distance="50"
              spinner="waveDots"
              @infinite="chatsInfiniteHandler">
              <div slot="no-results"></div>
            </infinite-loading>
          </v-flex>
        </v-flex>
        <!-- messages (lg, md) -->
        <v-flex
          md8
          hidden-sm-and-down
          class="text-xs-center"
          style="background-color: #F5F5F5"
          :class="{
            'border-side': $vuetify.breakpoint.lgAndUp,
          }"
          :style="{ height: windowHeight + 'px' }"
        >
          <div class="pt-4">
            左からチャットを選択してください
          </div>
        </v-flex>
        <!-- chat lists (sm, xs)-->
        <v-flex
          xs12
          sm10
          offset-sm1
          hidden-md-and-up
          :class="{
            'pa-3': $vuetify.breakpoint.smOnly,
          }"
        >
          <v-flex
            class="scroll-y"
            :class="{
              'border': $vuetify.breakpoint.smOnly,
            }"
            :style="{ height: windowHeight + 'px' }"
          >
            <v-list
              v-if="chats != null && chats.length != 0"
              two-line
              class="pa-2"
            >
              <template v-for="(chat, index) in chats">
                <v-list-tile
                  avatar
                  :to="'/messages/' + chat.chatId"
                >
                  <v-list-tile-avatar>
                    <v-avatar
                      class="avatar-border"
                      :size="40"
                    >
                      <img v-if="chat.companyImageUrl" :src="chat.companyImageUrl">
                    </v-avatar>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ chat.companyName }}</v-list-tile-title>
                    <v-list-tile-sub-title >{{ chat.lastMessage }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action class="pt-3" style="padding-bottom: 12px;">
                    <v-list-tile-action-text>{{ chat.timestamp }}</v-list-tile-action-text>
                    <v-avatar
                      v-show="chat.userUnreadCount && chat.userUnreadCount != 0"
                      size="22"
                      color="#FF5A5F"
                    >
                      <span class="white--text" style="font-size: 12px">{{ chat.userUnreadCount > 99 ? '99+' : chat.userUnreadCount }}</span>
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
              v-if="showInfiniteLoading && chats.length >= 20 && !isChatsLoading"
              :distance="50"
              spinner="waveDots"
              @infinite="chatsInfiniteHandler">
              <div slot="no-results"></div>
            </infinite-loading>
          </v-flex>
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
      title: 'メッセージ',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    message: '',
    showInfiniteLoading: false,
    windowHeight: 0,
    chatsCount: 0,
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      type: state => state.profile.type,
      profileImageUrl: state => state.profile.imageUrl,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      chats: state => state.chats.chats,
      isInitialChatsLoading: state => state.chats.isInitialLoading,
      isChatsLoading: state => state.chats.isLoading,
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
    this.windowHeight = window.innerHeight - toolbarHeight - 4

    this.showInfiniteLoading = true

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetChatsState()
      this.updateIsInitialChatsLoading(true)
      this.updateIsChatsLoading(true)
      this.queryChats({uid: this.uid, companyId: null, chats: this.chats})
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetChatsState()
        this.updateIsInitialChatsLoading(true)
        this.updateIsChatsLoading(true)
        this.queryChats({uid: uid, companyId: null, chats: this.chats})
      }
    },
  },
  methods: {
    chatsInfiniteHandler($state) {
      if (!this.allChatsQueried) {
        if (!this.isChatsLoading && this.uid != null && this.uid != '') {
          this.chatsCount += 1
          this.updateIsChatsLoading(true)
          this.queryChats({uid: this.uid, companyId: null, chats: this.chats})

          if (this.chatsCount > 50) {
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
      queryChat: 'chat/queryChat',
      queryChats: 'chats/queryChats',
      updateUnreadCount: 'chats/updateUnreadCount',
      updateIsInitialChatsLoading: 'chats/updateIsInitialLoading',
      updateIsChatsLoading: 'chats/updateIsLoading',
      resetChatsState: 'chats/resetState',
    }),
  }
}
</script>
