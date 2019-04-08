<template>
  <v-layout
    white
    row
    wrap
  >
    <v-flex
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md)-->
        <v-flex
          md4
          hidden-sm-and-down
          :class="{
            'pa-5': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <my-page-menu/>
        </v-flex>
        <!-- career timeline (lg, md) -->
        <v-flex
          md8
          xs12
          :class="{
            'px-5 pb-3': $vuetify.breakpoint.lgAndUp,
            'px-3 pb-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex sm6 xs8 offset-sm3 offset-xs2>
            <!-- menu (sm, xs) -->
            <my-page-menu class="hidden-md-and-up"/>
            <!-- career timeline -->
            <v-timeline dense>
              <v-timeline-item
                v-for="item in career"
                :key="item.jobId"
                large
                class="py-4"
              >
                <template v-slot:icon>
                  <v-avatar>
                    <v-img :src="item.companyImageUrl"/>
                  </v-avatar>
                </template>
                <div class="py-3">
                  <div class="mb-1">{{ item.startedAt }}</div>
                  <div class="title font-weight-bold mb-3 return">{{ item.companyName }}</div>
                  <div>{{ item.occupation }}</div>
                  <div v-if="item.end">期間: {{ item.duration }}ヶ月</div>
                  <div v-else>勤務中</div>
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
    mypageItems: [
      'passes',
      'career',
      'feedbacks',
      'reviews'
    ],
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
      career: state => state.career.career,
    }),
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.queryCareer(user.uid)
      }
    })
  },
  methods: {
    ...mapActions({
      queryCareer: 'career/queryCareer',
    }),
  }
}
</script>
