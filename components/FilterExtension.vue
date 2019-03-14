<template>
  <div class="px-5">
    <!-- 職種 -->
    <v-menu
      v-model="occupationMenu"
      fixed
      offset-y
      :close-on-content-click="false"
    >
      <v-btn
        slot="activator"
        v-bind:outline="!isOccupationFilterActive"
        v-bind:depressed="isOccupationFilterActive"
        :color="filterButtonColor('occupation')"
        @click="occupationFilterButtonClicked"
      >
        <span :class="filterTextColor('occupation')">{{ occupationFilterText }}</span>
      </v-btn>
      <v-card>
        <v-list>
          <!-- エンジニア -->
          <v-list-tile @click="tempEngineer=!tempEngineer">
            <v-checkbox v-model="tempEngineer" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">エンジニア</v-list-tile-title>
          </v-list-tile>
          <!-- デザイナー -->
          <v-list-tile @click="tempDesigner=!tempDesigner">
            <v-checkbox v-model="tempDesigner" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">デザイナー</v-list-tile-title>
          </v-list-tile>
          <!-- 営業 -->
          <v-list-tile @click="tempSales=!tempSales">
            <v-checkbox v-model="tempSales" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">営業</v-list-tile-title>
          </v-list-tile>
          <!-- その他 -->
          <v-list-tile @click="tempOthers=!tempOthers">
            <v-checkbox v-model="tempOthers" readonly></v-checkbox>
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
    >
      <v-btn
        slot="activator"
        v-bind:outline="!isFeaturesFilterActive"
        v-bind:depressed="isFeaturesFilterActive"
        :color="filterButtonColor('features')"
        @click="featuresFilterButtonClicked"
      >
        <span :class="filterTextColor('features')">{{ featuresFilterText }}</span>
      </v-btn>
      <v-card>
        <v-list>
          <!-- 未経験ok -->
          <v-list-tile @click="tempExperience=!tempExperience">
            <v-checkbox v-model="tempExperience" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">未経験歓迎</v-list-tile-title>
          </v-list-tile>
          <!-- 資金調達あり -->
          <v-list-tile @click="tempFunding=!tempFunding">
            <v-checkbox v-model="tempFunding" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">資金調達をしている</v-list-tile-title>
          </v-list-tile>
          <!-- 創業者20代 -->
          <v-list-tile @click="tempFounder20s=!tempFounder20s">
            <v-checkbox v-model="tempFounder20s" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">創業者が20代</v-list-tile-title>
          </v-list-tile>
          <!-- メディア掲載 -->
          <v-list-tile @click="tempMedia=!tempMedia">
            <v-checkbox v-model="tempMedia" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">メディアに掲載されたことがある</v-list-tile-title>
          </v-list-tile>
          <!-- 友人と応募ok -->
          <v-list-tile @click="tempFriend=!tempFriend">
            <v-checkbox v-model="tempFriend" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">友人と応募OK</v-list-tile-title>
          </v-list-tile>
          <!-- 海外進出 -->
          <v-list-tile @click="tempOverseas=!tempOverseas">
            <v-checkbox v-model="tempOverseas" readonly></v-checkbox>
            <v-list-tile-title class="pl-3">海外進出している</v-list-tile-title>
          </v-list-tile>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="featuresMenu = false">キャンセル</v-btn>
          <v-btn color="primary" flat @click="updateFeaturesFilter">適用</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    // 職種
    occupationMenu: false,
    tempEngineer: false,
    tempDesigner: false,
    tempSales: false,
    tempOthers: false,
    // 特徴
    featuresMenu: false,
    tempExperience: false,
    tempFunding: false,
    tempFounder20s: false,
    tempMedia: false,
    tempFriend: false,
    tempOverseas: false
  }),
  computed: {
    filterButtonColor: function() {
      return function(filterType) {
        if (filterType == 'occupation') {
          return this.isOccupationFilterActive ? '#00897B' : '#E0E0E0'
        } else if (filterType == 'features') {
          return this.isFeaturesFilterActive ? '#00897B' : '#E0E0E0'
        }
      }
    },
    filterTextColor: function() {
      return function(filterType) {
        if (filterType == 'occupation') {
          return this.isOccupationFilterActive ? 'whiteTextColor' : 'textColor'
        } else if (filterType == 'features') {
          return this.isFeaturesFilterActive ? 'whiteTextColor' : 'textColor'
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
        }
        return text
      }
      return '特徴'
    },
    isOccupationFilterActive: function() {
      return (this.engineer || this.designer || this.sales || this.others)
    },
    isFeaturesFilterActive: function() {
      return (this.experience || this.funding || this.founder20s || this.media || this.friend || this.overseas)
    },
    ...mapState({
      engineer: state => state.jobs.engineer,
      designer: state => state.jobs.designer,
      sales: state => state.jobs.sales,
      others: state => state.jobs.others,
      experience: state => state.jobs.experience,
      funding: state => state.jobs.funding,
      founder20s: state => state.jobs.founder20s,
      media: state => state.jobs.media,
      friend: state => state.jobs.friend,
      overseas: state => state.jobs.overseas,
    })
  },
  methods: {
    occupationFilterButtonClicked: function() {
      this.tempEngineer = this.engineer
      this.tempDesigner = this.designer
      this.tempSales = this.sales
      this.tempOthers = this.others
    },
    featuresFilterButtonClicked: function() {
      this.tempExperience = this.experience
      this.tempFunding = this.funding
      this.tempFounder20s = this.founder20s
      this.tempMedia = this.media
      this.tempFriend = this.friend
      this.tempOverseas = this.overseas
    },
    updateOccupationFilter: function() {
      this.occupationMenu = false

      const queryParams = []
      if (this.tempEngineer) {
        queryParams.push('engineer')
      }
      if (this.tempDesigner) {
        queryParams.push('designer')
      }
      if (this.tempSales) {
        queryParams.push('sales')
      }
      if (this.tempOthers) {
        queryParams.push('others')
      }
      this.$router.replace({ path: '/', query: { occupation: queryParams, features: this.$route.query.features }})
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
      this.$router.replace({ path: '/', query: { occupation: this.$route.query.occupation, features: queryParams }})
    }
  }
}
</script>
