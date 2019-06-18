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
    <v-flex v-else-if="isLoading" xs12 :style="{ height: windowHeight + 'px' }">
      <v-layout align-center justify-center column fill-height>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex v-else-if="uid && uid != ''" xs12 class="py-3 break">
      <!-- Profile画像 & UserName -->
      <div class="align-center">
        <v-card flat>
          <v-card-actions
            class="break py-4"
            :class="{
              'px-5': $vuetify.breakpoint.smAndUp,
              'px-3': $vuetify.breakpoint.xsOnly,
            }"
          >
            <v-avatar
              :size="avatarSize"
              class="grey lighten-3 clickable"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar">
            </v-avatar>
            <span
              class="text-color font-weight-bold px-3 headline"
            >
              {{ companyName }}
            </span>
          </v-card-actions>
        </v-card>
      </div>
      <div :class="{'px-5': $vuetify.breakpoint.smAndUp}">
        <!-- 企業の請求一覧 -->
        <div class="pb-3">
          <v-btn
            outline
            color="teal"
            class="ma-0"
            :to="'/admin/companies/' + params.id + '/invoice'"
          >
            企業の請求一覧
          </v-btn>
        </div>
        <!-- 削除済み -->
        <div v-if="isDeleted" class="pt-4">
          <span class="orange--text font-weight-bold">削除済み</span>
        </div>
        <!-- email -->
        <div class="pt-4">
          <div>
            <span class="text-color font-weight-bold">
              email:
            </span>
            <span class="light-text-color pl-3">{{ email }}</span>
          </div>
          <div v-if="email != invoiceEmail">
            <span class="text-color font-weight-bold">
              invoiceEmail:
            </span>
            <span class="light-text-color pl-3">{{ invoiceEmail }}</span>
          </div>
        </div>
        <!-- プラン -->
        <div class="pt-4">
          <span class="text-color font-weight-bold pr-3">
            プラン:
          </span>
          <span v-if="plan == 0" class="teal--text font-weight-bold">採用報酬型</span>
          <span v-if="plan == 1" class="red--text font-weight-bold">アルファ</span>
          <span v-if="plan == 2" class="blue--text font-weight-bold">ベータ</span>
          <span v-else-if="plan == null" class="grey--text font-weight-bold">未契約</span>
          <v-btn
            v-show="!isEditingPlan"
            flat
            @click="editPlanButtonClicked"
          >
            <v-icon :size="14">edit</v-icon>
            <span class="caption teal-text-color">編集する</span>
          </v-btn>
          <div v-if="isEditingPlan" class="pt-3">
            <v-select
              v-model="tempPlan"
              :items="planItems"
              attach
              solo
            ></v-select>
            <v-btn
              @click="isEditingPlan = false"
            >
              キャンセル
            </v-btn>
            <v-btn
              :disabled="updatePlanButtonDisabled"
              @click="updatePlanButtonClicked"
            >
              更新
            </v-btn>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    avatarSize: 50,
    isEditingPlan: false,
    tempPlan: null,
  }),
  computed: {
    updatePlanButtonDisabled() {
      if (this.tempPlan == null) {
        return true
      }

      let currentPlan
      if (this.plan == null) {
        currentPlan = '未契約'
      } else if (this.plan == 0) {
        currentPlan = '採用報酬型'
      } else if (this.plan == 1) {
        currentPlan = 'アルファ'
      } else if (this.plan == 2) {
        currentPlan = 'ベータ'
      }

      if (currentPlan == this.tempPlan) {
        return true
      } else {
        return false
      }
    },
    planItems() {
      let items
      if (this.plan == null) {
        items = [
          '未契約',
          '採用報酬型',
          'アルファ',
          'ベータ'
        ]
      } else {
        items = [
          '採用報酬型',
          'アルファ',
          'ベータ',
          '解約'
        ]
      }
      return items
    },
    params() {
      return this.$route.params
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isAdmin: state => state.profile.isAdmin,
      isRefreshing: state => state.isRefreshing,
      isLoading: state => state.company.isLoading,
      plan: state => state.company.plan,
      isDeleted: state => state.company.isDeleted,
      imageUrl: state => state.company.imageUrl,
      companyId: state => state.company.companyId,
      companyName: state => state.company.companyName,
      email: state => state.company.email,
      invoiceEmail: state => state.company.invoiceEmail,
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

    if (this.isAdmin) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryCompanyFromAdmin(this.$route.params.id)
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    editPlanButtonClicked() {
      if (this.plan == null) {
        this.tempPlan = '未契約'
      } else if (this.plan == 0) {
        this.tempPlan = '採用報酬型'
      } else if (this.plan == 1) {
        this.tempPlan = 'アルファ'
      } else if (this.plan == 2) {
        this.tempPlan = 'ベータ'
      }
      this.isEditingPlan = true
    },
    updatePlanButtonClicked() {
      let tempPlan
      if (this.tempPlan == '採用報酬型') {
        tempPlan = 0
      } else if (this.tempPlan == 'アルファ') {
        tempPlan = 1
      } else if (this.tempPlan == 'ベータ') {
        tempPlan = 2
      } else if (this.tempPlan == '解約') {
        tempPlan = null
      }

      this.updatePlan({companyId: this.companyId, plan: tempPlan})
      this.isEditingPlan = false
    },
    ...mapActions({
      queryCompanyFromAdmin: 'company/queryCompanyFromAdmin',
      updateIsLoading: 'company/updateIsLoading',
      resetState: 'company/resetState',
      updatePlan: 'admin/updatePlan'
    }),
  }
}
</script>
