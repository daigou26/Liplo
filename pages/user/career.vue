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
      v-else
      xs12
      md10
      offset-md1
      class="break"
      :class="{
        'px-4': $vuetify.breakpoint.smOnly,
      }"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md, sm)-->
        <v-flex
          md4
          sm3
          hidden-xsOnly
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <my-page-menu/>
        </v-flex>
        <!-- career -->
        <v-flex
          md8
          sm9
          xs12
          class="py-3"
          :class="{
            'px-3': $vuetify.breakpoint.mdAndUp,
            'py-4': $vuetify.breakpoint.smAndUp,
          }"
        >
          <v-flex sm6 xs8 offset-sm3 offset-xs2>
            <!-- career timeline -->
            <v-timeline dense>
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
                <div class="py-3 textColor">
                  <div class="mb-1 light-text-color">{{ item.startedAt }}</div>
                  <div class="title font-weight-bold mb-3 return">{{ item.companyName }}</div>
                  <div class="pb-1">職種:　{{ item.occupation }}</div>
                  <div v-if="!item.end">
                    勤務中
                  </div>
                  <div v-else-if="item.isInternExtended">
                    <div v-if="item.extendedInternEnd">
                      終了日:　{{ item.endedAt }}
                    </div>
                    <div v-else>
                      インターン延長中
                    </div>
                  </div>
                  <div v-else>
                    終了日:　{{ item.endedAt }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { auth } from '@/plugins/firebase'
import MyPageMenu from '~/components/MyPageMenu'

export default {
  components: {
    MyPageMenu
  },
  data: () => ({
    isQueried: false,
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
    if (this.uid != null && this.uid != '' && !this.isQueried) {
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
        this.updateIsLoading(true)
        this.queryCareer(uid)
      }
    }
  },
  methods: {
    ...mapActions({
      queryCareer: 'career/queryCareer',
      updateIsLoading: 'career/updateIsLoading',
    }),
  }
}
</script>
