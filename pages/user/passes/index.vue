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
    <v-flex v-else-if="isInitialLoading" xs12 :style="{ height: windowHeight + 'px' }">
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
        <!-- passes -->
        <v-flex
          xs12
          class="py-3"
          :class="{
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex xs12>
            <div class="text-xs-right pt-2 pb-2">
              <v-btn
                small
                flat
                class="grey--text text--darken-2"
                @click="passTypesDialog=true"
              >
                <v-icon class="mr-1" color="teal lighten-2" style="font-size: 18px; color: #BDBDBD">info</v-icon>
                パスの種類について
              </v-btn>
            </div>
            <!-- 契約済み -->
            <div
              v-if="contractedPasses && contractedPasses.length > 0"
              class="text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly,
              }"
            >
              契約済みの企業
            </div>
            <v-container v-if="contractedPasses && contractedPasses.length > 0" fluid grid-list-lg px-0 mb-4>
              <v-layout row wrap>
                <v-flex v-for="(pass, index) in contractedPasses" :key="pass.passId" xs6 md4>
                  <v-card
                    :to="'/user/passes/' + pass.passId"
                    class="text-xs-center py-2"
                    :class="{
                      'hiring': pass.type == 'hiring',
                      'offer': pass.type == 'offer',
                      'limited': pass.type == 'limited',
                    }"
                  >
                    <div
                      v-if="pass.type != 'hiring' && pass.joiningYear"
                      class="pa-2 text-color font-weight-bold text-xs-left"
                    >
                      {{ pass.joiningYear }}年度
                    </div>
                    <v-avatar
                      :size="avatarSize"
                      :class="{
                        'grey lighten-3': !pass.companyImageUrl,
                      }"
                    >
                      <img v-if="pass.companyImageUrl" :src="pass.companyImageUrl" alt="avatar">
                    </v-avatar>
                    <div
                      class="pt-3 px-3 font-weight-bold text-color"
                      :class="{
                        'subheading': $vuetify.breakpoint.smAndUp,
                      }"
                    >
                      {{ pass.companyName }}
                    </div>
                    <div class="pt-2 px-2 caption text-color font-weight-bold">
                      {{ pass.occupation }}
                    </div>
                    <div class="pt-1 px-1 caption light-text-color">
                      {{ pass.contractedDate }} に契約
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <!-- 未契約 -->
            <div
              v-if="passes && passes.length > 0"
              class="text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly,
              }"
            >
              未契約の企業
            </div>
            <v-container v-if="passes && passes.length > 0" fluid grid-list-lg px-0>
              <v-layout row wrap>
                <v-flex v-for="(pass, index) in passes" :key="pass.passId" xs6 md4>
                  <v-card
                    :to="'/user/passes/' + pass.passId"
                    class="text-xs-center py-2"
                    :class="{
                      'hiring': pass.type == 'hiring',
                      'offer': pass.type == 'offer',
                      'limited': pass.type == 'limited',
                    }"
                  >
                    <div
                      v-if="pass.type != 'hiring' && pass.joiningYear"
                      class="pa-2 text-color font-weight-bold text-xs-left"
                    >
                      {{ pass.joiningYear }}年度
                    </div>
                    <v-avatar
                      :size="avatarSize"
                      :class="{
                        'grey lighten-3': !pass.companyImageUrl,
                      }"
                    >
                      <img v-if="pass.companyImageUrl" :src="pass.companyImageUrl" alt="avatar">
                    </v-avatar>
                    <div
                      class="pt-3 px-3 font-weight-bold text-color"
                      :class="{
                        'subheading': $vuetify.breakpoint.smAndUp,
                        '': $vuetify.breakpoint.xsOnly,
                      }"
                    >
                      {{ pass.companyName }}
                    </div>
                    <div class="pt-2 px-2 caption text-color font-weight-bold">
                      {{ pass.occupation }}
                    </div>
                    <div class="pt-1 px-1 caption light-text-color">
                      <span v-if="!pass.isValid">無効になりました</span>
                      <span v-else-if="pass.isAccepted">内定受諾済み</span>
                      <span v-else-if="pass.isExpired">有効期限を過ぎました</span>
                      <span v-else>有効期限: {{ pass.timestamp }} まで</span>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card
              v-if="(passes == null || passes.length == 0) && (contractedPasses == null || contractedPasses.length == 0)"
              class="px-3 py-4"
              :class="{
                'mx-3': $vuetify.breakpoint.xsOnly,
                'mt-4': $vuetify.breakpoint.mdAndUp,
                'mt-3': $vuetify.breakpoint.smAndDown,
              }"
            >
              <div class="text-xs-center">
                <div
                  class="text-color"
                  :class="{
                    'title': $vuetify.breakpoint.xsOnly,
                    'headline': $vuetify.breakpoint.smAndUp,
                  }"
                >
                  パスがありません
                </div>
                <div class="pt-3 light-text-color">
                  企業からパスをもらった場合はこちらに表示されます
                </div>
                <v-btn class="mt-4 font-weight-bold white--text" color="teal" to="/">募集を探す</v-btn>
              </div>
            </v-card>
            <infinite-loading
              v-if="showInfiniteLoading && passes && passes.length >= 10 && !isLoading"
              :distance="50"
              spinner="waveDots"
              @infinite="infiniteHandler">
              <div slot="no-results"></div>
            </infinite-loading>
          </v-flex>
        </v-flex>
        <!-- パスの種類の説明 -->
        <v-dialog
          v-model="passTypesDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="600"
        >
          <v-card>
            <v-toolbar flat color="white">
              <v-btn class="hidden-sm-and-up" icon @click="passTypesDialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <span
                class="pl-3 text-color font-weight-bold"
                :class="{
                  'title': $vuetify.breakpoint.smAndUp,
                  'subheading': $vuetify.breakpoint.xsOnly
                }"
              >
                パスの種類
              </span>
            </v-toolbar>
            <v-flex
              xs12
              py-3
              class="light-text-color"
              :class="{'px-4': $vuetify.breakpoint.smAndUp, 'px-4 mt-4': $vuetify.breakpoint.xsOnly}"
            >
              <!-- 入社パス -->
              <div class="pb-3">
                <div class="subheading font-weight-bold">
                  1. 入社パス
                  <v-icon class="ml-2" color="pink lighten-2" style="font-size: 18px">bookmark</v-icon>
                </div>
                <div class="pt-2">
                  有効期間内であれば、いつでも入社できるパスです。
                  （卒業前に使用した場合、原則、卒業後に入社という形になります）
                </div>
                <div class="pt-4 subheading font-weight-bold">
                  2. 内定パス
                  <v-icon class="ml-2" color="blue lighten-1" style="font-size: 18px">bookmark</v-icon>
                </div>
                <div class="pt-2">
                  企業が定めた期間内であれば、内定を取得できるパスです。
                </div>
                <div class="pt-4 subheading font-weight-bold">
                  3. 先着パス
                  <v-icon class="ml-2" color="green lighten-2" style="font-size: 18px">bookmark</v-icon>
                </div>
                <div class="pt-2">
                  企業が定めた期間内であり、採用枠にあまりがある場合に限り、内定を取得できるパスです。
                </div>
                <div class="pt-4">
                  ※ どのパスも使用したら原則、入社を取り消しすることが出来ないので、慎重に使用してください。
                </div>
              </div>
            </v-flex>
          </v-card>
        </v-dialog>
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
      title: 'パス',
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
    passTypesDialog: false,
  }),
  computed: {
    avatarSize() {
      if (this.breakpoint == 'xs') {
        return 50
      } else {
        return 70
      }
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
      passes: state => state.passes.passes,
      contractedPasses: state => state.passes.contractedPasses,
      isInitialLoading: state => state.passes.isInitialLoading,
      isLoading: state => state.passes.isLoading,
      allPassesQueried: state => state.passes.allPassesQueried,
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
      this.updateIsInitialLoading(true)
      this.queryPasses(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsInitialLoading(true)
        this.queryPasses(uid)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allPassesQueried) {
        if (!this.isLoading && this.uid != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryPasses(this.uid)
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
      updateIsInitialLoading: 'passes/updateIsInitialLoading',
      updateIsLoading: 'passes/updateIsLoading',
      resetState: 'passes/resetState',
    }),
  }
}
</script>
<style>
.hiring {
  background-image: linear-gradient(-135deg, #F06292 15px, transparent 0);
}
.offer {
  background-image: linear-gradient(-135deg, #42A5F5 15px, transparent 0);
}
.limited {
  background-image: linear-gradient(-135deg, #81C784 15px, transparent 0);
}
</style>
