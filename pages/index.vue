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
          <v-list class="pt-0" v-if="jobs">
            <template v-for="(job, index) in jobs">
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
                <v-layout
                  align-center
                  class="pt-3 pb-5"
                >
                  <!-- Company Image -->
                  <v-flex xs2 text-xs-center>
                    <v-avatar
                      class="grey lighten-3"
                    >
                      <v-img :src="job.companyImageUrl" :size="30"></v-img>
                    </v-avatar>
                  </v-flex>
                  <!-- Company Name && Rating -->
                  <v-flex xs10 text-xs-left class="break">
                    <div class="textColor font-weight-bold align-center">
                      {{ job.companyName }}
                    </div>
                    <v-rating small readonly v-model="job.rating"></v-rating>
                  </v-flex>
                </v-layout>
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
      jobs: state => state.main.jobs,
      loading: state => state.main.loading,
    })
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.isBottomVisible()
    })
    if (this.jobs == null) {
      // filter set
      this.$store.dispatch('main/setFilter', this.$route.query)
      // query jobs
      this.$store.dispatch('main/queryJobs', this.$route.query)
    }
  },
  watchQuery: ['occupation', 'features'],
  fetch(context) {
    const store = context.store
    // filter set
    store.dispatch('main/setFilter', context.query)
    // query jobs
    store.dispatch('main/queryJobs', context.query)
  },
  watch: {
    bottom(bottom) {
      if (bottom　&& this.jobs != null) {
        this.$store.dispatch('main/addJobs', { queryParams: this.$route.query, jobs: this.$store.state.main.jobs})
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
