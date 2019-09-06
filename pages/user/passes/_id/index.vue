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
                先着パスは、採用枠がなくなり次第無効になるため、入社することを決めた場合は
                早めに使用してください。
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
              <div class="pb-4">
                <span v-if="type == 'hiring'" class="font-weight-bold pink--text text--lighten-2">入社パス</span>
                <span v-else-if="type == 'offer'" class="font-weight-bold blue--text text--lighten-1">内定パス</span>
                <span v-else-if="type == 'limited'" class="font-weight-bold green--text text--lighten-2">先着パス</span>
              </div>
              <div v-if="joiningYear" class="pb-2">
                <span class="font-weight-bold text-color">入社年度：　{{ joiningYear }}年度</span>
              </div>
              <div class="pb-4">
                <span class="font-weight-bold text-color">職種：</span>
                <span v-if="occupation" class="pt-2 font-weight-medium body-text">{{ occupation }}</span>
              </div>
              <div class="pb-3">
                <span class="font-weight-bold text-color">担当者からのメッセージ：</span>
                <p v-if="message" class="pt-2 body-text light-text-color return">{{ message }}</p>
              </div>
              <div class="pb-3">
                <span class="font-weight-bold text-color">期限：　{{ expirationDateText }}</span>
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
                  class="pb-3 font-weight-bold text-color"
                >
                  <span v-if="limit == null">採用枠： あり</span>
                  <span v-else>採用枠：　残り{{ limit - usedCount }}人</span>
                </div>
                <v-form v-model="acceptOfferValid" class="text-xs-right" @submit.prevent="">
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
                    class="mt-3 white--text"
                    color="teal lighten-1"
                    style="width: 150px"
                    @click="acceptDialog = true">
                    <span class="font-weight-bold">使用する</span>
                  </v-btn>
                </v-form>
              </div>
              <div
                v-if="!isContracted && !isAccepted && isValid && !isExpired && !(type == 'limited' && limit && limit <= usedCount)"
                class="py-4 light-text-color"
              >
                ※ 事前に担当者とのメッセージにて労働条件（給料や労働時間、仕事内容、勤務開始日など）を確認し、同意の上、慎重に使用してください。
                （労働条件は変更される可能性があるので、過去に一度確認している場合でも、パスの使用前に必ず確認してください）
                <div v-if="type == 'hiring'">また、入社パスを使用する場合は、メッセージにて、勤務開始日の希望を担当者に伝え、日程のすり合わせを行ってください。</div>
              </div>
            </div>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
    <!-- パス使用の確認 -->
    <v-dialog
      v-model="acceptDialog"
      width="300"
    >
      <v-card>
        <v-card-title class="title font-weight-bold text-color">パス使用の確認</v-card-title>
        <v-card-text class="text-color">
          パスを使用すると、入社を取り消しすることは出来ません。使用前に、
          担当者とのメッセージにて労働条件（給料や労働時間、仕事内容、勤務開始日など）を確認し、
          同意の上、慎重に使用してください。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            flat="flat"
            @click="acceptDialog = false"
          >
            キャンセル
          </v-btn>

          <v-btn
            color="teal lighten-1"
            flat="flat"
            @click="acceptButtonClicked"
          >
            使用
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      title: this.companyName ? this.companyName + ' - ' + 'パス' : 'パス',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    acceptDialog: false,
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
        v => (v <= this.expirationDate.getFullYear()) || '有効期限を過ぎています',
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

      this.acceptDialog = false
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
