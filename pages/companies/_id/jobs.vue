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
      <v-container class="pt-0 mt-3">
        <v-layout row wrap justify-center>
          <v-flex
            xs12
            sm8
            text-xs-center
          >
            <div class="text-xs-left headline textColor font-weight-bold pb-5 hidden-xs-only">
              募集一覧
            </div>
            <!-- job lists -->
            <v-list v-if="jobs && jobs.length > 0" class="pt-0">
              <template v-for="(job, index) in jobs">
                <!-- job image & title -->
                <v-hover>
                  <v-card
                    slot-scope="{ hover }"
                    class="mb-5"
                    :class="`elevation-${hover ? 12 : 2}`"
                  >
                    <v-card flat :to='"/jobs/" + job.jobId' class="clickable">
                      <v-img
                        :src="job.imageUrl"
                        :aspect-ratio="imageRatio"
                      ></v-img>
                      <div
                        class="pt-2 px-3 text-xs-left caption textColor font-weight-bold"
                      >
                        <v-chip outline small color="teal">{{ occupation(job.occupation) }}</v-chip>
                        <v-chip outline small color="grey-blue">{{ job.period }}ヶ月</v-chip>
                      </div>
                      <v-card-title primary-title class="px-4 pt-3 pb-0">
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
                    <!-- 投稿日 -->
                    <v-card flat>
                      <v-list-tile>
                        <v-spacer></v-spacer>
                        <v-list-tile-action class="caption font-weight-bold light-text-color">
                          <v-card-actions class="pa-0">
                            <v-icon class="mr-2 hidden-xs-only">access_alarm</v-icon>
                            {{ job.timestamp }}
                          </v-card-actions>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-card>
                  </v-card>
                </v-hover>
              </template>
            </v-list>
            <v-card
              v-else
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
                  まだ募集がありません
                </div>
                <div class="pt-3 light-text-color">
                  企業が募集を投稿した場合はこちらに表示されます
                </div>
                <v-btn class="mt-3 font-weight-bold" color="warning" to="/">他の企業の募集を探す</v-btn>
              </div>
            </v-card>
            <infinite-loading
              v-if="showInfiniteLoading && jobs && jobs.length >= 1 && !isLoading"
              :distance="50"
              spinner="waveDots"
              @infinite="infiniteHandler">
              <div slot="no-results"></div>
            </infinite-loading>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>


<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      count: 0,
      showInfiniteLoading: false,
      windowHeight: 0,
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
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      jobs: state => state.jobs.jobs,
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

    this.resetState()
    this.updateIsInitialLoading(true)
    this.updateIsLoading(true)
    // query jobs
    this.queryCompanyJobs(this.$route.params.id)
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allJobsQueried) {
        if (!this.isLoading) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryCompanyJobs(this.$route.params.id)
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
    ...mapActions({
      queryCompanyJobs: 'jobs/queryCompanyJobs',
      updateIsInitialLoading: 'jobs/updateIsInitialLoading',
      updateIsLoading: 'jobs/updateIsLoading',
      resetState: 'jobs/resetState',
    }),
  }
}
</script>
