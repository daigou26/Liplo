<template>
  <v-container grid-list-md pa-0>
    <v-layout
      row
      justify-center
      align-center
    >
      <v-flex xs12>
        <v-card>
          <!-- Profile画像 & UserName -->
          <div class="d-flex py-4 align-center">
            <!-- Profile画像 -->
            <v-flex xs4 sm2 text-xs-center>
              <v-avatar
                :size="avatarSize"
                class="grey lighten-3"
                @click="profileImageClicked"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                <v-icon v-else :size="70">person</v-icon>
              </v-avatar>
            </v-flex>
            <!-- User Name -->
            <v-flex xs8  class="break text-xs-left">
              <span class="display-1 textColor font-weight-bold">
                {{ name }}
              </span>
              <v-btn
                flat
                @click="userNameClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption edit-text-color">編集する</span>
              </v-btn>
            </v-flex>
            <!-- ProfileImage編集 -->
            <div>
              <v-dialog
                v-model="editProfileImage"
                :fullscreen="$vuetify.breakpoint.xsOnly"
                width="500"
              >
                <v-card>
                  <v-card-title
                    class="headline orange lighten-3"
                    primary-title
                  >
                    プロフィール画像を変更
                  </v-card-title>
                  <v-flex xs10 offset-xs1 text-xs-center>
                    <div class="py-4">
                      <v-avatar
                        :size="selectedImageSize"
                        class="grey lighten-3"
                      >
                        <v-img v-if="selectedImage" :src="selectedImage" />
                        <v-img v-else-if="imageUrl" :src="imageUrl" />
                        <v-icon v-else style="font-size: 150px">person</v-icon>
                      </v-avatar>
                    </div>
                    <input type="file" v-on:change="onFileChange">
                    <p v-if="!imageFileSizeValid" class="warning-text-color">
                      {{ imageFileSizeWarning }}
                    </p>
                  </v-flex>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      @click="editProfileImage=false"
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      color="primary"
                      flat
                      :disabled ="selectedImage == null"
                      @click="updateProfileImage"
                    >
                      変更
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <!-- UserName編集 -->
            <v-form v-model="editUserNameValid">
              <v-dialog
                v-model="editUserName"
                :fullscreen="$vuetify.breakpoint.xsOnly"
                width="500"
              >
                <v-card>
                  <v-card-title
                    class="headline orange lighten-3"
                    primary-title
                  >
                    名前を変更
                  </v-card-title>
                  <v-flex xs10 offset-xs1 py-3>
                    <!-- 苗字の編集画面 -->
                    <v-text-field
                      label="姓"
                      v-model="tempLastName"
                      :rules="lastNameRules"
                      required
                    ></v-text-field>
                    <!-- 苗字の編集画面 -->
                    <v-text-field
                      label="名"
                      v-model="tempFirstName"
                      :rules="firstNameRules"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      @click="editUserName=false"
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      color="primary"
                      flat
                      :disabled="!editUserNameValid"
                      @click="updateUserName"
                    >
                      変更
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-form>
          </div>
          <div :class="{'px-5': $vuetify.breakpoint.smAndUp}">
            <!-- 紹介文 -->
            <div>
              <!-- タイトル&編集ボタン -->
              <v-layout
                align-center
                justify-space-between
                row
                class="pt-5"
              >
                <v-flex xs8 sm10>
                  <v-card-title class="title font-weight-bold">紹介文</v-card-title>
                </v-flex>
                <v-flex xs4 sm2 v-show="!editSelfIntro">
                  <v-btn
                    flat
                    @click="selfIntroEditButtonClicked"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption edit-text-color">編集する</span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm10>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 sm10 class="break">
                <!-- 自己紹介の表示 -->
                <v-card-text v-if="!editSelfIntro">
                  <p>{{ selfIntro }}</p>
                </v-card-text>
                <!-- 自己紹介の編集画面 -->
                <div v-else>
                  <v-form v-model="editSelfIntroValid">
                    <v-textarea
                      solo
                      label="自己紹介"
                      v-model="tempSelfIntro"
                      :rules="selfIntroRules"
                      required
                    ></v-textarea>
                    <v-btn
                      @click="editSelfIntro=false"
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      :disabled="!editSelfIntroValid"
                      @click="updateSelfIntro"
                    >
                      更新
                    </v-btn>
                  </v-form>
                </div>
              </v-flex>
            </div>
            <!-- やりたいこと -->
            <div>
              <!-- タイトル&編集ボタン -->
              <v-layout
                align-center
                justify-space-between
                row
                class="pt-5"
              >
                <v-flex xs8 sm10>
                  <v-card-title class="title font-weight-bold">やりたいこと・実現したいこと</v-card-title>
                </v-flex>
                <v-flex xs4 sm2 v-show="!editWhatWantToDo">
                  <v-btn
                    flat
                    @click="whatWantToDoEditButtonClicked"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption edit-text-color">編集する</span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm10>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 sm10 class="break">
                <!-- やりたいことの表示 -->
                <v-card-text v-if="!editWhatWantToDo">
                  <p>{{ whatWantToDo }}</p>
                </v-card-text>
                <!-- やりたいことの編集画面 -->
                <div v-else>
                  <v-form v-model="editWhatWantToDoValid">
                    <v-textarea
                      solo
                      label="やりたいことや実現したいことを書いてください"
                      v-model="tempWhatWantToDo"
                      :rules="whatWantToDoRules"
                      required
                    ></v-textarea>
                    <v-btn
                      @click="editWhatWantToDo=false"
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      :disabled="!editWhatWantToDoValid"
                      @click="updateWhatWantToDo"
                    >
                      更新
                    </v-btn>
                  </v-form>
                </div>
              </v-flex>
            </div>
            <!-- ポートフォリオ -->
            <div>
              <!-- タイトル&編集ボタン -->
              <v-layout
                align-center
                justify-space-between
                row
                class="pt-5"
              >
                <v-flex xs8 sm10>
                  <v-card-title class="title font-weight-bold">ポートフォリオ</v-card-title>
                </v-flex>
                <v-flex xs4 sm2 v-show="!editPortfolio">
                  <v-btn
                    flat
                    @click="portfolioEditButtonClicked(null)"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption edit-text-color">追加する</span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm10>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 sm10>
                <!-- ポートフォリオ表示 -->
                <v-list v-if="!editPortfolio && this.portfolio != null" class="pl-4">
                  <template v-for="(item, index) in this.portfolio">
                      <div class="d-flex pb-3">
                        <v-flex xs4 sm3 lg2>
                          <v-img :src="item.imageUrl" height="100"></v-img>
                        </v-flex>
                        <v-flex xs8 sm9 lg10 class="px-4 break">
                          <div>
                            <span class="font-weight-bold subheading textColor">{{ item.title }}</span>
                            <v-btn
                              class="pa-0 ma-0"
                              flat
                              @click="portfolioEditButtonClicked(index)"
                            >
                              <v-icon :size="14">edit</v-icon>
                              <span class="caption edit-text-color">編集する</span>
                            </v-btn>
                          </div>
                          <p　class="textColor">
                            {{ item.content }}
                          </p>
                          <p class="textColor">
                            {{ item.url }}
                          </p>
                        </v-flex>
                      </div>
                  </template>
                </v-list>
                <!-- ポートフォリオ編集画面 -->
                <div v-if="editPortfolio">
                  <v-form v-model="editPortfolioValid">
                    <div class="d-flex pb-3">
                      <v-flex xs8 sm9 lg10 class="px-4 break">
                        <div class="py-3">
                          <v-img :src="tempPortfolioItemImageUrl" width="200" height="100" class="grey lighten-3"/>
                          <input type="file" v-on:change="onFileChange">
                        </div>
                        <v-text-field
                          solo
                          label="タイトル"
                          v-model="tempPortfolioItemTitle"
                          :rules="portfolioItemTitleRules"
                          required
                        ></v-text-field>
                        <v-textarea
                          solo
                          label="説明"
                          v-model="tempPortfolioItemContent"
                          :rules="portfolioItemContentRules"
                          required
                        ></v-textarea>
                        <v-text-field
                          solo
                          label="URL"
                          v-model="tempPortfolioItemUrl"
                          :rules="portfolioItemUrlRules"
                          required
                        ></v-text-field>
                        <v-btn
                          @click="editPortfolio=false"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          v-if="selectedPortfolioItemIndex != null"
                          @click="deletePortfolioItem"
                        >
                          削除
                        </v-btn>
                        <v-btn
                          :disabled="!editPortfolioValid || tempPortfolioItemImageUrl == null"
                          @click="updatePortfolio"
                        >
                          更新
                        </v-btn>
                      </v-flex>
                    </div>
                  </v-form>
                </div>
              </v-flex>
            </div>
            <!-- スキル -->
            <div>
              <!-- タイトル&編集ボタン -->
              <v-layout
                align-center
                justify-space-between
                row
                class="pt-5"
              >
                <v-flex xs8 sm10>
                  <v-card-title class="title font-weight-bold">スキル</v-card-title>
                </v-flex>
                <v-flex xs4 sm2 v-show="!editSkills">
                  <v-btn
                    flat
                    @click="skillsEditButtonClicked(null)"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption edit-text-color">追加する</span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm10>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 sm10 class="break">
                <!-- スキル表示 -->
                <v-list v-if="!editSkills && skills != null" class="pl-4">
                  <template v-for="(item, index) in skills">
                    <div class="py-2">
                      <div class="font-weight-bold body-2 textColor">
                        {{ item.title }}
                        <v-btn
                          class="pa-0 ma-0"
                          flat
                          @click="skillsEditButtonClicked(index)"
                        >
                          <v-icon :size="14">edit</v-icon>
                          <span class="caption edit-text-color">編集する</span>
                        </v-btn>
                      </div>
                      <p>
                        {{ item.content }}
                      </p>
                    </div>
                  </template>
                </v-list>
                <!-- スキルの編集画面 -->
                <div v-if="editSkills">
                  <v-form v-model="editSkillsValid">
                    <div class="d-flex pb-3">
                      <v-flex xs8 sm9 lg10 class="px-4 break">
                        <v-text-field
                          solo
                          label="タイトル"
                          v-model="tempSkillTitle"
                          :rules="skillTitleRules"
                          required
                        ></v-text-field>
                        <v-textarea
                          solo
                          label="説明"
                          v-model="tempSkillContent"
                          :rules="skillContentRules"
                          required
                        ></v-textarea>
                        <v-btn
                          @click="editSkills=false"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          v-if="selectedSkillIndex != null"
                          @click="deleteSkill"
                        >
                          削除
                        </v-btn>
                        <v-btn
                          :disabled="!editSkillsValid"
                          @click="updateSkills"
                        >
                          更新
                        </v-btn>
                      </v-flex>
                    </div>
                  </v-form>
                </div>
              </v-flex>
            </div>
            <!-- 関連リンク -->
            <div>
              <!-- タイトル&編集ボタン -->
              <v-layout
                align-center
                justify-space-between
                row
                class="pt-5"
              >
                <v-flex xs8 sm10>
                  <v-card-title class="title font-weight-bold">関連リンク</v-card-title>
                </v-flex>
                <v-flex xs4 sm2 v-show="!editLinks">
                  <v-btn
                    flat
                    @click="linksEditButtonClicked(null)"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption edit-text-color">追加する</span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm10>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 sm10 class="break">
                <!-- 関連リンク表示 -->
                <v-list v-if="!editLinks && links != null" class="pl-4">
                  <template v-for="(item, index) in links">
                    <div class="py-2">
                      <div class="font-weight-bold body-2 textColor">
                        {{ item.title }}
                        <v-btn
                          class="pa-0 ma-0"
                          flat
                          @click="linksEditButtonClicked(index)"
                        >
                          <v-icon :size="14">edit</v-icon>
                          <span class="caption edit-text-color">編集する</span>
                        </v-btn>
                      </div>
                      <p>
                        {{ item.url }}
                      </p>
                    </div>
                  </template>
                </v-list>
                <!-- 関連リンクの編集画面 -->
                <div v-if="editLinks">
                  <v-form v-model="editLinksValid">
                    <div class="d-flex pb-3">
                      <v-flex xs8 sm9 lg10 class="px-4 break">
                        <v-text-field
                          solo
                          label="タイトル"
                          v-model="tempLinkTitle"
                          :rules="linkTitleRules"
                          required
                        ></v-text-field>
                        <v-text-field
                          solo
                          label="URL"
                          v-model="tempLinkUrl"
                          :rules="linkUrlRules"
                          required
                        ></v-text-field>
                        <v-btn
                          @click="editLinks=false"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          v-if="selectedLinkIndex != null"
                          @click="deleteLink"
                        >
                          削除
                        </v-btn>
                        <v-btn
                          :disabled="!editLinksValid"
                          @click="updateLinks"
                        >
                          更新
                        </v-btn>
                      </v-flex>
                    </div>
                  </v-form>
                </div>
              </v-flex>
            </div>
            <!-- 基本情報 -->
            <div>
              <!-- タイトル&編集ボタン -->
              <v-layout
                align-center
                justify-space-between
                row
                class="pt-5"
              >
                <v-flex xs8 sm10>
                  <v-card-title class="title font-weight-bold">基本情報</v-card-title>
                </v-flex>
                <v-flex xs4 sm2 v-show="!editUserInfo">
                  <v-btn
                    class="text-xs-left"
                    flat
                    @click="userInfoEditButtonClicked"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption edit-text-color">編集する</span>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm10>
                <v-divider></v-divider>
              </v-flex>
              <v-flex xs12 sm10 class="break">
                <!-- 基本情報の表示 -->
                <v-list v-if="!editUserInfo" class="pl-4">
                  <div class="pb-2">
                    <span>大学:</span>
                    <span class="pl-2">{{ university }}</span>
                  </div>
                  <div class="pb-2">
                    <span>学部:</span>
                    <span class="pl-2">{{ faculty }}</span>
                  </div>
                  <div class="pb-2">
                    <span>学科:</span>
                    <span class="pl-2">{{ department }}</span>
                  </div>
                  <div class="pb-2">
                    <span>生年月日:</span>
                    <span class="pl-2">{{ birthDate }}</span>
                  </div>
                </v-list>
                <!-- 基本情報の編集画面 -->
                <div v-else>
                  <v-form v-model="editUserInfoValid">
                    <v-text-field
                      solo
                      label="大学"
                      v-model="tempUniversity"
                      :rules="userInfoRules"
                      required
                    ></v-text-field>
                    <v-text-field
                      solo
                      label="学部"
                      v-model="tempFaculty"
                      :rules="userInfoRules"
                      required
                    ></v-text-field>
                    <v-text-field
                      solo
                      label="学科"
                      v-model="tempDepartment"
                      :rules="userInfoRules"
                      required
                    ></v-text-field>
                    <v-btn
                      @click="editUserInfo=false"
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      :disabled="!editUserInfoValid"
                      @click="updateUserInfo"
                    >
                      更新
                    </v-btn>
                  </v-form>
                </div>
              </v-flex>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { firestore, auth, storage, storageRef } from '@/plugins/firebase'

