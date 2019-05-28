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
    <v-flex v-else-if="uid" xs12>
      <v-layout
        row
        white
        wrap
      >
        <v-flex
          xs12
          :class="{
            'pa-4': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <v-alert
            v-if="plan == null"
            class="mb-3"
            :value="true"
            type="error"
            outline
          >
            現在、解約されているため、操作が制限されます
          </v-alert>
          <v-card :flat="flat">
            <div class="title textColor font-weight-bold pa-4">
              候補者
            </div>
            <div v-if="!isCurrentCandidatesExist" class="textColor text-xs-center pb-4">
              現在、候補者がいません
            </div>
            <bar-chart
              v-else-if="showChart && candidatesChartData && !(breakpoint == 'xs' || breakpoint == 'sm')"
              :class="{
                'pa-4': $vuetify.breakpoint.smAndUp,
                'pa-3': $vuetify.breakpoint.xsOnly,
              }"
              :data="candidatesChartData"
              :options="candidatesBarChartOptions"
            />
            <horizontal-bar-chart
              v-else-if="showChart && candidatesChartData && (breakpoint == 'xs' || breakpoint == 'sm')"
              :class="{
                'pa-4': $vuetify.breakpoint.smAndUp,
                'pa-3': $vuetify.breakpoint.xsOnly,
              }"
              :data="candidatesChartData"
              :options="candidatesHorizontalBarChartOptions"
            />
          </v-card>
        </v-flex>
        <v-flex xs12 hidden-md-and-up>
          <v-divider></v-divider>
        </v-flex>
        <v-flex
          sm6
          xs12
          :class="{
            'pa-4': $vuetify.breakpoint.mdAndUp,
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
                <radar-chart
                  v-if="showChart && reviewsChartData"
                  :data="reviewsChartData"
                  :options="reviewsChartOptions"
                />
                <div v-else class="textColor">
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
            'pa-4': $vuetify.breakpoint.mdAndUp,
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
                <doughnut-chart
                  v-if="showChart && feedbacksChartData && feedbacksChartOptions"
                  :data="feedbacksChartData"
                  :options="feedbacksChartOptions"
                />
                <div v-else class="textColor">
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
  middleware: 'auth',
  data() {
    return {
      isQueried: false,
      windowHeight: 0,
      showChart: false,
      candidatesBarChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            barPercentage: 0.5,
          }],
          yAxes: [{
            ticks: {
              min: 0,
              precision: 0
            }
          }]
        }
      },
      candidatesHorizontalBarChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              min: 0,
              precision: 0
            }
          }]
        }
      },
      reviewsChartOptions: {
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
    isCurrentCandidatesExist() {
      if (this.currentCandidates) {
        return !(
          this.currentCandidates.inbox == 0 &&
          this.currentCandidates.inProcess == 0 &&
          this.currentCandidates.intern == 0 &&
          this.currentCandidates.extendedIntern == 0 &&
          this.currentCandidates.pass == 0 &&
          this.currentCandidates.contracted == 0 &&
          this.currentCandidates.hired == 0
        )
      } else {
        return false
      }
    },
    flat() {
      return (this.breakpoint == 'sm' || this.breakpoint == 'xs') ? true : false
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      plan: state => state.profile.plan,
      type: state => state.profile.type,
      companyId: state => state.profile.companyId,
      rating: state => state.company.rating,
      currentCandidates: state => state.company.currentCandidates,
      candidatesChartData: state => state.company.candidatesChartData,
      allCandidates: state => state.company.allCandidates,
      feedback: state => state.company.feedback,
      reviewsChartData: state => state.company.reviewsChartData,
      feedbacksChartData: state => state.company.feedbacksChartData,
      feedbacksChartOptions: state => state.company.feedbacksChartOptions,
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
