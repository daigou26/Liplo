<template>
  <v-layout
    row
    white
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
    <v-flex v-else-if="uid && uid != ''" xs12 class="px-3">
      <v-flex xs12 sm10 offset-sm1>
        <div class="title text-color font-weight-bold py-3">
          求人を更新
        </div>
      </v-flex>
      <!-- Top Image -->
      <v-flex xs12 sm10 offset-sm1 class="py-3">
        <div class="pb-2 light-text-color">
          トップ画像（必須）
        </div>
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
      <v-flex xs12 sm10 offset-sm1 class="py-4 px-4 break">
        <v-form v-model="valid" class="pb-5">
          <!-- Title -->
          <v-text-field
            class="pt-4"
            v-model="tempTitle"
            :rules="titleRules"
            counter="50"
            label="タイトル（必須）"
            placeholder="タイトルを入力してください。"
            required
          ></v-text-field>
          <v-textarea
            class="pt-5"
            v-model="tempContent"
            :rules="contentRules"
            counter="100"
            rows="3"
            label="概要（必須）"
            placeholder="概要を100字以内で入力してください。これは検索画面で表示されます。"
            required
          ></v-textarea>
          <v-textarea
            class="pt-5"
            v-model="tempDescription"
            :rules="descriptionRules"
            label="仕事内容（必須）"
            placeholder="仕事内容について、記載できる範囲で、出来るだけ詳しくご記入ください。"
            required
          ></v-textarea>
          <v-textarea
            class="pt-5"
            v-model="tempWage"
            :rules="wageRules"
            label="給料（必須）"
            placeholder="給料について（時給や交通費を含むかどうかなど）"
            required
          ></v-textarea>
          <v-textarea
            class="pt-5"
            v-model="tempRequiredSkills"
            :rules="requiredSkillsRules"
            label="必要なスキル（必須）"
            placeholder="必要なスキルについて"
            required
          ></v-textarea>
          <v-textarea
            class="pt-5"
            v-model="tempIdealSkills"
            :rules="idealSkillsRules"
            label="あると好ましいスキル"
            placeholder="あると好ましいスキルについて"
            required
          ></v-textarea>
          <v-textarea
            class="pt-5"
            v-model="tempIdealCandidate"
            :rules="idealCandidateRules"
            label="望ましい人物像"
            placeholder="望ましい人物像について"
            required
          ></v-textarea>
          <v-flex sm6 pt-5>
            <v-text-field
              v-if="tempWorkweek"
              v-model="tempWorkweek.days"
              :rules="workweekDaysRules"
              label="週の最低勤務日数（必須）"
              suffix="日"
              type="number"
              required
            ></v-text-field>
          </v-flex>
          <v-flex sm6 pt-5>
            <v-text-field
              v-if="tempWorkweek"
              v-model="tempWorkweek.hours"
              :rules="workweekHoursRules"
              label="週の最低勤務時間（必須）"
              suffix="時間"
              type="number"
              required
            ></v-text-field>
          </v-flex>
          <v-flex sm6 pt-5>
            <v-text-field
              v-model="tempPeriod"
              :rules="periodRules"
              label="勤務期間（必須）"
              suffix="ヶ月"
              type="number"
              required
            ></v-text-field>
            <p class="text-color" style="font-size: 12px;">
              パスを出すまでの試用期間。期間は1ヶ月から3ヶ月ほどを推奨しています。試用期間が終わった後にインターンを延長することができます。
            </p>
          </v-flex>
          <v-flex sm6 pt-5>
            <v-select
              v-model="tempWorkday"
              :items="workdayItems"
              label="勤務可能曜日（必須）"
            ></v-select>
          </v-flex>
          <v-layout row wrap pt-4>
            <v-flex sm3 class="pr-2">
              <v-text-field
                v-if="tempWorktime"
                v-model="tempWorktime.begin"
                mask="time"
                label="勤務可能時間（始め）"
                placeholder="10:00"
                :rules="worktimeRules"
                required
                ></v-text-field>
            </v-flex>
            <v-flex sm3 class="pl-2">
              <v-text-field
                v-if="tempWorktime"
                v-model="tempWorktime.end"
                mask="time"
                label="勤務可能時間（終わり）"
                placeholder="19:00"
                :rules="worktimeRules"
                required
                ></v-text-field>
            </v-flex>
          </v-layout>
          <v-select
            class="pt-5"
            v-model="tempOccupation"
            :items="occupationItems"
            label="募集職種（必須）"
          ></v-select>
          <v-textarea
            v-if="tempOccupation == 'エンジニア'"
            class="pt-5"
            v-model="tempEnvironment"
            :rules="environmentRules"
            label="開発環境"
            placeholder="開発環境について"
            required
          ></v-textarea>
          <v-select
            class="pt-5"
            v-model="tempFeatures"
            :items="featureItems"
            label="特徴"
            chips
            multiple
          ></v-select>
          <v-select
            class="pt-5"
            v-model="tempIndustry"
            :items="industryItems"
            label="業界（必須）"
          ></v-select>
          <v-text-field
            class="pt-5"
            v-model="tempNearestStation"
            :rules="nearestStationRules"
            label="最寄りの駅"
            placeholder="例）JR新宿駅 / 徒歩10分"
            required
          ></v-text-field>
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
              :disabled="!valid || !imageFileSizeValid || plan == null"
              @click="updateButtonClicked"
            >
              更新
            </v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: '募集編集',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    valid: true,
    imageFileSizeValid: true,
    imageFileSizeWarning: '5MB以下の画像を選択してください',
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
      v => !!v || '数字を入力してください',
      v => (v <= 5 && v >= 1) || '1 ~ 5日で指定してください',
    ],
    workweekHoursRules: [
      v => !!v || '数字を入力してください',
      v => (v >= 0) || '0以上で指定してください',
      v => (v <= 100) || '100時間以内で指定してください'
    ],
    tempPeriod: null,
    periodRules: [
      v => !!v || '数字を入力してください',
      v => (v > 0) || '0以下は入力できません',
      v => (v <= 48) || '48までで指定してください'
    ],
    tempWorkday: '',
    workdayItems: [
      '平日のみ',
      '土曜可',
      '日曜可',
      '土日可',
    ],
    tempWorktime: {
      begin: '',
      end: ''
    },
    worktimeRules: [
      v => !!v || '数字を入力してください',
      v => (v <= 2400) || '時間を指定してください',
      v => (v.length == 4) || '4桁で指定してください'
    ],
    tempOccupation: '',
    occupationItems: [
      'エンジニア',
      'デザイナー',
      '営業',
      'マーケター',
      '企画',
      'ライター',
      'その他',
    ],
    tempFeatures: [],
    featureItems: [
      '未経験OK',
      'メディア掲載実績あり',
      '資金調達済み',
      '海外進出中',
      '友人と応募OK',
      '土日OK',
      'シフト自由',
      '平均年齢が20代',
      '19時以降勤務可能'
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
    tempNearestStation: '',
    nearestStationRules: [
      v => (v.length <= 100) || '100字以内で入力してください'
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
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      plan: state => state.profile.plan,
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
      worktime: state => state.companyJob.worktime,
      idealCandidate: state => state.companyJob.idealCandidate,
      occupation: state => state.companyJob.occupation,
      features: state => state.companyJob.features,
      industry: state => state.companyJob.industry,
      nearestStation: state => state.companyJob.nearestStation,
      status: state => state.companyJob.status,
      isLoading: state => state.companyJob.isLoading,
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

    this.resetState()
    this.updateIsLoading(true)
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
    nearestStation(nearestStation) {
      this.tempNearestStation = nearestStation
    },
    environment(environment) {
      if (environment == null) {
        this.tempEnvironment = ''
      } else {
        this.tempEnvironment = environment
      }
    },
    workweek(workweek) {
      if (workweek) {
        if (workweek.days.one) {
          this.tempWorkweek.days = '1'
        } else if (workweek.days.two) {
          this.tempWorkweek.days = '2'
        } else if (workweek.days.three) {
          this.tempWorkweek.days = '3'
        } else if (workweek.days.four) {
          this.tempWorkweek.days = '4'
        } else if (workweek.days.five) {
          this.tempWorkweek.days = '5'
        }

        this.tempWorkweek.hours = workweek.hours
      }
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
    worktime(worktime) {
      this.tempWorktime = worktime
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
      } else if (occupation.marketer == true) {
        this.tempOccupation = 'マーケター'
      } else if (occupation.planner == true) {
        this.tempOccupation = '企画'
      } else if (occupation.writer == true) {
        this.tempOccupation = 'ライター'
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
      if (features.shift == true) {
        this.tempFeatures.push('シフト自由')
      }
      if (features.average20s == true) {
        this.tempFeatures.push('平均年齢が20代')
      }
      if (features.worktime == true) {
        this.tempFeatures.push('19時以降勤務可能')
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
      // 画像サイズは5MB以下のみ
      if (files[0] != null && files[0].size/1024/1024 <= 5) {
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
        marketer: false,
        planner: false,
        writer: false,
        others: false,
      }
      switch (this.tempOccupation) {
        case 'エンジニア': occupation.engineer = true; break
        case 'デザイナー': occupation.designer = true; break
        case '営業': occupation.sales = true; break
        case 'マーケター': occupation.marketer = true; break
        case '企画': occupation.planner = true; break
        case 'ライター': occupation.writer = true; break
        case 'その他': occupation.others = true; break
      }

      let features = {
        experience: false,
        media: false,
        funding: false,
        overseas: false,
        friend: false,
        weekend: false,
        shift: false,
        average20s: false,
        worktime: false
      }
      if (this.tempFeatures.includes('未経験OK')) {
        features.experience = true
      }
      if (this.tempFeatures.includes('メディア掲載実績あり')) {
        features.media = true
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
      if (this.tempFeatures.includes('シフト自由')) {
        features.shift = true
      }
      if (this.tempFeatures.includes('平均年齢が20代')) {
        features.average20s = true
      }
      if (this.tempFeatures.includes('19時以降勤務可能')) {
        features.worktime = true
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

      let workweekDays = {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
      }
      switch (this.tempWorkweek.days) {
        case '1': workweekDays.one = true; break
        case '2': workweekDays.two = true; break
        case '3': workweekDays.three = true; break
        case '4': workweekDays.four = true; break
        case '5': workweekDays.five = true; break
      }

      const workweek = {
        days: workweekDays,
        hours: Number(this.tempWorkweek.hours)
      }

      var worktime = {
        begin: this.tempWorktime.begin,
        end: this.tempWorktime.end,
      }

      const status = this.tempStatus == '公開中' ? 'published' : 'private'

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
        worktime: worktime,
        idealCandidate: this.tempIdealCandidate,
        occupation: occupation,
        features: features,
        industry: industry,
        nearestStation: this.tempNearestStation,
        environment: this.tempEnvironment,
        status: status,
      })

      this.valid = false
    },
    ...mapActions({
      queryJob: 'companyJob/queryJob',
      updateIsLoading: 'companyJob/updateIsLoading',
      updateJob: 'companyJob/updateJob',
      resetState: 'companyJob/resetState',
    }),
  }
}
</script>
