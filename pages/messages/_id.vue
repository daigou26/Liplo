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
          class="scroll-y"
          :class="{
            'pa-5': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-list
            v-if="chats != null && chats.length != 0"
            two-line
            class="border"
          >
            <template v-for="(chat, index) in chats">
              <v-list-tile
                avatar
                @click=""
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
                  <v-list-tile-title v-html="chat.companyName"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="chat.lastMessage"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider
                v-if="chats.length != index + 1"
                :inset="true"
              ></v-divider>
            </template>
          </v-list>

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
            'pa-5': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
        </v-flex>
        <!-- urlが /messages の場合: chat lists (sm, xs)-->
        <v-flex
          v-if="params.id == null"
          xs12
          sm10
          offset-sm1
          hidden-md-and-up
          class="scroll-y"
          :class="{
            'pa-5': $vuetify.breakpoint.smOnly,
          }"
        >
          <v-list
            v-if="chats != null && chats.length != 0"
            two-line
            :class="{
              'border': $vuetify.breakpoint.smOnly,
            }"
          >
            <template v-for="(chat, index) in chats">
              <v-list-tile
                avatar
                @click=""
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
                  <v-list-tile-title v-html="chat.companyName"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="chat.lastMessage"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider
                v-if="chats.length != index + 1"
                :inset="true"
              ></v-divider>
            </template>
          </v-list>

          <infinite-loading
            v-if="showInfiniteLoading && chats.length >= 2 && !isLoading"
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
import { auth } from '@/plugins/firebase'

export default {
  data: () => ({
    showInfiniteLoading: false,
    windowHeight: 0,
    count: 0,
  }),
  computed: {
    params() {
      return this.$route.params
    },
    ...mapState({
      user: state => state.user,
      chats: state => state.chats.chats,
      isLoading: state => state.chats.isLoading,
      allChatsQueried: state => state.chats.allChatsQueried,
    }),
  },
  mounted() {
    this.windowHeight = window.innerHeight - 64
    this.showInfiniteLoading = true
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('chats/queryChats', {uid: user.uid, companyId: null, chats: this.chats})
      }
    })
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
    ...mapActions({
      queryChats: 'chats/queryChats',
      updateLoading: 'chats/updateLoading',
    }),
  }
}
</script>
