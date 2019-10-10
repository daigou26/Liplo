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
            <td style="min-width: 150px" class="text-xs-left">
              <v-rating
                :value="props.item.all == null ? 0 : props.item.all"
                background-color="#FF5A5F"
                color="#FF5A5F"
                small
                half-increments
                readonly
              />
            </td>
            <td
              class="break"
              style="min-width: 250px"
            >
              {{ props.item.content.substr(0, 30) }}
              {{ props.item.content.length > 30 ? '...' : '' }}
            </td>
          </n-link>
        </template>
      </v-data-table>
      <infinite-loading
        v-if="showInfiniteLoading && reviews && reviews.length >= 20 && !isLoading"
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
  head () {
    return {
      title: 'レビュー',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data() {
    return {
      count: 0,
      windowHeight: 0,
      showInfiniteLoading: false,
      isQueried: false,
      headers: [
        { text: '記入日', value: 'createdAt', sortable: false },
        { text: '評価', value: 'all', sortable: false },
        { text: 'コメント', value: 'content', sortable: false },
      ]
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      reviews: state => state.reviews.companyReviews,
      isInitialLoading: state => state.reviews.isInitialCompanyReviewsLoading,
      isLoading: state => state.reviews.isCompanyReviewsLoading,
      allCompanyReviewsQueried: state => state.reviews.allCompanyReviewsQueried,
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

    if (
      this.companyId != null &&
      !this.isQueried &&
      (!this.reviews || (this.reviews != null && this.reviews.length == 0))
    ) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryCompanyReviews(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.resetState()
        this.isQueried = true
        this.updateIsInitialLoading(true)
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
          if (this.count > 50) {
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
      updateIsInitialLoading: 'reviews/updateIsInitialCompanyReviewsLoading',
      updateIsLoading: 'reviews/updateIsCompanyReviewsLoading',
      resetState: 'reviews/resetCompanyReviewsState',
    }),
  }
}
</script>
