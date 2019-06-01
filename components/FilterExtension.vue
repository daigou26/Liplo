<template>
  <div
    class="filter"
    :class="{
      'px-5': $vuetify.breakpoint.smAndUp,
    }"
  >
    <!-- 求人フィルター -->
    <div v-if="!path.includes('/users')">
      <!-- 職種 -->
      <v-menu
        v-model="occupationMenu"
        fixed
        offset-y
        :close-on-content-click="false"
        :class="{
          'xs-filter': $vuetify.breakpoint.xsOnly,
        }"
      >
        <v-btn
          slot="activator"
          v-bind:outline="!isJobsOccupationFilterActive"
          v-bind:depressed="isJobsOccupationFilterActive"
          :color="jobsFilterButtonColor('occupation')"
          @click="jobsOccupationFilterButtonClicked"
        >
          <span :class="jobsFilterTextColor('occupation')">{{ occupationFilterText }}</span>
        </v-btn>
        <v-card>
          <v-list>
            <!-- エンジニア -->
            <v-list-tile @click="tempJobsEngineerFilter=!tempJobsEngineerFilter">
              <v-checkbox v-model="tempJobsEngineerFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">エンジニア</v-list-tile-title>
            </v-list-tile>
            <!-- デザイナー -->
            <v-list-tile @click="tempJobsDesignerFilter=!tempJobsDesignerFilter">
              <v-checkbox v-model="tempJobsDesignerFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">デザイナー</v-list-tile-title>
            </v-list-tile>
            <!-- 営業 -->
            <v-list-tile @click="tempJobsSalesFilter=!tempJobsSalesFilter">
              <v-checkbox v-model="tempJobsSalesFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">営業</v-list-tile-title>
            </v-list-tile>
            <!-- その他 -->
            <v-list-tile @click="tempJobsOthersFilter=!tempJobsOthersFilter">
              <v-checkbox v-model="tempJobsOthersFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">その他</v-list-tile-title>
            </v-list-tile>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="occupationMenu = false">キャンセル</v-btn>
            <v-btn color="primary" flat @click="updateOccupationFilter">適用</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <!-- 特徴 -->
      <v-menu
        v-model="featuresMenu"
        fixed
        offset-y
        :close-on-content-click="false"
        :class="{
          'xs-filter': $vuetify.breakpoint.xsOnly,
        }"
      >
        <v-btn
          slot="activator"
          v-bind:outline="!isFeaturesFilterActive"
          v-bind:depressed="isFeaturesFilterActive"
          :color="jobsFilterButtonColor('features')"
          @click="featuresFilterButtonClicked"
        >
          <span :class="jobsFilterTextColor('features')">{{ featuresFilterText }}</span>
        </v-btn>
        <v-card>
          <v-list>
            <!-- 未経験ok -->
            <v-list-tile @click="tempExperience=!tempExperience">
              <v-checkbox v-model="tempExperience" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">未経験歓迎</v-list-tile-title>
            </v-list-tile>
            <!-- 資金調達あり -->
            <v-list-tile @click="tempFunding=!tempFunding">
              <v-checkbox v-model="tempFunding" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">資金調達をしている</v-list-tile-title>
            </v-list-tile>
            <!-- 創業者20代 -->
            <v-list-tile @click="tempFounder20s=!tempFounder20s">
              <v-checkbox v-model="tempFounder20s" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">創業者が20代</v-list-tile-title>
            </v-list-tile>
            <!-- メディア掲載 -->
            <v-list-tile @click="tempMedia=!tempMedia">
              <v-checkbox v-model="tempMedia" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">メディアに掲載されたことがある</v-list-tile-title>
            </v-list-tile>
            <!-- 海外進出 -->
            <v-list-tile @click="tempOverseas=!tempOverseas">
              <v-checkbox v-model="tempOverseas" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">海外進出している</v-list-tile-title>
            </v-list-tile>
            <!-- 友人と応募ok -->
            <v-list-tile @click="tempFriend=!tempFriend">
              <v-checkbox v-model="tempFriend" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">友人と応募OK</v-list-tile-title>
            </v-list-tile>
            <!-- 土日ok -->
            <v-list-tile @click="tempWeekend=!tempWeekend">
              <v-checkbox v-model="tempWeekend" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">土日OK</v-list-tile-title>
            </v-list-tile>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="featuresMenu = false">キャンセル</v-btn>
            <v-btn color="primary" flat @click="updateFeaturesFilter">適用</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <!-- 勤務日数 -->
      <v-menu
        v-model="workweekMenu"
        fixed
        offset-y
        :close-on-content-click="false"
        :class="{
          'xs-filter': $vuetify.breakpoint.xsOnly,
        }"
      >
        <v-btn
          slot="activator"
          v-bind:outline="!isWorkweekFilterActive"
          v-bind:depressed="isWorkweekFilterActive"
          :color="jobsFilterButtonColor('workweek')"
          @click="workweekFilterButtonClicked"
        >
          <span :class="jobsFilterTextColor('workweek')">{{ workweekFilterText }}</span>
        </v-btn>
        <v-card>
          <v-radio-group class="pl-3 pt-3 mt-0" v-model="tempWorkweek">
            <v-radio label="指定なし" value="指定なし" color="teal"></v-radio>
            <v-radio
              v-for="n in 5"
              :key="n"
              :label="`週${n}日`"
              :value="n"
              color="teal"
            ></v-radio>
          </v-radio-group>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="workweekMenu = false">キャンセル</v-btn>
            <v-btn color="primary" flat @click="updateWorkweekFilter">適用</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
    <!-- ユーザーフィルター -->
    <div v-else>
      <!-- 職種 -->
      <v-menu
        v-model="occupationMenu"
        fixed
        offset-y
        :close-on-content-click="false"
      >
        <v-btn
          slot="activator"
          v-bind:outline="!isUsersOccupationFilterActive"
          v-bind:depressed="isUsersOccupationFilterActive"
          :color="usersFilterButtonColor('occupation')"
          @click="usersOccupationFilterButtonClicked"
        >
          <span :class="usersFilterTextColor('occupation')">{{ occupationFilterText }}</span>
        </v-btn>
        <v-card>
          <v-list>
            <!-- エンジニア -->
            <v-list-tile @click="engineerButtonClicked">
              <v-checkbox v-model="tempUsersEngineerFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">エンジニア</v-list-tile-title>
            </v-list-tile>
            <!-- デザイナー -->
            <v-list-tile @click="designerButtonClicked">
              <v-checkbox v-model="tempUsersDesignerFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">デザイナー</v-list-tile-title>
            </v-list-tile>
            <!-- 営業 -->
            <v-list-tile @click="salesButtonClicked">
              <v-checkbox v-model="tempUsersSalesFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">営業</v-list-tile-title>
            </v-list-tile>
            <!-- その他 -->
            <v-list-tile @click="othersButtonClicked">
              <v-checkbox v-model="tempUsersOthersFilter" readonly color="teal"></v-checkbox>
              <v-list-tile-title class="pl-3">その他</v-list-tile-title>
            </v-list-tile>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="occupationMenu = false">キャンセル</v-btn>
            <v-btn color="primary" flat @click="updateOccupationFilter">適用</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    // 職種
    occupationMenu: false,
    tempJobsEngineerFilter: false,
    tempJobsDesignerFilter: false,
    tempJobsSalesFilter: false,
    tempJobsOthersFilter: false,
    tempUsersEngineerFilter: false,
    tempUsersDesignerFilter: false,
    tempUsersSalesFilter: false,
    tempUsersOthersFilter: false,
    // 特徴
    featuresMenu: false,
    tempExperience: false,
    tempFunding: false,
    tempFounder20s: false,
    tempMedia: false,
    tempOverseas: false,
    tempFriend: false,
    tempWeekend: false,
    // 勤務日数
    workweekMenu: false,
    tempWorkweek: '指定なし',
  }),
  computed: {
    path() {
      return this.$route.path
    },
    jobsFilterButtonColor: function() {
      return function(filterType) {
        if (filterType == 'occupation') {
          return this.isJobsOccupationFilterActive ? '#00897B' : '#E0E0E0'
        } else if (filterType == 'features') {
          return this.isFeaturesFilterActive ? '#00897B' : '#E0E0E0'
        } else if (filterType == 'workweek') {
          return this.isWorkweekFilterActive ? '#00897B' : '#E0E0E0'
        }
      }
    },
    usersFilterButtonColor: function() {
      return function(filterType) {
        if (filterType == 'occupation') {
          return this.isUsersOccupationFilterActive ? '#00897B' : '#E0E0E0'
        }
      }
    },
    jobsFilterTextColor: function() {
      return function(filterType) {
        if (filterType == 'occupation') {
          return this.isJobsOccupationFilterActive ? 'white-text-color' : 'text-color'
        } else if (filterType == 'features') {
          return this.isFeaturesFilterActive ? 'white-text-color' : 'text-color'
        } else if (filterType == 'workweek') {
          return this.isWorkweekFilterActive ? 'white-text-color' : 'text-color'
        }
      }
    },
    usersFilterTextColor: function() {
      return function(filterType) {
        if (filterType == 'occupation') {
          return this.isUsersOccupationFilterActive ? 'white-text-color' : 'text-color'
        }
      }
    },
    occupationFilterText: function() {
      const occupationParams = this.$route.query.occupation
      if (Array.isArray(occupationParams) && occupationParams.length > 1) {
        return '職種・' + occupationParams.length
      }
      if ((Array.isArray(occupationParams) && occupationParams.length == 1) || typeof occupationParams == 'string') {
        let text
        switch (Array.isArray(occupationParams) ? occupationParams[0] : occupationParams) {
          case 'engineer':
            text = 'エンジニア'
            break
          case 'designer':
            text = 'デザイナー'
            break
          case 'sales':
            text = '営業'
            break
          case 'others':
            text = 'その他'
            break
        }
        return text
      }
      return '職種'
    },
    featuresFilterText: function() {
      const featuresParams = this.$route.query.features
      if (Array.isArray(featuresParams) && featuresParams.length > 1) {
        return '特徴・' + featuresParams.length
      }
      if ((Array.isArray(featuresParams) && featuresParams.length == 1) || typeof featuresParams == 'string') {
        let text
        switch (Array.isArray(featuresParams) ? featuresParams[0] : featuresParams) {
          case 'experience':
            text = '未経験歓迎'
            break
          case 'funding':
            text = '資金調達済み'
            break
          case 'founder20s':
            text = '創業者が20代'
            break
          case 'media':
            text = 'メディア掲載あり'
            break
          case 'friend':
            text = '友人と応募OK'
            break
          case 'overseas':
            text = '海外進出'
            break
          case 'weekend':
            text = '土日OK'
            break
        }
        return text
      }
      return '特徴'
    },
    workweekFilterText: function() {
      const workweek = this.$route.query.workweek
      if (workweek == null) {
        return '勤務日数'
      } else {
        return '週' + workweek + '日'
      }
    },
    isJobsOccupationFilterActive: function() {
      return (this.jobsEngineerFilter || this.jobsDesignerFilter || this.jobsSalesFilter || this.jobsOthersFilter)
    },
    isUsersOccupationFilterActive: function() {
      return (this.usersEngineerFilter || this.usersDesignerFilter || this.usersSalesFilter || this.usersOthersFilter)
    },
    isFeaturesFilterActive: function() {
      return (this.experience || this.funding || this.founder20s || this.media || this.friend || this.overseas)
    },
    isWorkweekFilterActive: function() {
      return this.workweek != null
    },
    ...mapState({
      jobsEngineerFilter: state => state.jobs.engineer,
      jobsDesignerFilter: state => state.jobs.designer,
      jobsSalesFilter: state => state.jobs.sales,
      jobsOthersFilter: state => state.jobs.others,
      usersEngineerFilter: state => state.users.engineer,
      usersDesignerFilter: state => state.users.designer,
      usersSalesFilter: state => state.users.sales,
      usersOthersFilter: state => state.users.others,
      experience: state => state.jobs.experience,
      funding: state => state.jobs.funding,
      founder20s: state => state.jobs.founder20s,
      media: state => state.jobs.media,
      friend: state => state.jobs.friend,
      overseas: state => state.jobs.overseas,
      weekend: state => state.jobs.weekend,
      workweek: state => state.jobs.workweek,
    })
  },
  methods: {
    jobsOccupationFilterButtonClicked: function() {
      this.tempJobsEngineerFilter = this.jobsEngineerFilter
      this.tempJobsDesignerFilter = this.jobsDesignerFilter
      this.tempJobsSalesFilter = this.jobsSalesFilter
      this.tempJobsOthersFilter = this.jobsOthersFilter
    },
    // users
    engineerButtonClicked: function() {
      this.tempUsersEngineerFilter = !this.tempUsersEngineerFilter
      this.tempUsersDesignerFilter = false
      this.tempUsersSalesFilter = false
      this.tempUsersOthersFilter = false
    },
    designerButtonClicked: function() {
      this.tempUsersEngineerFilter = false
      this.tempUsersDesignerFilter = !this.tempUsersDesignerFilter
      this.tempUsersSalesFilter = false
      this.tempUsersOthersFilter = false
    },
    salesButtonClicked: function() {
      this.tempUsersEngineerFilter = false
      this.tempUsersDesignerFilter = false
      this.tempUsersSalesFilter = !this.tempUsersSalesFilter
      this.tempUsersOthersFilter = false
    },
    othersButtonClicked: function() {
      this.tempUsersEngineerFilter = false
      this.tempUsersDesignerFilter = false
      this.tempUsersSalesFilter = false
      this.tempUsersOthersFilter = !this.tempUsersOthersFilter
    },
    usersOccupationFilterButtonClicked: function() {
      this.tempUsersEngineerFilter = this.usersEngineerFilter
      this.tempUsersDesignerFilter = this.usersDesignerFilter
      this.tempUsersSalesFilter = this.usersSalesFilter
      this.tempUsersOthersFilter = this.usersOthersFilter
    },
    featuresFilterButtonClicked: function() {
      this.tempExperience = this.experience
      this.tempFunding = this.funding
      this.tempFounder20s = this.founder20s
      this.tempMedia = this.media
      this.tempFriend = this.friend
      this.tempOverseas = this.overseas
      this.tempWeekend = this.weekend
    },
    workweekFilterButtonClicked: function() {
      if (this.workweek == null) {
        this.tempWorkweek = '指定なし'
      } else {
        this.tempWorkweek = Number(this.workweek)
      }
    },
    updateOccupationFilter: function() {
      this.occupationMenu = false

      const queryParams = []

      if (this.path.includes('/users')) {
        if (this.tempUsersEngineerFilter) {
          queryParams.push('engineer')
        }
        if (this.tempUsersDesignerFilter) {
          queryParams.push('designer')
        }
        if (this.tempUsersSalesFilter) {
          queryParams.push('sales')
        }
        if (this.tempUsersOthersFilter) {
          queryParams.push('others')
        }
        this.$router.replace({ path: '/users', query: { occupation: queryParams }})
      } else {
        if (this.tempJobsEngineerFilter) {
          queryParams.push('engineer')
        }
        if (this.tempJobsDesignerFilter) {
          queryParams.push('designer')
        }
        if (this.tempJobsSalesFilter) {
          queryParams.push('sales')
        }
        if (this.tempJobsOthersFilter) {
          queryParams.push('others')
        }
        this.$router.replace({
          path: '/',
          query: {
            occupation: queryParams,
            features: this.$route.query.features,
            workweek: this.$route.query.workweek,
            order: this.$route.query.order
          }
        })
      }
    },
    updateFeaturesFilter: function() {
      this.featuresMenu = false

      const queryParams = []
      if (this.tempExperience) {
        queryParams.push('experience')
      }
      if (this.tempFunding) {
        queryParams.push('funding')
      }
      if (this.tempFounder20s) {
        queryParams.push('founder20s')
      }
      if (this.tempMedia) {
        queryParams.push('media')
      }
      if (this.tempFriend) {
        queryParams.push('friend')
      }
      if (this.tempOverseas) {
        queryParams.push('overseas')
      }
      if (this.tempWeekend) {
        queryParams.push('weekend')
      }
      this.$router.replace({
        path: '/',
        query: {
          occupation: this.$route.query.occupation,
          features: queryParams,
          workweek: this.$route.query.workweek,
          order: this.$route.query.order
        }
      })
    },
    updateWorkweekFilter: function() {
      this.workweekMenu = false
      var query = {
        occupation: this.$route.query.occupation,
        features: this.$route.query.features,
        order: this.$route.query.order
      }

      if (this.tempWorkweek != '指定なし') {
        query.workweek = this.tempWorkweek
      }

      this.$router.replace({
        path: '/',
        query: query
      })
    }
  }
}
</script>
<style>
.filter .v-btn {
  border-radius: 10px;
}
.xs-filter .v-btn {
  min-width: 0;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 4px;
  margin-right: 4px;
  font-size: 12px;
}
</style>
