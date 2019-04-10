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
    >
      <v-card flat>
        <v-list class="px-0 py-3">
          <v-list-tile>
            <v-list-tile-avatar color="grey darken-3">
              <v-img
                v-if="profileImageUrl"
                :src="profileImageUrl"
              ></v-img>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="textColor font-weight-bold return">{{ userName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <div style="padding-left: 72px">
        インターン終了時期：　{{ timestamp }}
      </div>
      <div class="pt-4 px-3">
        <div class="pt-3 subheading font-weight-bold">
          フィードバック
        </div>
        <v-form v-model="feedbackValid">
          <!-- 良い点 -->
          <v-textarea
            label="良い点"
            v-model="goodPoint"
            :rules="feedbackRules"
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
              :disabled="!feedbackValid"
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
  data: () => ({
    isQueried: false,
    feedbackValid: true,
    goodPoint: '',
    advice: '',
    feedbackRules: [
      v => !!v || '入力されていません',
      v => (v.length <= 200) || '200字以内で入力してください'
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
      companyId: state => state.profile.companyId,
      userName: state => state.feedback.userName,
      profileImageUrl: state => state.feedback.profileImageUrl,
      createdAt: state => state.feedback.createdAt,
      timestamp: state => state.feedback.timestamp,
    }),
  },
  mounted() {
    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.queryFeedback({nuxt: this.$nuxt, params: this.params, companyId: this.companyId})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
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
      resetState: 'feedback/resetState',
    }),
  }
}
</script>
