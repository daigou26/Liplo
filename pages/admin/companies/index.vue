<template>
  <v-layout
    row
    white
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
      class="break"
    >
      <!-- 新規作成 -->
      <div class="pr-3 pt-3 text-xs-right">
        <v-btn to="/admin/companies/new">新規作成</v-btn>
      </div>
      <!-- 検索 -->
      <div class="pl-3">
        <v-layout row wrap>
          <v-flex xs10 sm4>
            <v-text-field
              v-model="searchText"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-flex>
          <v-btn flat icon color="blue" class="mt-3" @click="searchButtonClicked">
            <v-icon>search</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <!-- 企業一覧 -->
      <div class="pt-3">
        <v-data-table
          :headers="headers"
          :items="companies"
          class="elevation-1"
          hide-actions
          no-data-text="企業がありません"
        >
          <template v-slot:items="props">
            <n-link class="clickable" tag="tr" :to="'/admin/companies/' + props.item.companyId">
              <td class="py-1">
                <v-avatar
                  size="50"
                  class="grey lighten-3"
                >
                  <v-img
                    v-if="props.item.imageUrl"
                    :src="props.item.imageUrl"
                  />
                  <v-icon v-else :size="50">person</v-icon>
                </v-avatar>
              </td>
              <td style="min-width: 150px">{{ props.item.companyName }}</td>
              <td style="min-width: 150px">
                <span v-if="props.item.isDeleted" class="orange--text font-weight-bold">削除済み</span>
                <span v-else-if="props.item.plan == 0" class="teal--text font-weight-bold">採用報酬型</span>
                <span v-else-if="props.item.plan == 1" class="red--text font-weight-bold">アルファ</span>
                <span v-else-if="props.item.plan == 2" class="blue--text font-weight-bold">ベータ</span>
                <span v-else-if="props.item.plan == null" class="grey--text font-weight-bold">未契約</span>
              </td>
            </n-link>
          </template>
        </v-data-table>
        <infinite-loading
          v-if="showInfiniteLoading && companies && companies.length >= 20 && !isLoading"
          :distance="50"
          spinner="waveDots"
          @infinite="infiniteHandler">
          <div slot="no-results"></div>
        </infinite-loading>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  middleware: 'auth',
  head () {
    return {
      title: '企業一覧',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data() {
    return {
      isQueried: false,
      count: 0,
      windowHeight: 0,
      showInfiniteLoading: false,
      searchText: '',
      headers: [
        {
          sortable: false,
          value: 'imageUrl',
          width: '100'
        },
        {
          text: '企業名',
          align: 'left',
          sortable: false,
          value: 'companyName'
        },
        {
          text: 'ステータス',
          align: 'left',
          sortable: false,
          value: 'status'
        },
      ],
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      isAdmin: state => state.profile.isAdmin,
      companies: state => state.companies.companies,
      isInitialLoading: state => state.companies.isInitialLoading,
      isLoading: state => state.companies.isLoading,
      allCompaniesQueried: state => state.companies.allCompaniesQueried,
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

    if (this.isAdmin) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryCompanies()
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    searchButtonClicked() {
      this.resetState()
      this.updateIsLoading(true)
      this.searchCompanies(this.searchText)
    },
    infiniteHandler($state) {
      if (!this.allCompaniesQueried) {
        if (!this.isLoading) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryCompanies()
        }
        if (this.count > 50) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } else {
        $state.complete()
      }
    },
    ...mapActions({
      queryCompanies: 'companies/queryCompanies',
      searchCompanies: 'companies/searchCompanies',
      updateIsInitialLoading: 'companies/updateIsInitialLoading',
      updateIsLoading: 'companies/updateIsLoading',
      resetState: 'companies/resetState',
    }),
  }
}
</script>
