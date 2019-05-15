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
    <v-flex
      v-else
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
        <div class="textColor pt-3">
          Type：　{{ type }}
        </div>
        <div class="pt-2 textColor">
          Date：　{{ timestamp }}
        </div>
        <div class="pt-5">
          <span class="font-weight-bold textColor">内容</span>
          <p v-if="content" class="pt-3 light-text-color body-text return">{{ content }}</p>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
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
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      isAdmin: state => state.profile.isAdmin,
      type: state => state.appFeedback.type,
      content: state => state.appFeedback.content,
      timestamp: state => state.appFeedback.timestamp,
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

    if (this.isAdmin) {
      this.resetState()
      this.queryFeedback(this.$route.params.id)
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions({
      queryFeedback: 'appFeedback/queryFeedback',
      resetState: 'appFeedback/resetState',
    }),
  }
}
</script>
<style>
#feedback-detail div.v-list__tile {
  padding: 0px;
}
</style>
