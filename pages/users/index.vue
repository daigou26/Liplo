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
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else
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
                <v-list-tile-avatar color="grey darken-3">
                  <v-img
                    :src="user.imageUrl"
                  ></v-img>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="pl-3 textColor font-weight-bold">
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
                <v-flex sm10 offset-sm1>
                  <v-layout row wrap>
                    <!-- 志望する職種 -->
                    <v-flex
                      v-if="user.desiredOccupations"
                      sm2
                      xs3
                    >
                      <div >志望する職種</div>
                    </v-flex>
                    <v-flex
                      v-if="user.desiredOccupations"
                      xs8
                      offset-xs1
                      px-2
                    >
                      <span v-if="user.desiredOccupations.engineer">エンジニア</span>
                      <span v-if="user.desiredOccupations.designer">　デザイナー</span>
                      <span v-if="user.desiredOccupations.sales">　営業</span>
                      <span v-if="user.desiredOccupations.others">　その他</span>
                    </v-flex>
                    <!-- 自己紹介 -->
                    <v-flex v-if="user.selfIntro" sm2 xs3 pt-4>
                      <div >自己紹介</div>
                    </v-flex>
                    <v-flex v-if="user.selfIntro" xs8 offset-xs1 px-2 pt-4>
                      <div class="textColor break">
                        {{ user.selfIntro.substr(0, 100) }}
                        {{ user.selfIntro.length > 100 ? '...' : '' }}
                      </div>
                    </v-flex>
                    <!-- スキル -->
                    <v-flex v-if="user.skills" sm2 xs3 pt-4>
                      <div >スキル</div>
                    </v-flex>
                    <v-flex v-if="user.skills" xs8 offset-xs1 px-2 pt-4>
                      <template v-if="index < 5" v-for="(skill, index) in user.skills">
                        <v-chip >{{ skill }}</v-chip>
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
            class="textColor"
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
  data: () => ({
    count: 0,
    windowHeight: 0,
    isQueried: false,
    showInfiniteLoading: false,
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      users: state => state.users.users,
      isInitialLoading: state => state.users.isInitialLoading,
      isLoading: state => state.users.isLoading,
      allUsersQueried: state => state.users.allUsersQueried,
      acceptScout: state => state.settings.acceptScout,
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
    store.dispatch('users/setFilter', context.query)
    store.dispatch('users/resetState')
    store.dispatch('users/updateIsInitialLoading', true)
    store.dispatch('users/updateIsLoading', true)
    store.dispatch('users/queryUsers', {queryParams: context.query, acceptScout: store.state.settings.acceptScout})
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryUsers({queryParams: this.$route.query, acceptScout: this.acceptScout})
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allUsersQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryUsers({queryParams: this.$route.query, acceptScout: this.acceptScout})

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
