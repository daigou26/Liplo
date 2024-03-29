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
      v-else-if="(breakpoint == 'xs' || breakpoint == 'sm') && (isInitialChatsLoading || isInitialMessagesLoading)"
      xs12
      :style="{ height: windowHeight + 'px' }"
    >
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <!-- chatがない場合 -->
    <v-flex
      v-else-if="!isInitialChatsLoading && params.id == null && chats.length == 0"
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
                  :class="{ 'teal lighten-5': params.id == chat.chatId }"
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
        >
          <v-layout
            row
            align-center
            wrap
            class="border-side"
          >
            <!-- companyName -->
            <div class="break pa-3 font-weight-bold">
              <nuxt-link :to="'/companies/' + companyId" class="link-text teal--text">{{ companyName }}</nuxt-link>
            </div>
            <!-- message -->
            <v-flex
              xs12
              grey lighten-4
              class="scroll-y"
              :style="{ height: messagesHeight + 'px' }"
              ref="messagesLScroll"
            >
              <infinite-loading
                v-if="showInfiniteLoading && messages && messages.length >= 10 && !isMessagesLoading"
                direction="top"
                spinner="waveDots"
                @infinite="messagesInfiniteHandler">
                <div slot="no-results"></div>
              </infinite-loading>
              <v-layout v-if="isInitialMessagesLoading" align-center justify-center column fill-height>
                Now Loading...
              </v-layout>
              <template v-for="(message, index) in messages" v-else-if="messages != null && messages.length != 0">
                <v-layout>
                  <v-flex
                    xs7
                    class="py-3"
                    :class="{ 'offset-xs5 text-xs-right pr-2': message.user != null }"
                  >
                    <v-card-actions class="pa-0" style="align-items: start">
                      <!-- 担当者のプロフィール画像 -->
                      <div>
                        <v-avatar
                          v-if="message.pic != null"
                          class="mx-2 avatar-border"
                          :size="40"
                        >
                          <img v-if="message.pic.imageUrl" :src="message.pic.imageUrl">
                          <v-icon v-else>person</v-icon>
                        </v-avatar>
                      </div>
                      <!-- message -->
                      <div
                        :class="{ 'message-right': message.user != null }"
                      >
                        <div v-if="message.pic != null" class="light-text-color">
                          {{ message.pic.name }}
                        </div>
                        <div
                          class="px-3 py-2 white message-border-radius return text-xs-left"
                          style="display: inline-block;"
                        >{{ message.message }}</div>
                        <div class="text-xs-right pt-1 pr-2 caption light-text-color">
                          {{ message.date }}
                          <span class="pl-1">{{ message.time }}</span>
                        </div>
                      </div>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
            <!-- userInput -->
            <v-flex xs12 pl-2 pr-3 class="border-top">
              <v-textarea
                v-model="message"
                flat
                row-height="20"
                rows="2"
                no-resize
                solo
                label="message"
                hide-details
                append-outer-icon="send"
                @click:append-outer="sendButtonClicked"
              ></v-textarea>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- (sm, xs) -->
        <v-flex
          xs12
          sm10
          offset-sm1
          hidden-md-and-up
          :class="{
            'px-5': $vuetify.breakpoint.smOnly,
          }"
        >
          <v-layout
            row
            wrap
            :class="{
              'border': $vuetify.breakpoint.smOnly,
            }"
          >
            <!-- companyName -->
            <div class="break pa-3 font-weight-bold">
              <nuxt-link :to="'/companies/' + companyId" class="link-text teal--text">{{ companyName }}</nuxt-link>
            </div>
            <!-- message -->
            <v-flex
              xs12
              grey lighten-4
              class="scroll-y"
              :style="{ height: messagesHeight + 'px' }"
              ref="messagesScroll"
            >
              <infinite-loading
                v-if="showInfiniteLoading && messages && messages.length >= 10 && !isMessagesLoading"
                direction="top"
                spinner="waveDots"
                @infinite="messagesInfiniteHandler">
                <div slot="no-results"></div>
              </infinite-loading>
              <template v-for="(message, index) in messages" v-if="messages != null && messages.length != 0">
                <v-layout>
                  <v-flex
                    xs10
                    class="py-3"
                    :class="{ 'offset-xs2 text-xs-right pr-2': message.user != null }"
                  >
                    <v-card-actions class="pa-0" style="align-items: start">
                      <!-- 担当者のプロフィール画像 -->
                      <div>
                        <v-avatar
                          v-if="message.pic != null"
                          class="mx-2 avatar-border"
                          :size="40"
                        >
                          <img v-if="message.pic.imageUrl" :src="message.pic.imageUrl">
                          <v-icon v-else>person</v-icon>
                        </v-avatar>
                      </div>
                      <!-- message -->
                      <div
                        :class="{ 'message-right': message.user != null }"
                      >
                        <div v-if="message.pic != null" class="light-text-color">
                          {{ message.pic.name }}
                        </div>
                        <div
                          class="px-3 py-2 white message-border-radius return text-xs-left"
                          style="display: inline-block;"
                        >{{ message.message }}</div>
                        <div class="text-xs-right pt-1 pr-2 caption light-text-color">
                          {{ message.date }}
                          <span class="pl-1">{{ message.time }}</span>
                        </div>
                      </div>
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
            <!-- userInput -->
            <v-flex xs12 pl-2 pr-3 class="border-top">
              <v-textarea
                v-model="message"
                flat
                row-height="20"
                rows="2"
                no-resize
                solo
                label="message"
                hide-details
                append-outer-icon="send"
                @click:append-outer="sendButtonClicked"
              ></v-textarea>
            </v-flex>
          </v-layout>
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
    messagesHeight: 0,
    chatsCount: 0,
    messagesCount: 0,
  }),
  computed: {
    params() {
      return this.$route.params
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    companyId() {
      let companyId
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        companyId = this.$store.state.chat.companyId
      } else {
        for (let chat of this.chats) {
          if (chat.chatId == this.params.id) {
            companyId = chat.companyId
          }
        }
      }
      return companyId
    },
    companyName() {
      let companyName
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        companyName = this.$store.state.chat.companyName
      } else {
        for (let chat of this.chats) {
          if (chat.chatId == this.params.id) {
            companyName = chat.companyName
          }
        }
      }
      return companyName
    },
    companyImageUrl() {
      let companyImageUrl
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        companyImageUrl = this.$store.state.chat.companyImageUrl
      } else {
        for (let chat of this.chats) {
          if (chat.chatId == this.params.id) {
            companyImageUrl = chat.companyImageUrl
          }
        }
      }
      return companyImageUrl
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
      messages: state => state.messages.messages,
      isInitialMessagesLoading: state => state.messages.isInitialLoading,
      isMessagesLoading: state => state.messages.isLoading,
      allMessagesQueried: state => state.messages.allMessagesQueried,
      unsubscribe: state => state.messages.unsubscribe,
      isNewMessage: state => state.messages.isNewMessage,
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
    // companyName section = 48  userInput section = 63
    this.messagesHeight = this.windowHeight - 48 - 63 - 3

    this.showInfiniteLoading = true

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetMessagesState()
      this.updateIsInitialMessagesLoading(true)
      this.updateIsMessagesLoading(true)
      this.queryMessages({nuxt: this.$nuxt, params: this.params, type: 'user'})

      if (this.breakpoint == 'md' || this.breakpoint == 'lg' || this.breakpoint == 'xl') {
        // すでにchatsがある場合はクエリしない
        if (this.chats == null || this.chats.length == 0) {
          // urlに直接アクセスした場合
          this.updateIsInitialChatsLoading(true)
          this.updateIsChatsLoading(true)
          this.queryChats({uid: this.uid, companyId: null, chats: this.chats})
          this.queryChat({nuxt: this.$nuxt, params: this.params})
        } else {
          // unreadCount 更新(local)
          this.updateUnreadCount(this.params)
        }
      } else {
        this.queryChat({nuxt: this.$nuxt, params: this.params})
      }
    }
  },
  destroyed () {
    // listenerがあればデタッチ
    if (this.unsubscribe) {
      this.unsubscribe()
      this.resetUnsubscribe()
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetMessagesState()
        this.updateIsInitialMessagesLoading(true)
        this.updateIsMessagesLoading(true)
        this.queryMessages({nuxt: this.$nuxt, params: this.params, type: 'user'})

        if (this.breakpoint == 'md' || this.breakpoint == 'lg' || this.breakpoint == 'xl') {
          // すでにchatsがある場合はクエリしない
          if (this.chats == null || this.chats.length == 0) {
            // urlに直接アクセスした場合
            this.updateIsInitialChatsLoading(true)
            this.updateIsChatsLoading(true)
            this.queryChats({uid: uid, companyId: null, chats: this.chats})
            this.queryChat({nuxt: this.$nuxt, params: this.params})
          } else {
            // unreadCount 更新(local)
            this.updateUnreadCount(this.params)
          }
        } else {
          this.queryChat({nuxt: this.$nuxt, params: this.params})
        }
      }
    },
    messages(messages) {
      // 最下部へスクロール
      if (messages != null && messages.length != 0 && (messages.length <= 10 || this.isNewMessage)) {
        this.$nextTick(() => {
          if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
            if (this.$refs.messagesScroll) {
              this.$refs.messagesScroll.scrollTop = this.$refs.messagesScroll.scrollHeight
            }
          } else {
            if (this.$refs.messagesLScroll) {
              this.$refs.messagesLScroll.scrollTop = this.$refs.messagesLScroll.scrollHeight
            }
          }
          this.updateIsNewMessage(false)
        })
      }
    }
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
    messagesInfiniteHandler($state) {
      if (!this.allMessagesQueried) {
        if (!this.isMessagesLoading && this.uid != null && this.uid != '') {
          this.messagesCount += 1
          this.updateIsMessagesLoading(true)
          this.queryMessages({params: this.params, infiniteState: $state})

          if (this.messagesCount > 50) {
            $state.complete()
          }
        }
      } else {
        $state.complete()
      }
    },
    sendButtonClicked() {
      if (this.params.id != null && this.message) {
        this.postMessageFromUser({
          params: this.$route.params,
          message: this.message,
          uid: this.uid,
          imageUrl: this.profileImageUrl,
          name: this.lastName + ' ' + this.firstName,
        })
      }
      this.message = ''
    },
    ...mapActions({
      queryChat: 'chat/queryChat',
      queryChats: 'chats/queryChats',
      updateUnreadCount: 'chats/updateUnreadCount',
      updateIsInitialChatsLoading: 'chats/updateIsInitialLoading',
      updateIsChatsLoading: 'chats/updateIsLoading',
      queryMessages: 'messages/queryMessages',
      updateIsInitialMessagesLoading: 'messages/updateIsInitialLoading',
      updateIsMessagesLoading: 'messages/updateIsLoading',
      updateIsNewMessage: 'messages/updateIsNewMessage',
      resetUnsubscribe: 'messages/resetUnsubscribe',
      postMessageFromUser: 'message/postMessageFromUser',
      resetChatsState: 'chats/resetState',
      resetMessagesState: 'messages/resetState',
    }),
  }
}
</script>
