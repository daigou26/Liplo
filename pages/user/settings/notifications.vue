<template>
  <v-layout
    white
    row
    wrap
  >
    <v-snackbar
      v-model="snackbar"
      class="px-5"
      color="orange lighten-1"
      :multi-line="true"
      :timeout="6000"
      :top="true"
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
            'py-5 px-4': $vuetify.breakpoint.lgAndUp,
            'pa-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <settings-menu/>
        </v-flex>
        <!-- settings (lg, md) -->
        <v-flex
          md8
          xs12
          class="py-3"
          :class="{
            'px-5': $vuetify.breakpoint.lgAndUp,
            'px-3': $vuetify.breakpoint.mdOnly,
          }"
        >
          <v-flex md10 sm6 xs8 offset-md1 offset-sm3 offset-xs2>
            <!-- menu (sm, xs) -->
            <settings-menu class="hidden-md-and-up"></settings-menu>
            <!-- settings -->
            <div class="title textColor pt-4">
              メール受信設定
            </div>
            <div class="pt-5">
              <v-checkbox
                v-model="tempScout"
                label="企業からのスカウト"
                color="info"
              ></v-checkbox>
              <v-checkbox
                v-model="tempPass"
                label="企業からの内定パス"
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
  components: {
    SettingsMenu
  },
  data: () => ({
    isQueried: false,
    tempScout: true,
    tempPass: true,
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
      notificationsSetting: state => state.settings.notificationsSetting,
      isLoading: state => state.settings.isLoading,
    }),
  },
  mounted() {
    if (this.uid != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.querySettings(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null) {
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
      }
    }
  },
  methods: {
    updateButtonClicked() {
      this.updateNotificationsSetting({
        uid: this.uid,
        setting: {scout: this.tempScout, pass: this.tempPass}
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
