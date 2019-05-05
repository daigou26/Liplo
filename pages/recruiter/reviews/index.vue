<template>
  <v-layout
    white
    column
  >
    <v-data-table
      :headers="headers"
      :items="reviews"
      class="elevation-1"
      hide-actions
      no-data-text="レビューがありません。"
    >
      <template v-slot:items="props">
        <n-link class="clickable" tag="tr" :to="'/recruiter/reviews/' + props.item.reviewId">
          <td class="text-xs-left">{{ props.item.timestamp }}</td>
          <td class="text-xs-left">
            <v-rating
              small
              half-increments
              readonly
              class="hidden-xs-only"
              :value="props.item.all == null ? 0 : props.item.all"
            />
            <div class="hidden-sm-and-up">
              <div v-if="props.item.all">
                {{ props.item.all }}/5
              </div>
              <div v-else>
                なし
              </div>
            </div>
          </td>
          <td>{{ props.item.content.substr(0, 30) }}{{ props.item.content.length > 30 ? '...' : '' }}</td>
        </n-link>
      </template>
    </v-data-table>
    <infinite-loading
      v-if="showInfiniteLoading && reviews && reviews.length >= 10 && !isLoading"
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
        { text: '投稿日', value: 'createdAt', width: '200' },
        { text: '評価', value: 'all', width: '150' },
        { text: 'コメント', value: 'content', sortable: false,},
      ],
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      companyId: state => state.profile.companyId,
      reviews: state => state.reviews.companyReviews,
      isLoading: state => state.reviews.isCompanyReviewsLoading,
      allCompanyReviewsQueried: state => state.reviews.allCompanyReviewsQueried,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryCompanyReviews(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
        this.updateIsLoading(true)
        this.queryCompanyReviews(companyId)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allCompanyReviewsQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryCompanyReviews(this.companyId)
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
      queryCompanyReviews: 'reviews/queryCompanyReviews',
      updateIsLoading: 'reviews/updateIsCompanyReviewsLoading',
      resetState: 'reviews/resetCompanyReviewsState',
    }),
  }
}
</script>
