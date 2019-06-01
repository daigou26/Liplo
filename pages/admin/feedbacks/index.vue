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
    <v-flex v-else-if="isInitialLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid && uid != ''"
      xs12
      class="break"
    >
      <!-- フィードバック -->
      <div>
        <v-data-table
          :headers="headers"
          :items="feedbacks"
          class="elevation-1"
          hide-actions
          no-data-text="フィードバックがありません。"
        >
          <template v-slot:items="props">
            <n-link class="clickable" tag="tr" :to="'/admin/feedbacks/' + props.item.feedbackId">
              <td class="text-xs-left" style="min-width: 150px">
                <span
                  v-if="props.item.type == 'バグ'"
                  class="font-weight-bold orange--text"
                >{{ props.item.type }}</span>
                <span
                  v-else-if="props.item.type == '要望'"
                  class="font-weight-bold teal--text"
                >{{ props.item.type }}</span>
                <span
                  v-else-if="props.item.type == '感想'"
                  class="font-weight-bold green--text"
                >{{ props.item.type }}</span>
                <span
                  v-else
                  class="font-weight-bold grey--text"
                >{{ props.item.type }}</span>
              </td>
              <td class="text-xs-left text-color break" style="min-width: 250px">{{ props.item.content }}</td>
              <td class="text-xs-left" style="min-width: 150px">{{ props.item.timestamp }}</td>
            </n-link>
          </template>
        </v-data-table>
        <infinite-loading
          v-if="showInfiniteLoading && feedbacks && feedbacks.length >= 20 && !isLoading"
          :distance="50"
          spinner="waveDots"
          @infinite="infiniteHandler">
          <div slot="no-results"></div>
        </infinite-loading>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  middleware: 'auth',
  data() {
    return {
      isQueried: false,
      windowHeight: 0,
      showChart: false,
      showInfiniteLoading: false,
      headers: [
        {
          sortable: false,
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Content',
          align: 'left',
          sortable: false,
          value: 'content'
        },
        {
          text: 'Date',
          align: 'left',
          value: 'timestamp'
        },
      ],
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      isAdmin: state => state.profile.isAdmin,
      feedbacks: state => state.appFeedbacks.feedbacks,
      isInitialLoading: state => state.appFeedbacks.isInitialLoading,
      isLoading: state => state.appFeedbacks.isLoading,
      allFeedbacksQueried: state => state.appFeedbacks.allFeedbacksQueried,
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

    if (this.isAdmin) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryFeedbacks()
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allFeedbacksQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryFeedbacks()
        }
        if (this.count > 50) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      queryFeedbacks: 'appFeedbacks/queryFeedbacks',
      updateIsInitialLoading: 'appFeedbacks/updateIsInitialLoading',
      updateIsLoading: 'appFeedbacks/updateIsLoading',
      resetState: 'appFeedbacks/resetState',
    }),
  }
}
</script>
