<template>
  <v-layout
    white
    row
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
    <v-flex
      v-else-if="uid && uid != ''"
      xs12
      py-3
      :class="{
        'px-5': $vuetify.breakpoint.smAndUp,
        'px-4': $vuetify.breakpoint.xsOnly
      }"
    >
      <div class="py-4">
        <p class="title font-weight-bold text-color">
          コメント
        </p>
        <div class="py-3 text-color return break">{{ content }}</div>
      </div>
      <div class="pt-4">
        <p class="title font-weight-bold text-color">
          レビュー
        </p>
        <div>
          <!-- chart -->
          <v-flex md5 sm8 xs12 hidden-xs-only>
            <radar-chart v-if="showChart && chartData" :data="chartData" :options="chartOptions" />
          </v-flex>
          <div class="hidden-sm-and-up pt-3 pb-5">
            <div class="d-flex">
              <v-flex xs7 sm6>
                <span class="font-weight-bold light-text-color pr-2">仕事内容</span>
              </v-flex>
              <v-flex xs5 sm6 text-sm-left text-xs-right>
                <v-rating
                  v-model="job"
                  background-color="#FF5A5F"
                  color="#FF5A5F"
                  small
                  half-increments
                  readonly
                />
              </v-flex>
            </div>
            <div class="d-flex">
              <v-flex xs7 sm6>
                <span class="font-weight-bold light-text-color pr-2">裁量度</span>
              </v-flex>
              <v-flex xs5 sm6 text-sm-left text-xs-right>
                <v-rating
                  v-model="discretion"
                  background-color="#FF5A5F"
                  color="#FF5A5F"
                  small
                  half-increments
                  readonly
                />
              </v-flex>
            </div>
            <div class="d-flex">
              <v-flex xs7 sm6>
                <span class="font-weight-bold light-text-color pr-2">労働時間</span>
              </v-flex>
              <v-flex xs5 sm6 text-sm-left text-xs-right>
                <v-rating
                  v-model="workingHours"
                  background-color="#FF5A5F"
                  color="#FF5A5F"
                  small
                  half-increments
                  readonly
                />
              </v-flex>
            </div>
            <div class="d-flex">
              <v-flex xs7 sm6>
                <span class="font-weight-bold light-text-color pr-2">労働環境</span>
              </v-flex>
              <v-flex xs5 sm6 text-sm-left text-xs-right>
                <v-rating
                  v-model="environment"
                  background-color="#FF5A5F"
                  color="#FF5A5F"
                  small
                  half-increments
                  readonly
                />
              </v-flex>
            </div>
            <div class="d-flex">
              <v-flex xs7 sm6>
                <span class="font-weight-bold light-text-color pr-2">雰囲気</span>
              </v-flex>
              <v-flex xs5 sm6 text-sm-left text-xs-right>
                <v-rating
                  v-model="atmosphere"
                  background-color="#FF5A5F"
                  color="#FF5A5F"
                  small
                  half-increments
                  readonly
                />
              </v-flex>
            </div>
          </div>
        </div>
        <v-hover>
          <v-card slot-scope="{ hover }" flat class="pt-3 pb-4">
            <v-card-actions>
              <v-icon style="font-size: 18px">info</v-icon>
              <span class="light-text-color caption">ヒント（レビューの項目について）</span>
            </v-card-actions>
            <v-card v-show="hover" flat class="caption pa-2">
              <div class="pt-3">
                <div class="text-color">
                  仕事内容：
                </div>
                <div class="text-color">
                  募集に書かれていた内容と合っていたかどうか
                </div>
              </div>
              <div class="pt-3">
                <div class="text-color">
                  裁量度：
                </div>
                <div class="text-color">
                  インターン生にも裁量が与えられていたかどうか
                </div>
              </div>
              <div class="pt-3">
                <div class="text-color">
                  労働環境：
                </div>
                <div class="text-color">
                  働きやすい環境かどうか（休憩などが自由にできるか、質問がしやすい環境かなど）
                </div>
              </div>
              <div class="pt-3">
                <div class="text-color">
                  労働時間：
                </div>
                <div class="text-color">
                  勤務時間帯を柔軟に決められるか、休暇を取りやすい環境か
                </div>
              </div>
              <div class="pt-3">
                <div class="text-color">
                  雰囲気：
                </div>
                <div class="text-color">
                  社内の雰囲気、人間関係などが良好かどうか
                </div>
              </div>
            </v-card>
          </v-card>
        </v-hover>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: 'レビュー',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
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
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      content: state => state.review.content,
      all: state => state.review.all,
      atmosphere: state => state.review.atmosphere,
      job: state => state.review.job,
      discretion: state => state.review.discretion,
      workingHours: state => state.review.workingHours,
      environment: state => state.review.environment,
      chartData: state => state.review.chartData,
      isLoading: state => state.review.isLoading,
    }),
  },
  mounted() {
    this.showChart = true

    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 30

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryReview({nuxt: this.$nuxt, params: this.$route.params, companyId: this.companyId})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryReview({nuxt: this.$nuxt, params: this.$route.params, companyId: companyId})
      }
    }
  },
  methods: {
    ...mapActions({
      queryReview: 'review/queryReview',
      updateIsLoading: 'review/updateIsLoading',
      resetState: 'review/resetState',
    }),
  }
}
</script>
労働時間
