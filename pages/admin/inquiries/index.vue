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
      <!-- 問い合わせ一覧 -->
      <div class="pt-3">
        <v-data-table
          :headers="headers"
          :items="inquiries"
          class="elevation-1"
          hide-actions
          no-data-text="問い合わせがありません"
        >
          <template v-slot:items="props">
            <n-link class="clickable" tag="tr" :to="'/admin/inquiries/' + props.item.inquiryId">
              <td style="min-width: 150px">{{ props.item.name }}</td>
              <td style="min-width: 150px">{{ props.item.email }}</td>
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
      title: 'お問い合わせ一覧',
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
          text: '名前',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'email',
          align: 'left',
          sortable: false,
          value: 'email'
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
      inquiries: state => state.inquiries.inquiries,
      isInitialLoading: state => state.inquiries.isInitialLoading,
      isLoading: state => state.inquiries.isLoading,
      allInquiriesQueried: state => state.inquiries.allInquiriesQueried,
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
      queryInquiries: 'inquiries/queryInquiries',
      updateIsInitialLoading: 'inquiries/updateIsInitialLoading',
      updateIsLoading: 'inquiries/updateIsLoading',
      resetState: 'inquiries/resetState',
    }),
  }
}
</script>
