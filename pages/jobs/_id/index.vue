<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex xs12 v-if="!isLoading">
      <v-flex>
        <v-img
          :src="imageUrl"
          :aspect-ratio="imageRatio"
        ></v-img>
      </v-flex>
      <v-flex xs10 offset-xs1 class="break">
        <v-layout
          white
          row
          wrap
        >
          <v-flex
            xs12
            lg8
            :class="{
              'pa-5': $vuetify.breakpoint.mdAndUp,
              'pa-3': $vuetify.breakpoint.smOnly,
              'py-3': $vuetify.breakpoint.xsOnly,
            }"
          >
            <!-- title -->
            <div
              class="font-weight-bold pb-5"
              :class="{
                'job-title': $vuetify.breakpoint.smAndUp,
                'headline': $vuetify.breakpoint.xsOnly
              }"
            >
              {{ title }}
            </div>
            <!-- mission -->
            <div v-if="mission" class="py-4">
              <p class="headline font-weight-bold textColor">
                Mission
              </p>
              <div>
                <p class="body-text return">{{ mission }}</p>
              </div>
            </div>
            <!-- vision -->
            <div v-if="vision" class="py-4">
              <p class="headline font-weight-bold textColor">
                Vision
              </p>
              <div>
                <p class="body-text return">{{ vision }}</p>
              </div>
            </div>
            <!-- value -->
            <div v-if="value" class="py-4">
              <p class="headline font-weight-bold textColor">
                Value
              </p>
              <div>
                <p class="body-text return">{{ value }}</p>
              </div>
            </div>
            <!-- culture -->
            <div v-if="culture" class="py-4">
              <p class="headline font-weight-bold textColor">
                Culture
              </p>
              <div>
                <p class="body-text return">{{ culture }}</p>
              </div>
            </div>
            <!-- what -->
            <div v-if="what" class="py-4">
              <p class="headline font-weight-bold textColor">
                何をやっているか
              </p>
              <div>
                <p class="body-text return">{{ what }}</p>
                <!-- サービス一覧 -->
                <v-list v-if="services" class="pt-3">
                  <template v-for="(service, index) in services">
                      <div class="d-flex pb-3">
                        <v-flex xs4 sm3 lg2>
                          <v-img :src="service.imageUrl" height="100"></v-img>
                        </v-flex>
                        <v-flex xs8 sm9 lg10 class="px-4 break">
                          <div>
                            <span class="font-weight-bold body-text">{{ service.title }}</span>
                          </div>
                          <p　class="textColor return">{{ service.content }}</p>
                          <p class="textColor">{{ service.url }}</p>
                        </v-flex>
                      </div>
                  </template>
                </v-list>
              </div>
            </div>
            <!-- why -->
            <div v-if="why" class="py-4">
              <p class="headline font-weight-bold textColor">
                なぜやっているか
              </p>
              <div>
                <p class="body-text return">{{ why }}</p>
              </div>
            </div>
            <!-- 仕事について -->
            <div class="py-4">
              <p class="headline font-weight-bold textColor">
                仕事について
              </p>
              <div v-if="description">
                <p class="body-text return">{{ description }}</p>
              </div>
              <!-- 給与 -->
              <div v-if="wage" class="py-3">
                <p class="job-sub-title font-weight-bold textColor">
                  給与
                </p>
                <div>
                  <p class="body-text return">{{ wage }}</p>
                </div>
              </div>
              <!-- 必要スキル -->
              <div v-if="requiredSkills" class="py-3">
                <p class="job-sub-title font-weight-bold textColor">
                  必要スキル
                </p>
                <div>
                  <p class="body-text return">{{ requiredSkills }}</p>
                </div>
              </div>
              <!-- あると望ましいスキル -->
              <div v-if="idealSkills" class="py-3">
                <p class="job-sub-title font-weight-bold textColor">
                  あると望ましいスキル
                </p>
                <div>
                  <p class="body-text return">{{ idealSkills }}</p>
                </div>
              </div>
              <!-- 開発環境 -->
              <div v-if="environment" class="py-3">
                <p class="job-sub-title font-weight-bold textColor">
                  開発環境
                </p>
                <div>
                  <p class="body-text return">{{ environment }}</p>
                </div>
              </div>
            </div>
            <!-- 求める人物像 -->
            <div v-if="idealCandidate" class="py-4">
              <p class="headline font-weight-bold textColor">
                求める人物像
              </p>
              <div>
                <p class="body-text return">{{ idealCandidate }}</p>
              </div>
            </div>
            <!-- review -->
            <div v-if="reviews" class="py-4 hidden-lg-and-up">
              <p class="headline font-weight-bold textColor">
                レビュー({{ reviews.rating.count }})
              </p>
              <div class="py-3">
                <!-- sm以下の場合は、チャートを使わない -->
                <div class="hidden-md-and-up pb-5">
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="subheading font-weight-bold textColor pr-2">成長できるか</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating small readonly v-model="reviews.rating.growth"/>
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="subheading font-weight-bold textColor pr-2">仕事内容</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating small readonly v-model="reviews.rating.job"/>
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="subheading font-weight-bold textColor pr-2">裁量度</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating small readonly v-model="reviews.rating.discretion"/>
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="subheading font-weight-bold textColor pr-2">出勤時間の柔軟性</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating small readonly v-model="reviews.rating.flexibleSchedule"/>
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="subheading font-weight-bold textColor pr-2">勤務中の自由度</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating small readonly v-model="reviews.rating.flexibility"/>
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="subheading font-weight-bold textColor pr-2">メンター</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating small readonly v-model="reviews.rating.mentor"/>
                    </v-flex>
                  </div>
                  <div class="d-flex">
                    <v-flex xs7 sm6>
                      <span class="subheading font-weight-bold textColor pr-2">雰囲気</span>
                    </v-flex>
                    <v-flex xs5 sm6 text-sm-left text-xs-right>
                      <v-rating small readonly v-model="reviews.rating.atmosphere"/>
                    </v-flex>
                  </div>
                </div>
                <div class="d-flex">
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
                              <!-- <v-img :src="companyImageUrl" :size="15"></v-img> -->
                              <v-icon style="font-size: 15px">person</v-icon>
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
            </div>
            <!-- 他の募集 -->
            <div class="py-4 mb-5">
              <p class="headline font-weight-bold textColor">
                他の募集
              </p>
              <div>
                <v-card flat>
                  <v-card-text class="overflow-hidden py-0">
                    <v-layout class="horiz-scroll">
                      <div
                        v-for="media in mediaList"
                        class="pr-3 pb-2"
                      >
                        <div>
                          <img :src="media.src" height="133" width="200"/>
                          <div class="sub-title1 font-weight-bold textColor">
                            エンジニア、デザイナー募集
                          </div>
                        </div>
                      </div>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-flex>
          <!-- right section -->
          <v-flex xs4 pa-5 hidden-md-and-down>
            <!-- review -->
            <div class="py-4">
              <p class="title font-weight-bold textColor">
                レビュー({{ reviews ? reviews.rating.count : 0 }})
              </p>
              <div v-if="reviews">
                <radar-chart v-if="showChart && reviewChartData" :data="reviewChartData" :options="reviewChartOptions" />
                <v-list>
                  <template v-for="(item, index) in reviews.comments">
                    <div class="py-2">
                      <div class="font-weight-bold body-text">
                        <v-avatar
                          class="grey lighten-3"
                          :size="25"
                        >
                          <!-- <v-img :src="companyImageUrl" :size="15"></v-img> -->
                          <v-icon style="font-size: 15px">person</v-icon>
                        </v-avatar>
                        {{ item.occupation }}
                      </div>
                      <p class="py-3 body-text return">{{ item.content }}</p>
                    </div>
                  </template>
                </v-list>
                <div
                  v-if="reviews.rating.count > 3"
                  class="teal--text font-weight-bold clickable text-xs-center"
                  @click="reviewsButtonClicked"
                >
                  すべて見る
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- footer -->
      <v-footer
        fixed
        app
        color="white"
        height="70"
        class="shadow-top"
      >
        <v-layout
          align-center
        >

          <!-- Company Name && Rating -->
          <v-flex
            xs6
            sm7
            md8
            text-xs-left
            class="break"
            :class="{
              'pl-4': $vuetify.breakpoint.mdAndUp,
            }"
          >
          <v-card v-if="companyId" flat :to="'../companies/' + companyId">
            <v-card-actions>
              <v-list-tile>
                <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                  <v-img
                    :src="companyImageUrl"
                  ></v-img>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="textColor font-weight-bold">
                    {{ companyName }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title v-if="reviews">
                    <v-rating small readonly v-model="reviews.rating.all"/>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-card-actions>
          </v-card>

          </v-flex>
          <v-flex
            v-if="type != 'recruiter'"
            xs6
            sm5
            md4
            text-xs-right
            :class="{
              'pr-5': $vuetify.breakpoint.mdAndUp,
              'pr-3': $vuetify.breakpoint.smOnly,
              'pr-1': $vuetify.breakpoint.xsOnly
            }"
          >
            <v-btn
              v-if="uid"
              large
              :disabled="isCandidate"
              class="warning"
              id="job-apply"
              @click="applyButtonClicked"
            >
              <span v-if="isCandidate" class="font-weight-bold">
                応募済み
              </span>
              <span v-else class="font-weight-bold">
                応募する
              </span>
            </v-btn>
            <span v-else>
              応募するにはログインが必要です
            </span>
          </v-flex>
        </v-layout>
      </v-footer>
      <div v-if="reviews" class="text-xs-center">
        <v-dialog
          v-model="reviewsDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="500"
        >
          <v-card class="py-3 px-3">
            <v-btn
              fab
              small
              color="white"
              @click="reviewsDialog=false"
            >
              <v-icon>close</v-icon>
            </v-btn>
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
                    <p class="headline font-weight-bold textColor">
                      レビュー{{ reviews.rating.count }}件
                    </p>
                    <v-list class="px-2">
                      <template v-for="(item, index) in allReviews">
                        <div class="py-2">
                          <div class="font-weight-bold body-text">
                            <v-avatar
                              class="grey lighten-3"
                              :size="25"
                            >
                              <!-- <v-img :src="companyImageUrl" :size="15"></v-img> -->
                              <v-icon style="font-size: 15px">person</v-icon>
                            </v-avatar>
                            {{ item.occupation }}
                          </div>
                          <v-rating small readonly v-model="item.all" class="pt-2"/>
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
    <v-flex v-else>
      <div class="text-xs-center">
        <v-progress-circular
         :size="50"
         color="primary"
         indeterminate
       ></v-progress-circular>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    isQueried: false,
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
    mediaList: [
      {id: 1, name: "1.png", src: "https://placeimg.com/200/200/animals"},
      {id: 2, name: "1.png", src: "https://placeimg.com/200/200/arch"},
      {id: 3, name: "1.png", src: "https://placeimg.com/200/200/nature"},
      {id: 4, name: "1.png", src: "https://placeimg.com/200/200/people"},
      {id: 5, name: "1.png", src: "https://placeimg.com/200/200/tech"},
      {id: 6, name: "1.png", src: "https://placeimg.com/200/200/animals"},
      {id: 7, name: "1.png", src: "https://placeimg.com/200/200/animals"},
    ],
  }),
  computed: {
    imageRatio() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '2'
        case 'sm': return '2.5'
        case 'md': return '3'
        case 'lg': return '3'
        case 'xl': return '3'
      }
    },
    ...mapState({
      type: state => state.profile.type,
      profileImageUrl: state => state.profile.imageUrl,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      uid: state => state.uid,
      imageUrl: state => state.job.imageUrl,
      title: state => state.job.title,
      companyId: state => state.job.companyId,
      companyName: state => state.job.companyName,
      companyImageUrl: state => state.job.companyImageUrl,
      mission: state => state.job.mission,
      vision: state => state.job.vision,
      value: state => state.job.value,
      culture: state => state.job.culture,
      system: state => state.job.system,
      why: state => state.job.why,
      what: state => state.job.what,
      services: state => state.job.services,
      description: state => state.job.description,
      wage: state => state.job.wage,
      requiredSkills: state => state.job.requiredSkills,
      idealSkills: state => state.job.idealSkills,
      environment: state => state.job.environment,
      welfare: state => state.job.welfare,
      workweek: state => state.job.workweek,
      period: state => state.job.period,
      workday: state => state.job.workday,
      idealCandidate: state => state.job.idealCandidate,
      occupation: state => state.job.occupation,
      features: state => state.job.features,
      createdAt: state => state.job.createdAt,
      applicants: state => state.job.applicants,
      reviews: state => state.job.reviews,
      reviewChartData: state => state.job.reviewChartData,
      isLoading: state => state.job.isLoading,
      isCandidate: state => state.job.isCandidate,
      allReviews: state => state.reviews.companyReviews,
      isReviewsLoading: state => state.reviews.isCompanyReviewsLoading,
      allReviewsQueried: state => state.reviews.allCompanyReviewsQueried,
    }),
  },
  mounted() {
    this.showChart = true
    this.showInfiniteLoading = true
  },
  watch: {
    uid(uid) {
      if (uid != null) {
        this.isQueried = true
        this.queryJobDetail({nuxt: this.$nuxt, params: this.$route.params, uid: uid})
      }
    }
  },
  fetch(context) {
    const store = context.store
    // query job
    store.dispatch('job/queryJobDetail', {nuxt: context, params: context.params, uid: store.state.uid})
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allReviewsQueried) {
        if (!this.isReviewsLoading) {
          this.count += 1
          this.updateIsReviewsLoading(true)
          this.queryCompanyReviews(this.companyId)
          if (this.count > 20) {
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
    applyButtonClicked() {
      this.apply({
        params: this.$route.params,
        uid: this.uid,
        imageUrl: this.profileImageUrl,
        firstName: this.firstName,
        lastName: this.lastName,
        companyId: this.companyId
      })
    },
    ...mapActions({
      queryJobDetail: 'job/queryJobDetail',
      apply: 'job/apply',
      queryCompanyReviews: 'reviews/queryCompanyReviews',
      updateIsReviewsLoading: 'reviews/updateIsCompanyReviewsLoading',
      resetReviewsState: 'reviews/resetState',
    }),
  }
}
</script>
