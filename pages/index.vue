<template>
  <v-layout
    white
    column
    justify-center
  >
    <v-container class="pt-0 mt-5">
      <v-layout row justify-center>
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
                          <v-rating small readonly v-model="job.rating"/>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-card-actions>
                </v-card>
              </v-card>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      bottom: false
    }
  },
  computed: {
    ...mapState({
      jobs: state => state.jobs.jobs,
      loading: state => state.jobs.loading,
    })
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.isBottomVisible()
    })
    if (this.jobs == null) {
      // filter set
      this.$store.dispatch('jobs/setFilter', this.$route.query)
      // query jobs
      this.$store.dispatch('jobs/queryJobs', this.$route.query)
    }
  },
  watchQuery: ['occupation', 'features'],
  fetch(context) {
    const store = context.store
    // filter set
    store.dispatch('jobs/setFilter', context.query)
    // query jobs
    store.dispatch('jobs/queryJobs', context.query)
  },
  watch: {
    bottom(bottom) {
      if (bottom　&& this.jobs != null) {
        this.$store.dispatch('jobs/addJobs', { queryParams: this.$route.query, jobs: this.$store.state.jobs.jobs})
      }
    }
  },
  methods: {
    isBottomVisible() {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    },
  }
}
</script>
