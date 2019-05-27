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
    <v-flex v-else-if="uid" xs12 class="py-3 break">
      <!-- Profile画像 & UserName -->
      <div class="py-4 align-center">
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
              class="textColor font-weight-bold px-3 headline"
            >
              {{ companyName }}
            </span>
          </v-card-actions>
        </v-card>
      </div>
      <div :class="{'px-5': $vuetify.breakpoint.smAndUp}">
        <!-- 削除済み -->
        <div v-if="isDeleted">
          <span class="orange--text font-weight-bold">削除済み</span>
        </div>
        <!-- email -->
        <div class="pt-4">
          <div>
            <span class="textColor font-weight-bold">
              email:
            </span>
            <span class="light-text-color pl-3">{{ email }}</span>
          </div>
          <div v-if="email != invoiceEmail">
            <span class="textColor font-weight-bold">
              invoiceEmail:
            </span>
            <span class="light-text-color pl-3">{{ invoiceEmail }}</span>
          </div>
        </div>
        <!-- プラン -->
        <div class="pt-4">
          <span class="textColor font-weight-bold pr-3">
            プラン:
          </span>
          <span v-if="plan == 0" class="teal--text font-weight-bold">成功報酬</span>
          <span v-else-if="plan == null" class="grey--text font-weight-bold">未契約</span>
          <div class="text-xs-right">
            <v-btn v-if="plan != null" @click="updatePlan({companyId: companyId, plan: null})">終了</v-btn>
            <v-btn v-else @click="updatePlan({companyId: companyId, plan: 0})">再開</v-btn>
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
    selectedImageSize: 200,
    selectedImage: null,
    imageFile: null,
    tempFirstName: '',
    tempLastName: '',
    firstNameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    editPositionValid: true,
  }),
  computed: {
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
    ...mapActions({
      queryCompanyFromAdmin: 'company/queryCompanyFromAdmin',
      updateIsLoading: 'company/updateIsLoading',
      resetState: 'company/resetState',
      updatePlan: 'admin/updatePlan'
    }),
  }
}
</script>
