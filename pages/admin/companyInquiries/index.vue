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
      <!-- 企業問い合わせ一覧 -->
      <div class="pt-3">
        <v-data-table
          :headers="headers"
          :items="inquiries"
          class="elevation-1"
          hide-actions
          no-data-text="問い合わせがありません"
        >
          <template v-slot:items="props">
            <n-link class="clickable" tag="tr" :to="'/admin/companyInquiries/' + props.item.inquiryId">
              <td style="min-width: 150px">{{ props.item.companyName }}</td>
              <td style="min-width: 150px">
                <span v-if="props.item.type == 0" class="teal--text font-weight-bold">資料請求</span>
                <span v-else-if="props.item.type == 1" class="green--text font-weight-bold">質問がしたい</span>
                <span v-else-if="props.item.type == 2" class="orange--text font-weight-bold">すぐに導入したい</span>
              </td>
              <td class="text-xs-left" style="min-width: 150px">{{ props.item.timestamp }}</td>
            </n-link>
          </template>
        </v-data-table>
        <infinite-loading
          v-if="showInfiniteLoading && inquiries && inquiries.length >= 20 && !isLoading"
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
      title: '企業お問い合わせ',
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
      searchText: '',
      showInfiniteLoading: false,
      headers: [
        {
          text: '企業名',
          align: 'left',
          sortable: false,
          value: 'companyName'
        },
        {
          text: 'Type',
          align: 'left',
          sortable: false,
          value: 'type'
        },
        {
          text: 'Date',
          align: 'left',
          sortable: false,
          value: 'timestamp'
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
      inquiries: state => state.companyInquiries.inquiries,
      isInitialLoading: state => state.companyInquiries.isInitialLoading,
      isLoading: state => state.companyInquiries.isLoading,
      allInquiriesQueried: state => state.companyInquiries.allInquiriesQueried,
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
      this.queryInquiries()
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    searchButtonClicked() {
      this.resetState()
      this.updateIsLoading(true)
      this.searchInquiries(this.searchText)
    },
    infiniteHandler($state) {
      if (!this.allInquiriesQueried) {
        if (!this.isLoading) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryInquiries()
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
      queryInquiries: 'companyInquiries/queryInquiries',
      searchInquiries: 'companyInquiries/searchInquiries',
      updateIsInitialLoading: 'companyInquiries/updateIsInitialLoading',
      updateIsLoading: 'companyInquiries/updateIsLoading',
      resetState: 'companyInquiries/resetState',
    }),
  }
}
</script>
