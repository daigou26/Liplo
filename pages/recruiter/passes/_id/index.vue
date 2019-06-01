<template>
  <v-layout
    white
    column
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
    <v-flex v-else-if="uid" xs12>
      <div class="text-color title pa-3 font-weight-bold">
        <span v-if="paramsId != 'hiring'">{{ paramsId }}年度 </span>
        <span v-if="!passType && paramsId == 'hiring'">入社パス（未使用）</span>
        <span v-else-if="passType == 'hiring'">入社パス</span>
        <span v-else-if="passType == 'offer'">内定パス</span>
        <span v-else-if="passType == 'limited'">先着パス</span>
      </div>
      <div class="text-xs-right light-text-color caption">
        <v-tooltip bottom max-width="300">
          <template v-slot:activator="{ on }">
            <span class="px-2" v-on="on">
              <v-icon class="mr-1" style="font-size: 16px; color: #BDBDBD">info</v-icon>
              <span  class="text-xs-right light-text-color caption">ハイライトされている候補者</span>
            </span>
          </template>
          <span>パスが使用されていて、契約がまだ済んでいない候補者はハイライトされます。
            契約が済みましたら、候補者のステータスを入社予定に変更してください。</span>
        </v-tooltip>
      </div>
      <v-data-table
        id="candidates"
        :headers="headers"
        :items="passes"
        :pagination.sync="pagination"
        class="elevation-1 mt-2"
        hide-actions
        no-data-text="候補者がいません。"
        style="background-color: #445544"
      >
        <template v-slot:items="props">
          <n-link
            class="clickable"
            :class="{'highlight-row': !props.item.isContracted && props.item.isAccepted}"
            tag="tr"
            :to="'/recruiter/candidates/' + props.item.candidateId"
          >
            <td class="py-1">
              <v-avatar
                size="50"
                class="grey lighten-3"
              >
                <v-img
                  v-if="props.item.profileImageUrl"
                  :src="props.item.profileImageUrl"
                />
                <v-icon v-else :size="50">person</v-icon>
              </v-avatar>
            </td>
            <td style="min-width: 150px">{{ props.item.userName }}</td>
            <td style="min-width: 150px">{{ props.item.occupation }}</td>
            <td style="min-width: 150px">
              <v-icon v-if="props.item.isAccepted" color="green">check</v-icon>
              <v-icon v-else>remove</v-icon>
            </td>
            <td style="min-width: 150px">
              <v-icon v-if="props.item.isContracted" color="green">check</v-icon>
              <v-icon v-else>remove</v-icon>
            </td>
            <td class="text-xs-left">
              <span v-if="props.item.acceptedDate">{{ props.item.acceptedDate }}</span>
              <v-icon v-else>remove</v-icon>
            </td>
          </n-link>
        </template>
      </v-data-table>
      <infinite-loading
        v-if="showInfiniteLoading && passes && passes.length >= 20 && !isLoading"
        :distance="50"
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
  data() {
    return {
      count: 0,
      windowHeight: 0,
      showInfiniteLoading: false,
      isQueried: false,
      headers: [
        {
          sortable: false,
          value: 'imageUrl',
          width: '100'
        },
        {
          text: '氏名',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: '職種', value: 'occupation', sortable: false },
        { text: '使用済みか', value: 'isAccepted', sortable: false },
        { text: '契約済みか', value: 'isContracted', sortable: false},
        { text: '使用日', value: 'acceptedDate' },
      ],
      pagination: {
        sortBy: 'acceptedDate',
        descending: true,
      },
    }
  },
  computed: {
    paramsId() {
      return this.$route.params.id
    },
    passType() {
      return this.$route.query.passType
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      companyId: state => state.profile.companyId,
      passes: state => state.companyPasses.passes,
      isInitialLoading: state => state.companyPasses.isInitialLoading,
      isLoading: state => state.companyPasses.isLoading,
      allPassesQueried: state => state.companyPasses.allPassesQueried,
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

    if (this.companyId != null && !this.isQueried) {
      if (this.$route.query.passType && this.$route.params.id) {
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryPasses({
          companyId: this.companyId,
          type: this.$route.query.passType,
          year: Number(this.paramsId)
        })
      } else if (this.$route.query.passType == null && this.$route.params.id == 'hiring') {
        this.resetState()
        this.updateIsInitialLoading(true)
        this.updateIsLoading(true)
        this.queryPasses({
          companyId: this.companyId,
          type: 'hiring',
          year: null
        })
      } else {
        this.$nuxt.error({ statusCode: 404, message: 'not found' })
      }
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        if (this.$route.query.passType && this.$route.params.id) {
          this.resetState()
          this.isQueried = true
          this.updateIsInitialLoading(true)
          this.updateIsLoading(true)
          this.queryPasses({
            companyId: companyId,
            type: this.$route.query.passType,
            year: Number(this.paramsId)
          })
        } else if (this.$route.query.passType == null && this.$route.params.id == 'hiring') {
          this.resetState()
          this.updateIsInitialLoading(true)
          this.updateIsLoading(true)
          this.queryPasses({
            companyId: companyId,
            type: 'hiring',
            year: null
          })
        } else {
          this.$nuxt.error({ statusCode: 404, message: 'not found' })
        }
      }
    }
  },
  methods: {
    infiniteHandler($state) {
      if (!this.allPassesQueried) {
        if (!this.isLoading && this.companyId != null) {
          this.count += 1
          this.updateIsLoading(true)
          this.queryPasses(this.companyId)
          if (this.count > 50) {
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
      queryPasses: 'companyPasses/queryPasses',
      updateIsInitialLoading: 'companyPasses/updateIsInitialLoading',
      updateIsLoading: 'companyPasses/updateIsLoading',
      resetState: 'companyPasses/resetState',
    }),
  }
}
</script>

<style>
.highlight-row {
  background-color: #FFF8E1;
}
</style>
