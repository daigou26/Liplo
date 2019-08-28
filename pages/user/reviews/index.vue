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
    <v-flex v-else-if="isInitialUserReviewsLoading || isNotReviewedListsLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid && uid != ''"
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
        <my-page-menu/>
        <!-- reviews -->
        <v-flex
          xs12
          class="py-3"
          :class="{
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex sm10 xs12 offset-sm1>
            <!-- 記入可能なレビュー -->
            <div class="my-3">
              <div class="font-weight-bold text-color subheading">
                記入待ちのレビュー
                <div class="pt-2 body-2 light-text-color">
                  レビューを書くことでスコアが上がり、スカウトされやすくなります。
                </div>
              </div>
              <v-list v-if="notReviewedLists && notReviewedLists.length > 0" two-line>
                <template v-for="(item, index) in notReviewedLists">
                  <v-list-tile :to="'/user/reviews/new?id=' + item.careerId" >
                    <v-list-tile-avatar color="grey darken-3">
                      <v-img
                        :src="item.companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="text-color font-weight-bold">{{ item.companyName }}</v-list-tile-title>
                      <v-list-tile-sub-title class="text-color caption">
                        {{ item.occupation }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="notReviewedLists.length != index + 1"
                    :inset="true"
                  ></v-divider>
                </template>
              </v-list>
              <div v-else class="mt-2 pa-4 border text-xs-center">
                <div>
                  レビューを書ける企業がありません。インターンに行きましょう！
                </div>
                <v-btn class="mt-4 font-weight-bold white--text" color="teal lighten-1" to="/">募集を探す</v-btn>
              </div>
            </div>

            <!-- reviews -->
            <div class="my-4">
              <div class="font-weight-bold text-color subheading">
                過去に書いたレビュー
              </div>
              <v-list v-if="userReviews && userReviews.length > 0" two-line>
                <template v-for="(review, index) in userReviews">
                  <v-list-tile :to="'/user/reviews/' + review.reviewId" >
                    <v-list-tile-avatar color="grey darken-3">
                      <v-img
                        :src="review.companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="text-color font-weight-bold">{{ review.companyName }}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <v-rating
                          v-model="review.all"
                          background-color="#FF5A5F"
                          color="#FF5A5F"
                          small
                          half-increments
                          readonly
                        />
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-action-text>{{ review.timestamp }}</v-list-tile-action-text>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider
                    v-if="userReviews.length != index + 1"
                    :inset="true"
                  ></v-divider>
                </template>
              </v-list>
              <div v-else class="pa-4 border">
                まだレビューを書いていません。
              </div>
              <infinite-loading
                v-if="showInfiniteLoading && userReviews && userReviews.length >= 10 && !isUserReviewsLoading"
                :distance="50"
                spinner="waveDots"
                @infinite="infiniteHandler">
                <div slot="no-results"></div>
              </infinite-loading>
            </div>
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
  middleware: 'auth',
  components: {
    MyPageMenu
  },
  head () {
    return {
      title: 'レビュー',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
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
      notReviewedLists: state => state.career.notReviewedLists,
      isNotReviewedListsLoading: state => state.career.isNotReviewedListsLoading,
      userReviews: state => state.reviews.userReviews,
      isInitialUserReviewsLoading: state => state.reviews.isInitialUserReviewsLoading,
      isUserReviewsLoading: state => state.reviews.isUserReviewsLoading,
      allUserReviewsQueried: state => state.reviews.allUserReviewsQueried,
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

    if (
      this.uid != null &&
      this.uid != '' &&
      !this.isQueried &&
      (!this.notReviewedLists || (this.notReviewedLists != null && this.notReviewedLists.length == 0)) &&
      (!this.userReviews || (this.userReviews != null && this.userReviews.length == 0))
    ) {
      this.resetReviewsState()
      this.resetCareerState()
      this.updateIsInitialUserReviewsLoading(true)
      this.updateIsNotReviewedListsLoading(true)
      this.queryUserReviews(this.uid)
      this.queryNotReviewedLists(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetReviewsState()
        this.resetCareerState()
        this.updateIsInitialUserReviewsLoading(true)
        this.updateIsNotReviewedListsLoading(true)
        this.queryUserReviews(uid)
        this.queryNotReviewedLists(uid)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allUserReviewsQueried) {
        if (!this.isUserReviewsLoading && this.uid != null) {
          this.count += 1
          this.updateIsUserReviewsLoading(true)
          this.queryUserReviews(this.uid)
        }
        if (this.count > 30) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      queryUserReviews: 'reviews/queryUserReviews',
      updateIsInitialUserReviewsLoading: 'reviews/updateIsInitialUserReviewsLoading',
      updateIsUserReviewsLoading: 'reviews/updateIsUserReviewsLoading',
      resetReviewsState: 'reviews/resetUserReviewsState',
      queryNotReviewedLists: 'career/queryNotReviewedLists',
      updateIsNotReviewedListsLoading: 'career/updateIsNotReviewedListsLoading',
      resetCareerState: 'career/resetState',
    }),
  }
}
</script>
