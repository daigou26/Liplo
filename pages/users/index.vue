<template>
  <v-layout
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
      <v-layout align-center justify-center column fill-height style="padding-top: 150px">
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid && uid != ''"
      xs12
      sm10
      offset-sm1
    >
      <v-list
        v-if="users != null && users.length != 0"
        two-line
        :class="{'pa-2': $vuetify.breakpoint.smAndUp}"
      >
        <template v-for="(user, index) in users">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :to="'/users/' + user.uid"
              class="clickable px-2 mb-4 mx-3 overflow-hidden"
              :class="`elevation-${hover ? 8 : 2}`"
            >
              <v-list-tile
                id="user-tile"
                class="px-3"
                :class="{'px-0': $vuetify.breakpoint.xsOnly}"
              >
                <v-list-tile-avatar>
                  <v-img
                    v-if="user.imageUrl"
                    :src="user.imageUrl"
                  ></v-img>
                  <v-icon v-else :size="40">person</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="pl-3 text-color font-weight-bold">
                    {{ user.lastName + ' ' + user.firstName }}
                  </v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>

                  <v-card-actions class="pa-0">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-if="user.hasPortfolio"
                          dark
                          v-on="on"
                          class="mr-3 material-icons-outlined"
                          color="teal lighten-3"
                        >
                          color_lens
                        </v-icon>
                      </template>
                      <span>ポートフォリオあり</span>
                    </v-tooltip>
                  </v-card-actions>
                </v-list-tile-action>
              </v-list-tile>
              <v-layout v-if="user.desiredOccupations || user.selfIntro || user.skills" row wrap pb-4>
                <v-flex sm10 offset-sm1 :class="{'pt-3 pl-3': $vuetify.breakpoint.xsOnly}">
                  <v-layout row wrap>
                    <!-- 志望する職種 -->
                    <v-flex
                      v-if="user.desiredOccupations"
                      sm2
                      xs3
                    >
                      <div class="text-color">志望する職種</div>
                    </v-flex>
                    <v-flex
                      v-if="user.desiredOccupations"
                      xs8
                      offset-xs1
                      px-2
                      class="text-color"
                    >
                      <span v-if="user.desiredOccupations.engineer">エンジニア</span>
                      <span v-if="user.desiredOccupations.designer">　デザイナー</span>
                      <span v-if="user.desiredOccupations.sales">　営業</span>
                      <span v-if="user.desiredOccupations.marketer">　マーケター</span>
                      <span v-if="user.desiredOccupations.planner">　企画</span>
                      <span v-if="user.desiredOccupations.writer">　ライター</span>
                      <span v-if="user.desiredOccupations.others">　その他</span>
                    </v-flex>
                    <!-- 自己紹介 -->
                    <v-flex v-if="user.selfIntro" sm2 xs3 pt-4>
                      <div class="text-color">自己紹介</div>
                    </v-flex>
                    <v-flex v-if="user.selfIntro" xs8 offset-xs1 px-2 pt-4>
                      <div class="text-color break">
                        {{ user.selfIntro.substr(0, 100) }}
                        {{ user.selfIntro.length > 100 ? '...' : '' }}
                      </div>
                    </v-flex>
                    <!-- 所属 -->
                    <v-flex v-if="user.university" sm2 xs3 pt-4>
                      <div class="text-color">所属</div>
                    </v-flex>
                    <v-flex v-if="user.university" class="text-color" xs8 offset-xs1 px-2 pt-4>
                      {{ user.university }}
                      <span v-if="user.faculty" class="pl-2">{{ user.faculty}}</span>
                      <span v-if="user.department" class="pl-2">{{ user.department}}</span>
                    </v-flex>
                    <!-- 学年 -->
                    <v-flex v-if="user.grade && user.grade != 'others'" sm2 xs3 pt-4>
                      <div class="text-color">学年</div>
                    </v-flex>
                    <v-flex v-if="user.grade && user.grade != 'others'" class="text-color" xs8 offset-xs1 px-2 pt-4>
                      <span v-if="user.grade == 'B1'">大学１年</span>
                      <span v-else-if="user.grade == 'B2'">大学２年</span>
                      <span v-else-if="user.grade == 'B3'">大学３年</span>
                      <span v-else-if="user.grade == 'B4'">大学４年</span>
                      <span v-else-if="user.grade == 'M1'">修士１年</span>
                      <span v-else-if="user.grade == 'M2'">修士２年</span>
                    </v-flex>
                    <!-- 卒業年度 -->
                    <v-flex v-if="user.graduationYear" sm2 xs3 pt-4>
                      <div class="text-color">卒業年度</div>
                    </v-flex>
                    <v-flex v-if="user.graduationYear" class="text-color" xs8 offset-xs1 px-2 pt-4>
                      {{ user.graduationYear }}年
                    </v-flex>
                    <!-- スキル -->
                    <v-flex v-if="user.skills" sm2 xs3 pt-4>
                      <div class="text-color">スキル</div>
                    </v-flex>
                    <v-flex v-if="user.skills" xs8 offset-xs1 px-2 pt-4>
                      <template v-if="index < 5" v-for="(skill, index) in user.skills">
                        <v-chip color="#FF5A5F" outline><strong>{{ skill }}</strong></v-chip>
                      </template>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
          </v-hover>
        </template>
      </v-list>
      <v-card
        v-if="users == null || users.length == 0"
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
            ユーザーが見つかりません
          </div>
          <div class="pt-3 light-text-color">
            絞り込みをしている場合は、条件を変えて検索してください
          </div>
        </div>
      </v-card>
      <infinite-loading
        v-if="showInfiniteLoading && users && users.length >= 10 && !isLoading"
        spinner="waveDots"
        @infinite="infiniteHandler">
        <div slot="no-results"></div>
      </infinite-loading>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: 'ユーザー検索',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    count: 0,
    windowHeight: 0,
    showInfiniteLoading: false,
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      users: state => state.users.users,
      isInitialLoading: state => state.users.isInitialLoading,
      isLoading: state => state.users.isLoading,
      allUsersQueried: state => state.users.allUsersQueried,
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

    this.showInfiniteLoading = true
  },
  watchQuery: ['occupation'],
  fetch(context) {
    const store = context.store
    const users = store.state.users.users

    if (store.state.profile.companyId &&
      store.state.profile.companyId != '' &&
      ((context.from && context.from.path == '/users') || users == null || (users && users.length == 0))) {
      store.dispatch('users/setFilter', context.query)
      store.dispatch('users/resetState')
      store.dispatch('users/updateIsInitialLoading', true)
      store.dispatch('users/updateIsLoading', true)
      store.dispatch('users/queryUsers', context.query)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryUsers(this.$route.query)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allUsersQueried) {
        if (!this.isLoading && this.companyId != null && this.companyId != '') {
          this.count += 1
          this.updateIsLoading(true)
          this.queryUsers(this.$route.query)

          if (this.count > 20) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      queryUsers: 'users/queryUsers',
      updateIsInitialLoading: 'users/updateIsInitialLoading',
      updateIsLoading: 'users/updateIsLoading',
      resetState: 'users/resetState',
      resetUsers: 'users/resetUsers',
      setFilter: 'users/setFilter'
    }),
  }
}
</script>
<style>
#user-tile.v-list__tile {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
