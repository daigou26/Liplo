<template>
  <v-layout
    white
    column
  >
    <!-- loading -->
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="isInitialLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="uid && uid != ''" xs12>
      <div class="text-xs-right">
        <v-btn :disabled="plan == null" to="/recruiter/jobs/new">新規作成</v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="jobs"
        :pagination.sync="pagination"
        class="elevation-1"
        hide-actions
        no-data-text="まだ募集を作成していません。"
      >
        <template v-slot:items="props">
          <td class="py-1">
            <v-img
              :src="props.item.imageUrl"
              class="grey lighten-2"
              height="60"
              width="100"
            />
          </td>
          <td class="break" style="min-width: 250px">{{ props.item.title }}</td>
          <td class="text-xs-left">
            <span v-if="props.item.status == 'published'" class="font-weight-bold teal--text text--lighten-2">公開中</span>
            <span v-else-if="props.item.status == 'draft'" class="font-weight-bold grey--text">下書き</span>
            <span v-else-if="props.item.status == 'creating'" class="font-weight-bold grey--text">作成中</span>
            <span v-else-if="props.item.status == 'private'" class="font-weight-bold red--text text--darken-1">公開停止</span>
          </td>
          <td class="text-xs-left">{{ props.item.timestamp }}</td>
          <td class="text-xs-center px-0">
            <v-btn
              small
              flat
              fab
              :disabled="plan == null"
              :to="'/recruiter/jobs/' + props.item.jobId + '/edit'"
            >
              <v-icon
                small
              >
                edit
              </v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
      <infinite-loading
        v-if="showInfiniteLoading && jobs && jobs.length >= 10 && !isLoading"
        :distance="50"
        spinner="waveDots"
        @infinite="infiniteHandler">
        <div slot="no-results"></div>
      </infinite-loading>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  data() {
    return {
      count: 0,
      windowHeight: 0,
      showInfiniteLoading: false,
      isQueried: false,
      statusItems: [
        '公開中',
        '公開停止',
      ],
      headers: [
        {
          text: '画像',
          sortable: false,
          value: 'imageUrl'
        },
        {
          text: 'タイトル',
          align: 'left',
          sortable: false,
          value: 'title',
          width: '40%'
        },
        { text: 'ステータス', value: 'status' },
        { text: '投稿日', value: 'timestamp' },
        { text: '編集', value: 'edit', sortable: false },
      ],
      pagination: {
        sortBy: 'timestamp',
        descending: true,
      },
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      plan: state => state.profile.plan,
      companyId: state => state.profile.companyId,
      jobs: state => state.companyJobs.jobs,
      isInitialLoading: state => state.companyJobs.isInitialLoading,
      isLoading: state => state.companyJobs.isLoading,
      allJobsQueried: state => state.companyJobs.allJobsQueried,
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
    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryJobs(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.resetState()
        this.isQueried = true
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryJobs(companyId)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allJobsQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryJobs(this.companyId)
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
      queryJobs: 'companyJobs/queryJobs',
      updateIsInitialLoading: 'companyJobs/updateIsInitialLoading',
      updateIsLoading: 'companyJobs/updateIsLoading',
      resetState: 'companyJobs/resetState',
    }),
  }
}
</script>
