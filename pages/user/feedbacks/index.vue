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
      :class="{
        'px-4': $vuetify.breakpoint.smAndDown,
      }"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md, sm)-->
        <my-page-menu/>
        <!-- feedbacks -->
        <v-flex
          xs12
          class="py-3"
          :class="{
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex sm10 xs12 offset-sm1>
            <!-- feedbacks -->
            <v-list v-if="feedbacks && feedbacks.length > 0" two-line>
              <template v-for="(feedback, index) in feedbacks">
                <v-list-tile :to="'/user/feedbacks/' + feedback.feedbackId" >
                  <v-list-tile-avatar color="grey darken-3">
                    <v-img
                      :src="feedback.companyImageUrl"
                    ></v-img>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor font-weight-bold">{{ feedback.companyName }}</v-list-tile-title>
                    <v-list-tile-sub-title class="text-xs-right light-text-color">{{ feedback.timestamp }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider
                  :inset="true"
                ></v-divider>
              </template>
            </v-list>
            <v-card
              v-else
              class="px-3 py-4"
              :class="{
                'mx-2': $vuetify.breakpoint.xsOnly,
                'mt-4': $vuetify.breakpoint.mdAndUp,
                'mt-3': $vuetify.breakpoint.smAndDown,
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
                  フィードバックがありません
                </div>
                <div class="pt-3 light-text-color">
                  企業からフィードバックが送られた場合はこちらに表示されます
                </div>
                <v-btn class="mt-3 font-weight-bold" color="warning" to="/">募集を探す</v-btn>
              </div>
            </v-card>
            <infinite-loading
              v-if="showInfiniteLoading && feedbacks && feedbacks.length >= 10 && !isLoading"
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
  }),
  computed: {
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
      feedbacks: state => state.feedbacks.feedbacks,
      isInitialLoading: state => state.feedbacks.isInitialLoading,
      isLoading: state => state.feedbacks.isLoading,
      allFeedbacksQueried: state => state.feedbacks.allFeedbacksQueried,
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
      this.queryFeedbacks({uid: this.uid, feedbacks: this.feedbacks})
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsInitialLoading(true)
        this.queryFeedbacks({uid: uid, feedbacks: this.feedbacks})
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allFeedbacksQueried) {
        if (!this.isFeedbacksLoading && this.uid != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryFeedbacks({uid: this.uid, feedbacks: this.feedbacks})
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
      queryFeedbacks: 'feedbacks/queryFeedbacks',
      updateIsInitialLoading: 'feedbacks/updateIsInitialLoading',
      updateIsLoading: 'feedbacks/updateIsLoading',
      resetState: 'feedbacks/resetState',
    }),
  }
}
</script>
