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
      <div :class="{'px-5': $vuetify.breakpoint.smAndUp}">
        <div class="pt-3 text-color">
          {{ timestamp }}
        </div>
        <div class="pt-4">
          <div>
            <span class="text-color font-weight-bold">
              名前:
            </span>
            <span class="light-text-color pl-3">{{ name }}</span>
          </div>
          <div>
            <span class="text-color font-weight-bold">
              メールアドレス:
            </span>
            <span class="light-text-color pl-3">{{ email }}</span>
          </div>
        </div>
        <!-- 問い合わせ -->
        <div class="pt-4">
          <div v-if="content" class="font-weight-bold text-color">問い合わせ内容：</div>
          <div v-if="content" class="return light-text-color">{{ content }}</div>
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
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isAdmin: state => state.profile.isAdmin,
      isRefreshing: state => state.isRefreshing,
      isLoading: state => state.inquiry.isLoading,
      name: state => state.inquiry.name,
      email: state => state.inquiry.email,
      content: state => state.inquiry.content,
      timestamp: state => state.inquiry.timestamp,
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
      this.queryInquiry(this.$route.params.id)
    } else {
      // 管理者出ない場合は rootへ
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions({
      queryInquiry: 'inquiry/queryInquiry',
      updateIsLoading: 'inquiry/updateIsLoading',
      resetState: 'inquiry/resetState',
    }),
  }
}
</script>
