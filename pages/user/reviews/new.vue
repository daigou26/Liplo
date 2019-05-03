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
        <!-- snackbar -->
        <v-snackbar
          v-model="snackbar"
          class="px-5"
          color="orange lighten-1"
          :multi-line="true"
          :timeout="6000"
          :top="true"
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
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
            'px-3': $vuetify.breakpoint.smAndDown,
          }"
        >
          <v-flex sm10 xs12 offset-sm1>
            <!-- review form -->
            <div
              v-if="notReviewedCompany != null"
              :class="{
                'px-5 py-2 border': $vuetify.breakpoint.mdAndUp,
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
              <div class="">
                <span class="font-weight-bold textColor">職種:</span>
                <p v-if="notReviewedCompany.occupation" class="font-weight-medium body-text">{{ notReviewedCompany.occupation }}</p>
              </div>
              <div class="py-4">
                <p class="title font-weight-bold textColor">
                  レビュー
                </p>
                <div class="d-flex py-2">
                  <span class="textColor pr-2">成長できるか</span>
                  <v-rating
                    v-model="growth"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                    class="text-xs-right"
                  />
                </div>
                <div class="d-flex py-2">
                  <span class="textColor pr-2">仕事内容</span>
                  <v-rating
                    v-model="job"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                    class="text-xs-right"
                  />
                </div>
                <div class="d-flex py-2">
                  <span class="textColor pr-2">裁量度</span>
                  <v-rating
                    v-model="discretion"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                    class="text-xs-right"
                  />
                </div>
                <div class="d-flex py-2">
                  <span class="textColor pr-2">出勤時間の柔軟性</span>
                  <v-rating
                    v-model="flexibleSchedule"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                    class="text-xs-right"
                  />
                </div>
                <div class="d-flex py-2">
                  <span class="textColor pr-2">勤務中の自由度</span>
                  <v-rating
                    v-model="flexibility"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                    class="text-xs-right"
                  />
                </div>
                <div class="d-flex py-2">
                  <span class="textColor pr-2">メンター</span>
                  <v-rating
                    v-model="mentor"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                    class="text-xs-right"
                  />
                </div>
                <div class="d-flex py-2">
                  <span class="textColor pr-2">雰囲気</span>
                  <v-rating
                    v-model="atmosphere"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                    class="text-xs-right"
                  />
                </div>
              </div>
              <div class="text-xs-right">
                <v-form v-model="reviewValid">
                  <v-textarea
                    solo
                    label="コメントや感想を入力してください。"
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
      notReviewedCompany: state => state.career.notReviewedCompany,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      if (this.$route.query.id != null) {
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
    }),
  }
}
</script>
<style>
#review-form div.v-list__tile {
  padding: 0px;
}
</style>
