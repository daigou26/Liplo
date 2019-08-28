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
      <!-- snackbar -->
      <v-snackbar
        v-model="snackbar"
        color="teal lighten-1"
        :multi-line="true"
        :timeout="6000"
        :left="true"
        :bottom="true"
      >
        {{ snackbarText }}
        <v-btn
          color="white"
          flat
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
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
        <div
          :class="{
            'px-5 py-2': $vuetify.breakpoint.mdAndUp,
          }"
        >
          <v-card v-if="companyId" flat :to="'/companies/' + companyId">
            <v-card-actions class="px-0 mb-4">
              <v-list-tile-avatar color="grey darken-3">
                <v-img
                  :src="companyImageUrl"
                ></v-img>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="text-color font-weight-bold return">{{ companyName }}</v-list-tile-title>
              </v-list-tile-content>
            </v-card-actions>
          </v-card>
          <v-form v-model="valid" @submit.prevent="">
            <div class="pt-3">
              <span class="font-weight-bold text-color">職種</span>
              <p v-if="occupation" class="light-text-color body-text return">{{ occupation }}</p>
            </div>
            <div class="py-3">
              <span class="font-weight-bold text-color">開始時期</span>
              <p v-if="startedAt" class="light-text-color body-text return">{{ startedAt }}</p>
            </div>
            <div class="py-3">
              <span class="font-weight-bold text-color">終了時期</span>
              <v-menu
                v-model="endedAtMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="tempEndedAt"
                    append-icon="event"
                    solo
                    class="mt-2"
                    readonly
                    required
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="tempEndedAt"
                  color="teal"
                  locale="ja"
                  @input="endedAtMenu = false"
                ></v-date-picker>
              </v-menu>
              <p v-if="!end" class="light-text-color caption">
                インターンが終了しているのに、まだ終了したことになっていない場合は、
                終了時期を入力して更新してください。
              </p>
            </div>
            <div class="py-3">
              <span class="font-weight-bold text-color">仕事内容</span>
              <v-textarea
                v-model="tempJobDescription"
                solo
                class="mt-2"
                :rules="jobDescriptionRules"
                required
              ></v-textarea>
            </div>
            <div class="text-xs-right">
              <v-btn
                :disabled="!valid"
                @click="updateButtonClicked"
              >
                更新
              </v-btn>
            </div>
          </v-form>
        </div>
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
  head () {
    return {
      title: 'キャリア編集',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    snackbar: false,
    snackbarText: '',
    valid: true,
    endedAtMenu: false,
    tempEndedAt: '',
    tempJobDescription: '',
    jobDescriptionRules: [
      v => (v.length <= 1000) || '1000字以内で入力してください'
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
      isRefreshing: state => state.isRefreshing,
      occupation: state => state.career.occupation,
      jobDescription: state => state.career.jobDescription,
      companyId: state => state.career.companyId,
      companyName: state => state.career.companyName,
      companyImageUrl: state => state.career.companyImageUrl,
      startedAt: state => state.career.startedAt,
      end: state => state.career.end,
      endedAt: state => state.career.endedAt,
      isInternExtended: state => state.career.isInternExtended,
      extendedInternEnd: state => state.career.extendedInternEnd,
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
      this.queryCareerDetail({uid: this.uid, careerId: this.$route.params.id})
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
        this.queryCareerDetail({uid: uid, careerId: this.$route.params.id})
      }
    },
    endedAt(endedAt) {
      this.tempEndedAt = endedAt
    },
    jobDescription(jobDescription) {
      if (jobDescription) {
        this.tempJobDescription = jobDescription
      } else {
        this.tempJobDescription = ''
      }
    },
  },
  methods: {
    updateButtonClicked() {
      let newData = {
        jobDescription: this.tempJobDescription,
      }
      if (this.tempEndedAt) {
        var endedAtArr = this.tempEndedAt.split('-')
        newData.endedAt = new Date(endedAtArr[0], endedAtArr[1] - 1, endedAtArr[2])
        newData.end = true
      }

      this.updateCareer({
        uid: this.uid,
        careerId: this.$route.params.id,
        newData: newData
      })

      this.snackbarText = 'キャリアを更新しました！'
      this.snackbar = true
    },
    ...mapActions({
      queryCareerDetail: 'career/queryCareerDetail',
      updateCareer: 'career/updateCareer',
      updateIsLoading: 'career/updateIsLoading',
      resetState: 'career/resetCareerDetailState',
    }),
  }
}
</script>
