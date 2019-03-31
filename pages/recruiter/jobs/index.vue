<template>
  <v-layout
    white
    column
  >
    <div class="text-xs-right">
      <v-btn to="/recruiter/jobs/new">新規作成</v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="jobs"
      class="elevation-1"
      hide-actions
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
        <td>{{ props.item.title }}</td>
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
      v-if="showInfiniteLoading && jobs && jobs.length >= 2 && !isLoading"
      :distance="50"
      spinner="waveDots"
      @infinite="infiniteHandler">
      <div slot="no-results"></div>
    </infinite-loading>
  </v-layout>
</template>

<script>
import { auth } from '@/plugins/firebase'
import { mapActions, mapState } from 'vuex'
export default {
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
          value: 'title'
        },
        { text: 'ステータス', value: 'status' },
        { text: '投稿日', value: 'timestamp' },
        { text: '編集', value: 'edit', sortable: false },
      ],
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      companyId: state => state.profile.companyId,
      jobs: state => state.companyJobs.jobs,
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
    this.windowHeight = window.innerHeight - toolbarHeight
    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryJobs(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
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
      updateIsLoading: 'companyJobs/updateIsLoading',
      resetState: 'companyJobs/resetState',
    }),
  }
}
</script>
