<template>
  <v-container grid-list-md pa-0>
    <v-layout
      row
      wrap
      justify-center
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
      <v-flex v-else-if="uid && uid != ''" xs12 pt-3 px-2>
        <v-layout row wrap>
          <v-flex xs12 md9>
            <v-card flat>
              <!-- Profile画像 & UserName -->
              <div>
                <v-card-actions
                  class="break py-4"
                  :class="{
                    'px-5': $vuetify.breakpoint.smAndUp,
                    'px-3': $vuetify.breakpoint.xsOnly,
                  }"
                >
                  <v-avatar
                    :size="avatarSize"
                    class="grey lighten-3 clickable"
                    @click="profileImageClicked"
                  >
                    <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                    <v-icon v-else>camera_alt</v-icon>
                  </v-avatar>
                  <span
                    class="text-color font-weight-bold px-3"
                    :class="{
                      'display-1 px-3': $vuetify.breakpoint.mdAndUp,
                      'headline': $vuetify.breakpoint.smAndDown,
                    }"
                  >
                    {{ name }}
                  </span>
                  <v-btn
                    flat
                    :icon="$vuetify.breakpoint.xsOnly"
                    :small="$vuetify.breakpoint.xsOnly"
                    :fab="$vuetify.breakpoint.xsOnly"
                    @click="userNameClicked"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="hidden-xs-only caption teal-text-color">編集する</span>
                  </v-btn>
                </v-card-actions>
                <!-- ProfileImage編集 -->
                <div v-show="isEditingProfileImage">
                  <v-dialog
                    :value="isEditingProfileImage"
                    :fullscreen="$vuetify.breakpoint.xsOnly"
                    persistent
                    width="500"
                  >
                    <v-card>
                      <v-card-title
                        class="headline grey lighten-3"
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
                        <p v-show="!imageFileSizeValid" class="warning-text-color">
                          {{ imageFileSizeWarning }}
                        </p>
                      </v-flex>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          flat
                          @click="updateIsEditingProfileImage(false)"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          color="teal"
                          flat
                          :disabled ="selectedImage == null || !imageFileSizeValid"
                          @click="updateProfileImage({uid: uid, imageFile: imageFile})"
                        >
                          変更
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
                <!-- UserName編集 -->
                <v-form v-show="isEditingUserName" v-model="editUserNameValid">
                  <v-dialog
                    :value="isEditingUserName"
                    :fullscreen="$vuetify.breakpoint.xsOnly"
                    persistent
                    width="500"
                  >
                    <v-card>
                      <v-card-title
                        class="headline grey lighten-3"
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
                          @click="updateIsEditingUserName(false)"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          color="teal"
                          flat
                          :disabled="!editUserNameValid"
                          @click="updateUserName({uid: uid, firstName: tempFirstName, lastName: tempLastName})"
                        >
                          変更
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-form>
              </div>
              <div
                class="break"
                :class="{'px-5': $vuetify.breakpoint.smAndUp}"
              >
                <!-- スコア -->
                <v-tooltip right max-width="300">
                  <template v-slot:activator="{ on }">
                    <v-card
                      v-on="on"
                      ontouchstart=""
                      color="teal lighten-1 hidden-sm-and-up"
                      class="mx-3 mt-3 pa-3"
                      style="border-radius: 10px"
                    >
                      <div class="white--text caption">
                        スコア
                      </div>
                      <div class="text-xs-right pr-4 pt-2 white--text font-weight-bold headline">
                        {{ points }}
                      </div>
                    </v-card>
                  </template>
                  <div class="pa-2 caption">
                    <div>
                      スコアが高い程、スカウトされやすくなります。
                    </div>
                    <div>
                      スコアは、インターンに採用されたり、企業のレビューを書くことで上げることができます。
                    </div>
                  </div>
                </v-tooltip>
                <v-layout row wrap>
                  <!-- プロフィール完成度 -->
                  <v-flex xs12 sm8 md12>
                    <v-card
                      :flat="$vuetify.breakpoint.mdAndUp"
                      class="pa-3 subheading"
                      :class="{'ma-3 mt-4': $vuetify.breakpoint.xsOnly}"
                      style="border-radius: 10px"
                    >
                      <span class="light-text-color">プロフィール完成度: </span>
                      <span class="font-weight-bold text-color">{{ completionPercentage }}%</span>
                      <div
                        v-if="completionPercentage != 100"
                        :class="{'mr-5': $vuetify.breakpoint.mdAndUp}"
                      >
                        <v-progress-linear
                          background-color="grey lighten-3"
                          color="teal lighten-3"
                          height="15"
                          :value="completionPercentage"
                        ></v-progress-linear>
                        <div class="light-text-color caption">
                          <div v-show="completionPercentage <= 50">
                            プロフィール完成度が 50% を超えていないとスカウトされません。
                            出来るだけ入力するようにしましょう。
                          </div>
                          <div v-show="completionPercentage > 50">
                            プロフィール完成度が高いほど、スカウトされやすくなります。
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-flex>
                  <v-flex sm4 hidden-md-and-up hidden-xs-only>
                    <!-- スコア -->
                    <v-tooltip bottom max-width="300">
                      <template v-slot:activator="{ on }">
                        <v-card
                          v-on="on"
                          ontouchstart=""
                          color="teal lighten-1"
                          class="mx-3 pa-3"
                          style="border-radius: 10px"
                        >
                          <div class="white--text caption">
                            スコア
                          </div>
                          <div class="text-xs-right pr-4 pt-2 white--text font-weight-bold headline">
                            {{ points }}
                          </div>
                        </v-card>
                      </template>
                      <div class="pa-2 caption">
                        <div>
                          スコアが高い程、スカウトされやすくなります。
                        </div>
                        <div>
                          スコアは、インターンに採用されたり、企業のレビューを書くことで上げることができます。
                        </div>
                      </div>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <!-- 志望する職種 -->
                <div class="px-2">
                  <v-layout
                    align-center
                    justify-space-between
                    row
                    :class="{
                      'pt-4': $vuetify.breakpoint.xsOnly,
                      'pt-5': $vuetify.breakpoint.smAndUp,
                    }"
                  >
                    <!-- タイトル&編集ボタン -->
                    <v-flex xs8 sm10>
                      <v-card-title
                        class="font-weight-bold"
                        :class="{
                          'subheading': $vuetify.breakpoint.xsOnly,
                          'title': $vuetify.breakpoint.smAndUp,
                        }"
                      >
                        志望する職種
                      </v-card-title>
                    </v-flex>
                    <v-flex xs4 sm2 v-show="!isEditingDesiredOccupations">
                      <v-btn
                        flat
                        @click="desiredOccupationsEditButtonClicked"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">編集する</span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm10>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm10 class="break">
                    <div v-if="!isEditingDesiredOccupations && desiredOccupations">
                      <v-chip v-if="desiredOccupations.engineer">
                        <span>エンジニア</span>
                      </v-chip>
                      <v-chip v-if="desiredOccupations.designer">
                        <span>デザイナー</span>
                      </v-chip>
                      <v-chip v-if="desiredOccupations.sales">
                        <span>営業</span>
                      </v-chip>
                      <v-chip v-if="desiredOccupations.marketer">
                        <span>マーケター</span>
                      </v-chip>
                      <v-chip v-if="desiredOccupations.planner">
                        <span>企画</span>
                      </v-chip>
                      <v-chip v-if="desiredOccupations.writer">
                        <span>ライター</span>
                      </v-chip>
                      <v-chip v-if="desiredOccupations.others">
                        <span>その他</span>
                      </v-chip>
                    </div>
                    <!-- 志望する職種の編集画面 -->
                    <div v-show="isEditingDesiredOccupations" class="text-xs-right">
                      <v-select
                        v-model="tempDesiredOccupations"
                        :items="desiredOccupationsItems"
                        attach
                        chips
                        solo
                        multiple
                      ></v-select>
                      <v-btn
                        @click="updateIsEditingDesiredOccupations(false)"
                      >
                        キャンセル
                      </v-btn>
                      <v-btn
                        @click="updateDesiredOccupations({uid: uid, desiredOccupations: tempDesiredOccupations})"
                      >
                        更新
                      </v-btn>
                    </div>
                  </v-flex>
                </div>
                <!-- 紹介文 -->
                <div class="px-2">
                  <v-layout
                    align-center
                    justify-space-between
                    row
                    class="pt-5"
                  >
                    <!-- タイトル&編集ボタン -->
                    <v-flex xs8 sm10>
                      <v-card-title
                        class="font-weight-bold"
                        :class="{
                          'subheading': $vuetify.breakpoint.xsOnly,
                          'title': $vuetify.breakpoint.smAndUp,
                        }"
                      >
                        紹介文
                      </v-card-title>
                    </v-flex>
                    <v-flex xs4 sm2 v-show="!isEditingSelfIntro">
                      <v-btn
                        flat
                        @click="selfIntroEditButtonClicked"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">編集する</span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm10>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm10 class="break">
                    <!-- 自己紹介の表示 -->
                    <v-card-text v-show="!isEditingSelfIntro">
                      <p class="return">{{ selfIntro }}</p>
                      <div v-show="!isEditingSelfIntro" class="caption light-text-color">
                        ※ 自己紹介の最初の100字は、採用担当者がユーザー検索した際の一覧に表示されます
                      </div>
                    </v-card-text>
                    <!-- 自己紹介の編集画面 -->
                    <div v-show="isEditingSelfIntro" class="text-xs-right">
                      <v-form v-model="editSelfIntroValid">
                        <v-textarea
                          solo
                          counter
                          label="自己紹介"
                          v-model="tempSelfIntro"
                          :rules="selfIntroRules"
                          required
                        ></v-textarea>
                        <v-btn
                          @click="updateIsEditingSelfIntro(false)"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          :disabled="!editSelfIntroValid"
                          @click="updateSelfIntro({uid: uid, selfIntro: tempSelfIntro})"
                        >
                          更新
                        </v-btn>
                      </v-form>
                    </div>
                  </v-flex>
                </div>
                <!-- やりたいこと -->
                <div class="px-2">
                  <v-layout
                    align-center
                    justify-space-between
                    row
                    class="pt-5"
                  >
                    <v-flex xs8 sm10>
                      <v-card-title
                        class="font-weight-bold"
                        :class="{
                          'subheading': $vuetify.breakpoint.xsOnly,
                          'title': $vuetify.breakpoint.smAndUp,
                        }"
                      >
                        やりたいこと・興味のあること
                      </v-card-title>
                    </v-flex>
                    <v-flex xs4 sm2 v-show="!isEditingWhatWantToDo">
                      <v-btn
                        flat
                        @click="whatWantToDoEditButtonClicked"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">編集する</span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm10>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm10 class="break">
                    <!-- やりたいことの表示 -->
                    <v-card-text v-show="!isEditingWhatWantToDo">
                      <p class="return">{{ whatWantToDo }}</p>
                    </v-card-text>
                    <!-- やりたいことの編集画面 -->
                    <div v-show="isEditingWhatWantToDo" class="text-xs-right">
                      <v-form v-model="editWhatWantToDoValid">
                        <v-textarea
                          solo
                          label="やりたいことや興味のあることを書いてください"
                          v-model="tempWhatWantToDo"
                          :rules="whatWantToDoRules"
                          required
                        ></v-textarea>
                        <v-btn
                          @click="updateIsEditingWhatWantToDo(false)"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          :disabled="!editWhatWantToDoValid"
                          @click="updateWhatWantToDo({uid: uid, whatWantToDo: tempWhatWantToDo})"
                        >
                          更新
                        </v-btn>
                      </v-form>
                    </div>
                  </v-flex>
                </div>
                <!-- ポートフォリオ -->
                <div class="px-2">
                  <v-layout
                    align-center
                    justify-space-between
                    row
                    class="pt-5"
                  >
                    <v-flex xs8 sm10>
                      <v-card-title
                        class="font-weight-bold"
                        :class="{
                          'subheading': $vuetify.breakpoint.xsOnly,
                          'title': $vuetify.breakpoint.smAndUp,
                        }"
                      >
                        ポートフォリオ
                      </v-card-title>
                    </v-flex>
                    <v-flex xs4 sm2 v-show="!isEditingPortfolio">
                      <v-btn
                        flat
                        @click="portfolioEditButtonClicked(null)"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">追加する</span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm10>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm10>
                    <!-- ポートフォリオ表示 -->
                    <v-list v-show="!isEditingPortfolio && this.portfolio != null">
                      <template v-for="(item, index) in this.portfolio">
                        <v-layout v-if="!xsWidth" layout class="pt-4 pb-3">
                          <v-flex xs4 sm3 lg2>
                            <v-img :src="item.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                          </v-flex>
                          <v-flex
                            xs8
                            sm9
                            lg10
                            class="break px-4"
                          >
                            <div>
                              <span class="font-weight-bold subheading text-color">{{ item.title }}</span>
                              <v-btn
                                class="pa-0 ma-0"
                                flat
                                @click="portfolioEditButtonClicked(index)"
                              >
                                <v-icon :size="14">edit</v-icon>
                                <span class="caption teal-text-color">編集する</span>
                              </v-btn>
                            </div>
                            <p　class="text-color return">{{ item.content }}</p>
                            <a v-if="item.url" :href="item.url" target="_blank">{{ item.url }}</a>
                          </v-flex>
                        </v-layout>
                        <div v-else class="pt-4 pb-3 px-3">
                          <v-img :src="item.imageUrl" aspect-ratio="1.5" max-height="100"></v-img>
                          <div>
                            <span class="font-weight-bold subheading text-color">{{ item.title }}</span>
                            <v-btn
                              class="pa-0 ma-0"
                              flat
                              @click="portfolioEditButtonClicked(index)"
                            >
                              <v-icon :size="14">edit</v-icon>
                              <span class="caption teal-text-color">編集する</span>
                            </v-btn>
                          </div>
                          <p　class="text-color return">{{ item.content }}</p>
                          <a :href="item.url" target="_blank">{{ item.url }}</a>
                        </div>
                      </template>
                    </v-list>
                    <!-- ポートフォリオ編集画面 -->
                    <div v-show="isEditingPortfolio">
                      <v-form v-model="editPortfolioValid">
                        <div class="d-flex pb-3">
                          <v-flex xs12 sm10 class="px-4 break text-xs-right">
                            <div class="py-3">
                              <v-img :src="tempPortfolioItemImageUrl" height="200" class="grey lighten-3"/>
                              <input type="file" v-on:change="onFileChange">
                              <p v-if="!imageFileSizeValid" class="warning-text-color">
                                {{ imageFileSizeWarning }}
                              </p>
                            </div>
                            <v-text-field
                              solo
                              label="タイトル"
                              v-model="tempPortfolioItemTitle"
                              :rules="portfolioItemTitleRules"
                              required
                            ></v-text-field>
                            <v-text-field
                              solo
                              label="説明"
                              v-model="tempPortfolioItemContent"
                              :rules="portfolioItemContentRules"
                              required
                            ></v-text-field>
                            <v-text-field
                              solo
                              placeholder="URLがある場合は記入してください"
                              v-model="tempPortfolioItemUrl"
                              :rules="portfolioItemUrlRules"
                              required
                            ></v-text-field>
                            <v-btn
                              @click="updateIsEditingPortfolio(false)"
                            >
                              キャンセル
                            </v-btn>
                            <v-btn
                              v-show="selectedPortfolioItemIndex != null"
                              @click="deletePortfolioItem({
                                uid: uid,
                                selectedIndex: selectedPortfolioItemIndex,
                                portfolio: portfolio,
                                tempPortfolio: tempPortfolio
                              })"
                            >
                              削除
                            </v-btn>
                            <v-btn
                              :disabled="
                                !editPortfolioValid ||
                                tempPortfolioItemImageUrl == null ||
                                tempPortfolioItemImageUrl == '' ||
                                !imageFileSizeValid
                              "
                              @click="updatePortfolio({
                                uid: uid,
                                isPortfolioImageChanged: isPortfolioImageChanged,
                                selectedIndex: selectedPortfolioItemIndex,
                                portfolio: portfolio,
                                tempPortfolio: tempPortfolio,
                                imageFile: tempPortfolioImageFile,
                                imageUrl: tempPortfolioItemImageUrl,
                                title: tempPortfolioItemTitle,
                                content: tempPortfolioItemContent,
                                url: tempPortfolioItemUrl
                              })"
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
                <div class="px-2">
                  <v-layout
                    align-center
                    justify-space-between
                    row
                    class="pt-5"
                  >
                    <v-flex xs8 sm10>
                      <v-card-title
                        class="font-weight-bold"
                        :class="{
                          'subheading': $vuetify.breakpoint.xsOnly,
                          'title': $vuetify.breakpoint.smAndUp,
                        }"
                      >
                        スキル
                      </v-card-title>
                    </v-flex>
                    <v-flex xs4 sm2 v-show="!isEditingSkills">
                      <v-btn
                        flat
                        @click="skillsEditButtonClicked(null)"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">編集する</span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm10>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm10 class="break">
                    <!-- スキル表示 -->
                    <v-list v-if="!isEditingSkills && skills != null" class="pl-4">
                      <template v-for="(item, index) in skills">
                        <v-chip>
                          <span>{{ item }}</span>
                        </v-chip>
                      </template>
                    </v-list>
                    <div v-show="!isEditingSkills" class="pl-4 caption light-text-color">
                      ※ 最大５つのスキルがユーザー検索の一覧に表示されます
                    </div>
                    <!-- スキルの編集画面 -->
                    <div v-if="isEditingSkills">
                      <v-form v-model="editSkillsValid">
                        <div class="d-flex pb-3">
                          <v-flex xs12 class="px-4 break text-xs-right">
                            <v-combobox
                              v-model="tempSkills"
                              chips
                              clearable
                              solo
                              multiple
                              hide-no-data
                              hint="スキルを入力後、enterを押すことで入力が確定します"
                              :rules="skillRules"
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
                              @click="updateIsEditingSkills(false)"
                            >
                              キャンセル
                            </v-btn>
                            <v-btn
                              :disabled="!editSkillsValid"
                              @click="updateSkills({
                                uid: uid,
                                skills: tempSkills,
                              })"
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
                <div class="px-2">
                  <v-layout
                    align-center
                    justify-space-between
                    row
                    class="pt-5"
                  >
                    <v-flex xs8 sm10>
                      <v-card-title
                        class="font-weight-bold"
                        :class="{
                          'subheading': $vuetify.breakpoint.xsOnly,
                          'title': $vuetify.breakpoint.smAndUp,
                        }"
                      >
                        関連リンク
                      </v-card-title>
                    </v-flex>
                    <v-flex xs4 sm2 v-show="!isEditingLinks">
                      <v-btn
                        flat
                        @click="linksEditButtonClicked(null)"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">追加する</span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm10>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm10 class="break">
                    <!-- 関連リンク表示 -->
                    <v-list v-if="!isEditingLinks && links != null" class="pl-4">
                      <template v-for="(item, index) in links">
                        <div class="py-2">
                          <div class="font-weight-bold body-2 text-color">
                            {{ item.title }}
                            <v-btn
                              class="pa-0 ma-0"
                              flat
                              @click="linksEditButtonClicked(index)"
                            >
                              <v-icon :size="14">edit</v-icon>
                              <span class="caption teal-text-color">編集する</span>
                            </v-btn>
                          </div>
                          <p>
                            {{ item.url }}
                          </p>
                        </div>
                      </template>
                    </v-list>
                    <!-- 関連リンクの編集画面 -->
                    <div v-show="isEditingLinks">
                      <v-form v-model="editLinksValid">
                        <div class="d-flex pb-3">
                          <v-flex xs12 sm10 class="px-4 break text-xs-right">
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
                              @click="updateIsEditingLinks(false)"
                            >
                              キャンセル
                            </v-btn>
                            <v-btn
                              v-show="selectedLinkIndex != null"
                              @click="deleteLink({
                                uid: uid,
                                selectedIndex: selectedLinkIndex,
                                links: tempLinks
                              })"
                            >
                              削除
                            </v-btn>
                            <v-btn
                              :disabled="!editLinksValid"
                              @click="updateLinks({
                                uid: uid,
                                selectedIndex: selectedLinkIndex,
                                links: tempLinks,
                                title: tempLinkTitle,
                                url: tempLinkUrl
                              })"
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
                <div class="px-2 pb-5">
                  <v-layout
                    align-center
                    justify-space-between
                    row
                    class="pt-5"
                  >
                    <v-flex xs8 sm10>
                      <v-card-title
                        class="font-weight-bold"
                        :class="{
                          'subheading': $vuetify.breakpoint.xsOnly,
                          'title': $vuetify.breakpoint.smAndUp,
                        }"
                      >
                        基本情報
                      </v-card-title>
                    </v-flex>
                    <v-flex xs4 sm2 v-show="!isEditingUserInfo">
                      <v-btn
                        class="text-xs-left"
                        flat
                        @click="userInfoEditButtonClicked"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">編集する</span>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 sm10>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm10 class="break">
                    <!-- 基本情報の表示 -->
                    <v-list v-show="!isEditingUserInfo" class="pl-4">
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
                        <span>卒業予定日:</span>
                        <span class="pl-2">{{ graduationDateText }}</span>
                      </div>
                      <div class="pb-2">
                        <span>生年月日:</span>
                        <span class="pl-2">{{ birthDateText }}</span>
                      </div>
                    </v-list>
                    <div
                      v-show="!isEditingUserInfo"
                      class="pl-4 caption light-text-color"
                    >
                      ※ 卒業予定日は、採用担当者がパスの有効期間を決める際に参考にするため、入力をお願いします。
                    </div>
                    <!-- 基本情報の編集画面 -->
                    <div v-show="isEditingUserInfo" class="text-xs-right">
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
                        <!-- 卒業予定日 -->
                        <v-menu
                          v-model="graduationDateMenu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="tempGraduationDate"
                              label="卒業予定日"
                              append-icon="event"
                              solo
                              readonly
                              required
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="tempGraduationDate"
                            color="teal"
                            locale="ja"
                            @input="graduationDateMenu = false"
                          ></v-date-picker>
                        </v-menu>
                        <v-btn
                          @click="updateIsEditingUserInfo(false)"
                        >
                          キャンセル
                        </v-btn>
                        <v-btn
                          :disabled="!editUserInfoValid || tempGraduationDate == ''"
                          @click="updateUserInfo({
                            uid: uid,
                            university: tempUniversity,
                            faculty: tempFaculty,
                            department: tempDepartment,
                            graduationDate: tempGraduationDate,
                          })"
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
          <v-flex md3 hidden-sm-and-down>
            <!-- スコア -->
            <v-card class="mt-5 pa-3">
              <div class="text-xs-center">
                <v-avatar
                  size="100"
                  color="teal lighten-1"
                >
                  <div class="white--text" style="display: block">
                    <div style="font-size: 10px">
                      スコア
                    </div>
                    <span class="headline">{{ points }}</span>
                  </div>
                </v-avatar>
              </div>
              <div class="pt-3 light-text-color caption">
                <div>
                  スコアが高い程、スカウトされやすくなります。（ユーザー検索の際に、上位に表示されます）
                </div>
                <div class="pt-2">
                  スコアは、インターンに採用されたり、企業のレビューを書くことで上げることができます。
                </div>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  middleware: 'auth',
  head () {
    return {
      title: 'プロフィール',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    windowWidth: 0,
    xsWidth: false,
    imageFileSizeWarning: '5MB以下の画像を選択してください',
    selectedImageSize: 200,
    selectedImage: null,
    imageFile: null,
    tempFirstName: '',
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
    tempDesiredOccupations: [],
    desiredOccupationsItems: [
      'エンジニア',
      'デザイナー',
      '営業',
      'マーケター',
      '企画',
      'ライター',
      'その他'
    ],
    tempSelfIntro: '',
    selfIntroRules: [
      v => (v.length <= 1000) || '1000字以内で入力してください'
    ],
    editSelfIntroValid: true,
    tempWhatWantToDo: '',
    whatWantToDoRules: [
      v => (v.length <= 1000) || '1000字以内で入力してください'
    ],
    editWhatWantToDoValid: true,
    tempPortfolio: null,
    tempPortfolioItemImageUrl: '',
    tempPortfolioItemTitle: '',
    tempPortfolioItemContent: '',
    tempPortfolioItemUrl: '',
    tempPortfolioImageFile: null,
    portfolioItemTitleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v && v.length <= 50) || '50字以内で入力してください'
    ],
    portfolioItemContentRules: [
      v => !!v || '説明を入力してください',
      v => (v && v.length <= 100) || '100字以内で入力してください'
    ],
    portfolioItemUrlRules: [
      v => (v.length <= 100) || '100字以内で入力してください',
      v => (v.includes('http://') || v.includes('https://') || v == null || v == '') || '無効なURLです'
    ],
    editPortfolioValid: true,
    tempSkills: null,
    skillRules: [
      v => (v && !(/\s/.test(v))) || 'スペースを含めないでください',
      v => (v && v.length <= 20) || '20字以内で入力してください'
    ],
    editSkillsValid: true,
    tempLinks: null,
    tempLinkTitle: '',
    tempLinkUrl: '',
    linkTitleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v && v.length <= 50) || '50字以内で入力してください'
    ],
    linkUrlRules: [
      v => !!v || 'URLを入力してください',
      v => (v && v.length <= 200) || '200字以内で入力してください',
      v => (v.includes('http://') || v.includes('https://')) || '無効なURLです'
    ],
    editLinksValid: true,
    tempUniversity: '',
    tempFaculty: '',
    tempDepartment: '',
    graduationDateMenu: false,
    tempGraduationDate: '',
    userInfoRules: [
      v => (v.length <= 50) || '50字以内で記入してください'
    ],
    editUserInfoValid: true,
  }),
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    completionPercentage() {
      var percentage = 0

      percentage += (this.imageUrl && this.imageUrl != '') ? 12 : 0
      if (this.desiredOccupations) {
        var isSelected = false
        if (this.desiredOccupations.engineer == true) {
          isSelected = true
        }
        if (this.desiredOccupations.designer == true) {
          isSelected = true
        }
        if (this.desiredOccupations.sales == true) {
          isSelected = true
        }
        if (this.desiredOccupations.marketer == true) {
          isSelected = true
        }
        if (this.desiredOccupations.planner == true) {
          isSelected = true
        }
        if (this.desiredOccupations.writer == true) {
          isSelected = true
        }
        if (this.desiredOccupations.others == true) {
          isSelected = true
        }
        percentage += isSelected ? 12 : 0
      }
      percentage += (this.selfIntro && this.selfIntro != '') ? 12 : 0
      percentage += (this.whatWantToDo && this.whatWantToDo != '') ? 12 : 0
      percentage += (this.portfolio && this.portfolio.length > 0) ? 12 : 0
      percentage += (this.skills && this.skills.length > 0) ? 12 : 0
      percentage += (this.links && this.links.length > 0) ? 12 : 0
      percentage += (this.university && this.university != '') ? 4 : 0
      percentage += (this.faculty && this.faculty != '') ? 4 : 0
      percentage += (this.department && this.department != '') ? 4 : 0
      percentage += (this.graduationDate && this.graduationDate != '') ? 4 : 0
      return percentage
    },
    avatarSize() {
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        return 40
      } else {
        return 60
      }
    },
    name: function() {
      return this.lastName + ' ' + this.firstName
    },
    graduationDateText: function() {
      let date = this.graduationDate
      if (date) {
        let year  = date.getFullYear()
        let month = date.getMonth() + 1
        let day  = date.getDate()
        date = `${year}/${month}/${day}`
        return date
      }
    },
    birthDateText: function() {
      if (this.birthDate) {
        const date = new Date( this.birthDate.seconds * 1000 )
        const year  = date.getFullYear()
        const month = date.getMonth() + 1
        const day  = date.getDate()
        if (year != null && month != null && day!= null) {
          return `${year}/${month}/${day}`
        }
      }
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      isLoading: state => state.profile.isLoading,
      points: state => state.profile.points,
      imageUrl: state => state.profile.imageUrl,
      imageFileSizeValid: state => state.profile.imageFileSizeValid,
      isEditingProfileImage: state => state.profile.isEditingProfileImage,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      isEditingUserName: state => state.profile.isEditingUserName,
      desiredOccupations: state => state.profile.desiredOccupations,
      isEditingDesiredOccupations: state => state.profile.isEditingDesiredOccupations,
      selfIntro: state => state.profile.selfIntro,
      isEditingSelfIntro: state => state.profile.isEditingSelfIntro,
      whatWantToDo: state => state.profile.whatWantToDo,
      isEditingWhatWantToDo: state => state.profile.isEditingWhatWantToDo,
      portfolio: state => state.profile.portfolio,
      isPortfolioImageChanged: state => state.profile.isPortfolioImageChanged,
      selectedPortfolioItemIndex: state => state.profile.selectedPortfolioItemIndex,
      isEditingPortfolio: state => state.profile.isEditingPortfolio,
      skills: state => state.profile.skills,
      isEditingSkills: state => state.profile.isEditingSkills,
      links: state => state.profile.links,
      selectedLinkIndex: state => state.profile.selectedLinkIndex,
      isEditingLinks: state => state.profile.isEditingLinks,
      email: state => state.profile.email,
      university: state => state.profile.university,
      faculty: state => state.profile.faculty,
      department: state => state.profile.department,
      graduationDate: state => state.profile.graduationDate,
      birthDate: state => state.profile.birthDate,
      isEditingUserInfo: state => state.profile.isEditingUserInfo,
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
    this.windowWidth = window.innerWidth

    if (this.uid != null && this.uid != '' && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryProfile(this.uid)
    }
  },
  watch: {
    uid(uid) {
      if (uid != null && uid != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryProfile(uid)
      }
    },
    windowWidth(width) {
      if (width < 450) {
        this.xsWidth = true
      }
    }
  },
  methods: {
    profileImageClicked() {
      this.updateImageFileSizeValid(true)
      this.updateIsEditingProfileImage(true)
      this.selectedImage = null
      this.imageFile = null
    },
    onFileChange(e) {
      this.updateImageFileSizeValid(true)
      let files = e.target.files || e.dataTransfer.files
      // 画像サイズは5MB以下のみ
      if (files[0] != null && files[0].size/1024/1024 <= 5) {
        if (this.isEditingProfileImage) {
          this.imageFile = files[0]
        } else if (this.isEditingPortfolio) {
          this.updateIsPortfolioImageChanged(true)
          this.tempPortfolioImageFile = files[0]
        }
      } else {
        this.updateImageFileSizeValid(false)
      }

      if (this.imageFileSizeValid) {
        this.createImage(files[0])
      }
    },
    createImage(file) {
      // アップロードした画像を表示
      let reader = new FileReader()
      reader.onload = (e) => {
        if (this.isEditingProfileImage) {
          this.selectedImage = e.target.result
        } else if (this.isEditingPortfolio) {
          this.tempPortfolioItemImageUrl = e.target.result
        }
      }
      reader.readAsDataURL(file)
    },
    userNameClicked() {
      this.updateIsEditingUserName(true)
      this.tempFirstName = this.firstName
      this.tempLastName = this.lastName
    },
    desiredOccupationsEditButtonClicked() {
      this.tempDesiredOccupations = []
      if (this.desiredOccupations) {
        if (this.desiredOccupations.engineer == true) {
          this.tempDesiredOccupations.push('エンジニア')
        }
        if (this.desiredOccupations.designer == true) {
          this.tempDesiredOccupations.push('デザイナー')
        }
        if (this.desiredOccupations.sales == true) {
          this.tempDesiredOccupations.push('営業')
        }
        if (this.desiredOccupations.marketer == true) {
          this.tempDesiredOccupations.push('マーケター')
        }
        if (this.desiredOccupations.planner == true) {
          this.tempDesiredOccupations.push('企画')
        }
        if (this.desiredOccupations.writer == true) {
          this.tempDesiredOccupations.push('ライター')
        }
        if (this.desiredOccupations.others == true) {
          this.tempDesiredOccupations.push('その他')
        }
      }

      this.updateIsEditingDesiredOccupations(true)
    },
    selfIntroEditButtonClicked() {
      this.tempSelfIntro = this.selfIntro
      this.updateIsEditingSelfIntro(true)
    },
    whatWantToDoEditButtonClicked() {
      this.tempWhatWantToDo = this.whatWantToDo
      this.updateIsEditingWhatWantToDo(true)
    },
    portfolioEditButtonClicked(index) {
      // 初期化
      this.updateImageFileSizeValid(true)
      this.updateIsPortfolioImageChanged(false)
      this.tempPortfolioImageFile = null
      this.setSelectedPortfolioItemIndex(index)
      this.tempPortfolio = this.portfolio
      if (index != null) {
        this.tempPortfolioItemImageUrl = this.portfolio[index].imageUrl
        this.tempPortfolioItemTitle = this.portfolio[index].title
        this.tempPortfolioItemContent = this.portfolio[index].content
        this.tempPortfolioItemUrl = this.portfolio[index].url ? this.portfolio[index].url : ''
      } else {
        this.tempPortfolioItemImageUrl = ''
        this.tempPortfolioItemTitle = ''
        this.tempPortfolioItemContent = ''
        this.tempPortfolioItemUrl = ''
      }
      this.updateIsEditingPortfolio(true)
    },
    skillsEditButtonClicked(index) {
      this.tempSkills = this.skills
      this.updateIsEditingSkills(true)
    },
    removeSkill (item) {
      this.tempSkills.splice(this.tempSkills.indexOf(item), 1)
      this.tempSkills = [...this.tempSkills]
    },
    linksEditButtonClicked(index) {
      // 初期化
      this.setSelectedLinkIndex(index)
      this.tempLinks = this.links
      if (index != null) {
        this.tempLinkTitle = this.links[index].title
        this.tempLinkUrl = this.links[index].url
      } else {
        this.tempLinkTitle = ''
        this.tempLinkUrl = ''
      }
      this.updateIsEditingLinks(true)
    },
    userInfoEditButtonClicked() {
      this.tempUniversity = this.university
      this.tempFaculty = this.faculty
      this.tempDepartment = this.department

      if (this.graduationDate) {
        let date = this.graduationDate
        this.tempGraduationDate =
          String(date.getFullYear()) + '-' +
          String(date.getMonth() + 1) + '-' +
          String(date.getDate())
      }

      this.updateIsEditingUserInfo(true)
    },
    ...mapActions({
      queryProfile: 'profile/queryProfile',
      updateIsLoading: 'profile/updateIsLoading',
      updateImageFileSizeValid: 'profile/updateImageFileSizeValid',
      updateIsEditingProfileImage: 'profile/updateIsEditingProfileImage',
      updateProfileImage: 'profile/updateProfileImage',
      updateIsEditingUserName: 'profile/updateIsEditingUserName',
      updateUserName: 'profile/updateUserName',
      updateIsEditingDesiredOccupations: 'profile/updateIsEditingDesiredOccupations',
      updateDesiredOccupations: 'profile/updateDesiredOccupations',
      updateIsEditingSelfIntro: 'profile/updateIsEditingSelfIntro',
      updateSelfIntro: 'profile/updateSelfIntro',
      updateIsEditingWhatWantToDo: 'profile/updateIsEditingWhatWantToDo',
      updateWhatWantToDo: 'profile/updateWhatWantToDo',
      updateIsPortfolioImageChanged: 'profile/updateIsPortfolioImageChanged',
      setSelectedPortfolioItemIndex: 'profile/setSelectedPortfolioItemIndex',
      updateIsEditingPortfolio: 'profile/updateIsEditingPortfolio',
      updatePortfolio: 'profile/updatePortfolio',
      deletePortfolioItem: 'profile/deletePortfolioItem',
      updateIsEditingSkills: 'profile/updateIsEditingSkills',
      updateSkills: 'profile/updateSkills',
      setSelectedLinkIndex: 'profile/setSelectedLinkIndex',
      updateIsEditingLinks: 'profile/updateIsEditingLinks',
      updateLinks: 'profile/updateLinks',
      deleteLink: 'profile/deleteLink',
      updateIsEditingUserInfo: 'profile/updateIsEditingUserInfo',
      updateUserInfo: 'profile/updateUserInfo',
      resetState: 'profile/resetProfileState',
    }),
  }
}
</script>
