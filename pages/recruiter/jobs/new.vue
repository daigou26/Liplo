<template>
  <v-layout
    row
    white
    wrap
  >
    <v-flex xs12 sm8 offset-sm2>
      <div class="title font-weight-bold py-3">
        求人を投稿
      </div>
    </v-flex>
    <!-- Top Image -->
    <v-flex xs12 sm8 offset-sm2 class="py-3">
      <v-img
        v-if="selectedImage"
        :src="selectedImage"
        :aspect-ratio="imageRatio"
      ></v-img>
      <div v-else class="grey lighten-2" style="height: 200px;"></div>
      <input type="file" v-on:change="onFileChange">
      <p v-if="!imageFileSizeValid" class="warning-text-color">
        {{ imageFileSizeWarning }}
      </p>
    </v-flex>
    <v-flex xs12 sm8 offset-sm2 class="py-4 px-4 break">
      <v-form v-model="valid" class="pb-5">
        <!-- Title -->
        <v-text-field
          class="pt-4"
          v-model="title"
          :rules="titleRules"
          counter="50"
          label="Title"
          placeholder="タイトルを入力してください。"
          required
        ></v-text-field>
        <v-textarea
          class="pt-4"
          v-model="content"
          :rules="contentRules"
          counter="100"
          rows="3"
          label="概要"
          placeholder="概要を100字以内で入力してください。これは検索画面で表示されます。"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="description"
          :rules="descriptionRules"
          label="仕事内容"
          placeholder="仕事内容について"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="wage"
          :rules="wageRules"
          label="給料"
          placeholder="給料について"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="requiredSkills"
          :rules="requiredSkillsRules"
          label="必要なスキル"
          placeholder="必要なスキルについて"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="idealSkills"
          :rules="idealSkillsRules"
          label="あると好ましいスキル"
          placeholder="あると好ましいスキルについて"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="idealCandidate"
          :rules="idealCandidateRules"
          label="望ましい人物像"
          placeholder="望ましい人物像について"
          required
        ></v-textarea>
        <v-flex sm6 pt-4>
          <v-text-field
            v-model="workweek.days"
            :rules="workweekDaysRules"
            label="最低勤務日数（週）"
            suffix="日"
            type="number"
            required
          ></v-text-field>
        </v-flex>
        <v-flex sm6 pt-4>
          <v-text-field
            v-model="workweek.hours"
            :rules="workweekHoursRules"
            label="最低勤務時間（週合計）"
            suffix="時間"
            type="number"
            required
          ></v-text-field>
        </v-flex>
        <v-flex sm6 pt-4>
          <v-text-field
            v-model="period"
            label="勤務期間（月）"
            suffix="ヶ月"
            type="number"
            required
          ></v-text-field>
          <p class="textColor" style="font-size: 12px;">
            パスを出すまでの試用期間。期間は1ヶ月程度を推奨しています。試用期間が終わった後にインターンを延長することができます。
          </p>
        </v-flex>
        <v-select
          class="pt-4"
          v-model="workday"
          :items="workdayItems"
          label="勤務可能曜日"
        ></v-select>
        <v-select
          class="pt-4"
          v-model="occupation"
          :items="occupationItems"
          label="募集職種"
        ></v-select>
        <v-select
          class="pt-4"
          v-model="features"
          :items="featureItems"
          label="特徴"
          chips
          multiple
        ></v-select>
        <v-textarea
          v-if="occupation == 'エンジニア'"
          class="pt-4"
          v-model="environment"
          :rules="environmentRules"
          label="開発環境"
          placeholder="開発環境について"
          required
        ></v-textarea>
        <div class="text-xs-right py-3">
          <v-flex xs6 sm4 offset-xs6 offset-sm8>
            <v-select
              class="pt-4"
              v-model="status"
              :items="statusItems"
              label="status"
            ></v-select>
          </v-flex>
          <v-btn
            :disabled="!valid || !imageFileSizeValid"
            @click="postButtonClicked"
          >
            投稿する
          </v-btn>
        </div>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { firestore, auth, storage, storageRef } from '@/plugins/firebase'

