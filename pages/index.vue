<template>
  <v-layout
    white
    column
  >
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 pt-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="isInitialLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height style="padding-top: 150px">
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else>
      <!-- footer 表示ボタン -->
      <div v-show="!footer" class="hidden-xs-only" id="footer-button">
        <v-btn
          color="white"
          @click="footer = true"
        >
          <span class="font-weight-bold text-color">プライバシーなど</span>
        </v-btn>
      </div>
      <!-- プロフィール記入率が低い場合に表示 -->
      <v-layout v-if="uid && uid != '' && type == 'user' && completionPercentage != null && completionPercentage <= 50" row wrap>
        <v-flex xs12 sm12 md8 offset-md2>
          <v-card
            class="ma-3 pa-3 subheading clickable"
            :class="{'mt-4': $vuetify.breakpoint.xsOnly}"
            to="/user/profile"
            style="border-radius: 10px"
          >
            <div class="pb-3 font-weight-bold teal--text">
              まずはプロフィールを記入しましょう！
            </div>
            <span class="light-text-color caption">現在のプロフィール完成度: </span>
            <span class="font-weight-bold light-text-color">{{ completionPercentage }}%</span>
            <div
              v-if="completionPercentage != 100"
              :class="{'mr-5': $vuetify.breakpoint.mdAndUp}"
            >
              <v-progress-linear
                background-color="grey lighten-3"
                color="teal lighten-3"
                height="15"
                :value="completionPercentage"
              ></v-progress-linear>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- 並び替え -->
      <v-flex
        xs12
        style="padding-right: 10px"
        :class="{
          'pr-4': $vuetify.breakpoint.smAndUp,
        }"
        id="sort"
      >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon>sort</v-icon>
          <v-btn flat class="ma-0" @click="sortButtonClicked('recent')">
            <span
              :class="{
                'teal--text text--darken-1 font-weight-bold': order == 'recent',
                'text-color': order != 'recent',
              }"
            >
              新着順
            </span>
          </v-btn>
          <v-btn flat class="ma-0 pa-0" @click="sortButtonClicked('rating')">
            <span
              :class="{
                'teal--text text--darken-1 font-weight-bold': order == 'rating',
                'text-color': order != 'rating',
              }"
            >
              評価順
            </span>
          </v-btn>
        </v-card-actions>
      </v-flex>
      <v-container class="pt-0 mt-3">
        <v-layout row wrap justify-center>
          <v-flex
            xs12
            sm8
            text-xs-center
          >
            <!-- job lists -->
            <v-list class="pt-0" v-if="jobs">
              <template v-for="(job, index) in jobs">
                <!-- job image & title -->
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    :class="{
                      'mb-5': $vuetify.breakpoint.smAndUp,
                      'mb-4': $vuetify.breakpoint.xsOnly,
                      'elevation-12': hover && !$vuetify.breakpoint.xsOnly,
                      'elevation-2': !hover,
                    }"
                  >
                    <v-card flat :to='"jobs/" + job.jobId' class="clickable mb-3">
                      <v-img
                        :src="job.imageUrl"
                        :aspect-ratio="imageRatio"
                      ></v-img>
                      <div
                        class="pt-3 px-4 text-xs-left caption text-color font-weight-bold"
                      >
                        <v-chip outline small color="teal">{{ occupation(job.occupation) }}</v-chip>
                        <v-chip outline small color="blue-grey ">{{ job.period }}ヶ月</v-chip>
                      </div>
                      <v-card-title primary-title class="px-4 pt-3">
                        <div class="text-xs-left">
                          <!-- タイトル -->
                          <h3
                            :class="{
                              'headline': $vuetify.breakpoint.smAndUp,
                              'title': $vuetify.breakpoint.xsOnly,
                            }"
                            class="text-color font-weight-bold break mb-0"
                          >
                            {{ job.title }}
                          </h3>
                          <!-- 概要 -->
                          <div class="text-color break pt-3">{{ job.content }}</div>
                          <!-- シフト -->
                          <v-list-tile-action v-if="job.workweek && job.workday != null" class="pt-4 light-text-color caption">
                            <v-card-actions class="pa-0">
                              <v-icon class="mr-2" style="font-size: 18px;">date_range</v-icon>
                              週{{ workweekDaysText(job.workweek.days) }}日〜 （{{workdayText(job.workday)}}）
                            </v-card-actions>
                          </v-list-tile-action>
                          <!-- 最寄り -->
                          <v-list-tile-action v-if="job.nearestStation" class="pt-2 light-text-color caption">
                            <v-card-actions class="pa-0">
                              <v-icon class="mr-2" style="font-size: 18px;">place</v-icon>
                              {{ job.nearestStation }}
                            </v-card-actions>
                          </v-list-tile-action>
                        </div>
                      </v-card-title>
                    </v-card>
                    <!-- company info -->
                    <v-hover>
                      <v-card slot-scope="{ hover }" flat class="pb-3" :to="'companies/' + job.companyId">
                        <v-list-tile>
                          <v-list-tile-avatar>
                            <v-img
                              :src="job.companyImageUrl"
                              class="avatar-border"
                            ></v-img>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title
                              :class="{
                                'caption': $vuetify.breakpoint.xsOnly,
                              }"
                              class="text-color font-weight-bold"
                            >
                              {{ job.companyName }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              <v-card-actions class="pa-0">
                                <v-rating
                                  v-if="job.rating"
                                  v-model="job.rating.all"
                                  background-color="#FF5A5F"
                                  color="#FF5A5F"
                                  small
                                  half-increments
                                  readonly
                                />
                                <span v-if="job.rating" class="pl-1 pr-3 text-color">{{ job.rating.count }}</span>
                                <span v-show="hover" class="caption green--text hidden-xs-only">企業情報を確認する</span>
                              </v-card-actions>
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                          <!-- 投稿日 -->
                          <v-list-tile-action class="caption font-weight-bold light-text-color">
                            <v-card-actions class="pa-0">
                              <v-icon class="mr-2 hidden-xs-only">access_alarm</v-icon>
                              {{ job.timestamp }}
                            </v-card-actions>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-card>
                    </v-hover>
                  </v-card>
                </v-hover>
              </template>
            </v-list>
            <v-card
              v-if="jobs == null || jobs.length == 0"
              class="px-3 py-4"
              :class="{
                'mx-3': $vuetify.breakpoint.xsOnly,
                'mt-4': $vuetify.breakpoint.mdAndUp,
                'mt-3': $vuetify.breakpoint.smAndDown,
              }"
            >
              <div class="text-xs-center">
                <div
                  class="text-color"
                  :class="{
                    'title': $vuetify.breakpoint.xsOnly,
                    'headline': $vuetify.breakpoint.smAndUp,
                  }"
                >
                  募集が見つかりません
                </div>
                <div class="pt-3 light-text-color">
                  絞り込みをしている場合は、条件を変えて検索してください
                </div>
              </div>
            </v-card>
            <infinite-loading
              v-if="showInfiniteLoading && jobs && jobs.length >= 20 && !isLoading"
              :distance="50"
              spinner="waveDots"
              @infinite="infiniteHandler">
              <div slot="no-results"></div>
            </infinite-loading>
          </v-flex>
        </v-layout>
      </v-container>
      <!-- footer -->
      <v-footer
        v-show="footer"
        class="shadow-top"
        id="footer"
        fixed
        color="white"
        height="300"
      >
        <v-layout row wrap>
          <v-flex xs8 offset-xs2 pb-3 pt-5>
            <v-layout row wrap>
              <v-flex xs5>
                <div class="pb-2">
                  <nuxt-link to="/inquiry_for_recruiter" class="font-weight-bold text-color">採用担当者様はこちら</nuxt-link>
                </div>
                <div class="pb-2">
                  <nuxt-link to="/contact" class="font-weight-bold text-color">お問い合わせ</nuxt-link>
                </div>
                <div class="pb-2">
                  <nuxt-link to="/feedback" class="font-weight-bold text-color">フィードバックを送る</nuxt-link>
                </div>
              </v-flex>
              <v-flex xs5>
                <div class="pb-2">
                  <nuxt-link to="/terms" class="font-weight-bold text-color">利用規約</nuxt-link>
                </div>
                <div class="pb-2">
                  <nuxt-link to="/privacy_policy" class="font-weight-bold text-color">プライバシー</nuxt-link>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs8 offset-xs2 py-2>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs8 offset-xs2>
            <span>&copy; 2019 Liplo Inc. All rights reserved.</span>
          </v-flex>
          <v-flex xs10 offset-xs1 text-xs-right>
            <v-btn color="white" small @click="footer = false">
              <v-icon>close</v-icon>
              閉じる
            </v-btn>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-flex>
  </v-layout>
