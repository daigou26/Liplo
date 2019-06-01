<template>
  <v-layout
    row
    white
    wrap
  >
    <v-flex v-if="uid && uid != ''" xs12 sm10 offset-sm1 class="py-4 px-4 break">
      <div class="title text-color font-weight-bold py-3">
        企業を作成
      </div>
      <v-form v-model="valid" class="pb-5">
        <!-- companyName -->
        <v-text-field
          class="pt-4"
          v-model="companyName"
          :rules="rules"
          label="企業名"
          placeholder="企業名を入力してください。"
          required
        ></v-text-field>
        <!-- companyEmail -->
        <v-text-field
          class="pt-4"
          v-model="companyEmail"
          :rules="emailRules"
          label="企業メールアドレス"
          placeholder="企業メールアドレスを入力してください。"
          required
        ></v-text-field>
        <!-- userName -->
        <v-text-field
          class="pt-4"
          v-model="userName"
          :rules="rules"
          label="担当者名"
          placeholder="担当者名を入力してください。"
          required
        ></v-text-field>
        <!-- userEmail -->
        <v-text-field
          class="pt-4"
          v-model="email"
          :rules="emailRules"
          label="担当者メールアドレス"
          placeholder="担当者メールアドレスを入力してください。"
          required
        ></v-text-field>
        <!-- user position -->
        <v-text-field
          class="pt-4"
          v-model="position"
          :rules="rules"
          label="役職"
          placeholder="役職を入力してください。"
          required
        ></v-text-field>
        <v-flex sm6 pt-4>
          <v-select
            v-model="plan"
            :items="planItems"
            label="プラン"
          ></v-select>
        </v-flex>
        <div class="text-xs-right py-3">
          <v-btn
            :disabled="!valid"
            @click="addButtonClicked"
          >
            作成する
          </v-btn>
        </div>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  data: () => ({
    valid: true,
    companyName: '',
    userName: '',
    rules: [
      v => !!v || '入力してください',
    ],
    companyEmail: '',
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
    position: '',
    plan: '成功報酬',
    planItems: [
      '成功報酬'
    ]
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      companyId: state => state.profile.companyId,
    }),
  },
  methods: {
    addButtonClicked() {
      let plan
      if (this.plan == '成功報酬') {
        plan = 0
      }
      this.addCompany({
        router: this.$router,
        companyName: this.companyName,
        companyEmail: this.companyEmail,
        userName: this.userName,
        email: this.email,
        position: this.position,
        plan: plan
      })

      this.valid = false
    },
    ...mapActions({
      addCompany: 'admin/addCompany',
    }),
  }
}
</script>