export default {
  data: () => ({
    avatarSize: 70,
    imageFileSizeValid: true,
    imageFileSizeWarning: '2MB以下の画像を選択してください',
    selectedImageSize: 200,
    editProfileImage: false,
    selectedImage: null,
    imageFile: null,
    firstName: '',
    tempFirstName: '',
    lastName: '',
    tempLastName: '',
    firstNameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    lastNameRules: [
      v => !!v || '苗字を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    editUserNameValid: true,
    editUserName: false,
    selfIntro: '',
    tempSelfIntro: '',
    selfIntroRules: [
      v => (v.length <= 300) || '300字以内で入力してください'
    ],
    editSelfIntroValid: true,
    editSelfIntro: false,
    whatWantToDo: '',
    tempWhatWantToDo: '',
    whatWantToDoRules: [
      v => (v.length <= 300) || '300字以内で入力してください'
    ],
    editWhatWantToDoValid: true,
    editWhatWantToDo: false,
    portfolio: null,
    tempPortfolio: null,
    isPortfolioImageChanged: false,
    tempPortfolioItemImageUrl: '',
    tempPortfolioItemTitle: '',
    tempPortfolioItemContent: '',
    tempPortfolioItemUrl: '',
    tempPortfolioImageFile: null,
    selectedPortfolioItemIndex: null,
    portfolioItemTitleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v && v.length <= 20) || '20字以内で入力してください'
    ],
    portfolioItemContentRules: [
      v => !!v || '説明を入力してください',
      v => (v && v.length <= 50) || '50字以内で入力してください'
    ],
    portfolioItemUrlRules: [
      v => !!v || 'URLを入力してください',
      v => (v && v.length <= 50) || '50字以内で入力してください',
      v => (v.includes('http://') || v.includes('https://')) || '無効なURLです'
    ],
    editPortfolioValid: true,
    editPortfolio: false,
    skills: null,
    tempSkills: null,
    tempSkillTitle: '',
    tempSkillContent: '',
    selectedSkillIndex: null,
    skillTitleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v && v.length <= 30) || '20字以内で入力してください'
    ],
    skillContentRules: [
      v => !!v || '説明を入力してください',
      v => (v && v.length <= 100) || '100字以内で入力してください',
    ],
    editSkillsValid: true,
    editSkills: false,
    links: null,
    tempLinks: null,
    tempLinkTitle: '',
    tempLinkUrl: '',
    selectedLinkIndex: null,
    linkTitleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v && v.length <= 30) || '30字以内で入力してください'
    ],
    linkUrlRules: [
      v => !!v || 'URLを入力してください',
      v => (v && v.length <= 100) || '100字以内で入力してください',
      v => (v.includes('http://') || v.includes('https://')) || '無効なURLです'
    ],
    editLinksValid: true,
    editLinks: false,
    email: '',
    university: '',
    tempUniversity: '',
    faculty: '',
    tempFaculty: '',
    department: '',
    tempDepartment: '',
    birthTimestamp: '',
    userInfoRules: [
      v => (v.length <= 50) || '50字以内で記入してください'
    ],
    editUserInfoValid: true,
    editUserInfo: false
  }),
  computed: {
    ...mapGetters([
      'user',
      'imageUrl'
    ]),
    name: function() {
      return this.lastName + ' ' + this.firstName
    },
    birthDate: function() {
      const date = new Date( this.birthTimestamp * 1000 )
      const year  = date.getFullYear()
      const month = date.getMonth() + 1
      const day  = date.getDate()
      if (year != null && month != null && day!= null) {
        return `${year}/${month}/${day}`
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      console.log('profile auth state changed')
      if (user) {
        this.fetchData(user.uid)
      }
    })
  },
  methods: {
    fetchData(uid) {
      // profile情報取得
      console.log('fetchData')
      if (uid) {
        const self = this
        firestore.collection('users').doc(uid).collection('profile').doc(uid)
          .get()
          .then(function(doc) {
            console.log(doc.exists)
            if (doc.exists) {
              console.log(doc)
              self.firstName = doc.data()['firstName']
              self.lastName = doc.data()['lastName']
              self.selfIntro = doc.data()['selfIntro'] != null ? doc.data()['selfIntro'] : ''
              self.whatWantToDo = doc.data()['whatWantToDo'] != null ? doc.data()['whatWantToDo'] : ''
              self.portfolio = doc.data()['portfolio']
              self.skills = doc.data()['skills']
              self.links = doc.data()['links']
              self.birthTimestamp = doc.data()['birthTimestamp']
              self.university = doc.data()['university'] != null ? doc.data()['university'] : ''
              self.faculty = doc.data()['faculty'] != null ? doc.data()['faculty'] : ''
              self.department = doc.data()['department'] != null ? doc.data()['department'] : ''
            }
          })
      }
    },
    profileImageClicked() {
      this.imageFileSizeValid = true
      this.selectedImage = null
      this.imageFile = null
      this.editProfileImage = true
    },
    onFileChange(e) {
      this.imageFileSizeValid = true
      let files = e.target.files || e.dataTransfer.files
      if (files[0] != null && files[0].size/1024/1024 <= 2) {
        if (this.editProfileImage) {
          this.imageFile = files[0]
        } else if (this.editPortfolio) {
          this.isPortfolioImageChanged = true
          this.tempPortfolioImageFile = files[0]
        }
      } else {
        this.imageFileSizeValid = false
      }

      if (this.imageFileSizeValid) {
        this.createImage(files[0])
      }
    },
    createImage(file) {
      // アップロードした画像を表示
      let reader = new FileReader()
      reader.onload = (e) => {
        if (this.editProfileImage) {
          this.selectedImage = e.target.result
        } else if (this.editPortfolio) {
          this.tempPortfolioItemImageUrl = e.target.result
        }
      }
      reader.readAsDataURL(file)
    },
    updateProfileImage() {
      // アップロード
      const self = this
      const uploadTask = storageRef.child(`users/${this.user.uid}/profile.jpg`).put(this.imageFile)
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // dbにurl保存
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL)
          firestore.collection('users').doc(self.user.uid)
            .update({
              imageUrl: downloadURL
            })
            .then(() => {
              self.editProfileImage = false
              self.$store.dispatch('setImageUrl', downloadURL)
            })
            .catch((error) => {
              console.error("Error adding document: ", error)
            })
        })
      })
    },
    userNameClicked() {
      this.editUserName = true
      this.tempFirstName = this.firstName
      this.tempLastName = this.lastName
    },
    updateUserName() {
      const nameData = {
        firstName: this.tempFirstName,
        lastName: this.tempLastName,
      }
      const self = this
      const batch = firestore.batch()
      const userRef = firestore.collection('users').doc(this.user.uid)
      batch.set(userRef, nameData)
      const profileRef = firestore.collection('users')
        .doc(this.user.uid).collection('profile').doc(this.user.uid)
      batch.set(profileRef, nameData)
      batch.commit()
        .then(() => {
          self.firstName = self.tempFirstName
          self.lastName = self.tempLastName
          self.editUserName = false
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    },
    selfIntroEditButtonClicked() {
      this.tempSelfIntro = this.selfIntro
      this.editSelfIntro = true
    },
    updateSelfIntro() {
      if (this.tempSelfIntro != this.selfIntro) {
        const self = this
        firestore.collection('users').doc(this.user.uid)
          .collection('profile').doc(this.user.uid)
          .update({
            selfIntro: this.tempSelfIntro,
          })
          .then(() => {
            self.selfIntro = self.tempSelfIntro
            self.editSelfIntro = false
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      } else {
        this.editSelfIntro = false
      }
    },
    whatWantToDoEditButtonClicked() {
      this.tempWhatWantToDo = this.whatWantToDo
      this.editWhatWantToDo = true
    },
    updateWhatWantToDo() {
      if (this.tempWhatWantToDo != this.whatWantToDo) {
        const self = this
        firestore.collection('users').doc(this.user.uid)
          .collection('profile').doc(this.user.uid)
          .update({
            whatWantToDo: this.tempWhatWantToDo,
          })
          .then(() => {
            self.whatWantToDo = self.tempWhatWantToDo
            self.editWhatWantToDo = false
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      } else {
        this.editWhatWantToDo = false
      }
    },
    portfolioEditButtonClicked(index) {
      // 初期化
      this.isPortfolioImageChanged = false
      this.tempPortfolioImageFile = null
      this.selectedPortfolioItemIndex = index
      this.tempPortfolio = this.portfolio
      if (index != null) {
        this.tempPortfolioItemImageUrl = this.portfolio[index].imageUrl
        this.tempPortfolioItemTitle = this.portfolio[index].title
        this.tempPortfolioItemContent = this.portfolio[index].content
        this.tempPortfolioItemUrl = this.portfolio[index].url
      } else {
        this.tempPortfolioItemImageUrl = ''
        this.tempPortfolioItemTitle = ''
        this.tempPortfolioItemContent = ''
        this.tempPortfolioItemUrl = ''
      }
      this.editPortfolio = true
    },
    updatePortfolio() {
      // 画像が変更されているか
      if (this.isPortfolioImageChanged) {
        const date = new Date()
        var timestamp = Math.floor( date.getTime() / 1000 )

        if (this.selectedPortfolioItemIndex != null) {
          const fileName = this.portfolio[this.selectedPortfolioItemIndex].timestamp
          storageRef.child(`users/${this.user.uid}/portfolio/${fileName}.jpg`).delete()
        }

        // 画像アップロード
        const self = this
        const uploadTask = storageRef.child(`users/${this.user.uid}/portfolio/${timestamp}.jpg`).put(this.tempPortfolioImageFile)
        uploadTask.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done');
        }, function(error) {
          // Handle unsuccessful uploads
        }, function() {
          // dbに保存
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL)
            // 新しいitem
            const tempPortfolioItem = {
              imageUrl: downloadURL,
              title: self.tempPortfolioItemTitle,
              content: self.tempPortfolioItemContent,
              url: self.tempPortfolioItemUrl,
              timestamp: timestamp
            }
            // listに入れる
            if (self.selectedPortfolioItemIndex != null) {
              self.tempPortfolio.splice(self.selectedPortfolioItemIndex, 1)
              self.tempPortfolio.splice(self.selectedPortfolioItemIndex, 0, tempPortfolioItem)
            } else {
              if (self.tempPortfolio == null) {
                self.tempPortfolio = []
              }
              self.tempPortfolio.push(tempPortfolioItem)
            }
            // dbに保存
            firestore.collection('users').doc(self.user.uid)
              .collection('profile').doc(self.user.uid)
              .update({
                portfolio: self.tempPortfolio,
              })
              .then(() => {
                self.portfolio = self.tempPortfolio
                self.editPortfolio = false
              })
              .catch((error) => {
                console.error("Error adding document: ", error)
              })
          })
        })
      } else {
        const tempPortfolioItem = {
          imageUrl: this.tempPortfolioItemImageUrl,
          title: this.tempPortfolioItemTitle,
          content: this.tempPortfolioItemContent,
          url: this.tempPortfolioItemUrl
        }
        if (this.selectedPortfolioItemIndex != null) {
          this.tempPortfolio.splice(this.selectedPortfolioItemIndex, 1)
          this.tempPortfolio.splice(this.selectedPortfolioItemIndex, 0, tempPortfolioItem)
        }
        const self = this
        firestore.collection('users').doc(this.user.uid)
          .collection('profile').doc(this.user.uid)
          .update({
            portfolio: this.tempPortfolio,
          })
          .then(() => {
            self.portfolio = self.tempPortfolio
            self.editPortfolio = false
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      }
    },
    deletePortfolioItem() {
      // 画像削除
      if (this.selectedPortfolioItemIndex != null) {
        const fileName = this.portfolio[this.selectedPortfolioItemIndex].timestamp
        storageRef.child(`users/${this.user.uid}/portfolio/${fileName}.jpg`).delete()
      }
      const self = this
      this.tempPortfolio.splice(this.selectedPortfolioItemIndex, 1)
      firestore.collection('users').doc(this.user.uid)
        .collection('profile').doc(this.user.uid)
        .update({
          portfolio: this.tempPortfolio,
        })
        .then(() => {
          self.portfolio = self.tempPortfolio
          self.editPortfolio = false
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    },
    skillsEditButtonClicked(index) {
      // 初期化
      this.selectedSkillIndex = index
      this.tempSkills = this.skills
      if (index != null) {
        this.tempSkillTitle = this.skills[index].title
        this.tempSkillContent = this.skills[index].content
      } else {
        this.tempSkillTitle = ''
        this.tempSkillContent = ''
      }
      this.editSkills = true
    },
    updateSkills() {
      // 新しいスキル
      const tempSkill = {
        title: this.tempSkillTitle,
        content: this.tempSkillContent
      }
      // listに入れる
      if (this.selectedSkillIndex != null) {
        this.tempSkills.splice(this.selectedSkillIndex, 1)
        this.tempSkills.splice(this.selectedSkillIndex, 0, tempSkill)
      } else {
        if (this.tempSkills == null) {
          this.tempSkills = []
        }
        this.tempSkills.push(tempSkill)
      }
      // dbに保存
      const self = this
      firestore.collection('users').doc(this.user.uid)
        .collection('profile').doc(this.user.uid)
        .update({
          skills: this.tempSkills,
        })
        .then(() => {
          self.skills = self.tempSkills
          self.editSkills = false
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    },
    deleteSkill() {
      const self = this
      this.tempSkills.splice(this.selectedSkillIndex, 1)
      firestore.collection('users').doc(this.user.uid)
        .collection('profile').doc(this.user.uid)
        .update({
          skills: this.tempSkills,
        })
        .then(() => {
          self.skills = self.tempSkills
          self.editSkills = false
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    },
    linksEditButtonClicked(index) {
      // 初期化
      this.selectedLinkIndex = index
      this.tempLinks = this.links
      if (index != null) {
        this.tempLinkTitle = this.links[index].title
        this.tempLinkUrl = this.links[index].url
      } else {
        this.tempLinkTitle = ''
        this.tempLinkUrl = ''
      }
      this.editLinks = true
    },
    updateLinks() {
      // 新しいリンク
      const tempLink = {
        title: this.tempLinkTitle,
        url: this.tempLinkUrl
      }
      // listに入れる
      if (this.selectedLinkIndex != null) {
        this.tempLinks.splice(this.selectedLinkIndex, 1)
        this.tempLinks.splice(this.selectedLinkIndex, 0, tempLink)
      } else {
        if (this.tempLinks == null) {
          this.tempLinks = []
        }
        this.tempLinks.push(tempLink)
      }
      // dbに保存
      const self = this
      firestore.collection('users').doc(this.user.uid)
        .collection('profile').doc(this.user.uid)
        .update({
          links: this.tempLinks,
        })
        .then(() => {
          self.links = self.tempLinks
          self.editLinks = false
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    },
    deleteLink() {
      const self = this
      this.tempLinks.splice(this.selectedLinkIndex, 1)
      firestore.collection('users').doc(this.user.uid)
        .collection('profile').doc(this.user.uid)
        .update({
          links: this.tempLinks,
        })
        .then(() => {
          self.links = self.tempLinks
          self.editLinks = false
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    },
    userInfoEditButtonClicked() {
      this.tempUniversity = this.university
      this.tempFaculty = this.faculty
      this.tempDepartment = this.department
      this.editUserInfo = true
    },
    updateUserInfo() {
      const self = this
      firestore.collection('users').doc(this.user.uid)
        .collection('profile').doc(this.user.uid)
        .update({
          university: this.tempUniversity,
          faculty: this.tempFaculty,
          department: this.tempDepartment,
        })
        .then(() => {
          self.university = self.tempUniversity
          self.faculty = self.tempFaculty
          self.department = self.tempDepartment
          self.editUserInfo = false
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })

    },
  }
}
</script>
