<template>
  <v-layout
    white
    row
    wrap
  >
    <v-snackbar
      v-model="snackbar"
      class="px-5"
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
    <!-- loading -->
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else-if="uid"
      xs12
      md10
      offset-md1
      class="break"
    >
      <v-layout
        row
        wrap
      >
        <!-- menu (lg, md, sm)-->
        <v-flex
          sm4
          hidden-xs-only
          :class="{
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <settings-menu/>
        </v-flex>
        <!-- settings -->
        <v-flex
          sm8
          xs12
          class="py-3"
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex xs10 offset-xs1>
            <!-- settings -->
            <div class="title text-color pt-4">
              メール受信設定
            </div>
            <div v-if="type == 'user'" class="pt-5">
              <v-checkbox
                v-model="tempScout"
                label="企業からのスカウト"
                color="info"
              ></v-checkbox>
              <v-checkbox
                v-model="tempPass"
                label="企業からのパス"
                color="info"
              ></v-checkbox>
            </div>
            <div v-else class="pt-5">
              <v-checkbox
                v-model="tempApplication"
                label="学生からの応募"
                color="info"
              ></v-checkbox>
              <v-checkbox
                v-model="tempAcceptPass"
                label="学生がパスを使用した時"
                color="info"
              ></v-checkbox>
            </div>
            <div class="text-xs-right">
              <v-btn @click="updateButtonClicked">
                更新
              </v-btn>
            </div>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SettingsMenu from '~/components/SettingsMenu'

export default {
  middleware: 'auth',
  components: {
    SettingsMenu
  },
  data: () => ({
    isQueried: false,
    tempScout: true,
    tempPass: true,
    tempApplication: true,
    tempAcceptPass: true,
    snackbar: false,
    snackbarText: '',
  }),
  computed: {
    params() {
      return this.$route.params
    },
    path() {
      return this.$route.path
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      type: state => state.profile.type,
      notificationsSetting: state => state.settings.notificationsSetting,
      isLoading: state => state.settings.isLoading,
    }),
  },
  mounted() {
    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.querySettings(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.querySettings(uid)
      }
    },
    notificationsSetting(setting) {
      if (setting != null) {
        this.tempScout = setting.scout
        this.tempPass = setting.pass
        this.tempApplication = setting.application
        this.tempAcceptPass = setting.acceptPass
      }
    }
  },
  methods: {
    updateButtonClicked() {
      var settingData
      if (this.type == 'user') {
        settingData = {
          scout: this.tempScout,
          pass: this.tempPass
        }
      } else if (this.type == 'recruiter') {
        settingData = {
          application: this.tempApplication,
          acceptPass: this.tempAcceptPass
        }
      }
      this.updateNotificationsSetting({
        uid: this.uid,
        setting: settingData
      })
      this.snackbar = true
      this.snackbarText = 'メール受信設定を更新しました！'
    },
    ...mapActions({
      querySettings: 'settings/querySettings',
      updateNotificationsSetting: 'settings/updateNotificationsSetting',
      updateIsLoading: 'settings/updateIsLoading',
      resetState: 'settings/resetState',
    }),
  }
}
</script>
