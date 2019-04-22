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
        <!-- chat lists (lg, md)-->
        <v-flex
          md4
          hidden-sm-and-down
          :class="{
            'pa-5': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex
            class="scroll-y border"
            :style="{ height: chatsHeight + 'px' }"
          >
            <v-list
              v-if="chats != null && chats.length != 0"
              two-line
            >
              <template v-for="(chat, index) in chats">
                <v-list-tile
                  avatar
                  :class="{ 'teal lighten-5': params.id == chat.chatId }"
                  :to="'/messages/' + chat.chatId"
                >
                  <v-list-tile-avatar>
                    <v-avatar
                      class="grey lighten-3"
                      :size="40"
                    >
                      <img v-if="chat.companyImageUrl" :src="chat.companyImageUrl">
                    </v-avatar>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{ chat.companyName }}</v-list-tile-title>
                    <v-list-tile-sub-title >{{ chat.lastMessage }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action v-if="chat.userUnreadCount && chat.userUnreadCount != 0">
                    <v-avatar size="27" color="red">
                      <span class="white--text" style="font-size: 14px">{{ chat.userUnreadCount > 99 ? '99+' : chat.userUnreadCount }}</span>
                    </v-avatar>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider
                  v-if="chats.length != index + 1"
                  :inset="true"
                ></v-divider>
              </template>
            </v-list>
            <div v-else>
              メッセージがありません
            </div>
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
          v-if="params.id"
          md8
          hidden-sm-and-down
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-layout
            row
            align-center
            wrap
            class="border"
          >
            <!-- companyName -->
            <div>
              <v-btn flat :to="'/companies/' + companyId">{{ companyName }}</v-btn>
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
              <template v-for="(message, index) in messages" v-if="messages != null && messages.length != 0">
                <v-layout>
                  <v-flex
                    xs10
                    class="py-3"
                    :class="{ 'offset-xs2 text-xs-right': message.user != null }"
                  >
                    <div class="d-inline-flex">
                      <!-- 担当者のプロフィール画像は左に -->
                      <v-avatar
                        v-if="message.pic != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.pic.imageUrl" :src="message.pic.imageUrl">
                      </v-avatar>
                      <div class="px-3 py-2 white message-border-radius return">{{ message.message }}</div>
                      <!-- ユーザーのプロフィール画像は右に -->
                      <v-avatar
                        v-if="message.user != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.user.imageUrl" :src="message.user.imageUrl">
                      </v-avatar>
                    </div>
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
            <!-- userInput -->
            <v-flex xs12 pl-2 pr-3>
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
        <!-- /chats の場合 -->
        <v-flex
          v-else
          md8
          hidden-sm-and-down
          class="grey lighten-3 mt-3"
          :class="{
            'px-5 pb-3': $vuetify.breakpoint.lgAndUp,
            'px-3 pb-3': $vuetify.breakpoint.mdOnly,
          }"
          :style="{ height: messagesHeight + 'px' }"
        >
          <div class="pt-3">
            左からチャットを選択してください
          </div>

        </v-flex>
        <!-- urlが /messages の場合: chat lists (sm, xs)-->
        <v-flex
          v-if="params.id == null"
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
            :style="{ height: chatsHeight + 'px' }"
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
                      class="grey lighten-3"
                      :size="40"
                    >
                      <img v-if="chat.companyImageUrl" :src="chat.companyImageUrl">
                    </v-avatar>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{ chat.companyName }}</v-list-tile-title>
                    <v-list-tile-sub-title >{{ chat.lastMessage }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action v-if="chat.userUnreadCount && chat.userUnreadCount != 0">
                    <v-avatar size="27" color="red">
                      <span class="white--text" style="font-size: 14px">{{ chat.userUnreadCount > 99 ? '99+' : chat.userUnreadCount }}</span>
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
        <!-- urlが /messages/:id の場合: messages (sm, xs) -->
        <v-flex
          v-if="params.id != null"
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
            <div>
              <v-btn flat :to="'/companies/' + companyId">{{ companyName }}</v-btn>
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
                    :class="{ 'offset-xs2 text-xs-right': message.user != null }"
                  >
                    <div class="d-inline-flex">
                      <!-- 担当者のプロフィール画像は左に -->
                      <v-avatar
                        v-if="message.pic != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.pic.imageUrl" :src="message.pic.imageUrl">
                      </v-avatar>
                      <div class="px-3 py-2 white message-border-radius return">{{ message.message }}</div>
                      <!-- ユーザーのプロフィール画像は右に -->
                      <v-avatar
                        v-if="message.user != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.user.imageUrl" :src="message.user.imageUrl">
                      </v-avatar>
                    </div>
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
            <!-- userInput -->
            <v-flex xs12 pl-2 pr-3>
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
  data: () => ({
    isQueried: false,
    message: '',
    showInfiniteLoading: false,
    windowHeight: 0,
    chatsHeight: 0,
    messagesHeight: 0,
    count: 0,
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
      type: state => state.profile.type,
      profileImageUrl: state => state.profile.imageUrl,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      chats: state => state.chats.chats,
      isChatsLoading: state => state.chats.isLoading,
      allChatsQueried: state => state.chats.allChatsQueried,
      messages: state => state.messages.messages,
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
    const windowHeight = window.innerHeight - toolbarHeight

    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      this.chatsHeight = windowHeight - 40
    } else {
      this.chatsHeight = windowHeight * 2 / 3
    }
    // companyName section = 48  userInput section = 63
    this.messagesHeight = windowHeight - 48 - 63 - 4

    this.showInfiniteLoading = true

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      if (this.params.id == null) {
        this.resetChatsState()
        this.queryChats({uid: this.uid, companyId: null, chats: this.chats})
      } else {
        this.resetMessagesState()
        this.updateIsMessagesLoading(true)
        this.queryMessages({params: this.params, type: 'user'})

        if (this.breakpoint == 'md' || this.breakpoint == 'lg' || this.breakpoint == 'xl') {
          // すでにchatsがある場合はクエリしない
          if (this.chats == null || this.chats.length == 0) {
            // urlに直接アクセスした場合
            this.queryChats({uid: this.uid, companyId: null, chats: this.chats})
          } else {
            // unreadCount 更新(local)
            this.updateUnreadCount(this.params)
          }
        } else {
          this.queryChat({nuxt: this.$nuxt, params: this.params})
        }
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
        if (this.params.id == null) {
          this.resetChatsState()
          this.queryChats({uid: uid, companyId: null, chats: this.chats})
        } else {
          this.resetMessagesState()
          this.updateIsMessagesLoading(true)
          this.queryMessages({params: this.params, type: 'user'})

          if (this.breakpoint == 'md' || this.breakpoint == 'lg' || this.breakpoint == 'xl') {
            // すでにchatsがある場合はクエリしない
            if (this.chats == null || this.chats.length == 0) {
              // urlに直接アクセスした場合
              this.queryChats({uid: uid, companyId: null, chats: this.chats})
            } else {
              // unreadCount 更新(local)
              this.updateUnreadCount(this.params)
            }
          } else {
            this.queryChat({nuxt: this.$nuxt, params: this.params})
          }
        }
      }
    },
    messages(messages) {
      // 最下部へスクロール
      if (messages.length <= 10 || this.isNewMessage) {
        this.$nextTick(() => {
          if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
            this.$refs.messagesScroll.scrollTop = this.$refs.messagesScroll.scrollHeight
          } else {
            this.$refs.messagesLScroll.scrollTop = this.$refs.messagesLScroll.scrollHeight
          }
          this.updateIsNewMessage(false)
        })
      }
    }
  },
  methods: {
    chatsInfiniteHandler($state) {
      if (!this.allChatsQueried) {
        if (!this.isChatsLoading && this.uid != null) {
          this.count += 1
          this.updateIsChatsLoading(true)
          this.queryChats({uid: this.uid, companyId: null, chats: this.chats})

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
    messagesInfiniteHandler($state) {
      if (!this.allMessagesQueried) {
        if (!this.isMessagesLoading && this.uid != null) {
          this.count += 1
          this.updateIsMessagesLoading(true)
          this.queryMessages({params: this.params, infiniteState: $state})

          if (this.count > 20) {
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
      updateIsChatsLoading: 'chats/updateIsLoading',
      queryMessages: 'messages/queryMessages',
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
