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
      <!-- 請求一覧 -->
      <div>
        <v-data-table
          :headers="headers"
          :items="paidActions"
          class="elevation-1"
          hide-actions
          no-data-text="データがありません"
        >
          <template v-slot:items="props">
            <n-link class="clickable" tag="tr" :to="'/admin/paidActions/' + props.item.paidActionId">
              <td class="py-1">
                <v-avatar
                  size="50"
                  class="grey lighten-3"
                >
                  <v-img
                    v-if="props.item.companyImageUrl"
                    :src="props.item.companyImageUrl"
                  />
                </v-avatar>
              </td>
              <td style="min-width: 150px">{{ props.item.companyName }}</td>
              <td style="min-width: 150px">
                <span v-if="props.item.type == 'intern'" class="green--text text--lighten-1 font-weight-bold">インターン</span>
                <span v-else-if="props.item.type == 'hired'" class="pink--text text--lighten-2 font-weight-bold">本採用</span>
              </td>
              <td style="min-width: 150px">
                <v-icon v-if="props.item.isFree" color="green">check</v-icon>
                <v-icon v-else>remove</v-icon>
              </td>
              <td style="min-width: 150px">
                <span v-if="props.item.plan == 0" class="teal--text font-weight-bold">採用報酬型</span>
                <span v-if="props.item.plan == 1" class="red--text font-weight-bold">アルファ</span>
                <span v-if="props.item.plan == 2" class="blue--text font-weight-bold">ベータ</span>
              </td>
              <td class="text-xs-left" style="min-width: 150px">{{ props.item.timestamp }}</td>
            </n-link>
          </template>
        </v-data-table>
        <infinite-loading
          v-if="showInfiniteLoading && paidActions && paidActions.length >= 20 && !isLoading"
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
  data() {
    return {
      isQueried: false,
      windowHeight: 0,
      showChart: false,
      showInfiniteLoading: false,
      headers: [
        {
          sortable: false,
          value: 'companyImageUrl',
          width: '100'
        },
        {
          text: '企業名',
          align: 'left',
          sortable: false,
          value: 'companyName'
        },
        {
          text: 'type',
          align: 'left',
          sortable: false,
          value: 'type'
        },
        {
          text: 'free',
          align: 'left',
          sortable: false,
          value: 'free'
        },
        {
          text: 'plan',
          align: 'left',
          sortable: false,
          value: 'plan'
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
      paidActions: state => state.paidActions.paidActions,
      isInitialLoading: state => state.paidActions.isInitialLoading,
      isLoading: state => state.paidActions.isLoading,
      allPaidActionsQueried: state => state.paidActions.allPaidActionsQueried,
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
    this.showChart = true

    if (this.isAdmin) {
      this.resetState()
      this.updateIsInitialLoading(true)
      this.updateIsLoading(true)
      this.queryPaidActions()
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allPaidActionsQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryPaidActions()
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
      queryPaidActions: 'paidActions/queryPaidActions',
      updateIsInitialLoading: 'paidActions/updateIsInitialLoading',
      updateIsLoading: 'paidActions/updateIsLoading',
      resetState: 'paidActions/resetState',
    }),
  }
}
</script>
