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
            <!-- 記入可能なレビュー -->
            <div v-if="params.id == null" class="my-3">
              <div class="subheading">
                記入待ちのレビュー
              </div>
              <v-list v-if="notReviewedLists != null && notReviewedLists.length != 0" two-line class="border">
                <template v-for="(item, index) in notReviewedLists">
                  <v-list-tile :to="'/user/reviews/new?id=' + item.careerId" >
                    <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                      <v-img
                        :src="item.companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="textColor font-weight-bold return">{{ item.companyName }}</v-list-tile-title>
                      <v-list-tile-sub-title class="textColor">
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
              <div v-else class="pa-3 border">
                レビューを書ける企業がありません。インターンに行きましょう！
              </div>
            </div>

            <!-- reviews -->
            <div v-if="params.id == null" class="my-4">
              <div class="subheading">
                過去に書いたレビュー
              </div>
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
              <div v-else class="pa-3 border">
                書いたレビューがありません。
              </div>
              <infinite-loading
                v-if="showInfiniteLoading && userReviews && userReviews.length >= 10 && !isUserReviewsLoading"
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
import MyPageMenu from '~/components/MyPageMenu'

export default {
  components: {
    MyPageMenu
  },
  data: () => ({
    isQueried: false,
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
      notReviewedLists: state => state.career.notReviewedLists,
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
    this.showInfiniteLoading = true

    if (this.uid != null && !this.isQueried) {
      if (this.params.id == null) {
        this.queryUserReviews({uid: this.uid, reviews: this.userReviews})
        this.queryNotReviewedLists(this.uid)
      } else {
        this.queryReview({nuxt: this.$nuxt, params: this.$route.params, uid: this.uid})
      }
    }
  },
  watch: {
    uid(uid) {
      if (uid != null) {
        this.isQueried = true
        if (this.params.id == null) {
          this.queryUserReviews({uid: uid, reviews: this.userReviews})
          this.queryNotReviewedLists(uid)
        } else {
          this.queryReview({nuxt: this.$nuxt, params: this.$route.params, uid: uid})
        }
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allUserReviewsQueried) {
        if (!this.isUserReviewsLoading && this.uid != null) {
          this.count += 1
          this.updateUserReviewsLoading(true)
          this.queryUserReviews({uid: this.uid, reviews: this.userReviews})
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
      queryReview: 'review/queryReview',
      queryNotReviewedLists: 'career/queryNotReviewedLists',
    }),
  }
}
</script>
<style>
#review-detail div.v-list__tile {
  padding: 0px;
}
</style>
