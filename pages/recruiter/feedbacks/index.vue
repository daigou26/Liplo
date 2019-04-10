<template>
  <v-layout
    white
    column
  >
    <div class="title font-weight-bold textColor pa-3">
      記入可能なフィードバック
    </div>
    <v-data-table
      :headers="headers"
      :items="feedbacks"
      class="elevation-1"
      hide-actions
      no-data-text="記入可能なフィードバックはありません。"
    >
      <template v-slot:items="props">
        <n-link class="clickable" tag="tr" :to="'/recruiter/feedbacks/' + props.item.feedbackId">
          <td class="py-1">
            <v-avatar
              size="50"
              class="grey lighten-3"
            >
              <v-img
                v-if="props.item.profileImageUrl"
                :src="props.item.profileImageUrl"
              />
              <v-icon v-else :size="50">person</v-icon>
            </v-avatar>
          </td>
          <td>{{ props.item.userName }}</td>
          <td class="text-xs-left">{{ props.item.timestamp }}</td>
        </n-link>
      </template>
    </v-data-table>
    <infinite-loading
      v-if="showInfiniteLoading && feedbacks && feedbacks.length >= 10 && !isLoading"
      :distance="50"
      spinner="waveDots"
      @infinite="infiniteHandler">
      <div slot="no-results"></div>
    </infinite-loading>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      count: 0,
      showInfiniteLoading: false,
      isQueried: false,
      headers: [
        {
          sortable: false,
          value: 'imageUrl',
          width: '100'
        },
        {
          text: '氏名',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'インターン終了時期',
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
      companyId: state => state.profile.companyId,
      feedbacks: state => state.feedbacks.unwrittenFeedbacks,
      isLoading: state => state.feedbacks.isUnwrittenFeedbacksLoading,
      allUnwrittenFeedbacksQueried: state => state.feedbacks.allUnwrittenFeedbacksQueried,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryUnwrittenFeedbacks(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
        this.updateIsLoading(true)
        this.queryUnwrittenFeedbacks(companyId)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allUnwrittenFeedbacksQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryUnwrittenFeedbacks(this.companyId)
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
      queryUnwrittenFeedbacks: 'feedbacks/queryUnwrittenFeedbacks',
      updateIsLoading: 'feedbacks/updateIsUnwittenFeedbacksLoading',
      resetState: 'feedbacks/resetState',
    }),
  }
}
</script>
