<template>
  <v-layout
    white
    column
    justify-center
  >
    <v-container class="pt-0 mt-5">
      <v-layout column justify-center>
        <v-flex
          xs12
          sm10
          lg8
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
                        <v-list-tile-sub-title>
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
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      count: 0,
      showInfiniteLoading: false,
    }
  },
  computed: {
    ...mapState({
      uid: state => state.uid,
      jobs: state => state.jobs.jobs,
      isLoading: state => state.jobs.isLoading,
      allJobsQueried: state => state.jobs.allJobsQueried,
    })
  },
  mounted() {
    this.showInfiniteLoading = true
  },
  watchQuery: ['occupation', 'features'],
  fetch(context) {
    const store = context.store
    store.dispatch('jobs/resetState')
    // filter set
    store.dispatch('jobs/setFilter', context.query)
    // query jobs
    store.dispatch('jobs/queryJobs', context.query)
  },
  watch: {
    uid(uid) {
      if (uid != null) {
        this.resetState()
        // filter set
        this.setFilter(this.$route.query)
        // query jobs
        this.queryJobs(this.$route.query)
      }
    }
  },
  methods: {
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
      resetState: 'jobs/resetState',
    }),
  }
}
</script>
