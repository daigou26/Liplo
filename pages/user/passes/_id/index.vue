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
        <my-page-menu/>
        <!-- pass -->
        <v-flex
          xs12
          class="py-3"
          :class="{
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex sm10 xs12 offset-sm1>
            <!-- 未使用 & 未契約 -->
            <v-alert
              v-if="!isContracted && !isAccepted && isValid && !isExpired && !(type == 'limited' && limit && limit <= usedCount)"
              :value="true"
              color="teal lighten-1"
              outline
              icon="card_giftcard"
              class="text-xs-left"
            >
              <div class="font-weight-bold">おめでとうございます！　{{ typeText }}が送られました。</div>
              <div v-if="type == 'limited'" class="font-weight-bold">
                先着パスは、採用枠がなくなり次第無効になるため、入社することを決めた場合は、早めに使用してください。
              </div>
              <div v-else class="font-weight-bold">
                この企業に入社することを決めたらメッセージを記入し、使用ボタンを押してください。
              </div>
            </v-alert>
            <!-- 使用済み & 未契約 -->
            <v-alert
              v-if="!isContracted && isAccepted && isValid"
              :value="true"
              color="green lighten-1"
              icon="info"
              outline
            >
              <span class="font-weight-bold">{{ typeText }}を使用しました。採用担当者から契約に関するメッセージが届きます。
                届かない場合は、企業とのメッセージでご確認お願いします。
              </span>
            </v-alert>
            <!-- 契約済 -->
            <v-alert
              v-if="isContracted"
              :value="true"
              color="orange darken-1"
              outline
              icon="card_giftcard"
            >
              <span class="font-weight-bold ">契約が完了しました！　おめでとうございます！</span>
            </v-alert>
            <!-- 未使用 & 未契約 & 先着パスの上限 -->
            <v-alert
              v-if="!isContracted && !isAccepted && isValid && !isExpired && type == 'limited' && limit && limit <= usedCount"
              :value="true"
              color="blue-grey lighten-2"
              outline
              icon="warning"
              class="text-xs-left"
            >
              <div class="font-weight-bold ">採用人数が上限に達したため、無効になりました。</div>
            </v-alert>
            <!-- 無効 -->
            <v-alert
              v-if="!isContracted && (!isValid || isExpired)"
              :value="true"
              color="blue-grey lighten-2"
              outline
              icon="warning"
            >
              <span class="font-weight-bold ">
                <div>
                  期限切れなどの理由により、無効になりました。
                </div>
                <div>
                  何か問題がございましたら、担当者とのメッセージにてご確認お願いします。
                </div>
              </span>
            </v-alert>
            <!-- pass detail -->
            <div
              class="py-4"
              :class="{
                'px-5': $vuetify.breakpoint.mdAndUp,
              }"
              id="pass-detail"
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
              <div v-if="joiningYear" class="pb-2">
                <span class="font-weight-bold textColor">入社年度：　{{ joiningYear }}年度</span>
              </div>
              <div class="pb-4">
                <span class="font-weight-bold textColor">職種：</span>
                <span v-if="occupation" class="pt-2 font-weight-medium body-text">{{ occupation }}</span>
              </div>
              <div class="pb-3">
                <span class="font-weight-bold textColor">担当者からのメッセージ：</span>
                <p v-if="message" class="pt-2 body-text light-text-color return">{{ message }}</p>
              </div>
              <div class="pb-3">
                <span class="font-weight-bold textColor">期限：　{{ expirationDateText }}</span>
              </div>
              <div
                v-if="
                  !isContracted &&
                  !isAccepted &&
                  isValid &&
                  !isExpired &&
                  !(type == 'limited' && limit && limit <= usedCount)
                "
              >
                <div
                  v-if="type == 'limited'"
                  class="pb-3 font-weight-bold textColor"
                >
                  <span v-if="limit == null">採用枠： あり</span>
                  <span v-else>採用枠：　残り{{ limit - usedCount }}人</span>
                </div>
                <v-form v-model="acceptOfferValid" class="text-xs-right">
                  <!-- 入社年度 -->
                  <v-text-field
                    v-if="type == 'hiring'"
                    v-model="tempJoiningYear"
                    class="pt-3"
                    label="入社年度"
                    type="number"
                    suffix="年度"
                    :rules="joiningYearRules"
                    required
                  ></v-text-field>
                  <v-textarea
                    v-if="!isAccepted"
                    label="メッセージ"
                    v-model="userMessage"
                    :rules="messageRules"
                    required
                  ></v-textarea>
                  <v-btn
                    :disabled="!acceptOfferValid || isAccepted"
                    color="warning"
                    @click="acceptButtonClicked">
                    <span class="font-weight-bold">使用する</span>
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
    windowHeight: 0,
    acceptOfferValid: true,
    tempJoiningYear: null,
    userMessage: '',
    messageRules: [
      v => !!v || 'メッセージを入力してください',
    ],
    count: 0,
  }),
  computed: {
    expirationDateText() {
      if (this.expirationDate) {
        let date = this.expirationDate
        let year  = date.getFullYear()
        let month = date.getMonth() + 1
        let day  = date.getDate()
      return `${year}/${month}/${day}`
      }
    },
    typeText() {
      if (this.type == 'hiring') {
        return '入社パス'
      } else if (this.type == 'offer') {
        return '内定パス'
      } else if (this.type == 'limited') {
        return '先着パス'
      }
    },
    joiningYearRules() {
      const year = new Date()
      return [
        v => (String(v).length == 4) || '4桁で指定してください',
        v => (v <= this.expirationDate.getFullYear()) || '有効期間を過ぎています',
        v => (v >= year.getFullYear() - 1) || `${year.getFullYear() - 1}以上で指定してください`,
      ]
    },
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
      companyId: state => state.pass.companyId,
      companyName: state => state.pass.companyName,
      companyImageUrl: state => state.pass.companyImageUrl,
      type: state => state.pass.type,
      joiningYear: state => state.pass.joiningYear,
      limit: state => state.pass.limit,
      allCount: state => state.pass.allCount,
      usedCount: state => state.pass.usedCount,
      message: state => state.pass.message,
      occupation: state => state.pass.occupation,
      expirationDate: state => state.pass.expirationDate,
      isAccepted: state => state.pass.isAccepted,
      isContracted: state => state.pass.isContracted,
      isValid: state => state.pass.isValid,
      isExpired: state => state.pass.isExpired,
      isLoading: state => state.pass.isLoading,
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

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryPass({nuxt: this.$nuxt, params: this.$route.params})
    }
  },
  destroyed () {
    this.updateIsLoading(false)
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryPass({nuxt: this.$nuxt, params: this.$route.params})
      }
    }
  },
  methods: {
    acceptButtonClicked() {
      this.acceptOffer({params: this.params, message: this.userMessage, joiningYear: this.tempJoiningYear})

      this.snackbarText = '使用しました！'
      this.snackbar = true
    },
    ...mapActions({
      updateIsLoading: 'pass/updateIsLoading',
      queryPass: 'pass/queryPass',
      acceptOffer: 'pass/acceptOffer',
      resetState: 'pass/resetState'
    }),
  }
}
</script>
<style>
#pass-detail div.v-list__tile {
  padding: 0px;
}
</style>
