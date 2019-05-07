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
            <!-- 契約済み -->
            <div
              v-if="contractedPasses && contractedPasses.length > 0"
              class="textColor"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly,
              }"
            >
              契約済みの企業
            </div>
            <v-container v-if="contractedPasses && contractedPasses.length > 0" fluid grid-list-lg mb-4>
              <v-layout row wrap>
                <v-flex v-for="(pass, index) in contractedPasses" :key="pass.passId" xs6 md4>
                  <v-card
                    :to="'/user/passes/' + pass.passId"
                    class="text-xs-center py-2 contracted"
                  >
                    <v-avatar
                      :size="avatarSize"
                      :class="{
                        'grey lighten-3': !pass.companyImageUrl,
                      }"
                    >
                      <img v-if="pass.companyImageUrl" :src="pass.companyImageUrl" alt="avatar">
                    </v-avatar>
                    <div
                      class="pt-3 px-3 font-weight-bold textColor"
                      :class="{
                        'subheading': $vuetify.breakpoint.smAndUp,
                      }"
                    >
                      {{ pass.companyName }}
                    </div>
                    <div class="pt-2 px-2 caption textColor font-weight-bold">
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
              class="textColor"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly,
              }"
            >
              未契約の企業
            </div>
            <v-container v-if="passes && passes.length > 0" fluid grid-list-lg>
              <v-layout row wrap>
                <v-flex v-for="(pass, index) in passes" :key="pass.passId" xs6 md4>
                  <v-card
                    :to="'/user/passes/' + pass.passId"
                    class="text-xs-center py-2"
                    :class="{
                      'accepted': pass.isAccepted,
                      'invalid': (!pass.isValid || pass.isExpired) && !pass.isAccepted,
                    }"
                  >
                    <v-avatar
                      :size="avatarSize"
                      :class="{
                        'grey lighten-3': !pass.companyImageUrl,
                      }"
                    >
                      <img v-if="pass.companyImageUrl" :src="pass.companyImageUrl" alt="avatar">
                    </v-avatar>
                    <div
                      class="pt-3 px-3 font-weight-bold textColor"
                      :class="{
                        'subheading': $vuetify.breakpoint.smAndUp,
                        '': $vuetify.breakpoint.xsOnly,
                      }"
                    >
                      {{ pass.companyName }}
                    </div>
                    <div class="pt-2 px-2 caption textColor font-weight-bold">
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
                  class="textColor"
                  :class="{
                    'title': $vuetify.breakpoint.xsOnly,
                    'headline': $vuetify.breakpoint.smAndUp,
                  }"
                >
                  内定パスがありません
                </div>
                <div class="pt-3 light-text-color">
                  企業から内定パスをもらった場合はこちらに表示されます
                </div>
                <v-btn class="mt-3 font-weight-bold" color="warning" to="/">募集を探す</v-btn>
              </div>
            </v-card>
            <infinite-loading
              v-if="showInfiniteLoading && passes && passes.length >= 1 && !isLoading"
              :distance="50"
              spinner="waveDots"
              @infinite="infiniteHandler">
              <div slot="no-results"></div>
            </infinite-loading>
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
    count: 0,
    showInfiniteLoading: false,
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
.contracted {
  background-image: linear-gradient(-135deg, #FB8C00 20px, transparent 0);
}
.accepted {
  background-image: linear-gradient(-135deg, #66BB6A 20px, transparent 0);
}
.invalid {
  background-image: linear-gradient(-135deg, #90A4AE 20px, transparent 0);
}
</style>
