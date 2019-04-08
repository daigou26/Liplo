<template>
  <v-layout>
    <v-flex xs12 v-if="!isLoading">
      <v-layout
        row
        white
        wrap
        fill-height
      >
      <!-- <v-flex xs12>
        <v-card flat>
          <v-card-actions>
            <v-list-tile>
              <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                <v-img
                  v-if="user"
                  :src="user.imageUrl"
                ></v-img>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="textColor font-weight-bold">
                  {{ user.name }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-card-actions>
        </v-card>
      </v-flex> -->
      <v-flex md6 hidden-sm-and-down>
        <div>
          <v-card flat class="pt-2">
            <v-list-tile two-line>
              <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                <v-img
                  v-if="user"
                  :src="user.imageUrl"
                ></v-img>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class="title textColor font-weight-bold">
                  {{ user.name }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-card>
          <!-- タグ -->
          <v-flex class="px-3 pt-3 break text-xs-left">
            <span class="textColor font-weight-bold">
              タグ
            </span>
            <v-btn
              v-if="!isEditingTags"
              flat
              small
              @click="tagsEditButtonClicked"
            >
              <v-icon :size="14">edit</v-icon>
              <span class="caption edit-text-color">編集する</span>
            </v-btn>
          </v-flex>
          <v-flex v-if="!isEditingTags" class="px-3 break text-xs-left">
            <v-chip v-if="tags" v-for="tag in tags" :key="tag">{{ tag }}</v-chip>
            <div v-if="tags == null || tags.length == 0">
              タグは設定されていません
            </div>
          </v-flex>
          <!-- タグ編集 -->
          <v-form v-if="isEditingTags" v-model="editTagsValid">
            <v-combobox
              v-model="tempTags"
              chips
              clearable
              solo
              multiple
              hide-no-data
              hint="タグを入力後、enterを押すことで入力が確定します"
              :rules="tagRules"
              required
            >
              <template v-slot:selection="data">
                <v-chip
                  close
                  @input="removeSkill(data.item)"
                >
                  <strong>{{ data.item }}</strong>
                </v-chip>
              </template>
            </v-combobox>
            <v-btn
              @click="updateIsEditingTags(false)"
            >
              キャンセル
            </v-btn>
            <v-btn
              :disabled="!editTagsValid"
              @click="updateTags({params: params, companyId: companyId, tags: tempTags})"
            >
              更新
            </v-btn>
          </v-form>
        </div>
      </v-flex>
      <v-flex md6 xs12 class="border-left">
        <v-tabs>
          <v-tab
            v-for="item in tabItems"
            :key="item.title"
          >
            {{ item.title }}
          </v-tab>
          <v-tab-item
            v-for="item in tabItems"
            :key="item.value"
            class="py-4 px-3"
          >
            <!-- summary -->
            <v-card v-if="item.value == 'summary'" flat>
              <div>
                <!-- タグ -->
                <v-flex class="px-3 break text-xs-left">
                  <span class="textColor font-weight-bold">
                    タグ
                  </span>
                  <v-btn
                    v-if="!isEditingTags"
                    flat
                    small
                    @click="tagsEditButtonClicked"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption edit-text-color">編集する</span>
                  </v-btn>
                </v-flex>
                <v-flex v-if="!isEditingTags" class="px-3 break text-xs-left">
                  <v-chip v-if="tags && tags.length > 0" v-for="tag in tags" :key="tag">{{ tag }}</v-chip>
                  <div v-if="tags == null || tags.length == 0">
                    タグは設定されていません。タグには、候補者の職種や役職を指定してください。(複数可)
                  </div>
                </v-flex>
                <!-- タグ編集 -->
                <v-form v-if="isEditingTags" v-model="editTagsValid">
                  <v-combobox
                    v-model="tempTags"
                    chips
                    clearable
                    solo
                    multiple
                    hide-no-data
                    hint="タグを入力後、enterを押すことで入力が確定します"
                    :rules="tagRules"
                    required
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        close
                        @input="removeSkill(data.item)"
                      >
                        <strong>{{ data.item }}</strong>
                      </v-chip>
                    </template>
                  </v-combobox>
                  <v-btn
                    @click="updateIsEditingTags(false)"
                  >
                    キャンセル
                  </v-btn>
                  <v-btn
                    :disabled="!editTagsValid"
                    @click="updateTags({params: params, companyId: companyId, tags: tempTags})"
                  >
                    更新
                  </v-btn>
                </v-form>
              </div>
            </v-card>
            <!-- status -->
            <v-card v-if="item.value == 'status' && status" flat>
              <v-select
                v-model="tempStatus"
                :items="statusItems"
                solo
              ></v-select>
              <div v-if="status.scouted == true">
                メッセージのやりとりが始まり次第、ステータスを<span class="font-weight-bold cyan--text text--lighten-1">選考中</span>に更新してください。
              </div>
              <div v-if="status.inbox == true">
                この応募者を選考する場合は、ステータスを<span class="font-weight-bold cyan--text text--lighten-1">選考中</span>に変え、メッセージを送りましょう。
              </div>
              <div v-if="status.inProcess == true">
                ステータスを<span class="font-weight-bold orange--text text--darken-1">インターン</span>に変更する場合は、インターンが確定してからお願いします。
                ステータスを切り替えた翌月に請求書をお送り致します。
              </div>
              <div v-if="status.intern == true">
                インターンを延長する場合は<span class="font-weight-bold orange--text text--darken-1">インターン延長</span>に、
              </div>
              <div v-if="status.intern == true || status.extendedIntern == true">
                内定パスを送る場合は<span class="font-weight-bold teal--text text--lighten-1">内定パス</span>に変更してください。
              </div>
              <!-- feedback -->
              <div v-if="status.intern == true" class="py-3">
                <div class="pt-3 subheading font-weight-bold">
                  フィードバック
                </div>
                <v-form v-model="feedbackValid">
                  <!-- 良い点 -->
                  <v-textarea
                    label="良い点"
                    v-model="goodPoint"
                    :rules="feedbackRules"
                    required
                  ></v-textarea>
                  <!-- アドバイス -->
                  <v-textarea
                    label="アドバイス"
                    v-model="advice"
                    placeholder="もっとこうした方が良くなるなど"
                    :rules="feedbackRules"
                    required
                  ></v-textarea>
                </v-form>
                <div class="textColor">
                  フィードバックを記入すると、企業ポイントが上がり、求人検索の際に上位に表示されやすくなります。
                  フィードバックは後からでも入力することが出来ます。
                </div>
              </div>
              <!-- pass -->
              <div v-if="status.intern == true || status.extendedIntern == true">
                <div v-if="tempStatus == '内定パス'" class="py-3">
                  <div class="pt-3 pb-2 subheading font-weight-bold">
                    内定パス
                  </div>
                  <v-form v-model="passValid">
                    <!-- 有効期限 -->
                    <v-card class="mb-4" style="padding-left: 12px; padding-right: 12px;">
                      <v-layout class="py-1" justify-space-between>
                        <v-flex xs11>
                          <datepicker
                            v-model="expirationDate"
                            class="py-2"
                            style="font-size: 16px;"
                            placeholder="有効期限"
                          ></datepicker>
                        </v-flex>
                      </v-layout>
                    </v-card>
                    <!-- 職種 -->
                    <v-text-field
                      label="職種"
                      v-model="occupation"
                      solo
                      :rules="occupationRules"
                      required
                    ></v-text-field>
                    <!-- メッセージ -->
                    <v-textarea
                      label="メッセージ"
                      v-model="message"
                      :rules="messageRules"
                      required
                    ></v-textarea>
                  </v-form>
                </div>
              </div>
              <div v-if="status.pass == true">
                ステータスを<span class="font-weight-bold green--text text--lighten-1">入社予定</span>に変更する場合は、内定契約が完了してからお願いします。
                ステータスを切り替えた翌月に請求書をお送り致します。
              </div>
              <div v-if="status.contracted == true">
                候補者が入社したらステータスを<span class="font-weight-bold green--text text--lighten-1">入社</span>に変更してください。
                ステータスを変更すると、候補者一覧に表示されなくなります。
              </div>
              <div class="text-xs-right">
                <v-btn
                  :disabled="updateButtonDisabled"
                  @click="updateStatusButtonClicked"
                >
                  更新
                </v-btn>
              </div>
            </v-card>
            <!-- messages -->
            <v-card v-if="item.value == 'messages' && status" flat>

            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
    </v-flex>
    <v-flex v-else>
      Now Loading...
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { firestore, auth, storage, storageRef } from '@/plugins/firebase'
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    Datepicker
  },
  data: () => ({
    isQueried: false,
    passValid: true,
    feedbackValid: true,
    tempStatus: '',
    message: '',
    messageRules: [
      v => !!v || '職種を入力してください',
      v => (v && v.length <= 200) || '200字以内で入力してください'
    ],
    expirationDate: null,
    occupation: '',
    occupationRules: [
      v => !!v || '職種を入力してください',
      v => (v && v.length <= 20) || '20字以内で入力してください'
    ],
    goodPoint: '',
    advice: '',
    feedbackRules: [
      v => (v.length <= 200) || '200字以内で入力してください'
    ],
    tempTags: [],
    tagRules: [
      v => (v && !(/\s/.test(v))) || 'スペースを含めないでください',
      v => (v && v.length <= 10) || '10字以内で入力してください'
    ],
    editTagsValid: true,
  }),
  computed: {
    updateButtonDisabled() {
      var disabled = false
      let currentStatus
      if (this.status.scouted == true) {
        currentStatus = 'スカウト'
      } else if (this.status.inbox == true) {
        currentStatus = '応募'
      } else if (this.status.inProcess == true) {
        currentStatus = '選考中'
      } else if (this.status.intern == true) {
        currentStatus = 'インターン'
      } else if (this.status.extendedIntern == true) {
        currentStatus = 'インターン延長'
      } else if (this.status.pass == true) {
        currentStatus = '内定パス'
      } else if (this.status.contracted == true) {
        currentStatus = '入社予定'
      }

      if (currentStatus == this.tempStatus) {
        return true
      }
      if (this.status.intern && this.tempStatus == '内定パス') {
        return !this.feedbackValid || !this.passValid || this.expirationDate == null
      } else if (this.status.intern && this.tempStatus != '内定パス') {
        return !this.feedbackValid
      } else if (!this.status.intern && this.tempStatus == '内定パス') {
        return !this.passValid || this.expirationDate == null
      } else {
        return false
      }
    },
    statusItems() {
      let items
      if (this.status.scouted == true) {
        items = [
          'スカウト',
          '選考中',
          '不採用'
        ]
      } else if (this.status.inbox == true) {
        items = [
          '応募',
          '選考中',
          '不採用'
        ]
      } else if (this.status.inProcess == true) {
        items = [
          '選考中',
          'インターン',
          '不採用'
        ]
      } else if (this.status.intern == true) {
        items = [
          'インターン',
          'インターン延長',
          '内定パス',
          '不採用'
        ]
      } else if (this.status.extendedIntern == true) {
        items = [
          'インターン延長',
          '内定パス',
          '不採用'
        ]
      } else if (this.status.pass == true) {
        items = [
          '内定パス',
          '入社予定',
          '不採用'
        ]
      } else if (this.status.contracted == true) {
        items = [
          '入社予定',
          '入社',
          '不採用'
        ]
      }
      return items
    },
    tabItems() {
      let items
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        items = [
          {
            title: '概要',
            value: 'summary'
          },
          {
            title: 'ステータス',
            value: 'status'
          },
          {
            title: 'レビュー',
            value: 'reviews'
          },
          {
            title: 'メッセージ',
            value: 'messages'
          },
        ]
      } else {
        items = [
          {
            title: 'ステータス',
            value: 'status'
          },
          {
            title: 'レビュー',
            value: 'reviews'
          },
          {
            title: 'メッセージ',
            value: 'messages'
          },
        ]
      }

      return items
    },
    params() {
      return this.$route.params
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      companyId: state => state.profile.companyId,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      imageUrl: state => state.profile.imageUrl,
      user: state => state.candidate.user,
      status: state => state.candidate.status,
      reviews: state => state.candidate.reviews,
      tags: state => state.candidate.tags,
      isLoading: state => state.candidate.isLoading,
      isEditingTags: state => state.candidate.isEditingTags,
    }),
  },
  mounted() {
    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.queryCandidate({nuxt: this.$nuxt, params: this.$route.params, companyId: this.companyId})
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId) {
        this.resetState()
        this.queryCandidate({nuxt: this.$nuxt, params: this.$route.params, companyId: companyId})
      }
    },
    status(status) {
      if (status) {
        if (status.scouted == true) {
          this.tempStatus = 'スカウト'
        } else if (status.inbox == true) {
          this.tempStatus = '応募'
        } else if (status.inProcess == true) {
          this.tempStatus = '選考中'
        } else if (status.intern == true) {
          this.tempStatus = 'インターン'
        } else if (status.extendedIntern == true) {
          this.tempStatus = 'インターン延長'
        } else if (status.pass == true) {
          this.tempStatus = '内定パス'
        } else if (status.contracted == true) {
          this.tempStatus = '入社予定'
        }
      }
    }
  },
  methods: {
    tagsEditButtonClicked() {
      this.tempTags = this.tags
      this.updateIsEditingTags(true)
    },
    removeSkill(item) {
      this.tempTags.splice(this.tempTags.indexOf(item), 1)
      this.tempTags = [...this.tempTags]
    },
    updateStatusButtonClicked() {
      let newStatus = {
        scouted: false,
        inbox: false,
        inProcess: false,
        intern: false,
        extendedIntern: false,
        pass: false,
        contracted: false,
        hired: false,
        rejected: false,
      }
      switch (this.tempStatus) {
        case 'スカウト': newStatus.scouted = true; break
        case '応募': newStatus.inbox = true; break
        case '選考中': newStatus.inProcess = true; break
        case 'インターン': newStatus.intern = true; break
        case 'インターン延長': newStatus.extendedIntern = true; break
        case '内定パス': newStatus.pass = true; break
        case '入社予定': newStatus.contracted = true; break
        case '入社': newStatus.hired = true; break
        case '不採用': newStatus.rejected = true; break
      }

      let candidateData = {
        router: this.$router,
        params: this.params,
        companyId: this.companyId,
        newStatus: newStatus,
      }

      if (this.tempStatus == '内定パス') {
        const pass = {
          expirationDate: this.expirationDate,
          message: this.message,
          occupation: this.occupation,
          pic: {
            uid: this.uid,
            name: this.lastName + ' ' + this.firstName,
            imageUrl: this.imageUrl,
          }
        }
        candidateData.pass = pass
      }

      if (this.status.intern == true && (this.goodPoint != '' || this.advice != '')) {
        let feedback = {}
        if (this.goodPoint != '') {
          feedback.goodPoint = this.goodPoint
        }
        if (this.advice != '') {
          feedback.advice = this.advice
        }
        candidateData.feedback = feedback
      }

      this.updateStatus(candidateData)
    },
    ...mapActions({
      queryCandidate: 'candidate/queryCandidate',
      updateIsEditingTags: 'candidate/updateIsEditingTags',
      updateTags: 'candidate/updateTags',
      updateStatus: 'candidate/updateStatus',
      resetState: 'candidate/resetState',
    }),
  }
}
</script>
