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
        <!-- menu (lg, md)-->
        <v-flex
          md3
          hidden-sm-and-down
          :class="{
            'pa-5': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <my-page-menu/>
        </v-flex>
        <!-- reviews (lg, md) -->
        <v-flex
          md8
          xs12
          class="py-3"
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex md10 sm6 xs8 offset-md1 offset-sm3 offset-xs2>
            <!-- menu (sm, xs) -->
            <my-page-menu class="hidden-md-and-up"/>
            <!-- reviews -->
            <div v-if="params.id == null">
              <v-list v-if="userReviews" two-line class="border">
                <template v-for="(review, index) in userReviews">
                  <v-list-tile :to="'/user/reviews/' + review.reviewId" >
                    <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                      <v-img
                        :src="review.companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="textColor font-weight-bold return">{{ review.companyName }}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <v-rating small readonly v-model="review.all"/>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="userReviews.length != index + 1"
                    :inset="true"
                  ></v-divider>
                </template>
              </v-list>
              <infinite-loading
                v-if="showInfiniteLoading && userReviews && userReviews.length >= 2 && !isUserReviewsLoading"
                :distance="50"
                spinner="waveDots"
                @infinite="infiniteHandler">
                <div slot="no-results"></div>
              </infinite-loading>
            </div>
            <!-- review detail -->
            <div
              v-else
              :class="{
                'px-5 py-2 border': $vuetify.breakpoint.mdAndUp,
              }"
              id="review-detail"
            >
              <v-card v-if="companyId" flat :to="'/companies/' + companyId">
                <v-card-actions class="px-0 pb-4">
                  <v-list-tile>
                    <v-list-tile-avatar color="grey darken-3">
                      <v-img
                        :src="companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="textColor font-weight-bold return">{{ companyName }}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        <v-rating v-if="all" small readonly v-model="all"/>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-card-actions>
              </v-card>
              <div class="d-flex">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold textColor pr-2">成長できるか</span>
                </v-flex>
                <v-flex v-if="growth" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating small readonly v-model="growth"/>
                </v-flex>
              </div>
              <div class="d-flex">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold textColor pr-2">仕事内容</span>
                </v-flex>
                <v-flex v-if="job" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating small readonly v-model="job"/>
                </v-flex>
              </div>
              <div class="d-flex">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold textColor pr-2">裁量度</span>
                </v-flex>
                <v-flex v-if="discretion" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating small readonly v-model="discretion"/>
                </v-flex>
              </div>
              <div class="d-flex">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold textColor pr-2">出勤時間の柔軟性</span>
                </v-flex>
                <v-flex v-if="flexibleSchedule" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating small readonly v-model="flexibleSchedule"/>
                </v-flex>
              </div>
              <div class="d-flex">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold textColor pr-2">勤務中の自由度</span>
                </v-flex>
                <v-flex v-if="flexibility" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating small readonly v-model="flexibility"/>
                </v-flex>
              </div>
              <div class="d-flex">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold textColor pr-2">メンター</span>
                </v-flex>
                <v-flex v-if="mentor" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating small readonly v-model="mentor"/>
                </v-flex>
              </div>
              <div class="d-flex">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold textColor pr-2">雰囲気</span>
                </v-flex>
                <v-flex v-if="atmosphere" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating small readonly v-model="atmosphere"/>
                </v-flex>
              </div>
              <p class="py-5 font-weight-medium body-text return">{{ content }}</p>
            </div>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { auth } from '@/plugins/firebase'
import MyPageMenu from '~/components/MyPageMenu'

export default {
  components: {
    MyPageMenu
  },
  data: () => ({
    count: 0,
    showInfiniteLoading: false,
    mypageItems: [
      'passes',
      'career',
      'feedbacks',
      'reviews'
    ],
    windowHeight: 0,
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
      user: state => state.user,
      userReviews: state => state.reviews.userReviews,
      isUserReviewsLoading: state => state.reviews.isUserReviewsLoading,
      allUserReviewsQueried: state => state.reviews.allUserReviewsQueried,
      companyId: state => state.review.companyId,
      companyName: state => state.review.companyName,
      companyImageUrl: state => state.review.companyImageUrl,
      content: state => state.review.content,
      all: state => state.review.all,
      atmosphere: state => state.review.atmosphere,
      job: state => state.review.job,
      discretion: state => state.review.discretion,
      flexibleSchedule: state => state.review.flexibleSchedule,
      flexibility: state => state.review.flexibility,
      mentor: state => state.review.mentor,
      growth: state => state.review.growth,
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
    this.showInfiniteLoading = true

    auth.onAuthStateChanged((user) => {
      if (user) {
        if (this.params.id == null) {
          this.queryUserReviews({uid: user.uid, reviews: this.userReviews})
        } else {
          this.queryUserReview({nuxt: this.$nuxt, params: this.$route.params})
        }
      }
    })
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allUserReviewsQueried) {
        if (!this.isUserReviewsLoading && this.user != null) {
          this.count += 1
          this.updateUserReviewsLoading(true)
          this.queryUserReviews({uid: this.user.uid, reviews: this.userReviews})
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
      queryUserReviews: 'reviews/queryUserReviews',
      updateUserReviewsLoading: 'reviews/updateUserReviewsLoading',
      queryUserReview: 'review/queryUserReview',
    }),
  }
}
</script>
<style>
#review-detail div.v-list__tile {
  padding: 0px;
}
</style>
