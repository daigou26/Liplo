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
    <v-flex v-else-if="isInitialLoading" xs12 :style="{ height: windowHeight + 'px' }">
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
        <!-- menu (lg, md)-->
        <v-flex
          md4
          hidden-sm-and-down
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <my-page-menu/>
        </v-flex>
        <!-- passes (lg, md) -->
        <v-flex
          md8
          xs12
          class="py-3"
          :class="{
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex md10 sm8 xs12 offset-md1 offset-sm2 >
            <!-- menu (sm, xs) -->
            <my-page-menu class="hidden-md-and-up"></my-page-menu>
            <!-- passes -->
            <v-container v-if="passes && passes.length > 0" fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex v-for="(pass, index) in passes" :key="index" xs6 md4>
                  <v-card
                    :to="'/user/passes/' + pass.passId"
                    class="text-xs-center py-2"
                  >
                    <v-avatar
                      :size="avatarSize"
                      :class="{
                        'grey lighten-3': !pass.companyImageUrl,
                      }"
                    >
                      <img v-if="pass.companyImageUrl" :src="pass.companyImageUrl" alt="avatar">
                    </v-avatar>
                    <div
                      class="pt-3 px-3 font-weight-bold textColor"
                      :class="{
                        'subheading': $vuetify.breakpoint.smAndUp,
                        '': $vuetify.breakpoint.xsOnly,
                      }"
                    >
                      {{ pass.companyName }}
                    </div>
                    <div class="pt-2 px-2 caption textColor font-weight-bold">
                      {{ pass.occupation }}
                    </div>
                    <div class="pt-1 px-1 caption light-text-color">
                      <span v-if="pass.isContracted">内定契約済み</span>
                      <span v-else-if="pass.isAccepted">内定受諾済み</span>
                      <span v-else-if="pass.isExpired">有効期限を過ぎました</span>
                      <span v-else>有効期限: {{ pass.expirationDate }} まで</span>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card
              v-else
              class="pa-3"
              :class="{
                'mx-3': $vuetify.breakpoint.xsOnly,
                'mt-4': $vuetify.breakpoint.mdAndUp,
              }"
            >
              <div class="text-xs-center">
                <div
                  class="textColor"
                  :class="{
                    'title': $vuetify.breakpoint.xsOnly,
                    'headline': $vuetify.breakpoint.smAndUp,
                  }"
                >
                  内定パスがありません
                </div>
                <div class="pt-3 light-text-color">
                  企業から内定パスをもらった場合はこちらに表示されます
                </div>
                <v-btn class="mt-3 font-weight-bold" color="warning" to="/">募集を探す</v-btn>
              </div>
            </v-card>
            <infinite-loading
              v-if="showInfiniteLoading && passes && passes.length >= 10 && !isPassesLoading"
              :distance="50"
              spinner="waveDots"
              @infinite="infiniteHandler">
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
import MyPageMenu from '~/components/MyPageMenu'

export default {
  components: {
    MyPageMenu
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    count: 0,
    showInfiniteLoading: false,
    mypageItems: [
      'passes',
      'career',
      'feedbacks',
      'reviews'
    ],
  }),
  computed: {
    avatarSize() {
      if (this.breakpoint == 'xs') {
        return 50
      } else {
        return 70
      }
    },
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
      isRefreshing: state => state.isRefreshing,
      passes: state => state.passes.passes,
      isInitialLoading: state => state.passes.isInitialLoading,
      isLoading: state => state.passes.isLoading,
      allPassesQueried: state => state.passes.allPassesQueried,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 30

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.queryPasses(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsInitialLoading(true)
        this.queryPasses(uid)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allPassesQueried) {
        if (!this.isLoading && this.uid != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryPasses(this.uid)
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
      queryPasses: 'passes/queryPasses',
      updateIsInitialLoading: 'passes/updateIsInitialLoading',
      updateIsLoading: 'passes/updateIsLoading',
      resetState: 'passes/resetState',
    }),
  }
}
</script>
