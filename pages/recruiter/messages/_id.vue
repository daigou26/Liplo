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
            style="height: 100%"
          >
            <!-- userName -->
            <div>
              <v-btn flat>{{ userName }}</v-btn>
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
                    :class="{ 'offset-xs2 text-xs-right': message.pic != null }"
                  >
                    <div class="d-inline-flex">
                      <!-- ユーザーのプロフィール画像は左に -->
                      <v-avatar
                        v-if="message.user != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.user.profileImageUrl" :src="message.user.profileImageUrl">
                      </v-avatar>
                      <div class="px-3 py-2 white message-border-radius return">{{ message.message }}</div>
                      <!-- 担当者のプロフィール画像は右に -->
                      <v-avatar
                        v-if="message.pic != null"
                        class="grey lighten-3 mx-2"
                        :size="40"
                      >
                        <img v-if="message.pic.profileImageUrl" :src="message.pic.profileImageUrl">
                      </v-avatar>
                    </div>
                  </v-flex>
                </v-layout>
              </template>
            </v-flex>
            <!-- userInput -->
            <v-flex xs12 px-2>
              <v-card class="pr-2">
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
              </v-card>
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
      user: state => state.user,
      recruiterImageUrl: state => state.profile.imageUrl,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      profileImageUrl: state => state.chat.profileImageUrl,
      userName: state => state.chat.userName,
      companyId: state => state.companyProfile.companyId,
      messages: state => state.messages.messages,
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
    this.windowHeight = window.innerHeight - toolbarHeight
    // companyName section = 48  userInput section = 63
    this.messagesHeight = this.windowHeight - 48 - 63 - 30

    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryChat({nuxt: this.$nuxt, params: this.$route.params})
      this.queryMessages({params: this.params})
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
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
        this.updateIsLoading(true)
        this.queryChat({nuxt: this.$nuxt, params: this.$route.params})
        this.queryMessages({params: this.params})
      }
    },
    messages(messages) {
      // 最下部へスクロール
      if (messages.length <= 10 || this.isNewMessage) {
        this.$nextTick(() => {
          this.$refs.messagesScroll.scrollTop = this.$refs.messagesScroll.scrollHeight
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
          params: this.$route.params,
          message: this.message,
          uid: this.user.uid,
          profileImageUrl: this.recruiterImageUrl,
          name: this.lastName + ' ' + this.firstName,
        })
      }
      this.message = ''
    },
    ...mapActions({
      queryChat: 'chat/queryChat',
      queryMessages: 'messages/queryMessages',
      resetUnsubscribe: 'messages/resetUnsubscribe',
      updateIsLoading: 'messages/updateIsLoading',
      updateIsNewMessage: 'messages/updateIsNewMessage',
      postMessageFromPic: 'message/postMessageFromPic',
      resetState: 'messages/resetState',
    }),
  }
}
</script>
