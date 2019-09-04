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
        <!-- snackbar -->
        <v-snackbar
          v-model="snackbar"
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
        <my-page-menu/>
        <v-flex
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
                    <v-list-tile-avatar>
                      <v-img
                        :src="notReviewedCompany.companyImageUrl"
                        class="avatar-border"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="text-color font-weight-bold return">{{ notReviewedCompany.companyName }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-card-actions>
              </v-card>
              <div v-if="notReviewedCompany.occupation">
                <span class="font-weight-bold text-color">職種:
                  <span class="light-text-color">{{ notReviewedCompany.occupation }}</span>
                </span>
              </div>
              <div class="py-5">
                <p class="pb-3 title font-weight-bold text-color">
                  レビュー
                </p>
                <div class="py-4">
                  <p class="text-color">仕事内容が募集に書かれていたこととあっているか</p>
                  <v-rating
                    v-model="job"
                    hover
                    half-increments
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                  />
                </div>
                <div class="py-4">
                  <p class="text-color">インターン生に対して裁量が与えられているか</p>
                  <v-rating
                    v-model="discretion"
                    hover
                    half-increments
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                  />
                </div>
                <div class="py-4">
                  <p class="text-color">勤務時間帯を柔軟に決められるか、休暇を取りやすい環境か（社員が休暇を取れているか）</p>
                  <v-rating
                    v-model="workingHours"
                    hover
                    half-increments
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                  />
                </div>
                <div class="py-4">
                  <p class="text-color">働きやすい環境か（休憩などが自由にできるか、質問しやすい環境かなど）</p>
                  <v-rating
                    v-model="environment"
                    hover
                    half-increments
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                  />
                </div>
                <div class="py-4">
                  <p class="text-color">社内の雰囲気や人間関係が良かったか</p>
                  <v-rating
                    v-model="atmosphere"
                    hover
                    half-increments
                    background-color="#FF5A5F"
                    color="#FF5A5F"
                  />
                </div>
              </div>
              <div
                class="py-2"
                :class="{
                  'd-flex': $vuetify.breakpoint.smAndUp,
                }"
              >
                <v-form v-model="reviewValid" @submit.prevent="">
                  <v-textarea
                    solo
                    placeholder="インターンで感じた企業の良い点、改善すべき点などを自由にお書きください。"
                    v-model="content"
                    :rules="contentRules"
                    required
                  ></v-textarea>
                  <div class="caption light-text-color py-3">
                    このコメントは、企業の募集ページなどで<span class="font-weight-bold">匿名</span>で公開されます。
                    また、企業の方にもレビューの記入者の名前は公開されません。

                    <div class="pt-2">
                      ※ 誹謗中傷や他のユーザーの方が不快に感じるコメントはお控えください。また、人物が特定できる形でのコメントもお控えください。
                    </div>
                  </div>
                  <div class="text-xs-right">
                    <v-btn
                      :disabled="!reviewValid || notReviewedCompany.isWritten"
                      class="white--text"
                      color="teal lighten-1"
                      @click="reviewButtonClicked">
                      レビューを送信
                    </v-btn>
                  </div>
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
  middleware: 'auth',
  components: {
    MyPageMenu
  },
  head () {
    return {
      title: 'レビュー作成',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    snackbar: false,
    snackbarText: '',
    atmosphere: 3,
    job: 3,
    discretion: 3,
    workingHours: 3,
    environment: 3,
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
      const all = Math.round((
        this.atmosphere +
        this.job +
        this.discretion +
        this.workingHours +
        this.environment
      ) / 5 * 10) / 10

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
        workingHours: this.workingHours,
        environment: this.environment,
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
      resetState: 'career/resetNotReviewedCompanyState',
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
