<template>
  <v-layout
    row
    white
    wrap
    class="px-3"
  >
    <v-flex v-if="uid && uid != ''" xs12 sm10 offset-sm1 pb-3>
      <div class="title text-color font-weight-bold py-3">
        求人を投稿
      </div>
      <div class="text-color">
        <div>
          このページで入力した情報に加えて、企業情報が募集ページに表示されます。
        </div>
        <div>
          企業情報をまだ入力していない場合は、サイドバーの企業・社員から入力をお願いします。
        </div>
        <div>
          ※ 同じ内容の投稿の連投はご遠慮ください。
        </div>
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
      <div v-else class="grey lighten-2" style="height: 200px;"></div>
      <input type="file" v-on:change="onFileChange" accept='image/*'>
      <p v-if="!imageFileSizeValid" class="warning-text-color">
        {{ imageFileSizeWarning }}
      </p>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1 class="py-4 px-4 break">
      <v-form v-model="valid" class="pb-5" @submit.prevent="">
        <v-text-field
          class="pt-4"
          v-model="title"
          :rules="titleRules"
          counter="50"
          label="タイトル（必須）"
          placeholder="タイトルを入力してください。"
          required
        ></v-text-field>
        <v-textarea
          class="pt-5"
          v-model="content"
          :rules="contentRules"
          counter="100"
          rows="3"
          label="概要（必須）"
          placeholder="概要を100字以内で入力してください。これは検索画面で表示されます。"
          required
        ></v-textarea>
        <v-textarea
          class="pt-5"
          v-model="description"
          :rules="descriptionRules"
          label="仕事内容（必須）"
          placeholder="仕事内容について、記載できる範囲で、出来るだけ詳しくご記入ください。"
          required
        ></v-textarea>
        <v-textarea
          class="pt-5"
          v-model="wage"
          :rules="wageRules"
          label="給料（必須）"
          placeholder="インターンの給料について（時給や交通費を含むかどうかなど）"
          required
        ></v-textarea>
        <v-textarea
          class="pt-5"
          v-model="requiredSkills"
          :rules="requiredSkillsRules"
          label="必要なスキル・経験"
          placeholder="必要なスキル・経験について"
          required
        ></v-textarea>
        <v-textarea
          class="pt-5"
          v-model="idealSkills"
          :rules="idealSkillsRules"
          label="あると好ましいスキル"
          placeholder="あると好ましいスキルについて"
          required
        ></v-textarea>
        <v-textarea
          class="pt-5"
          v-model="idealCandidate"
          :rules="idealCandidateRules"
          label="望ましい人物像"
          placeholder="望ましい人物像について"
          required
        ></v-textarea>
        <v-flex sm6 pt-5>
          <v-text-field
            v-model="workweek.days"
            :rules="workweekDaysRules"
            label="週の最低勤務日数（必須）"
            placeholder="2"
            suffix="日"
            type="number"
            required
          ></v-text-field>
        </v-flex>
        <v-flex sm6 pt-4>
          <v-text-field
            v-model="workweek.hours"
            :rules="workweekHoursRules"
            label="週の最低勤務時間（必須）"
            placeholder="10"
            suffix="時間"
            type="number"
            required
          ></v-text-field>
        </v-flex>
        <v-flex sm6 pt-4>
          <v-text-field
            v-model="period"
            :rules="periodRules"
            label="勤務期間（必須）"
            placeholder="1"
            suffix="ヶ月"
            type="number"
            required
          ></v-text-field>
          <p class="text-color pt-1" style="font-size: 12px;">
            パスを出すまでのインターン期間（パスを発行するか決めるための試用期間）。
            期間は1ヶ月から6ヶ月ほどを推奨しています。この期間が終わった後にインターンを延長することもできます。
          </p>
        </v-flex>
        <v-flex sm6 pt-4>
          <v-select
            v-model="workday"
            :items="workdayItems"
            label="勤務可能曜日（必須）"
            placeholder="平日のみ"
          ></v-select>
        </v-flex>
        <v-layout row wrap align-center pt-4>
          <v-flex sm3 class="pr-2">
            <v-text-field
              v-model="worktime.begin"
              mask="time"
              label="勤務可能時間（必須）"
              placeholder="10:00（開始時間）"
              :rules="worktimeRules"
              required
              ></v-text-field>
          </v-flex>
          <span class="px-4 hidden-xs-only">〜</span>
          <v-flex sm3 class="pl-2">
            <v-text-field
              v-model="worktime.end"
              mask="time"
              placeholder="19:00（終了時間）"
              :rules="worktimeRules"
              required
              ></v-text-field>
          </v-flex>
        </v-layout>
        <v-select
          class="pt-5"
          v-model="occupation"
          :items="occupationItems"
          label="募集職種（必須）"
        ></v-select>
        <v-textarea
          v-if="occupation == 'エンジニア'"
          class="pt-5"
          v-model="environment"
          :rules="environmentRules"
          label="開発環境"
          placeholder="開発環境について"
          required
        ></v-textarea>
        <v-select
          class="pt-5"
          v-model="features"
          :items="featureItems"
          label="特徴"
          chips
          multiple
          hint="複数選択可"
          persistent-hint
        ></v-select>
        <v-select
          class="pt-5"
          v-model="industries"
          :items="industryItems"
          label="業界（必須）"
          multiple
          chips
          hint="複数選択可"
          persistent-hint
        ></v-select>
        <v-text-field
          class="pt-5"
          v-model="nearestStation"
          :rules="nearestStationRules"
          label="最寄りの駅"
          placeholder="例：　JR新宿駅 / 徒歩10分"
          required
        ></v-text-field>
        <div class="text-xs-right py-3">
          <v-flex xs6 sm4 offset-xs6 offset-sm8>
            <v-select
              class="pt-4"
              v-model="status"
              :items="statusItems"
              label="ステータス"
            ></v-select>
          </v-flex>
          <v-btn
            class="mt-5"
            style="width: 150px;"
            :loading="uploading"
            :disabled="postButtonDisabled || plan == null"
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

