<template>
  <v-layout
    white
    row
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
    <v-flex
      v-else-if="uid && uid != ''"
      xs12
      md10
      offset-md1
      class="break"
      :class="{
        'px-4': $vuetify.breakpoint.smAndDown,
      }"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md, sm)-->
        <my-page-menu/>
        <!-- career -->
        <v-flex
          xs12
          class="py-3"
          :class="{
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex
            sm10
            xs12
            offset-sm1
            class="text-xs-center"
            :class="{
              'pl-4': $vuetify.breakpoint.smAndUp,
            }"
          >
            <div class="text-xs-left light-text-color pb-5">
              キャリアは、このサービスを通して行ったインターンや入社した企業が表示されます。
              <div>
                企業の方に公開されるため、仕事内容などを出来るだけ詳しく入力しましょう。
                （雇用契約に機密保持の項目がある場合は、注意してお書きください）
              </div>
            </div>
            <!-- career timeline -->
            <v-timeline v-if="career && career.length > 0" dense>
              <v-timeline-item
                v-for="item in career"
                :key="item.careerId"
                large
                class="py-4"
              >
                <template v-slot:icon>
                  <v-avatar>
                    <v-img :src="item.companyImageUrl"/>
                  </v-avatar>
                </template>
                <div class="text-xs-right">
                  <v-btn flat small :to="'/user/career/' + item.careerId + '/edit'">
                    <span class="caption teal-text-color">編集する</span>
                  </v-btn>
                </div>
                <v-card
                  class="py-3 text-color text-xs-left"
                  :class="{
                    'px-4': $vuetify.breakpoint.smAndUp,
                    'px-3': $vuetify.breakpoint.xsOnly,
                  }"
                >
                  <div class="mb-2">
                    <span
                      v-if="item.type == 'intern'"
                      class="font-weight-bold caption teal--text"
                    >
                      インターン
                    </span>
                    <span
                      v-if="item.type == 'hired'"
                      class="font-weight-bold caption pink--text"
                    >
                      入社
                    </span>
                  </div>
                  <div class="mb-1 light-text-color">
                    {{ item.startedAt }} ~ 
                    <span
                      v-if="
                        item.end &&
                        ((item.isInternExtended && item.extendedInternEnd) || !item.isInternExtended)
                      ">{{ item.endedAt }}</span>
                  </div>
                  <div class="title font-weight-bold mb-3">{{ item.companyName }}</div>
                  <div class="pb-1">
                    職種:
                    <span class="text-color">{{ item.occupation }}</span>
                  </div>
                  <div v-if="!item.end" class="text-color">
                    勤務中
                  </div>
                  <div v-else-if="item.isInternExtended">
                    <div v-if="!item.extendedInternEnd" class="text-color">
                      インターン延長中
                    </div>
                  </div>
                  <div v-if="item.jobDescription" class="pt-3">
                    仕事内容:
                    <div class="text-color">
                      {{ item.jobDescription }}
                    </div>
                  </div>
                </v-card>
              </v-timeline-item>
            </v-timeline>
            <v-card
              v-else
              class="px-3 py-4"
              :class="{
                'mx-3': $vuetify.breakpoint.xsOnly,
                'mt-4': $vuetify.breakpoint.mdAndUp,
                'mt-3': $vuetify.breakpoint.smAndDown,
              }"
            >
              <div class="text-xs-center">
                <div
                  class="text-color"
                  :class="{
                    'title': $vuetify.breakpoint.xsOnly,
                    'headline': $vuetify.breakpoint.smAndUp,
                  }"
                >
                  キャリアがありません
                </div>
                <div class="pt-3 light-text-color">
                  企業に採用された場合はこちらに表示されます
                </div>
                <v-btn class="mt-3 font-weight-bold" color="warning" to="/">募集を探す</v-btn>
              </div>
            </v-card>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MyPageMenu from '~/components/MyPageMenu'

export default {
  middleware: 'auth',
  components: {
    MyPageMenu
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
  }),
  computed: {
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      career: state => state.career.career,
      isLoading: state => state.career.isLoading,
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

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryCareer(this.uid)
    }
  },
  destroyed () {
    this.updateIsLoading(false)
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryCareer(uid)
      }
    }
  },
  methods: {
    ...mapActions({
      queryCareer: 'career/queryCareer',
      updateIsLoading: 'career/updateIsLoading',
      resetState: 'career/resetState',
    }),
  }
}
</script>
