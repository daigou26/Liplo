<template>
  <v-layout
    white
    row
    align-center
    wrap
    :style="{ height: windowHeight + 'px' }"
  >
    <v-flex
      xs12
      md10
      offset-md1
      class="break"
      style="height: 100%"
    >
      <v-layout
        row
        wrap
        style="height: 100%"
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
                  :to="chat.chatId"
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
                </v-list-tile>
                <v-divider
                  v-if="chats.length != index + 1"
                  :inset="true"
                ></v-divider>
              </template>
            </v-list>
          </v-flex>
          <infinite-loading
            v-if="showInfiniteLoading && chats.length >= 2 && !isLoading"
            :distance="50"
            spinner="waveDots"
            @infinite="infiniteHandler">
            <div slot="no-results"></div>
          </infinite-loading>
        </v-flex>
        <!-- messages (lg, md) -->
        <v-flex
          md8
          hidden-sm-and-down
          :class="{
            'px-5 pb-3': $vuetify.breakpoint.lgAndUp,
            'px-3 pb-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-layout
            row
            align-center
            wrap
            class="border"
            style="height: 100%"
          >
            <!-- companyName -->
            <div>
              <v-btn flat>{{ companyName }}</v-btn>
            </div>
            <!-- message -->
            <v-flex
              xs12
              grey lighten-4
              class="scroll-y"
              :style="{ height: messagesHeight + 'px' }"
              ref="messageScroll"
            >
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
                        <img v-if="message.pic.profileImageUrl" :src="message.pic.profileImageUrl">
                      </v-avatar>
                      <div class="px-3 py-2 white message-border-radius return">{{ message.message }}</div>
                      <!-- ユーザーのプロフィール画像は右に -->
                      <v-avatar
                        v-if="message.user != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.user.profileImageUrl" :src="message.user.profileImageUrl">
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
                  :to="chat.chatId"
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
                </v-list-tile>
                <v-divider
                  v-if="chats.length != index + 1"
                  :inset="true"
                ></v-divider>
              </template>
            </v-list>
          </v-flex>
          <infinite-loading
            v-if="showInfiniteLoading && chats.length >= 2 && !isLoading"
            :distance="50"
            spinner="waveDots"
            @infinite="infiniteHandler">
            <div slot="no-results"></div>
          </infinite-loading>
        </v-flex>
        <!-- urlが /messages/:id の場合: messages (sm, xs) -->
        <v-flex
          v-if="params.id != null"
          xs12
          sm10
          offset-sm1
          hidden-md-and-up
          :class="{
            'px-5 pb-3': $vuetify.breakpoint.smOnly,
          }"
        >
          <v-layout
            row
            align-center
            wrap
            class="border"
            style="height: 100%"
          >
            <!-- companyName -->
            <div>
              <v-btn flat>{{ companyName }}</v-btn>
            </div>
            <!-- message -->
            <v-flex
              xs12
              grey lighten-4
              class="scroll-y"
              :style="{ height: messagesHeight + 'px' }"
              ref="messageScroll"
            >
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
                        <img v-if="message.pic.profileImageUrl" :src="message.pic.profileImageUrl">
                      </v-avatar>
                      <div class="px-3 py-2 white message-border-radius return">{{ message.message }}</div>
                      <!-- ユーザーのプロフィール画像は右に -->
                      <v-avatar
                        v-if="message.user != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.user.profileImageUrl" :src="message.user.profileImageUrl">
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
import { auth } from '@/plugins/firebase'

export default {
  data: () => ({
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
      user: state => state.user,
      profileImageUrl: state => state.profile.imageUrl,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      chats: state => state.chats.chats,
      isLoading: state => state.chats.isLoading,
      allChatsQueried: state => state.chats.allChatsQueried,
      messages: state => state.messages.messages,
      unsubscribe: state => state.messages.unsubscribe,
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight

    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      this.chatsHeight = this.windowHeight - 40
    } else {
      this.chatsHeight = this.windowHeight * 2 / 3
    }
    // companyName section = 48  userInput section = 63
    this.messagesHeight = this.windowHeight - 48 - 63 - 20
    // 最新のメッセージが表示されるようにscrollTopを設定
    // this.$refs.messageScroll.scrollTop = this.$refs.messageScroll.scrollHeight

    this.showInfiniteLoading = true
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (this.params.id == null) {
          this.queryChats({uid: user.uid, companyId: null, chats: this.chats})
        } else {
          // listenerがあればデタッチ
          if (this.unsubscribe) {
            console.log('remove listener')
            this.unsubscribe()
            this.resetUnsubscribe()
          }
          // listener追加
          this.addMessagesListener(this.params)
          if (this.breakpoint == 'md' || this.breakpoint == 'lg' || this.breakpoint == 'xl') {
            // すでにchatsがある場合はクエリしない
            if (this.chats == null || this.chats.length == 0) {
              // urlに直接アクセスした場合
              this.queryChats({uid: user.uid, companyId: null, chats: this.chats})
            }
          } else {
            this.queryChat(this.params)
          }
        }
      }
    })
  },
  destroyed () {
    // listenerがあればデタッチ
    if (this.unsubscribe) {
      console.log('remove listener in destroyed')
      this.unsubscribe()
      this.resetUnsubscribe()
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allChatsQueried) {
        if (!this.isLoading && this.user != null) {
          this.count += 1
          this.updateLoading(true)
          this.queryChats({uid: this.user.uid, companyId: null, chats: this.chats})
        }

        if (this.count < 20) {
          $state.complete()
        } else {
          $state.loaded()
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
          uid: this.user.uid,
          profileImageUrl: this.profileImageUrl,
          name: this.lastName + ' ' + this.firstName,
        })
      }
      this.message = ''
    },
    ...mapActions({
      queryChat: 'chat/queryChat',
      queryChats: 'chats/queryChats',
      updateLoading: 'chats/updateLoading',
      addMessagesListener: 'messages/addMessagesListener',
      resetUnsubscribe: 'messages/resetUnsubscribe',
      postMessageFromUser: 'message/postMessageFromUser',
    }),
  }
}
</script>
