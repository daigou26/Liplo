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
        :src="topImageUrl"
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
              <v-card-actions>
                <v-avatar
                  class="grey lighten-3"
                >
                  <v-img :src="companyImageUrl" :size="40"></v-img>
                </v-avatar>
                <span class="title text-color font-weight-bold align-center px-3">
                  {{ companyName }}
                </span>
              </v-card-actions>
            </div>
            <!-- members -->
            <div v-if="members" class="py-4">
              <p
                class="font-weight-bold text-color"
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
                        :key="member.uid"
                        class="pr-4"
                      >
                        <div class="text-xs-center" style="max-width: 150px;">
                          <v-avatar
                            :size="avatarSize"
                            class="grey lighten-3"
                          >
                            <img v-if="member.imageUrl" :src="member.imageUrl">
                          </v-avatar>
                          <div class="sub-title1 py-2 font-weight-bold text-color">
                            {{ member.name }}
                          </div>
                          <div v-if="member.position" class="text-color">
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
            <div v-if="mission" class="py-5">
              <p
                class="font-weight-bold text-color"
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
            <div v-if="vision" class="py-5">
              <p
                class="font-weight-bold text-color"
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
            <div v-if="value" class="py-5">
              <p
                class="font-weight-bold text-color"
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
            <div v-if="culture" class="py-5">
              <p
                class="font-weight-bold text-color"
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
            <!-- system -->
            <div v-if="system" class="py-5">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                社内制度
              </p>
              <div>
                <p class="body-text return">{{ system }}</p>
              </div>
            </div>
            <!-- what -->
            <div v-if="what" class="py-5">
              <p
                class="font-weight-bold text-color"
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
                          <p　class="text-color return">{{ service.content }}</p>
                          <a :href="service.url" target="_blank">{{ service.url }}</a>
                        </v-flex>
                      </div>
                      <div v-else class="pt-4">
                        <v-img :src="service.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                        <div class="font-weight-bold body-text">{{ service.title }}</div>
                        <div　class="text-color return pb-2">{{ service.content }}</div>
                        <a :href="service.url" target="_blank">{{ service.url }}</a>
                      </div>
                  </template>
                </v-list>
              </div>
            </div>
            <!-- why -->
            <div v-if="why" class="py-5">
              <p
                class="font-weight-bold text-color"
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
            <div v-if="welfare" class="py-5">
              <p
                class="font-weight-bold text-color"
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
            <div class="py-5">
              <p
                class="font-weight-bold text-color"
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
              <div v-if="uid && uid != '' && reviews" class="pt-3">
                <!-- chart (xs) -->
                <v-flex xs12 hidden-sm-and-up>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" ontouchstart="">
                        <radar-chart
                          v-if="showChart && reviewsChartData"
                          :data="reviewsChartData"
                          :options="reviewsChartOptions"
                        />
                      </div>
                    </template>
                    <div>
                      <div>
                        仕事内容：
                      </div>
                      <div>
                        募集に書かれていた内容と合っていたかどうか
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        裁量度：
                      </div>
                      <div>
                        インターン生にも裁量が与えられていたかどうか
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        労働環境：
                      </div>
                      <div>
                        働きやすい環境かどうか（休憩などが自由にできるか、質問がしやすい環境かなど）
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        労働時間：
                      </div>
                      <div>
                        勤務時間帯を柔軟に決められるか、休暇を取りやすい環境か
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        雰囲気：
                      </div>
                      <div>
                        社内の雰囲気、人間関係などが良好かどうか
                      </div>
                    </div>
                  </v-tooltip>
                </v-flex>
                <div class="d-flex">
                  <!-- comments -->
                  <v-flex
                    md8
                    sm6
                    xs12
                    :class="{
                      'pr-4': $vuetify.breakpoint.mdOnly,
                      'pt-4': $vuetify.breakpoint.xsOnly,
                    }"
                  >
                    <v-list>
                      <template v-for="(item, index) in reviews.comments">
                        <v-hover>
                          <div
                            slot-scope="{ hover }"
                            ontouchstart=""
                            class="pt-2"
                            :class="{
                              'pt-3': $vuetify.breakpoint.xsOnly
                            }"
                          >
                            <div class="font-weight-bold body-text">
                              <v-avatar
                                class="grey lighten-3"
                                :size="25"
                              >
                                <v-icon style="font-size: 18px">person</v-icon>
                              </v-avatar>
                              {{ item.occupation }}
                            </div>
                            <div class="pt-3 pl-2 body-text return">{{ item.content }}</div>
                            <div
                              class="hidden-xs-only"
                              :style="{ visibility: hover ? 'visible' : 'hidden' }"
                            >
                              <v-btn
                                small
                                flat
                                class="caption teal--text text--lighten-1 mx-0"
                                style="text-decoration: none;"
                                @click="userReviewsButtonClicked(item.uid)"
                              >
                                この人が書いた他のレビューを見る
                              </v-btn>
                            </div>
                            <v-btn
                              small
                              flat
                              class="hidden-sm-and-up caption teal--text text--lighten-1 mt-0 mx-0"
                              style="text-decoration: none;"
                              @click="userReviewsButtonClicked(item.uid)"
                            >
                              この人が書いた他のレビューを見る
                            </v-btn>
                          </div>
                        </v-hover>
                      </template>
                    </v-list>
                    <div
                      v-if="reviews.rating.count > 3"
                      class="d-inline-flex teal--text font-weight-bold clickable"
                      :class="{
                        'pt-2': $vuetify.breakpoint.xsOnly
                      }"
                      @click="reviewsButtonClicked"
                    >
                      レビューをすべて見る
                    </div>
                  </v-flex>
                  <!-- chart (xl, lg, md, sm) -->
                  <v-flex md4 sm6 pl-3 hidden-xs-only>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div v-on="on" ontouchstart="">
                          <radar-chart
                            v-if="showChart && reviewsChartData"
                            :data="reviewsChartData"
                            :options="reviewsChartOptions"
                          />
                        </div>
                      </template>
                      <div>
                        <div>
                          仕事内容：
                        </div>
                        <div>
                          募集に書かれていた内容と合っていたかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          裁量度：
                        </div>
                        <div>
                          インターン生にも裁量が与えられていたかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          労働環境：
                        </div>
                        <div>
                          働きやすい環境かどうか（休憩などが自由にできるか、質問がしやすい環境かなど）
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          労働時間：
                        </div>
                        <div>
                          勤務時間帯を柔軟に決められるか、休暇を取りやすい環境か
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          雰囲気：
                        </div>
                        <div>
                          社内の雰囲気、人間関係などが良好かどうか
                        </div>
                      </div>
                    </v-tooltip>
                  </v-flex>
                </div>
              </div>
              <div v-if="uid && uid != '' && (reviews == null || reviews.length == 0)" class="pt-2">
                まだレビューがありません
              </div>
            </div>
            <!-- 募集 -->
            <div class="py-5">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                募集
              </p>
              <v-card v-if="jobs && jobs.length > 0" flat class="pb-3">
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
                        <div class="sub-title1 font-weight-bold text-color">
                          {{ job.title }}
                        </div>
                      </v-card>
                    </template>
                  </v-layout>
                </v-card-text>
              </v-card>
              <div v-else>
                まだ募集がありません
              </div>
              <nuxt-link
                v-if="jobs && jobs.length > 1"
                class="pl-2 teal--text font-weight-bold link-text"
                :to="'/companies/' + companyId + '/jobs'"
              >
                募集をすべて見る
              </nuxt-link>
            </div>
            <!-- 企業情報 -->
            <div class="py-5">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                企業情報
              </p>
              <div v-if="url || foundedDate || location || employeesCount">
                <div v-if="url" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">link</v-icon>
                    <a :href="url" target="_blank" class="pl-2">{{ url }}</a>
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
              <div v-else>
                まだ企業情報がありません
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <div v-if="reviews" class="text-xs-center">
        <v-dialog
          :value="reviewsDialog || userReviewsDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          persistent
          width="500"
        >
          <!-- レビュー -->
          <v-card v-show="!userReviewsDialog" class="py-3 px-3">
            <v-toolbar flat color="white">
              <v-toolbar-side-icon
                @click="reviewsDialog=false"
                class="ma-0"
              >
                <v-icon style="font-size: 20px">close</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title class="font-weight-bold ml-0">
                <span
                  :class="{
                    'toolbar-title': $vuetify.breakpoint.smAndUp,
                    'toolbar-title-small': $vuetify.breakpoint.xsOnly
                  }"
                >レビュー{{ reviews.rating.count }}件</span>
              </v-toolbar-title>
            </v-toolbar>
            <v-flex
              xs12
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xsOnly}"
            >
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <div>
                    <v-list class="px-2">
                      <template v-for="(item, index) in allReviews">
                        <v-hover>
                          <div slot-scope="{ hover }" ontouchstart="" class="pt-3">
                            <div class="font-weight-bold body-text">
                              <v-avatar
                                :size="25"
                              >
                                <v-icon style="font-size: 18px">person</v-icon>
                              </v-avatar>
                              {{ item.occupation }}
                            </div>
                            <v-rating
                              v-model="item.all"
                              background-color="pink"
                              color="pink"
                              small
                              half-increments
                              readonly
                              class="pt-3 pl-2"
                            />
                            <div class="pt-3 pl-2 body-text return">{{ item.content }}</div>
                            <div
                              class="hidden-xs-only"
                              :style="{ visibility: hover ? 'visible' : 'hidden' }"
                            >
                              <v-btn
                                small
                                flat
                                class="caption teal--text text--lighten-1 mx-0"
                                style="text-decoration: none;"
                                @click="userReviewsButtonClicked(item.uid)"
                              >
                                この人が書いた他のレビューを見る
                              </v-btn>
                            </div>
                            <v-btn
                              small
                              flat
                              class="hidden-sm-and-up caption teal--text text--lighten-1 mt-0 mx-0"
                              style="text-decoration: none;"
                              @click="userReviewsButtonClicked(item.uid)"
                            >
                              この人が書いた他のレビューを見る
                            </v-btn>
                          </div>
                        </v-hover>
                        <v-divider v-if="allReviews.length != index + 1"></v-divider>
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
          <v-card v-show="userReviewsDialog" class="py-3 px-3">
            <v-toolbar flat color="white">
              <v-toolbar-side-icon
                @click="userReviewsDialog=false"
                class="ma-0"
              >
                <v-icon v-show="reviewsDialog" style="font-size: 20px">arrow_back</v-icon>
                <v-icon v-show="!reviewsDialog" style="font-size: 20px">close</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title class="font-weight-bold ml-0">
                <span
                  :class="{
                    'toolbar-title': $vuetify.breakpoint.smAndUp,
                    'toolbar-title-small': $vuetify.breakpoint.xsOnly
                  }"
                >このユーザーが記入したレビュー</span>
              </v-toolbar-title>
            </v-toolbar>
            <v-flex
              xs12
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xsOnly}"
            >
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <div>
                    <v-list class="px-2">
                      <template v-for="(item, index) in userReviews">
                        <div class="pt-3">
                          <v-card
                            flat
                            class="font-weight-bold body-text"
                            :to="'/companies/' + item.companyId"
                          >
                            <v-avatar
                              :class="{'grey lighten-3': !item.companyImageUrl || item.companyImageUrl == ''}"
                              :size="25"
                            >
                              <v-img
                                v-if="item.companyImageUrl"
                                :src="item.companyImageUrl"
                              ></v-img>
                            </v-avatar>
                            {{ item.companyName }}
                          </v-card>
                          <v-rating
                            v-model="item.all"
                            background-color="pink"
                            color="pink"
                            small
                            half-increments
                            readonly
                            class="pt-3"
                          />
                          <p class="pt-3 caption text-color">
                            職種：　{{ item.occupation }}
                          </p>
                          <div class="pb-3 body-text return">{{ item.content }}</div>
                        </div>
                        <v-divider v-if="userReviews.length != index + 1"></v-divider>
                      </template>
                    </v-list>
                    <infinite-loading
                      v-if="showInfiniteLoading && userReviews && userReviews.length >= 10 && !isUserReviewsLoading"
                      :distance="50"
                      spinner="waveDots"
                      @infinite="infiniteUserReviewsHandler">
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
  head () {
    return {
      title: this.companyName,
      meta: [
        { hid: 'description', name: 'description', content: this.what },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: this.companyName + ' - Liplo' },
        { hid: 'og:description', property: 'og:description', content: this.what },
        { hid: 'og:url', property: 'og:url', content: 'https://liplo.jp' + this.$route.path },
        { hid: 'og:image', property: 'og:image', content: this.companyImageUrl },
        { hid: 'twitter:image', name: 'twitter:image', content: this.imageUrl },
        { hid: 'twitter:title', name: 'twitter:title', content: this.companyName + ' - Liplo' },
        { hid: 'twitter:description', name: 'twitter:description', content: this.what },
      ],
    }
  },
  data: () => ({
    reviewsQueryCount: 0,
    userReviewsQueryCount: 0,
    windowHeight: 0,
    windowWidth: 0,
    xsWidth: false,
    showInfiniteLoading: false,
    reviewsDialog: false,
    userReviewsDialog: false,
    reviewsChartOptions: {
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
    // user のレビュー一覧をクエリする時に使用
    selectedUserId: '',
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
        } else if (occupation.marketer == true) {
          return 'マーケター'
        } else if (occupation.planner == true) {
          return '企画'
        } else if (occupation.writer == true) {
          return 'ライター'
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
      topImageUrl: state => state.company.topImageUrl,
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
      reviewsChartData: state => state.company.reviewsChartData,
      jobs: state => state.company.jobs,
      isLoading: state => state.company.isLoading,
      allReviews: state => state.reviews.companyReviews,
      isReviewsLoading: state => state.reviews.isCompanyReviewsLoading,
      allReviewsQueried: state => state.reviews.allCompanyReviewsQueried,
      userReviews: state => state.reviews.userReviews,
      isUserReviewsLoading: state => state.reviews.isUserReviewsLoading,
      allUserReviewsQueried: state => state.reviews.allUserReviewsQueried,
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
    // 企業に対するレビュー一覧
    infiniteHandler($state) {
      if (!this.allReviewsQueried) {
        if (!this.isReviewsLoading) {
          this.reviewsQueryCount += 1
          this.updateIsReviewsLoading(true)
          this.queryCompanyReviews(this.companyId)
          if (this.reviewsQueryCount > 50) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }
      } else {
        $state.complete()
      }
    },
    // 特定のユーザーのレビュー一覧
    infiniteUserReviewsHandler($state) {
      if (!this.allUserReviewsQueried) {
        if (!this.isUserReviewsLoading) {
          this.userReviewsQueryCount += 1
          this.updateIsUserReviewsLoading(true)
          this.queryUserReviews(this.selectedUserId)
          if (this.userReviewsQueryCount > 20) {
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
    userReviewsButtonClicked(uid) {
      if (uid && uid != '') {
        this.selectedUserId = uid
        this.userReviewsDialog = true
        if (this.userReviews.length == 0) {
          this.resetUserReviewsState()
          this.updateIsUserReviewsLoading(true)
          this.queryUserReviews(this.selectedUserId)
        }
      }
    },
    ...mapActions({
      queryCompanyDetail: 'company/queryCompanyDetail',
      updateIsLoading: 'company/updateIsLoading',
      resetCompanyState: 'company/resetState',
      queryCompanyReviews: 'reviews/queryCompanyReviews',
      updateIsReviewsLoading: 'reviews/updateIsCompanyReviewsLoading',
      resetReviewsState: 'reviews/resetCompanyReviewsState',
      queryUserReviews: 'reviews/queryUserReviews',
      updateIsUserReviewsLoading: 'reviews/updateIsUserReviewsLoading',
      resetUserReviewsState: 'reviews/resetUserReviewsState',
    }),
  }
}
</script>
