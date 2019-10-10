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
    >
      <v-card flat>
        <v-list class="px-0 py-3">
          <v-list-tile>
            <v-list-tile-avatar>
              <v-img
                v-if="profileImageUrl"
                :src="profileImageUrl"
                class="avatar-border"
              ></v-img>
              <v-icon v-else class="avatar-border">person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="text-color font-weight-bold return">{{ userName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <div class="text-color px-3 pt-4">
        職種：　{{ occupation }}
      </div>
      <div class="pt-2 text-color px-3">
        インターン終了時期：　{{ timestamp }}
      </div>
      <div class="pt-5 px-3">
        <div class="pt-3 subheading font-weight-bold">
          フィードバック
        </div>
        <v-form v-model="feedbackValid" @submit.prevent="">
          <!-- 良かった点 -->
          <v-textarea
            label="良かった点"
            v-model="goodPoint"
            :rules="feedbackRules"
            placeholder="候補者の良かったところ"
            required
          ></v-textarea>
          <!-- アドバイス -->
          <v-textarea
            label="アドバイス"
            v-model="advice"
            placeholder="もっとこうした方が良くなるなど"
            :rules="feedbackRules"
            required
          ></v-textarea>
          <div class="text-xs-right py-3">
            <v-btn
              :disabled="!feedbackValid || (!goodPoint && !advice) || plan == null"
              @click="sendFeedbackButtonClicked"
            >
              送信
            </v-btn>
          </div>
        </v-form>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: 'フィードバック作成',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    feedbackValid: true,
    goodPoint: '',
    advice: '',
    feedbackRules: [
      v => (v.length <= 1000) || '1000字以内で入力してください'
    ],
  }),
  computed: {
    params() {
      return this.$route.params
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      plan: state => state.profile.plan,
      companyId: state => state.profile.companyId,
      userName: state => state.feedback.userName,
      profileImageUrl: state => state.feedback.profileImageUrl,
      occupation: state => state.feedback.occupation,
      createdAt: state => state.feedback.createdAt,
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
    sendFeedbackButtonClicked() {
      this.sendFeedback({
        router: this.$router,
        params: this.params,
        goodPoint: this.goodPoint,
        advice: this.advice
      })
    },
    ...mapActions({
      queryFeedback: 'feedback/queryFeedback',
      sendFeedback: 'feedback/sendFeedback',
      updateIsLoading: 'feedback/updateIsLoading',
      resetState: 'feedback/resetState',
    }),
  }
}
</script>
