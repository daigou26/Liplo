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
    <v-flex v-else xs12>
      <v-data-table
        :headers="headers"
        :items="candidates"
        class="elevation-1"
        hide-actions
        no-data-text="候補者がいません。"
      >
        <template v-slot:items="props">
          <n-link class="clickable" tag="tr" :to="'/recruiter/candidates/' + props.item.candidateId">
            <td class="py-1">
              <v-avatar
                size="50"
                class="grey lighten-3"
              >
                <v-img
                  v-if="props.item.user.imageUrl"
                  :src="props.item.user.imageUrl"
                />
                <v-icon v-else :size="50">person</v-icon>
              </v-avatar>
            </td>
            <td style="min-width: 150px">{{ props.item.user.name }}</td>
            <td style="min-width: 150px" class="text-xs-left">
              <span v-if="props.item.status.scouted == true" class="font-weight-bold blue--text text--darken-2">スカウト</span>
              <span v-else-if="props.item.status.inbox == true" class="font-weight-bold blue--text text--darken-2">応募</span>
              <span v-else-if="props.item.status.inProcess == true" class="font-weight-bold cyan--text text--lighten-1">選考中</span>
              <span v-else-if="props.item.status.intern == true" class="font-weight-bold orange--text text--darken-1">インターン</span>
              <span v-else-if="props.item.status.pass == true" class="font-weight-bold teal--text text--lighten-1">パス</span>
              <span v-else-if="props.item.status.contracted == true" class="font-weight-bold green--text text--lighten-1">入社予定(契約完了)</span>
            </td>
            <td style="min-width: 150px" class="text-xs-left">
              <v-rating
                v-if="props.item.reviews"
                :value="props.item.reviews == null ? 0 : props.item.reviews.rating"
                background-color="teal"
                color="teal darken-1"
                small
                half-increments
                readonly
              />
              <div v-else>
                なし
              </div>
            </td>
            <td style="min-width: 150px" class="text-xs-left">
              <div v-if="props.item.tags">
                <v-chip v-for="tag in props.item.tags" :key="tag">{{ tag }}</v-chip>
              </div>
              <div v-else>
                未設定
              </div>
            </td>
            <td class="text-xs-left">{{ props.item.timestamp }}</td>
          </n-link>
        </template>
      </v-data-table>
      <infinite-loading
        v-if="showInfiniteLoading && candidates && candidates.length >= 20 && !isLoading"
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
  data() {
    return {
      count: 0,
      windowHeight: 0,
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
        { text: 'ステータス', value: 'status' },
        { text: '評価', value: 'reviews' },
        { text: 'タグ', value: 'tags', sortable: false},
        { text: '更新日', value: 'timestamp' },
      ],
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      candidates: state => state.candidates.candidates,
      isInitialLoading: state => state.candidates.isInitialLoading,
      isLoading: state => state.candidates.isLoading,
      allCandidatesQueried: state => state.candidates.allCandidatesQueried,
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
      this.queryCandidates(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryCandidates(companyId)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allCandidatesQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryCandidates(this.companyId)
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
      queryCandidates: 'candidates/queryCandidates',
      updateIsInitialLoading: 'candidates/updateIsInitialLoading',
      updateIsLoading: 'candidates/updateIsLoading',
      resetState: 'candidates/resetState',
    }),
  }
}
</script>