export default {
  data: () => ({
    valid: true,
    imageFileSizeValid: true,
    imageFileSizeWarning: '2MB以下の画像を選択してください',
    selectedImageSize: 200,
    selectedImage: null,
    imageFile: null,
    title: '',
    titleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v.length <= 50) || '50字以内で入力してください'
    ],
    content: '',
    contentRules: [
      v => !!v || '概要を入力してください',
      v => (v.length <= 100) || '100字以内で入力してください'
    ],
    description: '',
    descriptionRules: [
      v => !!v || '仕事内容を入力してください',
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    wage: '',
    wageRules: [
      v => !!v || '給料について入力してください',
      v => (v.length <= 1000) || '1000字以内で入力してください'
    ],
    requiredSkills: '',
    requiredSkillsRules: [
      v => !!v || '必要なスキルについて入力してください',
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    idealSkills: '',
    idealSkillsRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    idealCandidate: '',
    idealCandidateRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    workweek: {
      days: null,
      hours: null,
    },
    workweekDaysRules: [
      v => (v <= 7) || '7日以内で指定してください'
    ],
    workweekHoursRules: [
      v => (v <= 100) || '100時間以内で指定してください'
    ],
    period: null,
    workday: null,
    workdayItems: [
      '平日のみ',
      '土曜可',
      '日曜可',
      '土日可',
    ],
    occupation: '',
    occupationItems: [
      'エンジニア',
      'デザイナー',
      '営業',
      'その他',
    ],
    features: null,
    featureItems: [
      '未経験OK',
      'メディア掲載実績あり',
      '創業者が20代',
      '資金調達済み',
      '海外進出中',
      '友人と応募OK'
    ],
    environment: '',
    environmentRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    status: '公開',
    statusItems: [
      '公開',
      '下書き'
    ]
  }),
  computed: {
    imageRatio() {
      switch (this.breakpoint) {
        case 'xs': return '2'
        case 'sm': return '2.5'
        case 'md': return '3'
        case 'lg': return '3'
        case 'xl': return '3'
      }
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      companyId: state => state.profile.companyId,
    }),
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      // 画像サイズは2MB以下のみ
      if (files[0] != null && files[0].size/1024/1024 <= 2) {
        this.imageFile = files[0]
        this.createImage(files[0])
      } else {
        this.imageFileSizeValid = false
      }
    },
    createImage(file) {
      // アップロードした画像を表示
      let reader = new FileReader()
      reader.onload = (e) => {
        this.selectedImage = e.target.result
      }
      reader.readAsDataURL(file)
    },
    postButtonClicked() {
      let workday
      switch (this.workday) {
        case '平日のみ': workday = 0; break
        case '土曜可': workday = 1; break
        case '日曜可': workday = 2; break
        case '土日可': workday = 3; break
      }

      let occupation = {
        engineer: false,
        designer: false,
        sales: false,
        others: false,
      }
      switch (this.occupation) {
        case 'エンジニア': occupation.engineer = true; break
        case 'デザイナー': occupation.designer = true; break
        case '営業': occupation.sales = true; break
        case 'その他': occupation.others = true; break
      }


      let features = {
        experience: false,
        media: false,
        founder20s: false,
        funding: false,
        overseas: false,
        friend: false,
      }
      if (this.features.includes('未経験OK')) {
        features.experience = true
      }
      if (this.features.includes('メディア掲載実績あり')) {
        features.media = true
      }
      if (this.features.includes('創業者が20代')) {
        features.founder20s = true
      }
      if (this.features.includes('資金調達済み')) {
        features.funding = true
      }
      if (this.features.includes('海外進出中')) {
        features.overseas = true
      }
      if (this.features.includes('友人と応募OK')) {
        features.friend = true
      }

      const workweek = {
        days: Number(this.workweek.days),
        hours: Number(this.workweek.hours)
      }

      const status = this.status == '公開' ? 'published' : 'draft'

      this.postJob({
        router: this.$router,
        companyId: this.companyId,
        imageFile: this.imageFile,
        title: this.title,
        content: this.content,
        description: this.description,
        wage: this.wage,
        requiredSkills: this.requiredSkills,
        idealSkills: this.idealSkills,
        workweek: workweek,
        period: Number(this.period),
        workday: workday,
        idealCandidate: this.idealCandidate,
        occupation: occupation,
        features: features,
        environment: this.environment,
        status: status,
      })

      this.valid = false
    },
    ...mapActions({
      postJob: 'companyJob/postJob',
    }),
  }
}
</script>
