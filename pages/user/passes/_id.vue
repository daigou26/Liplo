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
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md)-->
        <v-flex
          md3
          hidden-sm-and-down
          :class="{
            'pa-5': $vuetify.breakpoint.lgAndUp,
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
          }"
        >
          <v-flex md10 sm6 xs8 offset-md1 offset-sm3 offset-xs2>
            <!-- menu (sm, xs) -->
            <my-page-menu class="hidden-md-and-up"></my-page-menu>
            <!-- passes -->
            <div v-if="params.id == null">
              <v-list v-if="passes" three-line class="border">
                <template v-for="(pass, index) in passes">
                  <v-list-tile :to="'/user/passes/' + pass.passId" >
                    <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                      <v-img
                        :src="pass.companyImageUrl"
                      ></v-img>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title class="textColor font-weight-bold return">{{ pass.companyName }}</v-list-tile-title>
                      <v-list-tile-sub-title>
                        {{ pass.occupation }}
                      </v-list-tile-sub-title>
                      <v-list-tile-sub-title class="pt-2" style="font-size: 13px">
                        <span v-if="pass.isContracted">内定契約済み</span>
                        <span v-else-if="pass.isAccepted">内定受諾済み</span>
                        <span v-else-if="pass.isExpired">有効期限を過ぎました</span>
                        <span v-else>有効期限: {{ pass.expirationDate }} まで</span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="passes.length != index + 1"
                    :inset="true"
                  ></v-divider>
                </template>
              </v-list>
              <infinite-loading
                v-if="showInfiniteLoading && passes && passes.length >= 10 && !isPassesLoading"
                :distance="50"
                spinner="waveDots"
                @infinite="infiniteHandler">
                <div slot="no-results"></div>
              </infinite-loading>
            </div>
            <!-- pass detail -->
            <div
              v-else
              :class="{
                'px-5 py-2 border': $vuetify.breakpoint.mdAndUp,
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
              <div class="pb-5">
                <span class="font-weight-bold textColor">職種:</span>
                <p v-if="occupation" class="font-weight-medium body-text">{{ occupation }}</p>
              </div>
              <div class="pb-5">
                <span class="font-weight-bold textColor">メッセージ</span>
                <p v-if="message" class="body-text return">{{ message }}</p>
              </div>
              <div v-if="isContracted" class="pb-5">
                <span class="font-weight-bold textColor">内定契約済みです。　おめでとうございます！</span>
              </div>
              <div v-if="!isContracted && !isAccepted && !isValid" class="pb-5">
                <span class="font-weight-bold textColor">無効になりました。</span>
              </div>
              <div v-if="!isContracted && isValid" class="text-xs-right">
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
                    <span v-if="!isAccepted">受諾する</span>
                    <span v-else>受諾済み</span>
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
    acceptOfferValid: true,
    userMessage: '',
    messageRules: [
      v => !!v || 'メッセージを入力してください',
    ],
    count: 0,
    showInfiniteLoading: false,
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
      passes: state => state.passes.passes,
      isPassesLoading: state => state.passes.isPassesLoading,
      allPassesQueried: state => state.passes.allPassesQueried,
      companyId: state => state.pass.companyId,
      companyName: state => state.pass.companyName,
      companyImageUrl: state => state.pass.companyImageUrl,
      message: state => state.pass.message,
      occupation: state => state.pass.occupation,
      expirationDate: state => state.pass.expirationDate,
      isAccepted: state => state.pass.isAccepted,
      isContracted: state => state.pass.isContracted,
      isValid: state => state.pass.isValid,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true

    if (this.uid != null && !this.isQueried) {
      if (this.params.id == null) {
        this.queryPasses({uid: this.uid, passes: this.passes})
      } else {
        this.queryPass({nuxt: this.$nuxt, params: this.$route.params})
      }
    }
  },
  watch: {
    uid(uid) {
      if (uid != null) {
        this.isQueried = true
        if (this.params.id == null) {
          this.queryPasses({uid: uid, passes: this.passes})
        } else {
          this.queryPass({nuxt: this.$nuxt, params: this.$route.params})
        }
      }
    }
  },
  methods: {
    acceptButtonClicked() {
      this.acceptOffer({params: this.params, message: this.userMessage})
      this.setIsAccepted(true)
    },
    infiniteHandler($state) {
      if (!this.allPassesQueried) {
        if (!this.isPassesLoading && this.uid != null) {
          this.count += 1
          this.updatePassesLoading(true)
          this.queryPasses({uid: this.uid, passes: this.passes})
        }
        if (this.count > 20) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      queryPasses: 'passes/queryPasses',
      updatePassesLoading: 'passes/updatePassesLoading',
      queryPass: 'pass/queryPass',
      acceptOffer: 'pass/acceptOffer',
      setIsAccepted: 'pass/setIsAccepted',
    }),
  }
}
</script>
<style>
#pass-detail div.v-list__tile {
  padding: 0px;
}
</style>
