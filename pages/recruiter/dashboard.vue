<template>
  <v-layout
    row
    white
    align-start
    align-content-start
    wrap
    :style="{ height: windowHeight + 'px' }"
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
                <span v-if="count">{{ count[item.prop] }}</span>
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
    <v-flex
      sm6
      xs12
      :class="{
        'pa-3': $vuetify.breakpoint.mdAndUp,
      }"
    >
      <v-card
        :flat="flat"
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
            <radar-chart v-if="showChart && chartData" :data="chartData" :options="chartOptions" />
            <div v-else>
              まだデータがありません
            </div>
          </div>
          </v-card-text>
        </v-container>
      </v-card>
    </v-flex>
    <v-flex
      sm4
      offset-sm1
      xs12
      :class="{
        'pa-3': $vuetify.breakpoint.mdAndUp,
      }"
    >
      <v-card
        :flat="flat"
        class="py-3"
      >
        <v-container>
          <v-card-text
            :class="{
              'pa-0': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <div v-if="feedback"　class="text-xs-center">
              <div class="headline font-weight-bold">
                {{ (feedback.writtenCount / feedback.all).toFixed(2) * 100 }} %
              </div>
              <div class="pt-2">
                フィードバック記入率
              </div>
            </div>
            <div v-else>
              <div class="subheading font-weight-bold">
                フィードバック
              </div>
              <div class="text-xs-center pt-4">
                データがありません
              </div>
            </div>
          </v-card-text>
        </v-container>
      </v-card>
    </v-flex>

  </v-layout>
</template>

<script>
import { auth } from '@/plugins/firebase'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
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
      chartOptions: {
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
      type: state => state.profile.type,
      companyId: state => state.profile.companyId,
      user: state => state.user,
      rating: state => state.company.rating,
      count: state => state.company.count,
      feedback: state => state.company.feedback,
      chartData: state => state.company.chartData,
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight

    this.showChart = true
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && this.rating == null) {
        this.queryCompany({nuxt: this.$nuxt, companyId: companyId})
      }
    }
  },
  methods: {
    ...mapActions({
      queryCompany: 'company/queryCompany',
    }),
  }
}
</script>