export default {
  middleware: 'auth',
  head () {
    return {
      title: '募集作成',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    valid: true,
    uploading: false,
    imageFileSizeValid: true,
    imageFileSizeWarning: '画像を選択してください（3MB以下）',
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
      v => !!v || '数字を入力してください',
      v => (v <= 5 && v >= 1) || '1 ~ 5日で指定してください',
    ],
    workweekHoursRules: [
      v => !!v || '数字を入力してください',
      v => (v >= 0) || '0以上で指定してください',
      v => (v <= 100) || '100時間以内で指定してください'
    ],
    period: null,
    periodRules: [
      v => !!v || '数字を入力してください',
      v => (v > 0) || '0以下は入力できません',
      v => (v <= 48) || '48以下で指定してください'
    ],
    workday: null,
    workdayItems: [
      '平日のみ',
      '土曜可',
      '日曜可',
      '土日可',
    ],
    worktime: {
      begin: '',
      end: ''
    },
    worktimeRules: [
      v => !!v || '数字を入力してください',
      v => (v <= 2400) || '時間を指定してください',
      v => (v.length == 4) || '4桁で指定してください'
    ],
    workdayItems: [
      '平日のみ',
      '土曜可',
      '日曜可',
      '土日可',
    ],
    nearestStation: '',
    nearestStationRules: [
      v => (v.length <= 100) || '100字以内で入力してください'
    ],
    occupation: null,
    occupationItems: [
      'エンジニア',
      'デザイナー',
      '営業',
      'マーケター',
      '企画',
      'ライター',
      'その他',
    ],
    environment: '',
    environmentRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    features: null,
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
    industries: null,
    industryItems: [
      'IT',
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
    status: '公開',
    statusItems: [
      '公開',
      '下書き'
    ]
  }),
  computed: {
    postButtonDisabled() {
      return (!this.valid ||
        this.imageFile == null ||
        !this.imageFileSizeValid ||
        this.occupation == null ||
        this.workday == null ||
        this.industries == null
      )
    },
    imageRatio() {
      switch (this.breakpoint) {
        case 'xs': return '2'
        case 'sm': return '2.5'
        case 'md': return '2.8'
        case 'lg': return '2.8'
        case 'xl': return '2.8'
      }
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      plan: state => state.profile.plan,
      companyId: state => state.profile.companyId,
    }),
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      // 画像サイズは3MB以下のみ
      if (files[0] != null && files[0].size/1024/1024 <= 3) {
        this.imageFileSizeValid = true
        this.imageFile = files[0]
        this.createImage(files[0])
      } else {
        this.imageFileSizeValid = false
        this.imageFile = null
        this.selectedImage = null
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
        marketer: false,
        planner: false,
        writer: false,
        others: false,
      }
      switch (this.occupation) {
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
      if (this.features) {
        if (this.features.includes('未経験OK')) {
          features.experience = true
        }
        if (this.features.includes('メディア掲載実績あり')) {
          features.media = true
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
        if (this.features.includes('土日OK')) {
          features.weekend = true
        }
        if (this.features.includes('シフト自由')) {
          features.shift = true
        }
        if (this.features.includes('平均年齢が20代')) {
          features.average20s = true
        }
        if (this.features.includes('19時以降勤務可能')) {
          features.worktime = true
        }
      }


      let industries = {
        it: false,
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
      // analytics用
      let industriesText = ''

      if (this.industries) {
        if (this.industries.includes('IT')) {
          industries.it = true
          industriesText += 'it'
        }
        if (this.industries.includes('教育')) {
          industries.education = true
          industriesText += (industriesText == '') ? 'education' : ',education'
        }
        if (this.industries.includes('人材')) {
          industries.hr = true
          industriesText += (industriesText == '') ? 'hr' : ',hr'
        }
        if (this.industries.includes('金融')) {
          industries.finance = true
          industriesText += (industriesText == '') ? 'finance' : ',finance'
        }
        if (this.industries.includes('医療・福祉')) {
          industries.healthcare = true
          industriesText += (industriesText == '') ? 'healthcare' : ',healthcare'
        }
        if (this.industries.includes('エンタメ')) {
          industries.entertainment = true
          industriesText += (industriesText == '') ? 'entertainment' : ',entertainment'
        }
        if (this.industries.includes('旅行')) {
          industries.travel = true
          industriesText += (industriesText == '') ? 'travel' : ',travel'
        }
        if (this.industries.includes('ゲーム')) {
          industries.game = true
          industriesText += (industriesText == '') ? 'game' : ',game'
        }
        if (this.industries.includes('広告')) {
          industries.ad = true
          industriesText += (industriesText == '') ? 'ad' : ',ad'
        }
        if (this.industries.includes('メディア')) {
          industries.media = true
          industriesText += (industriesText == '') ? 'media' : ',media'
        }
        if (this.industries.includes('メーカー')) {
          industries.maker = true
          industriesText += (industriesText == '') ? 'maker' : ',maker'
        }
        if (this.industries.includes('飲食')) {
          industries.food = true
          industriesText += (industriesText == '') ? 'food' : ',food'
        }
        if (this.industries.includes('ファッション')) {
          industries.fashion = true
          industriesText += (industriesText == '') ? 'fashion' : ',fashion'
        }
        if (this.industries.includes('その他')) {
          industries.others = true
          industriesText += (industriesText == '') ? 'others' : ',others'
        }
      }

      let workweekDays = {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
      }
      switch (this.workweek.days) {
        case '1': workweekDays.one = true; break
        case '2': workweekDays.two = true; break
        case '3': workweekDays.three = true; break
        case '4': workweekDays.four = true; break
        case '5': workweekDays.five = true; break
      }
      const workweek = {
        days: workweekDays,
        hours: Number(this.workweek.hours)
      }

      var worktime = {
        begin: this.worktime.begin,
        end: this.worktime.end,
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
        worktime: worktime,
        idealCandidate: this.idealCandidate,
        occupation: occupation,
        features: features,
        industries: industries,
        industriesText: industriesText,
        nearestStation: this.nearestStation,
        environment: this.environment,
        status: status,
      })

      this.valid = false
      this.uploading = true
    },
    ...mapActions({
      postJob: 'companyJob/postJob',
    }),
  }
}
</script>
