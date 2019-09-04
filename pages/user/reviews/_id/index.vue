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
      v-else-if="uid && uid != ''"
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
        <my-page-menu/>
        <!-- reviews -->
        <v-flex
          xs12
          class="py-3"
          :class="{
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex sm10 xs12 offset-sm1>
            <!-- review detail -->
            <div
              :class="{
                'px-5 py-2': $vuetify.breakpoint.mdAndUp,
              }"
              id="review-detail"
            >
              <v-card v-if="companyId" flat :to="'/companies/' + companyId">
                <v-card-actions class="px-0 pb-4">
                  <v-list-tile>
                    <v-list-tile-avatar>
                      <v-img
                        :src="companyImageUrl"
                        class="avatar-border"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="text-color font-weight-bold return">{{ companyName }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-card-actions>
              </v-card>
              <div class="d-flex pt-2">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold light-text-color pr-2">仕事内容</span>
                </v-flex>
                <v-flex v-if="job" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating
                    v-model="job"
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                    small
                    half-increments
                    readonly
                  />
                </v-flex>
              </div>
              <div class="d-flex pt-2">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold light-text-color pr-2">裁量度</span>
                </v-flex>
                <v-flex v-if="discretion" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating
                    v-model="discretion"
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                    small
                    half-increments
                    readonly
                  />
                </v-flex>
              </div>
              <div class="d-flex pt-2">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold light-text-color pr-2">労働時間</span>
                </v-flex>
                <v-flex v-if="workingHours" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating
                    v-model="workingHours"
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                    small
                    half-increments
                    readonly
                  />
                </v-flex>
              </div>
              <div class="d-flex pt-2">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold light-text-color pr-2">労働環境</span>
                </v-flex>
                <v-flex v-if="environment" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating
                    v-model="environment"
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                    small
                    half-increments
                    readonly
                  />
                </v-flex>
              </div>
              <div class="d-flex pt-2">
                <v-flex xs7 sm6>
                  <span class="font-weight-bold light-text-color pr-2">雰囲気</span>
                </v-flex>
                <v-flex v-if="atmosphere" xs5 sm6 text-sm-left text-xs-right>
                  <v-rating
                    v-model="atmosphere"
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                    small
                    half-increments
                    readonly
                  />
                </v-flex>
              </div>
              <div class="py-5">
                <span class="font-weight-bold text-color">コメント</span>
                <p class="font-weight-medium body-text light-text-color return">{{ content }}</p>
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
  middleware: 'auth',
  components: {
    MyPageMenu
  },
  head () {
    return {
      title: 'レビュー',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
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
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.review.companyId,
      companyName: state => state.review.companyName,
      companyImageUrl: state => state.review.companyImageUrl,
      content: state => state.review.content,
      all: state => state.review.all,
      atmosphere: state => state.review.atmosphere,
      job: state => state.review.job,
      discretion: state => state.review.discretion,
      workingHours: state => state.review.workingHours,
      environment: state => state.review.environment,
      isLoading: state => state.review.isLoading,
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

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryReview({nuxt: this.$nuxt, params: this.$route.params, uid: this.uid})
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryReview({nuxt: this.$nuxt, params: this.$route.params, uid: uid})
      }
    }
  },
  methods: {
    ...mapActions({
      queryReview: 'review/queryReview',
      updateIsLoading: 'review/updateIsLoading',
      resetState: 'review/resetState',
    }),
  }
}
</script>
<style>
#review-detail div.v-list__tile {
  padding: 0px;
}
</style>
