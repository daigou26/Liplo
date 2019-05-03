<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex
      xs12
      md10
      offset-md1
      class="break"
      :class="{
        'px-4': $vuetify.breakpoint.smAndDown,
      }"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md, sm)-->
        <v-flex
          md4
          sm3
          hidden-xsOnly
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <my-page-menu/>
        </v-flex>
        <!-- feedbacks -->
        <v-flex
          md8
          sm9
          xs12
          class="py-3"
          :class="{
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex sm10 xs12 offset-sm1>
            <!-- feedbacks -->
            <div v-if="params.id == null">
              <v-list v-if="feedbacks" two-line class="border">
                <template v-for="(feedback, index) in feedbacks">
                  <v-list-tile :to="'/user/feedbacks/' + feedback.feedbackId" >
                    <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                      <v-img
                        :src="feedback.companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="textColor font-weight-bold return">{{ feedback.companyName }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="feedbacks.length != index + 1"
                    :inset="true"
                  ></v-divider>
                </template>
              </v-list>
              <infinite-loading
                v-if="showInfiniteLoading && feedbacks && feedbacks.length >= 10 && !isFeedbacksLoading"
                :distance="50"
                spinner="waveDots"
                @infinite="infiniteHandler">
                <div slot="no-results"></div>
              </infinite-loading>
            </div>
            <!-- feedback detail -->
            <div
              v-else
              :class="{
                'px-5 py-2 border': $vuetify.breakpoint.mdAndUp,
              }"
              id="feedback-detail"
            >
              <v-card v-if="companyId" flat :to="'/companies/' + companyId">
                <v-card-actions class="px-0 pb-4">
                  <v-list-tile>
                    <v-list-tile-avatar color="grey darken-3">
                      <v-img
                        :src="companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="textColor font-weight-bold return">{{ companyName }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-card-actions>
              </v-card>
              <div class="pt-5">
                <span class="font-weight-bold">良かった点</span>
                <p v-if="goodPoint" class="font-weight-medium body-text return">{{ goodPoint }}</p>
              </div>
              <div class="py-5">
                <span class="font-weight-bold">アドバイス</span>
                <p v-if="advice" class="font-weight-medium body-text return">{{ advice }}</p>
              </div>
            </div>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MyPageMenu from '~/components/MyPageMenu'

export default {
  components: {
    MyPageMenu
  },
  data: () => ({
    isQueried: false,
    count: 0,
    showInfiniteLoading: false,
  }),
  computed: {
    params() {
      return this.$route.params
    },
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      feedbacks: state => state.feedbacks.feedbacks,
      isFeedbacksLoading: state => state.feedbacks.isFeedbacksLoading,
      allFeedbacksQueried: state => state.feedbacks.allFeedbacksQueried,
      companyId: state => state.feedback.companyId,
      companyName: state => state.feedback.companyName,
      companyImageUrl: state => state.feedback.companyImageUrl,
      goodPoint: state => state.feedback.goodPoint,
      advice: state => state.feedback.advice,
      createdAt: state => state.feedback.createdAt,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      if (this.params.id == null) {
        this.queryFeedbacks({uid: this.uid, feedbacks: this.feedbacks})
      } else {
        this.queryFeedback({nuxt: this.$nuxt, params: this.$route.params})
      }
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        if (this.params.id == null) {
          this.queryFeedbacks({uid: uid, feedbacks: this.feedbacks})
        } else {
          this.queryFeedback({nuxt: this.$nuxt, params: this.$route.params})
        }
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allFeedbacksQueried) {
        if (!this.isFeedbacksLoading && this.uid != null) {
          this.count += 1
          this.updateFeedbacksLoading(true)
          this.queryFeedbacks({uid: this.uid, feedbacks: this.feedbacks})
        }
        if (this.count > 20) {
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
      updateFeedbacksLoading: 'feedbacks/updateFeedbacksLoading',
      queryFeedback: 'feedback/queryFeedback',
    }),
  }
}
</script>
<style>
#feedback-detail div.v-list__tile {
  padding: 0px;
}
</style>
