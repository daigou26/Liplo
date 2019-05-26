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
    <v-flex v-else-if="isInitialLoading || isUnwrittenFeedbacksLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid"
      xs12
      md10
      offset-md1
      class="break"
      :class="{
        'px-4': $vuetify.breakpoint.smAndDown,
      }"
    >
      <!-- 記入可能なフィードバック -->
      <div class="my-3">
        <div class="font-weight-bold textColor subheading">
          記入可能なフィードバック
          <div class="pt-2 body-2 textColor">
            フィードバック記入率は、募集ページで表示されます
          </div>
        </div>
        <v-list v-if="unwrittenFeedbacks && unwrittenFeedbacks.length > 0" two-line>
          <template v-for="(feedback, index) in unwrittenFeedbacks">
            <v-list-tile :to="'/recruiter/feedbacks/' + feedback.feedbackId + '/new'" >
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  :src="feedback.profileImageUrl"
                ></v-img>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="textColor font-weight-bold">{{ feedback.userName }}</v-list-tile-title>
                <v-list-tile-sub-title class="textColor caption">
                  {{ feedback.occupation }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider
              v-if="unwrittenFeedbacks.length != index + 1"
              :inset="true"
            ></v-divider>
          </template>
        </v-list>
        <div v-else class="mt-2 pa-4 border text-xs-center">
          <div>
            記入可能なフィードバックはありません
          </div>
        </div>
      </div>
      <!-- 過去に書いたフィードバック -->
      <div class="my-4">
        <div class="font-weight-bold textColor subheading">
          過去に書いたフィードバック
        </div>
        <v-list v-if="feedbacks && feedbacks.length > 0" two-line>
          <template v-for="(feedback, index) in feedbacks">
            <v-list-tile :to="'/recruiter/feedbacks/' + feedback.feedbackId" >
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  :src="feedback.profileImageUrl"
                ></v-img>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="textColor font-weight-bold">{{ feedback.userName }}</v-list-tile-title>
                <v-list-tile-sub-title class="textColor caption">
                  {{ feedback.occupation }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ feedback.timestamp }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider
              v-if="feedbacks.length != index + 1"
              :inset="true"
            ></v-divider>
          </template>
        </v-list>
        <div v-else class="pa-4 border">
          まだフィードバックを書いていません。
        </div>
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
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      feedbacks: state => state.feedbacks.feedbacks,
      isInitialLoading: state => state.feedbacks.isInitialLoading,
      isLoading: state => state.feedbacks.isLoading,
      allFeedbacksQueried: state => state.feedbacks.allFeedbacksQueried,
      unwrittenFeedbacks: state => state.feedbacks.unwrittenFeedbacks,
      isUnwrittenFeedbacksLoading: state => state.feedbacks.isUnwrittenFeedbacksLoading,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 30

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryFeedbacks({uid: null, companyId: this.companyId})
      this.updateIsUnwittenFeedbacksLoading(true)
      this.queryUnwrittenFeedbacks(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryFeedbacks({uid: null, companyId: companyId})
        this.updateIsUnwittenFeedbacksLoading(true)
        this.queryUnwrittenFeedbacks(companyId)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allFeedbacksQueried) {
        if (!this.isFeedbacksLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryFeedbacks({uid: null, companyId: this.companyId})
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
      queryFeedbacks: 'feedbacks/queryFeedbacks',
      updateIsInitialLoading: 'feedbacks/updateIsInitialLoading',
      updateIsLoading: 'feedbacks/updateIsLoading',
      queryUnwrittenFeedbacks: 'feedbacks/queryUnwrittenFeedbacks',
      updateIsUnwittenFeedbacksLoading: 'feedbacks/updateIsUnwittenFeedbacksLoading',
      resetState: 'feedbacks/resetState',
    }),
  }
}
</script>
