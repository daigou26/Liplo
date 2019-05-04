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
    <v-flex v-else-if="isNotReviewedCompanyLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
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
      <v-layout
        row
        wrap
      >
        <!-- snackbar -->
        <v-snackbar
          v-model="snackbar"
          class="px-5"
          color="teal lighten-1"
          :multi-line="true"
          :timeout="6000"
          :left="true"
          :bottom="true"
        >
          {{ snackbarText }}
          <v-btn
            color="white"
            flat
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
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
            'px-3': $vuetify.breakpoint.smAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex sm10 xs12 offset-sm1>
            <!-- review form -->
            <div
              v-if="notReviewedCompany != null"
              :class="{
                'px-5 py-2': $vuetify.breakpoint.mdAndUp,
              }"
              id="review-form"
            >
              <v-card v-if="notReviewedCompany.companyId" flat :to="'/companies/' + notReviewedCompany.companyId">
                <v-card-actions class="px-0 pb-4">
                  <v-list-tile>
                    <v-list-tile-avatar color="grey darken-3">
                      <v-img
                        :src="notReviewedCompany.companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="textColor font-weight-bold return">{{ notReviewedCompany.companyName }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-card-actions>
              </v-card>
              <div v-if="notReviewedCompany.occupation">
                <span class="font-weight-bold textColor">職種:
                  <span class="light-text-color">{{ notReviewedCompany.occupation }}</span>
                </span>
              </div>
              <div class="py-5">
                <p class="pb-3 title font-weight-bold textColor">
                  レビュー
                </p>
                <div class="py-3">
                  <p class="textColor">成長できる環境か</p>
                  <v-rating
                    v-model="growth"
                    hover
                    half-increments
                    background-color="teal"
                    color="teal darken-1"
                  />
                </div>
                <div class="py-3">
                  <p class="textColor">仕事内容が募集に書かれていたこととあっているか</p>
                  <v-rating
                    v-model="job"
                    hover
                    half-increments
                    background-color="teal"
                    color="teal darken-1"
                  />
                </div>
                <div class="py-3">
                  <p class="textColor">インターン生に対して裁量が与えられているか</p>
                  <v-rating
                    v-model="discretion"
                    hover
                    half-increments
                    background-color="teal"
                    color="teal darken-1"
                  />
                </div>
                <div class="py-3">
                  <p class="textColor">勤務時間を柔軟に決められるか</p>
                  <v-rating
                    v-model="flexibleSchedule"
                    hover
                    half-increments
                    background-color="teal"
                    color="teal darken-1"
                  />
                </div>
                <div class="py-3">
                  <p class="textColor">勤務中の自由度があるか（休憩などが自由にできるか）</p>
                  <v-rating
                    v-model="flexibility"
                    hover
                    half-increments
                    background-color="teal"
                    color="teal darken-1"
                  />
                </div>
                <div class="py-3">
                  <p class="textColor">メンターの評価（自分の担当者の評価）</p>
                  <v-rating
                    v-model="mentor"
                    hover
                    half-increments
                    background-color="teal"
                    color="teal darken-1"
                  />
                </div>
                <div class="py-3">
                  <p class="textColor">社内の雰囲気が良かったかどうか</p>
                  <v-rating
                    v-model="atmosphere"
                    hover
                    half-increments
                    background-color="teal"
                    color="teal darken-1"
                  />
                </div>
              </div>
              <div
                class="py-2"
                :class="{
                  'd-flex': $vuetify.breakpoint.smAndUp,
                }"
              >
                <v-form v-model="reviewValid">
                  <v-textarea
                    solo
                    placeholder="コメントや感想を入力してください。"
                    v-model="content"
                    :rules="contentRules"
                    required
                  ></v-textarea>
                  <v-btn
                    :disabled="!reviewValid || notReviewedCompany.isWritten"
                    color="warning"
                    @click="reviewButtonClicked">
                    レビューを送信
                  </v-btn>
                </v-form>
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
    windowHeight: 0,
    snackbar: false,
    snackbarText: '',
    atmosphere: 3,
    job: 3,
    discretion: 3,
    flexibleSchedule: 3,
    flexibility: 3,
    mentor: 3,
    growth: 3,
    reviewValid: true,
    content: '',
    contentRules: [
      v => !!v || '入力してください',
    ],
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
      notReviewedCompany: state => state.career.notReviewedCompany,
      isNotReviewedCompanyLoading: state => state.career.isNotReviewedCompanyLoading,
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
      if (this.$route.query.id != null) {
        this.resetState()
        this.updateIsNotReviewedCompanyLoading(true)
        this.queryNotReviewedCompany({nuxt: this.$nuxt, uid: this.uid, careerId: this.$route.query.id})
      } else {
        this.$router.replace({ path: '/user/reviews'})
      }
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        if (this.$route.query.id != null) {
          this.resetState()
          this.updateIsNotReviewedCompanyLoading(true)
          this.queryNotReviewedCompany({nuxt: this.$nuxt, uid: uid, careerId: this.$route.query.id})
        } else {
          this.$router.replace({ path: '/user/reviews'})
        }
      }
    }
  },
  methods: {
    reviewButtonClicked() {
      this.reviewValid = false
      const all = Math.round((this.atmosphere + this.job + this.discretion + this.flexibleSchedule + this.flexibility + this.mentor + this.mentor) / 7 * 10) / 10
      var review = {
        uid: this.uid,
        careerId: this.notReviewedCompany.careerId,
        companyId: this.notReviewedCompany.companyId,
        companyName: this.notReviewedCompany.companyName,
        occupation: this.notReviewedCompany.occupation,
        content: this.content,
        all: all,
        atmosphere: this.atmosphere,
        job: this.job,
        discretion: this.discretion,
        flexibleSchedule: this.flexibleSchedule,
        flexibility: this.flexibility,
        mentor: this.mentor,
        growth: this.growth,
        createdAt: new Date(),
      }
      if (this.notReviewedCompany.companyImageUrl) {
        review.companyImageUrl = this.notReviewedCompany.companyImageUrl
      }
      this.postReview({router: this.$router, careerId: this.$route.query.id, review: review})
      this.snackbar = true
      this.snackbarText = 'レビューを送信しました！'
    },
    ...mapActions({
      postReview: 'review/postReview',
      queryNotReviewedCompany: 'career/queryNotReviewedCompany',
      updateIsNotReviewedCompanyLoading: 'career/updateIsNotReviewedCompanyLoading',
      resetState: 'career/resetState',
    }),
  }
}
</script>
<style>
#review-form div.v-list__tile {
  padding: 0px;
}
#review-form i.v-icon {
  padding: 3px !important;
}
</style>
