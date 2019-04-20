<template>
  <v-layout>
    <v-flex xs12 v-if="!isLoading">
      <v-layout
        row
        white
        wrap
        :class="{'fill-height': $vuetify.breakpoint.mdAndUp}"
      >
        <!-- user image & name (sm, xs) -->
        <v-flex xs12 hidden-md-and-up>
          <v-card flat>
            <v-list two-line>
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
                  <v-list-tile-sub-title>
                    <v-rating
                      small
                      half-increments
                      readonly
                      :value="reviews == null ? 0 : reviews.rating"
                    />
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <!-- candidate summary (sm, xs) -->
        <v-flex md6 hidden-sm-and-down>
          <!-- user image & name (md, lg, xl) -->
          <v-card flat>
            <v-list two-line>
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
                  <v-list-tile-sub-title>
                    <v-rating
                      small
                      half-increments
                      readonly
                      :value="reviews == null ? 0 : reviews.rating"
                    />
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <!-- タグ -->
          <div>
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
            <v-form v-if="isEditingTags" v-model="editTagsValid" class="pa-3">
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
          <!-- pass -->
          <div v-if="pass && status.pass">
            <v-flex class="px-3 pt-4 break text-xs-left">
              <span class="textColor font-weight-bold">
                内定パス
              </span>
              <v-btn
                v-if="!isEditingPass"
                flat
                small
                @click="passEditButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption edit-text-color">編集する</span>
              </v-btn>
            </v-flex>
            <v-flex v-if="!isEditingPass" class="px-3 break text-xs-left">
              <div class="pb-2">
                <span>有効期限:　</span>{{ passExpirationDate }}
              </div>
              <div>
                <span>職種:　</span>{{ passOccupation }}
              </div>

            </v-flex>
            <!-- pass編集 -->
            <v-form v-if="isEditingPass" v-model="editPassValid" class="pa-3">
              <!-- 有効期限 -->
              <v-card class="mb-4" style="padding-left: 12px; padding-right: 12px;">
                <v-layout class="py-1" justify-space-between>
                  <v-flex xs11>
                    <datepicker
                      v-model="tempExpirationDate"
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
                v-model="tempPasspassOccupation"
                solo
                :rules="passOccupationRules"
                required
              ></v-text-field>
              <v-btn
                @click="updateIsEditingPass(false)"
              >
                キャンセル
              </v-btn>
              <v-btn
                :disabled="!editPassValid"
                @click="updatePass({
                  params: params,
                  companyId: companyId,
                  expirationDate: tempExpirationDate,
                  occupation: tempPasspassOccupation
                })"
              >
                更新
              </v-btn>
            </v-form>
          </div>
        </v-flex>
        <v-flex
          md6
          xs12
          :class="{'border-left': $vuetify.breakpoint.mdAndUp}"
        >
          <v-tabs @change="changeInput">
            <v-tab
              v-for="item in tabItems"
              :key="item.title"
            >
              {{ item.title }}
            </v-tab>
            <v-tab-item
              v-for="item in tabItems"
              :key="item.value"
              class="mt-3"
              :class="{'scroll-y': $vuetify.breakpoint.mdAndUp}"
              :style="{ height: tabItemHeight + 'px' }"
            >
              <!-- summary -->
              <div v-if="item.value == 'summary'" class="pa-3">
                <!-- タグ -->
                <div>
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
                <!-- pass -->
                <div v-if="pass && status.pass">
                  <v-flex class="px-3 pt-4 break text-xs-left">
                    <span class="textColor font-weight-bold">
                      内定パス
                    </span>
                    <v-btn
                      v-if="!isEditingPass"
                      flat
                      small
                      @click="passEditButtonClicked"
                    >
                      <v-icon :size="14">edit</v-icon>
                      <span class="caption edit-text-color">編集する</span>
                    </v-btn>
                  </v-flex>
                  <v-flex v-if="!isEditingPass" class="px-3 break text-xs-left">
                    <div class="pb-2">
                      <span>有効期限:　</span>{{ passExpirationDate }}
                    </div>
                    <div>
                      <span>職種:　</span>{{ passOccupation }}
                    </div>

                  </v-flex>
                  <!-- pass編集 -->
                  <v-form v-if="isEditingPass" v-model="editPassValid" class="pa-3">
                    <!-- 有効期限 -->
                    <v-card class="mb-4" style="padding-left: 12px; padding-right: 12px;">
                      <v-layout class="py-1" justify-space-between>
                        <v-flex xs11>
                          <datepicker
                            v-model="tempExpirationDate"
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
                      v-model="tempPassOccupation"
                      solo
                      :rules="occupationRules"
                      required
                    ></v-text-field>
                    <v-btn
                      @click="updateIsEditingPass(false)"
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      :disabled="!editPassValid"
                      @click="updatePass({
                        params: params,
                        companyId: companyId,
                        expirationDate: tempExpirationDate,
                        passOccupation: tempPasspassOccupation
                      })"
                    >
                      更新
                    </v-btn>
                  </v-form>
                </div>
              </div>
              <!-- status -->
              <div v-if="item.value == 'status' && status" class="pa-3">
                <v-select
                  v-model="tempStatus"
                  :items="statusItems"
                  solo
                ></v-select>
                <div v-if="status.scouted">
                  メッセージのやりとりが始まり次第、ステータスを<span class="font-weight-bold cyan--text text--lighten-1">選考中</span>に更新してください。
                </div>
                <div v-if="status.inbox">
                  この応募者を選考する場合は、ステータスを<span class="font-weight-bold cyan--text text--lighten-1">選考中</span>に変え、メッセージを送りましょう。
                </div>
                <div v-if="status.inProcess">
                  ステータスを<span class="font-weight-bold orange--text text--darken-1">インターン</span>に変更する場合は、インターンが確定してからお願いします。
                  ステータスを切り替えた翌月に請求書をお送り致します。
                  <div v-if="tempStatus == 'インターン'" class="py-3">
                    <v-form v-model="internValid">
                      <!-- 職種 -->
                      <v-text-field
                        label="職種"
                        v-model="internOccupation"
                        :rules="occupationRules"
                        required
                      ></v-text-field>
                    </v-form>
                  </div>
                </div>
                <div v-if="status.intern">
                  インターンを延長する場合は<span class="font-weight-bold orange--text text--darken-1">インターン延長</span>に、
                </div>
                <div v-if="status.intern || status.extendedIntern">
                  内定パスを送る場合は<span class="font-weight-bold teal--text text--lighten-1">内定パス</span>に変更してください。
                </div>
                <!-- feedback -->
                <div v-if="status.intern" class="py-3">
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
                        v-model="passOccupation"
                        solo
                        :rules="occupationRules"
                        required
                      ></v-text-field>
                      <!-- メッセージ -->
                      <v-textarea
                        label="メッセージ"
                        v-model="passMessage"
                        :rules="messageRules"
                        required
                      ></v-textarea>
                    </v-form>
                  </div>
                </div>
                <div v-if="status.pass == true">
                  <div>
                    ステータスを<span class="font-weight-bold green--text text--lighten-1">入社予定</span>に変更する場合は、内定契約が完了してからお願いします。
                    ステータスを切り替えた翌月に請求書をお送り致します。
                  </div>
                  <div class="pt-2">
                    内定パスの有効期限が切れた場合は、ステータスを
                    <span class="font-weight-bold grey--text">不採用</span>にすることで内定パスが無効になります。
                  </div>
                </div>
                <div v-if="status.contracted == true">
                  候補者が入社したらステータスを<span class="font-weight-bold green--text text--lighten-1">入社</span>に変更してください。
                  ステータスを変更すると、候補者一覧に表示されなくなります。
                </div>
                <div class="text-xs-right">
                  <v-btn
                    :disabled="updateStatusButtonDisabled"
                    @click="updateStatusButtonClicked"
                  >
                    更新
                  </v-btn>
                </div>
              </div>
              <!-- reviews -->
              <div v-if="item.value == 'reviews'">
                <v-form v-model="reviewValid" class="pa-3">
                  <v-rating
                    v-model="rating"
                    hover
                    half-increments
                    background-color="orange lighten-3"
                    color="orange"
                  />
                  <v-textarea
                    label="レビュー"
                    v-model="review"
                    rows="3"
                    :rules="messageRules"
                    required
                  ></v-textarea>
                  <div class="text-xs-right">
                    <v-btn
                      :disabled="!reviewValid || rating == 0"
                      color="warning"
                      @click="sendReviewButtonClicked">
                      {{ sendReviewButtonText }}
                    </v-btn>
                  </div>
                </v-form>
                <div v-if="reviews" class="pb-4 grey lighten-4">
                  <template v-for="(comment, index) in reviews.comments">
                    <v-card flat class="grey lighten-4">
                      <v-list two-line class="grey lighten-4">
                        <v-list-tile>
                          <v-list-tile-avatar color="grey darken-3">
                            <v-img
                              v-if="comment.pic.imageUrl"
                              :src="comment.pic.imageUrl"
                            ></v-img>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title class="textColor font-weight-bold">
                              {{ comment.pic.name }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              <v-rating
                                small
                                half-increments
                                readonly
                                :value="comment.rating == null ? 0 : comment.rating"
                              />
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                      <div class="pb-3" style="padding-left: 72px">
                        {{ comment.content }}
                      </div>
                    </v-card>
                    <v-divider
                      v-if="reviews.comments.length != index + 1"
                    ></v-divider>
                  </template>
                </div>
              </div>
              <!-- messages -->
              <v-card v-if="item.value == 'messages' && isShowMessage" flat>
                <div v-if="isMessagesLoading">
                  Now Loading...(ローディングが終わらない場合はリロードしてください。)

                </div>
                <div v-else>
                  <v-layout
                    row
                    align-center
                    wrap
                  >
                    <!-- message -->
                    <v-flex
                      xs12
                      grey lighten-4
                      class="scroll-y"
                      :style="{ height: messagesHeight + 'px' }"
                      ref="messagesScroll"
                    >
                      <infinite-loading
                        v-if="showInfiniteLoading && messages && messages.length >= 10 && !isMessagesLoading"
                        direction="top"
                        spinner="waveDots"
                        @infinite="infiniteHandler">
                        <div slot="no-results"></div>
                      </infinite-loading>
                      <template v-for="(message, index) in messages" v-if="messages != null && messages.length != 0">
                        <v-layout>
                          <v-flex
                            xs10
                            class="py-3"
                            :class="{ 'offset-xs2 text-xs-right': message.pic != null }"
                          >
                            <div class="d-inline-flex">
                              <!-- ユーザーのプロフィール画像は左に -->
                              <v-avatar
                                v-if="message.user != null"
                                class="grey lighten-3 mx-2"
                                :size="40"
                              >
                                <img v-if="message.user.imageUrl" :src="message.user.imageUrl">
                              </v-avatar>
                              <div class="px-3 py-2 white message-border-radius return">{{ message.message }}</div>
                              <!-- 担当者のプロフィール画像は右に -->
                              <v-avatar
                                v-if="message.pic != null"
                                class="grey lighten-3 mx-2"
                                :size="40"
                              >
                                <img v-if="message.pic.imageUrl" :src="message.pic.imageUrl">
                              </v-avatar>
                            </div>
                          </v-flex>
                        </v-layout>
                      </template>
                    </v-flex>
                    <!-- userInput -->
                    <v-flex xs12 px-2>
                      <v-card class="pr-2" flat>
                        <v-textarea
                          v-model="message"
                          flat
                          row-height="20"
                          rows="2"
                          no-resize
                          solo
                          label="message"
                          hide-details
                          append-outer-icon="send"
                          @click:append-outer="sendButtonClicked"
                        ></v-textarea>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </div>
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
    isMessagesQueried: false,
    showInfiniteLoading: false,
    count: 0,
    tabItemHeight: 0,
    messagesHeight: 0,
    internValid: true,
    internOccupation: '',
    passValid: true,
    feedbackValid: true,
    tempStatus: '',
    passMessage: '',
    messageRules: [
      v => !!v || '入力されていません',
      v => (v && v.length <= 200) || '200字以内で入力してください'
    ],
    expirationDate: null,
    passOccupation: '',
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
    tempExpirationDate: null,
    tempPassOccupation: '',
    editPassValid: true,
    reviewValid: true,
    rating: 0,
    review: '',
    sendReviewButtonText: 'レビュー送信',
    message: '',
    isShowMessage: false,
  }),
  computed: {
    passExpirationDate() {
      if (this.expirationDate) {
        const date = this.expirationDate
        let year  = date.getFullYear()
        let month = date.getMonth() + 1
        let day  = date.getDate()
        return `${year}/${month}/${day}`
      }
    },
    isReviewed() {
      for (const comment of this.reviews.comments) {
        if (comment.pic.uid == this.uid) {
          return true
        }
      }
      return false
    },
    updateStatusButtonDisabled() {
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
      if (this.status.inProcess && this.tempStatus == 'インターン') {
        return !this.internValid
      } else if (this.status.intern && this.tempStatus == '内定パス') {
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
      var items = [
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
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        items.unshift({
          title: '概要',
          value: 'summary'
        })
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
      chatId: state => state.candidate.chatId,
      tags: state => state.candidate.tags,
      pass: state => state.candidate.pass,
      isLoading: state => state.candidate.isLoading,
      isEditingTags: state => state.candidate.isEditingTags,
      isEditingPass: state => state.candidate.isEditingPass,
      messages: state => state.candidate.messages,
      isMessagesLoading: state => state.candidate.isMessagesLoading,
      allMessagesQueried: state => state.candidate.allMessagesQueried,
      unsubscribe: state => state.candidate.unsubscribe,
      isNewMessage: state => state.candidate.isNewMessage,
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    // tab menu = 48  margin = 16
    this.tabItemHeight = window.innerHeight - toolbarHeight - 48 - 16
    this.messagesHeight = window.innerHeight - toolbarHeight - 48 - 63 - 18

    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      this.tabItemHeight -= 88
      this.messagesHeight -= 88
    }

    this.showInfiniteLoading = true

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.queryCandidate({nuxt: this.$nuxt, params: this.$route.params, companyId: this.companyId})
    }
  },
  destroyed () {
    // listenerがあればデタッチ
    if (this.unsubscribe) {
      this.unsubscribe()
      this.resetState()
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
    },
    uid(uid) {
      if (uid && this.reviews) {
        for (const comment of reviews.comments) {
          if (comment.pic.uid == this.uid) {
            this.rating = comment.rating
            this.review = comment.content
            this.sendReviewButtonText = 'レビューを編集'
          }
        }
      }
    },
    reviews(reviews) {
      if (reviews && this.uid) {
        for (const comment of reviews.comments) {
          if (comment.pic.uid == this.uid) {
            this.rating = comment.rating
            this.review = comment.content
            this.sendReviewButtonText = 'レビューを編集'
          }
        }
      }
    },
    pass(pass) {
      if (pass) {
        this.expirationDate = pass.expirationDate
        this.passOccupation = pass.occupation
      }
    },
    messages(messages) {
      // 最下部へスクロール
      if (messages.length <= 10 || this.isNewMessage) {
        this.$nextTick(() => {
          if (this.$refs.messagesScroll) {
            this.$refs.messagesScroll[0].scrollTop = this.$refs.messagesScroll[0].scrollHeight
            this.updateIsNewMessage(false)
          }
        })
      }
    }
  },
  methods: {
    tagsEditButtonClicked() {
      this.tempTags = this.tags
      this.updateIsEditingTags(true)
    },
    passEditButtonClicked() {
      this.tempExpirationDate = this.expirationDate
      this.tempPassOccupation = this.passOccupation
      this.updateIsEditingPass(true)
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

      if (this.tempStatus == 'インターン') {
        candidateData.occupation = this.internOccupation
      }

      if (this.tempStatus == '内定パス') {
        const pass = {
          expirationDate: this.expirationDate,
          message: this.passMessage,
          occupation: this.passOccupation,
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
    sendReviewButtonClicked() {
      let reviewData = {
        params: this.params,
        companyId: this.companyId,
        pic: {
          uid: this.uid,
          name: this.lastName + ' ' + this.firstName,
          imageUrl: this.imageUrl,
        },
        rating: this.rating,
        content: this.review
      }

      if (this.isReviewed) {
        reviewData.type = 'edit'
      } else {
        reviewData.type = 'new'
      }

      this.sendReview(reviewData)
    },
    changeInput(index) {
      // messages クエリ
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        if (index == 3 && !this.isMessagesQueried) {
          this.isMessagesQueried = true
          this.updateIsMessagesLoading(true)
          this.isShowMessage = true
          this.queryMessages()
        }
      } else {
        if (index == 2 && !this.isMessagesQueried) {
          this.isMessagesQueried = true
          this.updateIsMessagesLoading(true)
          this.isShowMessage = true
          this.queryMessages()
        }
      }
    },
    infiniteHandler($state) {
      if (!this.allMessagesQueried) {
        if (!this.isMessagesLoading && this.companyId != null) {
          this.count += 1
          this.updateIsMessagesLoading(true)
          this.queryMessages($state)

          if (this.count > 20) {
            $state.complete()
          }
        }
      } else {
        $state.complete()
      }
    },
    sendButtonClicked() {
      if (this.chatId && this.message) {
        this.postMessageFromPic({
          chatId: this.chatId,
          message: this.message,
          uid: this.uid,
          imageUrl: this.imageUrl,
          name: this.lastName + ' ' + this.firstName,
        })
      }
      this.message = ''
    },
    ...mapActions({
      queryCandidate: 'candidate/queryCandidate',
      updateIsEditingTags: 'candidate/updateIsEditingTags',
      updateTags: 'candidate/updateTags',
      updateIsEditingPass: 'candidate/updateIsEditingPass',
      updatePass: 'candidate/updatePass',
      updateStatus: 'candidate/updateStatus',
      sendReview: 'candidate/sendReview',
      queryMessages: 'candidate/queryMessages',
      resetUnsubscribe: 'candidate/resetUnsubscribe',
      updateIsMessagesLoading: 'candidate/updateIsMessagesLoading',
      updateIsNewMessage: 'candidate/updateIsNewMessage',
      postMessageFromPic: 'message/postMessageFromPic',
      resetState: 'candidate/resetState',
    }),
  }
}
</script>
