<template>
  <v-layout
    row
    white
    wrap
  >
    <v-flex xs12 sm8 offset-sm2>
      <div class="title font-weight-bold py-3">
        求人を更新
      </div>
    </v-flex>
    <!-- Top Image -->
    <v-flex xs12 sm8 offset-sm2 class="py-3">
      <v-img
        v-if="selectedImage"
        :src="selectedImage"
        :aspect-ratio="imageRatio"
      ></v-img>
      <v-img
        v-else-if="imageUrl"
        :src="imageUrl"
        :aspect-ratio="imageRatio"
      ></v-img>
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
          v-model="tempTitle"
          :rules="titleRules"
          counter="50"
          label="Title"
          placeholder="タイトルを入力してください。"
          required
        ></v-text-field>
        <v-textarea
          class="pt-4"
          v-model="tempContent"
          :rules="contentRules"
          counter="100"
          rows="3"
          label="概要"
          placeholder="概要を100字以内で入力してください。これは検索画面で表示されます。"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="tempDescription"
          :rules="descriptionRules"
          label="仕事内容"
          placeholder="仕事内容について"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="tempWage"
          :rules="wageRules"
          label="給料"
          placeholder="給料について"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="tempRequiredSkills"
          :rules="requiredSkillsRules"
          label="必要なスキル"
          placeholder="必要なスキルについて"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="tempIdealSkills"
          :rules="idealSkillsRules"
          label="あると好ましいスキル"
          placeholder="あると好ましいスキルについて"
          required
        ></v-textarea>
        <v-textarea
          class="pt-4"
          v-model="tempIdealCandidate"
          :rules="idealCandidateRules"
          label="望ましい人物像"
          placeholder="望ましい人物像について"
          required
        ></v-textarea>
        <v-flex sm6 pt-4>
          <v-text-field
            v-if="tempWorkweek"
            v-model="tempWorkweek.days"
            :rules="workweekDaysRules"
            label="最低勤務日数（週）"
            suffix="日"
            type="number"
            required
          ></v-text-field>
        </v-flex>
        <v-flex sm6 pt-4>
          <v-text-field
            v-if="tempWorkweek"
            v-model="tempWorkweek.hours"
            :rules="workweekHoursRules"
            label="最低勤務時間（週合計）"
            suffix="時間"
            type="number"
            required
          ></v-text-field>
        </v-flex>
        <v-flex sm6 pt-4>
          <v-text-field
            v-model="tempPeriod"
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
          v-model="tempWorkday"
          :items="workdayItems"
          label="勤務可能曜日"
        ></v-select>
        <v-select
          class="pt-4"
          v-model="tempOccupation"
          :items="occupationItems"
          label="募集職種"
        ></v-select>
        <v-textarea
          v-if="tempOccupation == 'エンジニア'"
          class="pt-4"
          v-model="tempEnvironment"
          :rules="environmentRules"
          label="開発環境"
          placeholder="開発環境について"
          required
        ></v-textarea>
        <v-select
          class="pt-4"
          v-model="tempFeatures"
          :items="featureItems"
          label="特徴"
          chips
          multiple
        ></v-select>
        <v-select
          class="pt-4"
          v-model="tempIndustry"
          :items="industryItems"
          label="業界（必須）"
        ></v-select>
        <div class="text-xs-right py-3">
          <v-flex xs6 sm4 offset-xs6 offset-sm8>
            <v-select
              v-if="tempStatus != 'creating'"
              class="pt-4"
              v-model="tempStatus"
              :items="statusItems"
              label="status"
            ></v-select>
          </v-flex>
          <v-btn
            :disabled="!valid || !imageFileSizeValid"
            @click="updateButtonClicked"
          >
            更新
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
    isQueried: false,
    valid: true,
    imageFileSizeValid: true,
    imageFileSizeWarning: '2MB以下の画像を選択してください',
    selectedImageSize: 200,
    selectedImage: null,
    imageFile: null,
    tempTitle: '',
    titleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v.length <= 50) || '50字以内で入力してください'
    ],
    tempContent: '',
    contentRules: [
      v => !!v || '概要を入力してください',
      v => (v.length <= 100) || '100字以内で入力してください'
    ],
    tempDescription: '',
    descriptionRules: [
      v => !!v || '仕事内容を入力してください',
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    tempWage: '',
    wageRules: [
      v => !!v || '給料について入力してください',
      v => (v.length <= 1000) || '1000字以内で入力してください'
    ],
    tempRequiredSkills: '',
    requiredSkillsRules: [
      v => !!v || '必要なスキルについて入力してください',
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    tempIdealSkills: '',
    idealSkillsRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    tempIdealCandidate: '',
    idealCandidateRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    tempWorkweek: {
      days: null,
      hours: null,
    },
    workweekDaysRules: [
      v => (v <= 7) || '7日以内で指定してください'
    ],
    workweekHoursRules: [
      v => (v <= 100) || '100時間以内で指定してください'
    ],
    tempPeriod: null,
    tempWorkday: '',
    workdayItems: [
      '平日のみ',
      '土曜可',
      '日曜可',
      '土日可',
    ],
    tempOccupation: '',
    occupationItems: [
      'エンジニア',
      'デザイナー',
      '営業',
      'その他',
    ],
    tempFeatures: [],
    featureItems: [
      '未経験OK',
      'メディア掲載実績あり',
      '創業者が20代',
      '資金調達済み',
      '海外進出中',
      '友人と応募OK',
      '土日OK'
    ],
    tempIndustry: '',
    industryItems: [
      '教育',
      '人材',
      '金融',
      '医療・福祉',
      'エンタメ',
      '旅行',
      'ゲーム',
      '広告',
      'メディア',
      'メーカー',
      '飲食',
      'ファッション',
      'その他'
    ],
    tempEnvironment: '',
    environmentRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    tempStatus: null,
  }),
  computed: {
    statusItems() {
      return this.status == 'draft'
        ? [
          '公開中',
          '公開停止',
          '下書き'
        ]
        : [
          '公開中',
          '公開停止',
        ]
    },
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
      imageUrl: state => state.companyJob.imageUrl,
      title: state => state.companyJob.title,
      content: state => state.companyJob.content,
      description: state => state.companyJob.description,
      wage: state => state.companyJob.wage,
      requiredSkills: state => state.companyJob.requiredSkills,
      idealSkills: state => state.companyJob.idealSkills,
      environment: state => state.companyJob.environment,
      workweek: state => state.companyJob.workweek,
      period: state => state.companyJob.period,
      workday: state => state.companyJob.workday,
      idealCandidate: state => state.companyJob.idealCandidate,
      occupation: state => state.companyJob.occupation,
      features: state => state.companyJob.features,
      industry: state => state.companyJob.industry,
      status: state => state.companyJob.status
    }),
  },
  mounted() {
    this.resetState()
    this.queryJob(this.$route.params)
  },
  watch: {
    title(title) {
      this.tempTitle = title
    },
    content(content) {
      this.tempContent = content
    },
    description(description) {
      this.tempDescription = description
    },
    wage(wage) {
      this.tempWage = wage
    },
    requiredSkills(requiredSkills) {
      this.tempRequiredSkills = requiredSkills
    },
    idealSkills(idealSkills) {
      this.tempIdealSkills = idealSkills
    },
    environment(environment) {
      if (environment == null) {
        this.tempEnvironment = ''
      } else {
        this.tempEnvironment = environment
      }
    },
    workweek(workweek) {
      this.tempWorkweek = workweek
    },
    period(period) {
      this.tempPeriod = period
    },
    workday(workday) {
      if (workday == 0) {
        this.tempWorkday = '平日のみ'
      } else if (workday == 1) {
        this.tempWorkday = '土曜可'
      } else if (workday == 2) {
        this.tempWorkday = '日曜可'
      } else if (workday == 3) {
        this.tempWorkday = '土日可'
      }
    },
    idealCandidate(idealCandidate) {
      this.tempIdealCandidate = idealCandidate
    },
    occupation(occupation) {
      if (occupation.engineer == true) {
        this.tempOccupation = 'エンジニア'
      } else if (occupation.designer == true) {
        this.tempOccupation = 'デザイナー'
      } else if (occupation.sales == true) {
        this.tempOccupation = '営業'
      } else if (occupation.others == true) {
        this.tempOccupation = 'その他'
      }
    },
    features(features) {
      if (features.experience == true) {
        this.tempFeatures.push('未経験OK')
      }
      if (features.media == true) {
        this.tempFeatures.push('メディア掲載実績あり')
      }
      if (features.founder20s == true) {
        this.tempFeatures.push('創業者が20代')
      }
      if (features.funding == true) {
        this.tempFeatures.push('資金調達済み')
      }
      if (features.overseas == true) {
        this.tempFeatures.push('海外進出中')
      }
      if (features.friend == true) {
        this.tempFeatures.push('友人と応募OK')
      }
      if (features.weekend == true) {
        this.tempFeatures.push('土日OK')
      }
    },
    industry(industry) {
      if (industry.education == true) {
        this.tempIndustry = '教育'
      } else if (industry.hr == true) {
        this.tempIndustry = '人材'
      } else if (industry.finance == true) {
        this.tempIndustry = '金融'
      } else if (industry.healthcare == true) {
        this.tempIndustry = '医療・福祉'
      } else if (industry.entertainment == true) {
        this.tempIndustry = 'エンタメ'
      } else if (industry.travel == true) {
        this.tempIndustry = '旅行'
      } else if (industry.game == true) {
        this.tempIndustry = 'ゲーム'
      } else if (industry.ad == true) {
        this.tempIndustry = '広告'
      } else if (industry.media == true) {
        this.tempIndustry = 'メディア'
      } else if (industry.maker == true) {
        this.tempIndustry = 'メーカー'
      } else if (industry.food == true) {
        this.tempIndustry = '飲食'
      } else if (industry.fashion == true) {
        this.tempIndustry = 'ファッション'
      } else if (industry.others == true) {
        this.tempIndustry = 'その他'
      }
    },
    status(status) {
      if (status == 'published') {
        this.tempStatus = '公開中'
      } else if (status == 'private') {
        this.tempStatus = '公開停止'
      } else if (status == 'draft') {
        this.tempStatus = '下書き'
      } else if (status == 'creating') {
        this.tempStatus = '作成中'
      }
    },
  },
  methods: {
    onFileChange(e) {
      this.imageFileSizeValid = true
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
    updateButtonClicked() {
      let workday
      switch (this.tempWorkday) {
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
      switch (this.tempOccupation) {
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
        weekend: false,
      }
      if (this.tempFeatures.includes('未経験OK')) {
        features.experience = true
      }
      if (this.tempFeatures.includes('メディア掲載実績あり')) {
        features.media = true
      }
      if (this.tempFeatures.includes('創業者が20代')) {
        features.founder20s = true
      }
      if (this.tempFeatures.includes('資金調達済み')) {
        features.funding = true
      }
      if (this.tempFeatures.includes('海外進出中')) {
        features.overseas = true
      }
      if (this.tempFeatures.includes('友人と応募OK')) {
        features.friend = true
      }
      if (this.tempFeatures.includes('土日OK')) {
        features.weekend = true
      }

      let industry = {
        education: false,
        hr: false,
        finance: false,
        healthcare: false,
        entertainment: false,
        travel: false,
        game: false,
        ad: false,
        media: false,
        maker: false,
        food: false,
        fashion: false,
        others: false,
      }
      switch (this.tempIndustry) {
        case '教育': industry.education = true; break
        case '人材': industry.hr = true; break
        case '金融': industry.finance = true; break
        case '医療・福祉': industry.healthcare = true; break
        case 'エンタメ': industry.entertainment = true; break
        case '旅行': industry.travel = true; break
        case 'ゲーム': industry.game = true; break
        case '広告': industry.ad = true; break
        case 'メディア': industry.media = true; break
        case 'メーカー': industry.maker = true; break
        case '飲食': industry.food = true; break
        case 'ファッション': industry.fashion = true; break
        case 'その他': industry.others = true; break
      }

      const workweek = {
        days: Number(this.tempWorkweek.days),
        hours: Number(this.tempWorkweek.hours)
      }

      const status = this.tempStatus == '公開中' ? 'published' : 'draft'

      this.updateJob({
        params: this.$route.params,
        router: this.$router,
        companyId: this.companyId,
        imageFile: this.imageFile,
        title: this.tempTitle,
        content: this.tempContent,
        description: this.tempDescription,
        wage: this.tempWage,
        requiredSkills: this.tempRequiredSkills,
        idealSkills: this.tempIdealSkills,
        workweek: workweek,
        period: Number(this.tempPeriod),
        workday: workday,
        idealCandidate: this.tempIdealCandidate,
        occupation: occupation,
        features: features,
        industry: industry,
        environment: this.tempEnvironment,
        status: status,
      })

      this.valid = false
    },
    ...mapActions({
      queryJob: 'companyJob/queryJob',
      updateJob: 'companyJob/updateJob',
      resetState: 'companyJob/resetState',
    }),
  }
}
</script>
