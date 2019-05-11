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
      v-else-if="isInitialLoading"
      xs12
      :style="{ height: windowHeight + 'px' }"
    >
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm10
          offset-sm1
          :class="{
            'px-5 pb-3': $vuetify.breakpoint.smOnly,
          }"
        >
          <v-layout
            row
            align-center
            wrap
            class="border"
          >
            <!-- userName -->
            <div class="break pa-3 teal--text">
              <nuxt-link :to="'/users/' + chatUserId" class="link-text">{{ userName }}</nuxt-link>
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
                v-if="showInfiniteLoading && messages && messages.length >= 10 && !isLoading"
                direction="top"
                spinner="waveDots"
                @infinite="infiniteHandler">
                <div slot="no-results"></div>
              </infinite-loading>
              <template v-for="(message, index) in messages" v-if="messages != null && messages.length != 0">
                <v-layout>
                  <v-flex
                    xs10
                    class="py-3"
                    :class="{ 'offset-xs2 text-xs-right pr-2': message.pic != null }"
                  >
                    <v-card-actions class="pa-0" style="align-items: start">
                      <!-- ユーザーのプロフィール画像 -->
                      <div>
                        <v-avatar
                          v-if="message.user != null"
                          class="grey lighten-3 mx-2"
                          :size="40"
                        >
                          <img v-if="message.user.imageUrl" :src="message.user.imageUrl">
                        </v-avatar>
                      </div>
                      <!-- message -->
                      <div
                        :class="{ 'message-right': message.pic != null }"
                      >
                        <div v-if="message.user != null" class="light-text-color">
                          {{ message.user.name }}
                        </div>
                        <div
                          class="px-3 py-2 white message-border-radius return text-xs-left"
                          style="display: inline-block;"
                        >{{ message.message }}</div>
                        <div class="text-xs-right pt-1 pr-2 caption light-text-color return">{{ message.timestamp }}</div>
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
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    message: '',
    showInfiniteLoading: false,
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
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      recruiterImageUrl: state => state.profile.imageUrl,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      profileImageUrl: state => state.chat.profileImageUrl,
      userName: state => state.chat.userName,
      chatUserId: state => state.chat.uid,
      companyId: state => state.companyProfile.companyId,
      messages: state => state.messages.messages,
      isInitialLoading: state => state.messages.isInitialLoading,
      isLoading: state => state.messages.isLoading,
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
    this.windowHeight = window.innerHeight - toolbarHeight - 30
    // companyName section = 48  userInput section = 63
    this.messagesHeight = window.innerHeight - toolbarHeight - 48 - 63 - 8

    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryChat({nuxt: this.$nuxt, params: this.$route.params})
      this.queryMessages({params: this.params, type: 'recruiter'})
    }
  },
  destroyed () {
    // listenerがあればデタッチ
    if (this.unsubscribe) {
      this.unsubscribe()
      this.resetState()
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.resetState()
        this.isQueried = true
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryChat({nuxt: this.$nuxt, params: this.$route.params})
        this.queryMessages({params: this.params, type: 'recruiter'})
      }
    },
    messages(messages) {
      // 最下部へスクロール
      if (messages.length <= 10 || this.isNewMessage) {
        this.$nextTick(() => {
          if (this.$refs.messagesScroll) {
            this.$refs.messagesScroll.scrollTop = this.$refs.messagesScroll.scrollHeight
          }
          this.updateIsNewMessage(false)
        })
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allMessagesQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
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
        this.postMessageFromPic({
          chatId: this.$route.params.id,
          message: this.message,
          uid: this.uid,
          imageUrl: this.recruiterImageUrl,
          name: this.lastName + ' ' + this.firstName,
        })
      }
      this.message = ''
    },
    ...mapActions({
      queryChat: 'chat/queryChat',
      queryMessages: 'messages/queryMessages',
      resetUnsubscribe: 'messages/resetUnsubscribe',
      updateIsInitialLoading: 'messages/updateIsInitialLoading',
      updateIsLoading: 'messages/updateIsLoading',
      updateIsNewMessage: 'messages/updateIsNewMessage',
      postMessageFromPic: 'message/postMessageFromPic',
      resetState: 'messages/resetState',
    }),
  }
}
</script>