</template>


<script>
import { mapActions, mapState } from 'vuex'

export default {
  head () {
    return {
      titleTemplate: null,
      title: 'Liplo',
    }
  },
  data() {
    return {
      footer: false,
      count: 0,
      showInfiniteLoading: false,
      windowHeight: 0,
      footerButtonTop: 0,
      tempOrder: 'recent'
    }
  },
  computed: {
    imageRatio() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '2'
        case 'sm': return '2.5'
        case 'md': return '2.5'
        case 'lg': return '2.5'
        case 'xl': return '2.5'
      }
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
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
    workweekDaysText: function() {
      return function(days) {
        if (days) {
          if (days.one) {
            return 1
          } else if (days.two) {
            return 2
          } else if (days.three) {
            return 3
          } else if (days.four) {
            return 4
          } else if (days.five) {
            return 5
          }
        }
      }
    },
    workdayText: function() {
      return function(workday) {
        if (workday == 0) {
          return '平日のみ'
        } else if (workday == 1) {
          return '土曜可'
        } else if (workday == 2) {
          return '日曜可'
        } else if (workday == 3) {
          return '土日可'
        }
      }
    },
    ...mapState({
      isRefreshed: state => state.isRefreshed,
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      type: state => state.profile.type,
      completionPercentage: state => state.profile.completionPercentage,
      jobs: state => state.jobs.jobs,
      order: state => state.jobs.order,
      isInitialLoading: state => state.jobs.isInitialLoading,
      isLoading: state => state.jobs.isLoading,
      allJobsQueried: state => state.jobs.allJobsQueried,
    })
  },
  mounted() {
    this.showInfiniteLoading = true

    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 48 - 30
    this.footerButtonTop = window.innerHeight - toolbarHeight - 20
  },
  watchQuery: ['occupation', 'features', 'workweek', 'order'],
  async fetch(context) {
    const store = context.store
    const jobs = store.state.jobs.jobs

    if ((context.from && context.from.path == '/') || jobs == null || (jobs && jobs.length == 0)) {
      await store.dispatch('jobs/resetState')
      await store.dispatch('jobs/updateIsInitialLoading', true)
      await store.dispatch('jobs/updateIsLoading', true)
      // filter set
      await store.dispatch('jobs/setFilter', context.query)
      // order set
      await store.dispatch('jobs/setOrder', context.query)
      // query jobs
      await store.dispatch('jobs/queryJobs', context.query)
    }
  },
  watch: {
    isRefreshed(isRefreshed) {
      if (isRefreshed == true) {
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        // filter set
        this.setFilter(this.$route.query)
        // order set
        this.setOrder(this.$route.query)
        // query jobs
        this.queryJobs(this.$route.query)
      }
    },
  },
  methods: {
    sortButtonClicked(order) {
      if (order) {
        var queryParams
        if (order == 'recent') {
          queryParams = {
            occupation: this.$route.query.occupation,
            features: this.$route.query.features,
            workweek: this.$route.query.workweek,
          }
        } else if (order == 'rating') {
          queryParams = {
            occupation: this.$route.query.occupation,
            features: this.$route.query.features,
            workweek: this.$route.query.workweek,
            order: 'rating'
          }
        }
        this.$router.replace({
          path: '/',
          query: queryParams
        })
      }
    },
    infiniteHandler($state) {
      if (!this.allJobsQueried) {
        if (!this.isLoading) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryJobs(this.$route.query)
          if (this.count > 100) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      queryJobs: 'jobs/queryJobs',
      updateIsInitialLoading: 'jobs/updateIsInitialLoading',
      updateIsLoading: 'jobs/updateIsLoading',
      setFilter: 'jobs/setFilter',
      setOrder: 'jobs/setOrder',
      resetState: 'jobs/resetState',
      updateSignUpDialog: 'updateSignUpDialog',
    }),
  }
}
</script>
<style>
#sort .v-btn {
  min-width: 0;
}
#sort .v-btn:hover:before {
  background-color: transparent;
}
#footer-button {
  position: -webkit-sticky;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10
}
.top-bg{
  background-color:rgba(255, 90, 95, 0.95);
}
.img-shadow{
  filter: drop-shadow(10px 10px 10px rgba(0,0,0,0.6));
}
.main-padding-sm{
  padding:90px 0;
}
.main-padding-md{
  padding:100px 0;
}
.main-padding-lg{
  padding:180px 0;
}
.title-font-size-md {
  font-size: 30px;
}
.padding-left-lg {
  padding-left: 120px;
}
.padding-left-md {
  padding-left: 100px;
}
.padding-left-sm {
  padding-left: 80px;
}
.heading-font-size-sm {
  font-size: 40px;
}
.heading-font-size-xs {
  font-size: 30px;
}
</style>
