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
    <v-flex v-else-if="isLoading" xs12 :style="{ height: windowHeight + 'px' }">
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
      <div
        :class="{
          'px-5 py-2': $vuetify.breakpoint.mdAndUp,
        }"
        id="feedback-detail"
      >
        <v-card v-if="uid" flat :to="'/users/' + uid">
          <v-card-actions class="px-0 pb-4">
            <v-list-tile>
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  :src="profileImageUrl"
                ></v-img>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="textColor font-weight-bold return">{{ userName }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-card-actions>
        </v-card>
        <div class="textColor pt-3">
          職種：　{{ occupation }}
        </div>
        <div class="pt-2 textColor">
          インターン終了時期：　{{ timestamp }}
        </div>
        <div class="pt-5">
          <span class="font-weight-bold textColor">良かった点</span>
          <p v-if="goodPoint" class="light-text-color body-text return">{{ goodPoint }}</p>
        </div>
        <div class="py-3">
          <span class="font-weight-bold textColor">アドバイス</span>
          <p v-if="advice" class="light-text-color body-text return">{{ advice }}</p>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  data: () => ({
    isQueried: false,
    windowHeight: 0,
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
      companyId: state => state.profile.companyId,
      isRefreshing: state => state.isRefreshing,
      uid: state => state.feedback.uid,
      profileImageUrl: state => state.feedback.profileImageUrl,
      userName: state => state.feedback.userName,
      occupation: state => state.feedback.occupation,
      goodPoint: state => state.feedback.goodPoint,
      advice: state => state.feedback.advice,
      timestamp: state => state.feedback.timestamp,
      isLoading: state => state.feedback.isLoading,
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

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryFeedback({nuxt: this.$nuxt, params: this.params, companyId: this.companyId})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryFeedback({nuxt: this.$nuxt, params: this.params, companyId: companyId})
      }
    }
  },
  methods: {
    ...mapActions({
      queryFeedback: 'feedback/queryFeedback',
      updateIsLoading: 'feedback/updateIsLoading',
      resetState: 'feedback/resetState',
    }),
  }
}
</script>
<style>
#feedback-detail div.v-list__tile {
  padding: 0px;
}
</style>
