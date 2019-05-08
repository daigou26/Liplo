<template>
  <v-layout
    row
    white
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
      <v-layout
        row
        white
        wrap
      >
        <template v-for="(item, index) in items">
          <v-flex
            sm3
            xs6
            :class="{
              'pa-3': $vuetify.breakpoint.mdAndUp,
            }"
          >
            <v-card
              :flat="flat"
            >
              <v-container>
                <v-card-text
                  class="text-xs-center break"
                  :class="{
                    'pa-0': $vuetify.breakpoint.mdAndDown,
                  }"
                >
                  <div class="headline font-weight-bold">
                    <span v-if="currentCandidates">{{ currentCandidates[item.prop] }}</span>
                    <span v-else>0</span>
                  </div>
                  <div class="pt-2">
                    {{ item.title }}
                  </div>
                </v-card-text>
              </v-container>
            </v-card>
          </v-flex>
        </template>
        <v-flex xs12 hidden-md-and-up>
          <v-divider></v-divider>
        </v-flex>
        <v-flex
          sm6
          xs12
          :class="{
            'pa-3': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <v-card
            :flat="flat"
            :class="{
              'py-4': $vuetify.breakpoint.smOnly,
            }"
          >
            <v-container>
              <v-card-text
                :class="{
                  'pa-0': $vuetify.breakpoint.mdAndDown,
                }"
              >
              <div class="subheading font-weight-bold pt-3">
                レビュー
                <span v-if="rating">({{ rating.count }})</span>
              </div>
              <div
                class="text-xs-center"
                :class="{
                  'pa-3': $vuetify.breakpoint.mdAndUp,
                  'pa-2': $vuetify.breakpoint.xsOnly,
                }"
              >
                <radar-chart v-if="showChart && reviewChartData" :data="reviewChartData" :options="reviewChartOptions" />
                <div v-else>
                  まだデータがありません
                </div>
              </div>
              </v-card-text>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex xs12 hidden-sm-and-up><v-divider></v-divider></v-flex>
        <v-flex
          sm6
          xs12
          :class="{
            'pa-3': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <v-card
            :flat="flat"
            :class="{
              'py-4': $vuetify.breakpoint.smOnly,
            }"
          >
            <v-container>
              <v-card-text
                :class="{
                  'pa-0': $vuetify.breakpoint.mdAndDown,
                }"
              >
              <div class="subheading font-weight-bold pt-3">
                フィードバック記入率
              </div>
              <div
                class="text-xs-center pa-5"
              >
                <doughnut-chart v-if="showChart && feedbackChartData && feedbackChartOptions" :data="feedbackChartData" :options="feedbackChartOptions" />
                <div v-else>
                  まだデータがありません
                </div>
              </div>
              </v-card-text>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { auth } from '@/plugins/firebase'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      isQueried: false,
      windowHeight: 0,
      items: [
        {
          title: '応募者',
          prop: 'inbox'
        },
        {
          title: '選考中',
          prop: 'inProcess'
        },
        {
          title: 'インターン',
          prop: 'intern'
        },
        {
          title: '採用済み',
          prop: 'hired'
        },
      ],
      showChart: false,
      reviewChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
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
    }
  },
  computed: {
    flat() {
      return (this.breakpoint == 'sm' || this.breakpoint == 'xs') ? true : false
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      type: state => state.profile.type,
      companyId: state => state.profile.companyId,
      rating: state => state.company.rating,
      currentCandidates: state => state.company.currentCandidates,
      allCandidates: state => state.company.allCandidates,
      feedback: state => state.company.feedback,
      reviewChartData: state => state.company.reviewChartData,
      feedbackChartData: state => state.company.feedbackChartData,
      feedbackChartOptions: state => state.company.feedbackChartOptions,
      isLoading: state => state.company.isLoading,
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
    this.showChart = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryCompany({nuxt: this.$nuxt, companyId: this.companyId})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '' && this.rating == null) {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryCompany({nuxt: this.$nuxt, companyId: companyId})
      }
    }
  },
  methods: {
    ...mapActions({
      queryCompany: 'company/queryCompany',
      updateIsLoading: 'company/updateIsLoading',
      resetState: 'company/resetState',
    }),
  }
}
</script>
