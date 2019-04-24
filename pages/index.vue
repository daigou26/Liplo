<template>
  <v-layout
    white
    column
  >
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
      text-xs-right
      class="pr-4"
    >
      <v-btn-toggle :value="order">
        <v-btn flat color="teal darken-1" value="recent" @click="sortButtonClicked('recent')">
          新着順
        </v-btn>
        <v-btn flat color="teal darken-1" value="rating" @click="sortButtonClicked('rating')">
          評価順
        </v-btn>
      </v-btn-toggle>
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
              <v-card class="mb-5">
                <v-card flat :to='"jobs/" + job.jobId' class="clickable">
                  <v-img
                    :src="job.imageUrl"
                    aspect-ratio="2.75"
                  ></v-img>

                  <v-card-title primary-title class="px-4">
                    <div class="text-xs-left">
                      <h3 class="headline mb-0">{{ job.title }}</h3>
                      <div>{{ job.content }}</div>
                    </div>
                  </v-card-title>
                </v-card>
                <!-- company info -->
                <v-card flat class="pb-3" :to="'companies/' + job.companyId">
                  <v-card-actions>
                    <v-list-tile>
                      <v-list-tile-avatar color="grey darken-3">
                        <v-img
                          :src="job.companyImageUrl"
                        ></v-img>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title class="textColor font-weight-bold">
                          {{ job.companyName }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title v-if="job.rating">
                          <v-rating small half-increments readonly v-model="job.rating.all"/>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-card-actions>
                </v-card>
              </v-card>
            </template>
          </v-list>
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
      v-if="footer"
      class="shadow-top"
      id="footer"
      fixed
      app
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
      footerButtonTop: 0,
      tempOrder: 'recent'
    }
  },
  computed: {
    ...mapState({
      isRefreshed: state => state.isRefreshed,
      uid: state => state.uid,
      jobs: state => state.jobs.jobs,
      order: state => state.jobs.order,
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
    const windowHeight = window.innerHeight - toolbarHeight
    this.footerButtonTop = windowHeight - 20
  },
  watchQuery: ['occupation', 'features', 'workweek', 'order'],
  fetch(context) {
    const store = context.store
    store.dispatch('jobs/resetState')
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
      queryJobs: 'jobs/queryJobs',
      updateIsLoading: 'jobs/updateIsLoading',
      setFilter: 'jobs/setFilter',
      setOrder: 'jobs/setOrder',
      resetState: 'jobs/resetState',
    }),
  }
}
</script>
<style>
#footer-button {
  position: -webkit-sticky;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1
}
</style>
