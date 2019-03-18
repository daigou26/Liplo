<template>
  <v-layout
    white
    row
    align-center
    wrap
    :style="{ height: windowHeight + 'px' }"
  >
    <v-flex
      xs12
      md10
      offset-md1
      class="break"
      style="height: 100%"
    >
      <v-layout
        row
        wrap
        style="height: 100%"
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
        <!-- messages (lg, md) -->
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
            <v-menu
              content-class="dropdown-menu"
              transition="slide-y-transition"
              class="pt-2 pb-4 hidden-md-and-up"
              style="width: 200px;"
            >
              <v-btn
                slot="activator"
                flat
                block
                style="border-bottom: 1px dashed; border-color: #E0E0E0;"
              >
                {{ dropdownText }}
                <v-icon>arrow_drop_down</v-icon>
              </v-btn>
              <v-card>
                <v-list dense>
                  <v-list-tile
                    v-for="item in mypageItems"
                    :key="item"
                    :class="{ 'teal lighten-5': path == '/user/' + item }"
                    :to="'./' + item"
                  >
                    <v-list-tile-title
                      v-text="item"
                    />
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-menu>
            <!-- timeline -->
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
                  <div class="title font-weight-bold mb-3">{{ item.companyName }}</div>
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
    dropdownText: '',
    mypageItems: [
      'pass',
      'career',
      'feedbacks',
      'reviews'
    ],
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
      user: state => state.user,
      career: state => state.career.career,
    }),
  },
  mounted() {
    this.dropdownText = this.path.slice(this.path.indexOf('user/') + 5)
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight

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
