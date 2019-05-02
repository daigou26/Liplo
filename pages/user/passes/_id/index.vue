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
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md)-->
        <v-flex
          md4
          hidden-sm-and-down
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <my-page-menu/>
        </v-flex>
        <!-- passes (lg, md) -->
        <v-flex
          md8
          xs12
          class="py-3"
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
            'mt-4': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <v-flex md10 sm8 xs10 offset-md1 offset-sm2 offset-xs1>
            <!-- menu (sm, xs) -->
            <my-page-menu class="hidden-md-and-up"></my-page-menu>
            <!-- 未承諾 & 未契約 -->
            <v-alert
              v-if="!isContracted && !isAccepted && isValid"
              :value="true"
              color="teal lighten-1"
              outline
              icon="card_giftcard"
              class="text-xs-left"
            >
              <div class="font-weight-bold ">おめでとうございます！　内定パスをもらいました！</div>
              <div class="font-weight-bold ">この企業に入社することを決めたらメッセージを記入し、承諾ボタンを押してください！</div>
            </v-alert>
            <!-- 承諾済 & 未契約 -->
            <v-alert
              v-if="!isContracted && isAccepted && isValid"
              :value="true"
              color="green lighten-1"
              icon="info"
              outline
            >
              <span class="font-weight-bold ">内定承諾済みです。採用担当者から内定契約に関するメッセージが届きます。
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
              <span class="font-weight-bold ">内定契約が完了しました！　おめでとうございます！</span>
            </v-alert>
            <!-- 無効 -->
            <v-alert
              v-if="!isContracted && !isAccepted && !isValid"
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
                  何か問題がありましたら、メッセージにてご確認お願いします。
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
              <div class="pb-3">
                <span class="font-weight-bold textColor">期限：　{{ expirationDate }}</span>
              </div>
              <div class="pb-3">
                <span class="font-weight-bold textColor">職種：</span>
                <p v-if="occupation" class="pt-2 font-weight-medium body-text">{{ occupation }}</p>
              </div>
              <div class="pb-3">
                <span class="font-weight-bold textColor">担当者からのメッセージ：</span>
                <p v-if="message" class="pt-2 body-text light-text-color return">{{ message }}</p>
              </div>
              <div v-if="!isContracted && !isAccepted && isValid" class="text-xs-right">
                <v-form v-model="acceptOfferValid">
                  <v-textarea
                    v-if="!isAccepted"
                    solo
                    label="メッセージ"
                    v-model="userMessage"
                    :rules="messageRules"
                    required
                  ></v-textarea>
                  <v-btn
                    :disabled="!acceptOfferValid || isAccepted"
                    color="warning"
                    @click="acceptButtonClicked">
                    <span class="font-weight-bold">受諾する</span>
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
    acceptOfferValid: true,
    userMessage: '',
    messageRules: [
      v => !!v || 'メッセージを入力してください',
    ],
    count: 0,
    mypageItems: [
      'passes',
      'career',
      'feedbacks',
      'reviews'
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
      companyId: state => state.pass.companyId,
      companyName: state => state.pass.companyName,
      companyImageUrl: state => state.pass.companyImageUrl,
      message: state => state.pass.message,
      occupation: state => state.pass.occupation,
      expirationDate: state => state.pass.expirationDate,
      isAccepted: state => state.pass.isAccepted,
      isContracted: state => state.pass.isContracted,
      isValid: state => state.pass.isValid,
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
      this.updateIsLoading(true)
      this.queryPass({nuxt: this.$nuxt, params: this.$route.params})
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.updateIsLoading(true)
        this.queryPass({nuxt: this.$nuxt, params: this.$route.params})
      }
    }
  },
  methods: {
    acceptButtonClicked() {
      this.acceptOffer({params: this.params, message: this.userMessage})
    },
    ...mapActions({
      updateIsLoading: 'pass/updateIsLoading',
      queryPass: 'pass/queryPass',
      acceptOffer: 'pass/acceptOffer',
    }),
  }
}
</script>
<style>
#pass-detail div.v-list__tile {
  padding: 0px;
}
</style>
