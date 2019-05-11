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
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else>
      <!-- footer 表示ボタン -->
      <div class="hidden-xs-only" id="footer-button">
        <v-btn
          color="white"
          @click="footer = true"
        >
          <span class="font-weight-bold textColor">企業情報、プライバシーなど</span>
        </v-btn>
      </div>
      <!-- 並び替え -->
      <v-flex
        xs12
        :class="{
          'pr-5': $vuetify.breakpoint.smAndUp,
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
                'textColor': order != 'recent',
              }"
            >
              新着順
            </span>
          </v-btn>
          <v-btn flat class="ma-0 pa-0" @click="sortButtonClicked('rating')">
            <span
              :class="{
                'teal--text text--darken-1 font-weight-bold': order == 'rating',
                'textColor': order != 'recent',
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
                    class="mb-5"
                    :class="`elevation-${hover ? 12 : 2}`"
                  >
                    <v-card flat :to='"jobs/" + job.jobId' class="clickable">
                      <v-img
                        :src="job.imageUrl"
                        :aspect-ratio="imageRatio"
                      ></v-img>
                      <div
                        class="pt-3 px-4 text-xs-left caption textColor font-weight-bold"
                      >
                        <v-chip outline small color="teal">{{ occupation(job.occupation) }}</v-chip>
                        <v-chip outline small color="blue-grey ">{{ job.period }}ヶ月</v-chip>
                      </div>
                      <v-card-title primary-title class="px-4 pt-3">
                        <div class="text-xs-left">
                          <h3
                            :class="{
                              'headline': $vuetify.breakpoint.smAndUp,
                              'title': $vuetify.breakpoint.xsOnly,
                            }"
                            class="textColor font-weight-bold mb-0"
                          >
                            {{ job.title }}
                          </h3>
                          <div class="textColor pt-3">{{ job.content }}</div>
                        </div>
                      </v-card-title>
                    </v-card>
                    <!-- company info -->
                    <v-hover>
                      <v-card slot-scope="{ hover }" flat class="pb-3" :to="'companies/' + job.companyId">
                        <v-list-tile>
                          <v-list-tile-avatar color="grey darken-3">
                            <v-img
                              :src="job.companyImageUrl"
                            ></v-img>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title
                              :class="{
                                'caption': $vuetify.breakpoint.xsOnly,
                              }"
                              class="textColor font-weight-bold"
                            >
                              {{ job.companyName }}
                              <span v-show="hover" class="pl-2 caption green--text">企業情報を見る</span>
                            </v-list-tile-title>
                            <v-list-tile-sub-title v-if="job.rating">
                              <v-card-actions class="pa-0">
                                <v-rating
                                  v-model="job.rating.all"
                                  background-color="teal"
                                  color="teal darken-1"
                                  small
                                  half-increments
                                  readonly
                                />
                                <span class="pl-1 textColor">{{ job.rating.count }}</span>
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
                  class="textColor"
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
              v-if="showInfiniteLoading && jobs && jobs.length >= 10 && !isLoading"
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
              <v-flex xs6>
                <div class="pb-2">
                  <nuxt-link to="/company_registration" class="font-weight-bold textColor">採用担当者様はこちら</nuxt-link>
                </div>
                <div class="pb-2">
                  <nuxt-link to="/contact" class="font-weight-bold textColor">お問い合わせ</nuxt-link>
                </div>
                <div class="pb-2">
                  <nuxt-link to="/" class="font-weight-bold textColor">運営会社</nuxt-link>
                </div>
              </v-flex>
              <v-flex xs6>
                <div class="pb-3 textColor">
                  <v-btn flat small icon color="grey" class="ma-0 mr-3">
                    <v-icon>fab fa-facebook</v-icon>
                  </v-btn>
                  <v-btn flat small icon color="grey" class="ma-0">
                    <v-icon>fab fa-twitter</v-icon>
                  </v-btn>
                </div>
                <div class="pb-2">
                  <nuxt-link to="/" class="font-weight-bold textColor">利用規約</nuxt-link>
                </div>
                <div class="pb-2">
                  <nuxt-link to="/" class="font-weight-bold textColor">プライバシ</nuxt-link>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs8 offset-xs2 py-2>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs8 offset-xs2>
            <span>&copy; 2019 All rights reserved.</span>
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
        case 'md': return '3'
        case 'lg': return '3'
        case 'xl': return '3'
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
        } else if (occupation.others == true) {
          return 'その他'
        }
      }
    },
    ...mapState({
      isRefreshed: state => state.isRefreshed,
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
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
  fetch(context) {
    const store = context.store
    store.dispatch('jobs/resetState')
    store.dispatch('jobs/updateIsInitialLoading', true)
    store.dispatch('jobs/updateIsLoading', true)
    // filter set
    store.dispatch('jobs/setFilter', context.query)
    // order set
    store.dispatch('jobs/setOrder', context.query)
    // query jobs
    store.dispatch('jobs/queryJobs', context.query)
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
  z-index: 1
}
</style>
