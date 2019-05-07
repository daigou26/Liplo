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
    <v-flex v-else-if="isLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else xs12>
      <v-img
        class="grey lighten-2"
        :src="imageUrl"
        :aspect-ratio="imageRatio"
      ></v-img>
      <v-flex xs10 offset-xs1 class="break">
        <v-layout
          white
          row
          wrap
        >
          <v-flex
            xs12
            :class="{
              'pa-5': $vuetify.breakpoint.mdAndUp,
              'pa-3': $vuetify.breakpoint.smOnly,
              'py-3': $vuetify.breakpoint.xsOnly,
            }"
          >
            <!-- companyImage & Name -->
            <div class="mb-5">
              <v-avatar
                class="grey lighten-3"
              >
                <v-img :src="companyImageUrl" :size="40"></v-img>
              </v-avatar>
              <span class="title textColor font-weight-bold align-center px-3">
                {{ companyName }}
              </span>
            </div>
            <!-- members -->
            <div v-if="members" class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                メンバー
              </p>
              <div>
                <v-card flat>
                  <v-card-text class="overflow-hidden py-0">
                    <v-layout class="horiz-scroll">
                      <div
                        v-for="member in members"
                        class="pr-4"
                      >
                        <div class="text-xs-center" style="max-width: 150px;">
                          <v-avatar
                            :size="avatarSize"
                            class="grey lighten-3"
                          >
                            <img v-if="member.imageUrl" :src="member.imageUrl">
                          </v-avatar>
                          <div class="sub-title1 py-2 font-weight-bold textColor">
                            {{ member.name }}
                          </div>
                          <div v-if="member.position" class="textColor">
                            {{ member.position }}
                          </div>
                        </div>
                      </div>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </div>
            </div>
            <!-- mission -->
            <div v-if="mission" class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Mission
              </p>
              <div>
                <p class="body-text return">{{ mission }}</p>
              </div>
            </div>
            <!-- vision -->
            <div v-if="vision" class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Vision
              </p>
              <div>
                <p class="body-text return">{{ vision }}</p>
              </div>
            </div>
            <!-- value -->
            <div v-if="value" class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Value
              </p>
              <div>
                <p class="body-text return">{{ value }}</p>
              </div>
            </div>
            <!-- culture -->
            <div v-if="culture" class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Culture
              </p>
              <div>
                <p class="body-text return">{{ culture }}</p>
              </div>
            </div>
            <!-- what -->
            <div class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                何をやっているか
              </p>
              <div>
                <p class="body-text return">{{ what }}</p>
                <!-- サービス一覧 -->
                <v-list v-if="services">
                  <template v-for="(service, index) in services">
                      <div v-if="!xsWidth" class="d-flex pt-4">
                        <v-flex xs4 sm3 lg2>
                          <v-img :src="service.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                        </v-flex>
                        <v-flex xs8 sm9 lg10 class="pl-4 break">
                          <div class="font-weight-bold body-text">{{ service.title }}</div>
                          <p　class="textColor return">{{ service.content }}</p>
                          <a :href="service.url">{{ service.url }}</a>
                        </v-flex>
                      </div>
                      <div v-else class="pt-4">
                        <v-img :src="service.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                        <div class="font-weight-bold body-text">{{ service.title }}</div>
                        <div　class="textColor return pb-2">{{ service.content }}</div>
                        <a :href="service.url">{{ service.url }}</a>
                      </div>
                  </template>
                </v-list>

              </div>
            </div>
            <!-- why -->
            <div class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                なぜやっているか
              </p>
              <div>
                <p class="body-text return">{{ why }}</p>
              </div>
            </div>
            <!-- 福利厚生 -->
            <div v-if="welfare" class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                福利厚生
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ welfare }}</p>
              </div>
            </div>
            <!-- review -->
            <div class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                レビュー
              </p>
              <div v-if="!uid" class="pt-3">
                レビューを見るには、ログインする必要があります。
              </div>
              <div v-if="uid && reviews" class="pt-3">
                <v-hover>
                  <v-card slot-scope="{ hover }" flat class="pb-3">
                    <v-card-actions>
                      <v-icon style="font-size: 18px">info</v-icon>
                      <span class="light-text-color caption">ヒント（レビューの項目について）</span>
                    </v-card-actions>
                    <v-card v-show="hover" flat class="caption pa-2">
                      <div>
                        <div class="textColor">
                          成長できるか：
                        </div>
                        <div class="textColor">
                          インターンに行って成長できたかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div class="textColor">
                          仕事内容：
                        </div>
                        <div class="textColor">
                          募集に書かれていた内容と合っていたかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div class="textColor">
                          裁量度：
                        </div>
                        <div class="textColor">
                          インターン生にも裁量が与えられていたかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div class="textColor">
                          勤務中の自由度：
                        </div>
                        <div class="textColor">
                          休憩などが自由にできるかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div class="textColor">
                          勤務時間の柔軟性：
                        </div>
                        <div class="textColor">
                          勤務時間、日程を自由に決められるかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div class="textColor">
                          メンター：
                        </div>
                        <div class="textColor">
                          メンター（インターン生の担当者）の評価
                        </div>
                      </div>
                      <div class="pt-3">
                        <div class="textColor">
                          雰囲気：
                        </div>
                        <div class="textColor">
                          社内の雰囲気、人間関係などが良好かどうか
                        </div>
                      </div>
                    </v-card>
                  </v-card>
                </v-hover>
                <!-- sm以下の場合は、チャートを使わない -->
                <div class="hidden-md-and-up pb-5">
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="font-weight-bold textColor pr-2">成長できるか</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating
                        v-model="reviews.rating.growth"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="font-weight-bold textColor pr-2">仕事内容</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating
                        v-model="reviews.rating.job"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="font-weight-bold textColor pr-2">裁量度</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating
                        v-model="reviews.rating.discretion"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="font-weight-bold textColor pr-2">出勤時間の柔軟性</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating
                        v-model="reviews.rating.flexibleSchedule"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="font-weight-bold textColor pr-2">勤務中の自由度</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating
                        v-model="reviews.rating.flexibility"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="font-weight-bold textColor pr-2">メンター</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating
                        v-model="reviews.rating.mentor"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="font-weight-bold textColor pr-2">雰囲気</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating
                        v-model="reviews.rating.atmosphere"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                    </v-flex>
                  </div>
                </div>
                <div class="d-flex pt-3">
                  <!-- comments -->
                  <v-flex
                    md8
                    xs12
                    :class="{'pr-4': $vuetify.breakpoint.mdOnly}"
                  >
                    <v-list>
                      <template v-for="(item, index) in reviews.comments">
                        <div class="py-2">
                          <div class="font-weight-bold body-text">
                            <v-avatar
                              class="grey lighten-3"
                              :size="25"
                            >
                              <v-icon style="font-size: 18px">person</v-icon>
                            </v-avatar>
                            {{ item.occupation }}
                          </div>
                          <p class="py-3 body-text return">{{ item.content }}</p>
                        </div>
                      </template>
                    </v-list>
                    <div
                      v-if="reviews.rating.count > 3"
                      class="d-inline-flex teal--text font-weight-bold clickable"
                      @click="reviewsButtonClicked"
                    >
                      レビューをすべて見る
                    </div>
                  </v-flex>
                  <!-- chart -->
                  <v-flex md4 hidden-sm-and-down>
                    <radar-chart v-if="showChart && reviewChartData" :data="reviewChartData" :options="reviewChartOptions" />
                  </v-flex>
                </div>
              </div>
              <div v-if="uid && (reviews == null || reviews.length == 0)" class="pt-2">
                まだレビューがありません
              </div>
            </div>
            <!-- 募集 -->
            <div v-if="jobs && jobs.length > 0" class="py-4 mb-5">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                募集
              </p>
              <v-card flat class="pb-3">
                <v-card-text class="overflow-hidden pa-0">
                  <v-layout class="horiz-scroll">
                    <template v-for="job in jobs">
                      <v-card
                        flat
                        class="ma-2 mr-3"
                        :max-width="jobCardWidth"
                        :to="'/jobs/' + job.jobId"
                      >
                        <img
                          :src="job.imageUrl"
                          :height="jobCardHeight"
                          :width="jobCardWidth"
                          style="border-radius: 5px"
                        />
                        <div
                          class="py-1 caption teal--text text--lighten-2 font-weight-bold"
                        >
                          <span>{{ occupation(job.occupation) }}</span>
                        </div>
                        <div class="sub-title1 font-weight-bold textColor">
                          {{ job.title }}
                        </div>
                      </v-card>
                    </template>
                  </v-layout>
                </v-card-text>
              </v-card>
              <nuxt-link
                v-if="jobs && jobs.length > 1"
                class="pl-2 teal--text font-weight-bold link-text"
                :to="'/companies/' + companyId + '/jobs'"
              >
                募集をすべて見る
              </nuxt-link>
            </div>
            <!-- 企業情報 -->
            <div class="py-4">
              <p
                class="font-weight-bold textColor"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                企業情報
              </p>
              <div v-if="url" class="pb-2">
                <v-card-actions class="pa-0">
                  <v-icon style="font-size: 18px">link</v-icon>
                  <a :href="url" class="pl-2">{{ url }}</a>
                </v-card-actions>
              </div>
              <div v-if="foundedDate" class="pb-2">
                <v-card-actions class="pa-0">
                  <v-icon style="font-size: 18px">flag</v-icon>
                  <span class="pl-2">{{ foundedDate }}に設立</span>
                </v-card-actions>
              </div>
              <div v-if="location" class="pb-2">
                <v-card-actions class="pa-0">
                  <v-icon style="font-size: 18px">place</v-icon>
                  <span class="pl-2">{{ location }}</span>
                </v-card-actions>
              </div>
              <div v-if="employeesCount" class="pb-2">
                <v-card-actions class="pa-0">
                  <v-icon style="font-size: 18px">group</v-icon>
                  <span class="pl-2">{{ employeesCount }}人のメンバー</span>
                </v-card-actions>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <div v-if="reviews" class="text-xs-center">
        <v-dialog
          v-model="reviewsDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="500"
        >
          <v-card class="py-3 px-3">
            <v-toolbar flat color="white">
              <v-toolbar-side-icon
                @click="reviewsDialog=false"
                class="ml-2"
              >
                <v-icon>close</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title v-if="reviews" class="font-weight-bold textColor">
                レビュー{{ reviews.rating.count }}件
              </v-toolbar-title>
            </v-toolbar>
            <v-flex
              xs12
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-4': $vuetify.breakpoint.xsOnly}"
            >
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <div>
                    <v-list class="px-2">
                      <template v-for="(item, index) in allReviews">
                        <div class="py-2">
                          <div class="font-weight-bold body-text">
                            <v-avatar
                              class="grey lighten-3"
                              :size="25"
                            >
                              <v-icon style="font-size: 18px">person</v-icon>
                            </v-avatar>
                            {{ item.occupation }}
                          </div>
                          <v-rating
                            v-model="item.all"
                            background-color="teal"
                            color="teal darken-1"
                            small
                            half-increments
                            readonly
                            class="pt-2"
                          />
                          <p class="py-3 body-text return">{{ item.content }}</p>
                        </div>
                      </template>
                    </v-list>
                    <infinite-loading
                      v-if="showInfiniteLoading && allReviews && allReviews.length >= 10 && !isReviewsLoading"
                      :distance="50"
                      spinner="waveDots"
                      @infinite="infiniteHandler">
                      <div slot="no-results"></div>
                    </infinite-loading>
                  </div>
                </v-layout>
              </v-container>
            </v-flex>
          </v-card>
        </v-dialog>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    windowHeight: 0,
    windowWidth: 0,
    xsWidth: false,
    showInfiniteLoading: false,
    reviewsDialog: false,
    reviewChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scale: {
        ticks: {
            min: 1,
            max: 5,
        }
      }
    },
    showChart: false,
  }),
  computed: {
    occupation: function() {
      return function(occupation) {
        if (occupation.engineer == true) {
          return 'エンジニア'
        } else if (occupation.designer == true) {
          return 'デザイナー'
        } else if (occupation.sales == true) {
          return '営業'
        } else if (occupation.others == true) {
          return 'その他'
        }
      }
    },
    jobCardWidth() {
      return (this.breakpoint == 'xs') ? 200 : 250
    },
    jobCardHeight() {
      return (this.breakpoint == 'xs') ? 130 : 150
    },
    avatarSize() {
      return (this.breakpoint == 'xs') ? 50 : 60
    },
    imageRatio() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '2'
        case 'sm': return '2.5'
        case 'md': return '3.5'
        case 'lg': return '3.5'
        case 'xl': return '3.5'
      }
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      imageUrl: state => state.company.imageUrl,
      companyId: state => state.company.companyId,
      companyName: state => state.company.companyName,
      companyImageUrl: state => state.company.companyImageUrl,
      email: state => state.company.email,
      members: state => state.company.members,
      location: state => state.company.location,
      foundedDate: state => state.company.foundedDate,
      url: state => state.company.url,
      employeesCount: state => state.company.employeesCount,
      mission: state => state.company.mission,
      vision: state => state.company.vision,
      value: state => state.company.value,
      culture: state => state.company.culture,
      system: state => state.company.system,
      why: state => state.company.why,
      what: state => state.company.what,
      services: state => state.company.services,
      welfare: state => state.company.welfare,
      reviews: state => state.company.reviews,
      reviewChartData: state => state.company.reviewChartData,
      jobs: state => state.company.jobs,
      isLoading: state => state.company.isLoading,
      allReviews: state => state.reviews.companyReviews,
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
    this.windowWidth = window.innerWidth

    this.showChart = true
    this.showInfiniteLoading = true

    this.resetCompanyState()
    this.updateIsLoading(true)
    this.queryCompanyDetail({nuxt: this.$nuxt, params: this.$route.params})
  },
  watch: {
    windowWidth(width) {
      if (width < 450) {
        this.xsWidth = true
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allReviewsQueried) {
        if (!this.isReviewsLoading) {
          this.count += 1
          this.updateIsReviewsLoading(true)
          this.queryCompanyReviews(this.companyId)
          if (this.count > 50) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }
      } else {
        $state.complete()
      }
    },
    reviewsButtonClicked() {
      this.reviewsDialog = true
      if (this.allReviews.length == 0) {
        this.resetReviewsState()
        this.updateIsReviewsLoading(true)
        this.queryCompanyReviews(this.companyId)
      }
    },
    ...mapActions({
      queryCompanyDetail: 'company/queryCompanyDetail',
      updateIsLoading: 'company/updateIsLoading',
      resetCompanyState: 'company/resetState',
      queryCompanyReviews: 'reviews/queryCompanyReviews',
      updateIsReviewsLoading: 'reviews/updateIsCompanyReviewsLoading',
      resetReviewsState: 'reviews/resetCompanyReviewsState',
    }),
  }
}
</script>
