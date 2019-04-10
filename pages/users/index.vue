<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      sm10
      offset-sm1
    >
      <v-card>
        <v-list
          v-if="users != null && users.length != 0"
          two-line
          class="pa-2"
        >
          <template v-for="(user, index) in users">
            <v-card flat class="clickable pb-4" :to="'/users/' + user.uid">
              <v-card-actions>
                <v-list-tile
                  id="user-tile"
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
                </v-list-tile>
              </v-card-actions>
              <v-layout row wrap>
                <!-- 志望する職種 -->
                <v-flex v-if="user.desiredOccupations" sm2 xs3 offset-sm1>
                  <div >志望する職種</div>
                </v-flex>
                <v-flex
                  v-if="user.desiredOccupations"
                  xs8
                  offset-xs1
                  px-2
                  :class="{'pb-4': $vuetify.breakpoint.xsOnly}"
                >
                  <span v-if="user.desiredOccupations.engineer">エンジニア</span>
                  <span v-if="user.desiredOccupations.designer">　デザイナー</span>
                  <span v-if="user.desiredOccupations.sales">　営業</span>
                  <span v-if="user.desiredOccupations.others">　その他</span>
                </v-flex>
                <!-- <v-flex sm10 offset-sm1 hidden-xs-only py-3>
                  <v-divider></v-divider>
                </v-flex> -->
                <!-- 興味のある分野 -->
                <!-- <v-flex sm2 xs3 offset-sm1>
                  <div >興味のある分野</div>
                </v-flex>
                <v-flex xs8 offset-xs1 px-2>
                  <v-chip >機械学習</v-chip>
                  <v-chip>FinTech</v-chip>
                  <v-chip>HR Tech</v-chip>
                </v-flex> -->
                <v-flex v-if="user.skills" sm10 offset-sm1 hidden-xs-only py-3>
                  <v-divider></v-divider>
                </v-flex>
                <!-- スキル -->
                <v-flex v-if="user.skills" sm2 xs3 offset-sm1>
                  <div >スキル</div>
                </v-flex>
                <v-flex v-if="user.skills" xs8 offset-xs1 px-2>
                  <template v-for="(skill, index) in user.skills">
                    <v-chip >{{ skill }}</v-chip>
                  </template>

                </v-flex>
                <v-flex sm10 offset-sm1 hidden-xs-only py-3>
                  <v-divider></v-divider>
                </v-flex>
                <!-- ポートフォリオ -->
                <v-flex sm2 xs3 offset-sm1>
                  <div >ポートフォリオ</div>
                </v-flex>
                <v-flex xs8 offset-xs1 px-2>
                  あり
                </v-flex>
                <v-flex sm10 offset-sm1 hidden-xs-only py-3>
                  <v-divider></v-divider>
                </v-flex>
                <!-- 返信率 -->
                <v-flex sm2 xs3 offset-sm1>
                  <div >返信率</div>
                </v-flex>
                <v-flex xs8 offset-xs1 px-2>
                  80%
                </v-flex>
              </v-layout>
            </v-card>
            <v-divider
              v-if="users.length != index + 1"
            ></v-divider>
          </template>
        </v-list>
        <infinite-loading
          v-if="showInfiniteLoading && users && users.length >= 10 && !isLoading"
          spinner="waveDots"
          @infinite="infiniteHandler">
          <div slot="no-results"></div>
        </infinite-loading>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    count: 0,
    isQueried: false,
    showInfiniteLoading: false,
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      companyId: state => state.profile.companyId,
      users: state => state.users.users,
      isLoading: state => state.users.isLoading,
      allUsersQueried: state => state.users.allUsersQueried,
    }),
  },
  mounted() {
    this.showInfiniteLoading = true
  },
  watchQuery: ['occupation'],
  fetch(context) {
    const store = context.store
    store.dispatch('users/setFilter', context.query)
    store.dispatch('users/resetState')
    store.dispatch('users/updateIsLoading', true)
    store.dispatch('users/queryUsers', context.query)
  },
  watch: {
    companyId(companyId) {
      if (companyId != null) {
        this.resetState()
        this.isQueried = true
        this.updateIsLoading(true)
        this.queryUsers(this.$route.query)
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allUsersQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryUsers({queryParams: this.$route.query})

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
