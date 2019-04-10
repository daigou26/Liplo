<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex xs12 pa-3>
      <div class="py-4">
        <p class="title font-weight-bold textColor">
          コメント
        </p>
        <div class="py-3">
          {{ content }}
        </div>
      </div>
      <div class="py-4">
        <p class="title font-weight-bold textColor">
          レビュー
        </p>
        <div class="py-3">
          <!-- chart -->
          <v-flex lg4 md5 sm8 xs10>
            <radar-chart v-if="showChart && chartData" :data="chartData" :options="chartOptions" />
          </v-flex>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    isQueried: false,
    reviewsDialog: false,
    chartOptions: {
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
    ...mapState({
      companyId: state => state.profile.companyId,
      content: state => state.review.content,
      all: state => state.review.all,
      atmosphere: state => state.review.atmosphere,
      job: state => state.review.job,
      discretion: state => state.review.discretion,
      flexibleSchedule: state => state.review.flexibleSchedule,
      flexibility: state => state.review.flexibility,
      mentor: state => state.review.mentor,
      growth: state => state.review.growth,
      chartData: state => state.review.chartData,
    }),
  },
  mounted() {
    this.showChart = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.queryReview({nuxt: this.$nuxt, params: this.$route.params, companyId: this.companyId})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
        this.queryReview({nuxt: this.$nuxt, params: this.$route.params, companyId: companyId})
      }
    }
  },
  methods: {
    ...mapActions({
      queryReview: 'review/queryReview',
      resetState: 'review/resetState',
    }),
  }
}
</script>
