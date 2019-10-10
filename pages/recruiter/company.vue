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
    <v-flex v-else-if="uid && uid != ''" xs12>
      <v-snackbar
       v-model="snackbar"
       color="teal lighten-1"
       :multi-line="true"
       :timeout="6000"
       :left="true"
       :bottom="true"
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
      <!-- Top Image -->
      <v-flex xs12>
        <v-img
          v-if="topImageUrl"
          :src="topImageUrl"
          :aspect-ratio="imageRatio"
        ></v-img>
        <v-btn
          v-if="topImageUrl"
          class="text-color"
          absolute
          top
          left
          style="top: 20px"
          @click="topImageClicked"
        >
          トップ画像を設定
        </v-btn>
        <div v-if="!topImageUrl" class="grey lighten-1" style="height: 200px;">
          <v-btn
            flat
            @click="topImageClicked"
            style="color: #ffffff"
          >
            トップ画像を設定
          </v-btn>
        </div>
        <!-- TopImage編集 -->
        <div>
          <v-dialog
            :value="isEditingTopImage"
            :fullscreen="$vuetify.breakpoint.xsOnly"
            persistent
            width="500"
          >
            <v-card>
              <v-card-title
                class="headline grey lighten-3"
                primary-title
              >
                トップ画像を変更
              </v-card-title>
              <v-flex xs10 offset-xs1>
                <div class="py-4">
                  <v-img v-if="selectedTopImage" :src="selectedTopImage" height="200" />
                  <v-img v-else-if="topImageUrl" :src="topImageUrl" height="200" />
                  <div v-else class="grey lighten-3" style="height: 200px;"></div>
                </div>
                <input type="file" v-on:change="onTopImageFileChange" accept='image/*'>
                <p v-if="!topImageFileSizeValid" class="warning-text-color">
                  {{ imageFileSizeWarning }}
                </p>
              </v-flex>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  flat
                  @click="updateIsEditingTopImage(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  color="primary"
                  flat
                  :loading="uploading"
                  :disabled ="selectedTopImage == null || !topImageFileSizeValid || plan == null"
                  @click="updateTopImage({companyId: companyId, imageFile: topImageFile});uploading = true"
                >
                  変更
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-flex>
      <v-flex xs12 class="py-3 px-4 break">
        <!-- CompanyImage & CompanyName -->
        <div class="py-4 align-center">
          <v-card flat>
            <v-flex
              layout
            >
              <v-avatar
                :size="avatarSize"
                class="clickable avatar-border"
                @click="companyImageClicked"
              >
                <img v-if="companyImageUrl" :src="companyImageUrl">
                <v-icon v-else>camera_alt</v-icon>
              </v-avatar>
              <div class="pt-2">
                <div class="title text-color font-weight-bold break pl-4">
                  {{ companyName }}
                </div>
                <div>
                  <v-btn
                    flat
                    small
                    @click="editCompanyNameButtonClicked"
                  >
                    <v-icon :size="14">edit</v-icon>
                    <span class="caption teal-text-color">編集する</span>
                  </v-btn>
                </div>
              </div>
            </v-flex>
          </v-card>
          <!-- CompanyImage編集 -->
          <div>
            <v-dialog
              :value="isEditingCompanyImage"
              :fullscreen="$vuetify.breakpoint.xsOnly"
              persistent
              width="500"
            >
              <v-card>
                <v-card-title
                  class="headline grey lighten-3"
                  primary-title
                >
                  企業ロゴを変更
                </v-card-title>
                <v-flex xs10 offset-xs1 text-xs-center>
                  <div class="py-4">
                    <v-avatar
                      :size="selectedCompanyImageSize"
                      class="avatar-border"
                    >
                      <v-img v-if="selectedCompanyImage" :src="selectedCompanyImage" />
                      <v-img v-else-if="companyImageUrl" :src="companyImageUrl" />
                      <v-icon v-else >camera_alt</v-icon>
                    </v-avatar>
                  </div>
                  <input type="file" v-on:change="onCompanyImageFileChange" accept='image/*'>
                  <p v-if="!companyImageFileSizeValid" class="warning-text-color">
                    {{ imageFileSizeWarning }}
                  </p>
                </v-flex>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    @click="updateIsEditingCompanyImage(false)"
                  >
                    キャンセル
                  </v-btn>
                  <v-btn
                    color="primary"
                    flat
                    :loading="uploading"
                    :disabled ="selectedCompanyImage == null || !companyImageFileSizeValid || plan == null"
                    @click="updateCompanyImage({companyId: companyId, imageFile: companyImageFile});uploading = true"
                  >
                    変更
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <!-- CompanyName編集 -->
          <v-form v-model="editCompanyNameValid" @submit.prevent="">
            <v-dialog
              :value="isEditingCompanyName"
              :fullscreen="$vuetify.breakpoint.xsOnly"
              persistent
              width="500"
            >
              <v-card>
                <v-card-title
                  class="headline grey lighten-3"
                  primary-title
                >
                  企業名を変更
                </v-card-title>
                <v-flex xs10 offset-xs1 py-3>
                  <v-text-field
                    label="企業名"
                    v-model="tempCompanyName"
                    :rules="companyNameRules"
                    required
                  ></v-text-field>
                </v-flex>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    @click="updateIsEditingCompanyName(false)"
                  >
                    キャンセル
                  </v-btn>
                  <v-btn
                    color="primary"
                    flat
                    :disabled="!editCompanyNameValid || plan == null"
                    @click="updateCompanyName({companyId: companyId, companyName: tempCompanyName})"
                  >
                    変更
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-form>
        </div>
        <!-- メンバー -->
        <div v-if="members" class="py-4">
          <p
            class="font-weight-bold text-color"
            :class="{
              'title': $vuetify.breakpoint.smAndUp,
              'subheading': $vuetify.breakpoint.xsOnly
            }"
          >
            メンバー({{ members.length }})
          </p>
          <div>
            <v-card flat>
              <v-card-text class="overflow-hidden py-0">
                <v-layout class="horiz-scroll">
                  <div
                    v-for="member in members"
                    :key="member.uid"
                    class="pr-4"
                  >
                    <div class="text-xs-center" style="max-width: 150px;">
                      <v-avatar
                        :size="avatarSize"
                        class="avatar-border"
                      >
                        <img v-if="member.imageUrl" :src="member.imageUrl">
                      </v-avatar>
                      <div class="sub-title1 py-2 font-weight-bold text-color">
                        {{ member.name}}
                      </div>
                      <div v-if="member.position" class="text-color">
                        {{ member.position}}
                      </div>
                    </div>
                  </div>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>
          <div class="py-3">
            <v-btn
              flat
              small
              @click="addMemberButtonClicked"
            >
              <span class="teal-text-color">メンバーを追加する</span>
            </v-btn>
          </div>
          <v-dialog
            v-model="addMemberDialog"
            :fullscreen="$vuetify.breakpoint.xsOnly"
            width="500"
          >
            <v-card class="pt-5 pb-3 px-3">
              <v-toolbar flat color="white hidden-sm-and-up">
                <v-toolbar-side-icon
                  @click="addMemberDialog=false"
                ></v-toolbar-side-icon>
              </v-toolbar>
              <v-flex
                xs12
                class="text-xs-center"
                :class="{'px-2': $vuetify.breakpoint.smAndUp, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
              >
                <!-- ログインフォーム -->
                <v-form v-model="addMemberValid" @submit.prevent="">
                  <v-container>
                    <v-layout
                      column
                      justify-center
                    >
                      <v-flex xs12>
                        <!-- メールアドレス -->
                        <v-text-field
                          v-model="memberEmail"
                          :rules="emailRules"
                          label="メールアドレス"
                          append-icon="mail_outline"
                          solo
                          required
                        ></v-text-field>
                      </v-flex>
                      <!-- 招待ボタン -->
                      <v-btn
                        :disabled="!addMemberValid || addMemberLoading || plan == null"
                        class="teal lighten-1"
                        @click="inviteMember"
                      >
                        <span
                          class="font-weight-bold body-1"
                          style="color: #ffffff;"
                        >
                          招待
                        </span>
                      </v-btn>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-flex>
            </v-card>
          </v-dialog>
        </div>
        <!-- Mission -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              Mission
            </v-card-title>
            <div v-show="!isEditingMission">
              <v-btn
                flat
                small
                @click="editMissionButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingMission">
              <p class="return text-color">{{ mission }}</p>
            </v-card-text>
            <div v-show="isEditingMission">
              <v-form v-model="editMissionValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="Mission"
                  v-model="tempMission"
                  :rules="missionRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingMission(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editMissionValid || plan == null"
                  @click="updateMission({companyId: companyId, mission: tempMission})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- Vision -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              Vision
            </v-card-title>
            <div v-show="!isEditingVision">
              <v-btn
                flat
                small
                @click="editVisionButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingVision">
              <p class="return text-color">{{ vision }}</p>
            </v-card-text>
            <div v-show="isEditingVision">
              <v-form v-model="editVisionValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="Vision"
                  v-model="tempVision"
                  :rules="visionRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingVision(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editVisionValid || plan == null"
                  @click="updateVision({companyId: companyId, vision: tempVision})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- value -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              Value
            </v-card-title>
            <div v-show="!isEditingValue">
              <v-btn
                flat
                small
                @click="editValueButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingValue">
              <p class="return text-color">{{ value }}</p>
            </v-card-text>
            <div v-show="isEditingValue">
              <v-form v-model="editValueValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="Value"
                  v-model="tempValue"
                  :rules="valueRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingValue(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editValueValid || plan == null"
                  @click="updateValue({companyId: companyId, value: tempValue})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- Culture -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              Culture
            </v-card-title>
            <div v-show="!isEditingCulture">
              <v-btn
                flat
                small
                @click="editCultureButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingCulture">
              <p class="return text-color">{{ culture }}</p>
            </v-card-text>
            <div v-show="isEditingCulture">
              <v-form v-model="editCultureValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="Culture"
                  v-model="tempCulture"
                  :rules="cultureRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingCulture(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editCultureValid || plan == null"
                  @click="updateCulture({companyId: companyId, culture: tempCulture})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- System -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              社内制度
            </v-card-title>
            <div v-show="!isEditingSystem">
              <v-btn
                flat
                small
                @click="editSystemButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingSystem">
              <p class="return text-color">{{ system }}</p>
            </v-card-text>
            <div v-show="isEditingSystem">
              <v-form v-model="editSystemValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="社内制度"
                  v-model="tempSystem"
                  :rules="systemRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingSystem(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editSystemValid || plan == null"
                  @click="updateSystem({companyId: companyId, system: tempSystem})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- Why -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
              }"
            >
              なぜやるのか
            </v-card-title>
            <div v-show="!isEditingWhy">
              <v-btn
                flat
                small
                @click="editWhyButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingWhy">
              <p class="return text-color">{{ why }}</p>
            </v-card-text>
            <div v-show="isEditingWhy">
              <v-form v-model="editWhyValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="なぜやるのか"
                  v-model="tempWhy"
                  :rules="whyRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingWhy(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editWhyValid || plan == null"
                  @click="updateWhy({companyId: companyId, why: tempWhy})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- What -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              何をやっているのか
            </v-card-title>
            <div v-show="!isEditingWhat">
              <v-btn
                flat
                small
                @click="editWhatButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingWhat">
              <p class="return text-color">{{ what }}</p>
            </v-card-text>
            <div v-show="isEditingWhat">
              <v-form v-model="editWhatValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="何をやっているのか"
                  v-model="tempWhat"
                  :rules="whatRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingWhat(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editWhatValid || plan == null"
                  @click="updateWhat({companyId: companyId, what: tempWhat})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- Services -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              サービス
            </v-card-title>
            <div v-show="!isEditingServices">
              <v-btn
                flat
                small
                @click="editServicesButtonClicked(null)"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">追加する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 pb-5>
            <!-- サービス表示 -->
            <v-list
              v-if="!isEditingServices && this.services != null"
              :class="{
                'pl-4': $vuetify.breakpoint.smAndUp,
              }"
            >
              <template v-for="(service, index) in this.services">
                <v-layout v-if="!xsWidth" layout class="pt-4 pb-3">
                  <v-flex xs4 sm3 lg2>
                    <v-img :src="service.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                  </v-flex>
                  <v-flex
                    xs8
                    sm9
                    lg10
                    class="break"
                    :class="{
                      'px-4': $vuetify.breakpoint.smAndUp,
                      'pl-4': $vuetify.breakpoint.xsOnly,
                    }"
                  >
                    <div>
                      <span class="font-weight-bold subheading text-color">{{ service.title }}</span>
                      <v-btn
                        class="pa-0 ma-0"
                        flat
                        @click="editServicesButtonClicked(index)"
                      >
                        <v-icon :size="14">edit</v-icon>
                        <span class="caption teal-text-color">編集する</span>
                      </v-btn>
                    </div>
                    <p　class="text-color return">{{ service.content }}</p>
                    <a :href="service.url" target="_blank">{{ service.url }}</a>
                  </v-flex>
                </v-layout>
                <div v-else class="pt-4 pb-3">
                  <v-img :src="service.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                  <div>
                    <span class="font-weight-bold subheading text-color">{{ service.title }}</span>
                    <v-btn
                      class="pa-0 ma-0"
                      flat
                      @click="editServicesButtonClicked(index)"
                    >
                      <v-icon :size="14">edit</v-icon>
                      <span class="caption teal-text-color">編集する</span>
                    </v-btn>
                  </div>
                  <p　class="text-color return">{{ service.content }}</p>
                  <a :href="service.url" target="_blank">{{ service.url }}</a>
                </div>
              </template>
            </v-list>
            <!-- サービス編集画面 -->
            <div v-if="isEditingServices">
              <v-form v-model="editServicesValid" @submit.prevent="">
                <div class="d-flex pb-3">
                  <v-flex xs12 sm10 class="px-4 break">
                    <div class="py-3">
                      <v-img :src="tempServiceImageUrl" aspect-ratio="2" class="grey lighten-3"/>
                      <input type="file" v-on:change="onServiceImageFileChange" accept='image/*'>
                      <p v-if="!serviceImageFileSizeValid" class="warning-text-color">
                        {{ imageFileSizeWarning }}
                      </p>
                    </div>
                    <v-text-field
                      solo
                      label="タイトル"
                      v-model="tempServiceTitle"
                      :rules="serviceTitleRules"
                      required
                    ></v-text-field>
                    <v-text-field
                      solo
                      label="説明"
                      v-model="tempServiceContent"
                      :rules="serviceContentRules"
                      required
                    ></v-text-field>
                    <v-text-field
                      solo
                      placeholder="URLがある場合は記入してください"
                      v-model="tempServiceUrl"
                      :rules="serviceUrlRules"
                      required
                    ></v-text-field>
                    <v-btn
                      @click="updateIsEditingServices(false)"
                    >
                      キャンセル
                    </v-btn>
                    <v-btn
                      v-if="selectedServiceIndex != null"
                      :disabled="plan == null"
                      @click="deleteService({
                        companyId: companyId,
                        selectedIndex: selectedServiceIndex,
                        services: services,
                        tempServices: tempServices
                      })"
                    >
                      削除
                    </v-btn>
                    <v-btn
                      :loading="uploading"
                      :disabled="
                        !editServicesValid ||
                        tempServiceImageUrl == null ||
                        tempServiceImageUrl == '' ||
                        !serviceImageFileSizeValid ||
                        plan == null
                      "
                      @click="updateServices({
                        companyId: companyId,
                        companyName: companyName,
                        companyImageUrl: companyImageUrl,
                        isServiceImageChanged: isServiceImageChanged,
                        selectedIndex: selectedServiceIndex,
                        services: services,
                        tempServices: tempServices,
                        imageFile: tempServiceImageFile,
                        imageUrl: tempServiceImageUrl,
                        title: tempServiceTitle,
                        content: tempServiceContent,
                        url: tempServiceUrl
                      });uploading = true"
                    >
                      更新
                    </v-btn>
                  </v-flex>
                </div>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- Welfare -->
        <div>
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-4"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              福利厚生
            </v-card-title>
            <div v-show="!isEditingWelfare">
              <v-btn
                flat
                small
                @click="editWelfareButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </div>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <v-card-text v-show="!isEditingWelfare">
              <p class="return text-color">{{ welfare }}</p>
            </v-card-text>
            <div v-show="isEditingWelfare">
              <v-form v-model="editWelfareValid" @submit.prevent="">
                <v-textarea
                  solo
                  label="福利厚生"
                  v-model="tempWelfare"
                  :rules="welfareRules"
                  required
                ></v-textarea>
                <v-btn
                  @click="updateIsEditingWelfare(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editWelfareValid || plan == null"
                  @click="updateWelfare({companyId: companyId, welfare: tempWelfare})"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- 企業情報 -->
        <div class="mb-5">
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-5"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              企業情報
            </v-card-title>
            <v-btn
              v-show="!isEditingCompanyInfo"
              class="text-xs-left"
              flat
              @click="editCompanyInfoButtonClicked"
            >
              <v-icon :size="14">edit</v-icon>
              <span class="caption teal-text-color">編集する</span>
            </v-btn>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <!-- 企業情報の表示 -->
            <v-list v-show="!isEditingCompanyInfo" class="pl-4 pt-4">
              <div class="pb-2 text-color">
                <span>設立日:</span>
                <span class="pl-2">{{ founded }}</span>
              </div>
              <div class="pb-2 text-color">
                <span>所在地:</span>
                <span class="pl-2">{{ location }}</span>
              </div>
              <div class="pb-2 text-color">
                <span>社員数:</span>
                <span class="pl-2">{{ employeesCount }}</span>
              </div>
              <div class="pb-2 text-color">
                <span>ホームページ:</span>
                <span class="pl-2">{{ url }}</span>
              </div>
            </v-list>
            <!-- 企業情報の編集画面 -->
            <div v-show="isEditingCompanyInfo">
              <v-form v-model="editCompanyInfoValid" @submit.prevent="">
                <!-- 設立日 -->
                <v-menu
                  v-model="foundedDateMenu"
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
                      v-model="tempFoundedDate"
                      label="設立日"
                      append-icon="event"
                      solo
                      readonly
                      required
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="tempFoundedDate"
                    color="teal"
                    locale="ja"
                    @input="foundedDateMenu = false"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  solo
                  label="所在地"
                  append-icon="place"
                  v-model="tempLocation"
                  :rules="locationRules"
                  required
                ></v-text-field>
                <v-text-field
                  solo
                  label="社員数"
                  append-icon="person_outline"
                  v-model="tempEmployeesCount"
                  type="number"
                  required
                ></v-text-field>
                <v-text-field
                  solo
                  label="ホームページ"
                  append-icon="home"
                  v-model="tempUrl"
                  :rules="urlRules"
                  required
                ></v-text-field>
                <v-btn
                  @click="updateIsEditingCompanyInfo(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editCompanyInfoValid || plan == null"
                  @click="updateCompanyInfo({
                    companyId: companyId,
                    location: tempLocation,
                    employeesCount: Number(tempEmployeesCount),
                    foundedDate: tempFoundedDate,
                    url: tempUrl,
                  })"
                >
                  更新
                </v-btn>
              </v-form>
            </div>
          </v-flex>
        </div>
        <!-- 雇用情報 -->
        <div class="mb-5">
          <v-layout
            align-center
            justify-space-between
            row
            class="pt-5"
          >
            <v-card-title
              class="font-weight-bold text-color"
              :class="{
                'title': $vuetify.breakpoint.smAndUp,
                'subheading': $vuetify.breakpoint.xsOnly
              }"
            >
              雇用情報
            </v-card-title>
            <v-btn
              v-show="!isEditingEmploymentInfo"
              class="text-xs-left"
              flat
              @click="editEmploymentInfoButtonClicked"
            >
              <v-icon :size="14">edit</v-icon>
              <span class="caption teal-text-color">編集する</span>
            </v-btn>
          </v-layout>
          <v-flex xs12 sm10>
            <v-divider></v-divider>
            <div class="pl-3 pt-2 text-color">
              ※ 年度が変わりましたら随時情報を更新してください
            </div>
          </v-flex>
          <v-flex xs12 sm10 class="break">
            <!-- 雇用情報の表示 -->
            <v-list v-show="!isEditingEmploymentInfo" class="pl-4 pt-4">
              <div
                v-if="newGrad || newGradResignee || averageYearsOfService || averageAge"
                class="py-4 subheading font-weight-bold text-color"
              >
                募集・採用に関する情報
              </div>
              <div v-if="newGrad" class="pb-2 text-color">
                <span>前年度の新卒採用者数:</span>
                <span class="pl-2">{{ newGrad }} 人</span>
              </div>
              <div v-if="newGradResignee" class="pb-2 text-color">
                <span>前年度の新卒離職者数:</span>
                <span class="pl-2">{{ newGradResignee }} 人</span>
              </div>
              <div v-if="averageYearsOfService" class="pb-2 text-color">
                <span>平均勤続年数:</span>
                <span class="pl-2">{{ averageYearsOfService }} 年</span>
              </div>
              <div v-if="averageAge" class="pb-2 text-color">
                <span>社員の平均年齢:</span>
                <span class="pl-2">{{ averageAge }} 歳</span>
              </div>
              <div
                v-if="training || selfDevSupport || mentor || careerSupport || testSystem"
                class="py-4 subheading font-weight-bold text-color"
              >
                職業能力の開発及び向上に関する取組の実施状況
              </div>
              <ol>
                <li v-if="training" class="pb-4 text-color">
                  <span>研修:</span>
                  <span v-if="training.exists" class="pl-2 font-weight-bold">有</span>
                  <span v-else class="pl-2 font-weight-bold">無</span>
                  <div v-if="training.content" class="pt-2 text-color">{{ training.content }}</div>
                </li>
                <li v-if="selfDevSupport" class="pb-4 text-color">
                  <span>資格取得支援制度:</span>
                  <span v-if="selfDevSupport.exists" class="pl-2 font-weight-bold">有</span>
                  <span v-else class="pl-2 font-weight-bold">無</span>
                  <div v-if="selfDevSupport.content" class="pt-2 text-color">{{ selfDevSupport.content }}</div>
                </li>
                <li v-if="mentor" class="pb-4 text-color">
                  <span>メンター制度:</span>
                  <span v-if="mentor.exists" class="pl-2 font-weight-bold">有</span>
                  <span v-else class="pl-2 font-weight-bold">無</span>
                </li>
                <li v-if="careerSupport" class="pb-4 text-color">
                  <span>キャリアサポート:</span>
                  <span v-if="careerSupport.exists" class="pl-2 font-weight-bold">有</span>
                  <span v-else class="pl-2 font-weight-bold">無</span>
                  <div v-if="careerSupport.content" class="pt-2 text-color">{{ careerSupport.content }}</div>
                </li>
                <li v-if="testSystem" class="pb-4 text-color">
                  <span>社内検定:</span>
                  <span v-if="testSystem.exists" class="pl-2 font-weight-bold">有</span>
                  <span v-else class="pl-2 font-weight-bold">無</span>
                  <div v-if="testSystem.content" class="pt-2 text-color">{{ testSystem.content }}</div>
                </li>
              </ol>
              <div
                v-if="
                  overtimeWork ||
                  paidHolidays ||
                  (childcareLeave &&
                  ((childcareLeave.man && childcareLeave.man.taken) ||
                  (childcareLeave.woman && childcareLeave.woman.taken))) ||
                  femaleExecutives"
                class="py-4 subheading font-weight-bold text-color"
              >
                職場への定着の促進に関する取組の実施状況
              </div>
              <div v-if="overtimeWork" class="pb-4 text-color">
                <span>前年度の月平均所定外時間労働:</span>
                <span class="pl-2">{{ overtimeWork }} 時間</span>
              </div>
              <div v-if="paidHolidays" class="pb-4 text-color">
                <span>前年度の平均有給休暇取得日数:</span>
                <span class="pl-2">{{ paidHolidays }} 日</span>
              </div>
              <div
                v-if="
                  childcareLeave &&
                  ((childcareLeave.man && childcareLeave.man.taken) ||
                  (childcareLeave.woman && childcareLeave.woman.taken))
                "
                class="pb-4 text-color"
              >
                <span>前年度の育児休暇取得者数:</span>
                <div v-if="childcareLeave.man.taken" class="pt-2 pl-3">
                  <span>男性：</span>
                  {{ childcareLeave.man.taken }}
                  <span v-if="childcareLeave.man.all"> / {{ childcareLeave.man.all }} （育児休暇取得者数 / 配偶者の出産者数）</span>
                </div>
                <div v-if="childcareLeave.woman.taken" class="pt-2 pl-3">
                  <span>女性：</span>
                  {{ childcareLeave.woman.taken }}
                  <span v-if="childcareLeave.woman.all"> / {{ childcareLeave.woman.all }} （育児休暇取得者数 / 出産者数）</span>
                </div>
              </div>
              <div v-if="femaleExecutives" class="pb-4 text-color">
                <span>女性管理職の割合:</span>
                <span class="pl-2">{{ femaleExecutives }} %</span>
              </div>
            </v-list>
            <!-- 企業情報の編集画面 -->
            <div v-show="isEditingEmploymentInfo">
              <v-form v-model="editEmploymentInfoValid" @submit.prevent="">
                <div class="py-4 subheading font-weight-bold text-color">
                  1. 募集・採用に関する情報
                </div>
                <v-text-field
                  label="前年度の新卒採用者数"
                  v-model="tempNewGrad"
                  type="number"
                  suffix="人"
                  required
                ></v-text-field>
                <v-text-field
                  label="前年度の新卒離職者数"
                  v-model="tempNewGradResignee"
                  type="number"
                  suffix="人"
                  required
                ></v-text-field>
                <v-text-field
                  label="平均勤続年数"
                  v-model="tempAverageYearsOfService"
                  type="number"
                  suffix="年"
                  required
                ></v-text-field>
                <v-text-field
                  label="社員の平均年齢"
                  v-model="tempAverageAge"
                  type="number"
                  suffix="歳"
                  required
                ></v-text-field>
                <div class="py-4 subheading font-weight-bold text-color">
                  2. 職業能力の開発及び向上に関する取組の実施状況
                </div>
                <div class="pt-2 text-color">
                  研修有無およびその内容
                </div>
                <v-switch v-model="tempTraining.exists" color="teal" :label="`${ tempTraining.exists ? '有' : '無'}`"></v-switch>
                <v-textarea
                  v-model="tempTraining.content"
                  v-show="tempTraining.exists"
                  label="内容"
                  rows="3"
                  :rules="employmentInfoRules"
                  required
                ></v-textarea>
                <div class="pt-4 text-color">
                  自己啓発支援の有無及びその内容
                </div>
                <v-switch v-model="tempSelfDevSupport.exists" color="teal" :label="`${ tempSelfDevSupport.exists ? '有' : '無'}`"></v-switch>
                <v-textarea
                  v-model="tempSelfDevSupport.content"
                  v-show="tempSelfDevSupport.exists"
                  label="内容"
                  rows="3"
                  :rules="employmentInfoRules"
                  required
                ></v-textarea>
                <div class="pt-4 text-color">
                  メンター制度の有無
                </div>
                <v-switch v-model="tempMentor.exists" color="teal" :label="`${ tempMentor.exists ? '有' : '無'}`" class="mt-2"></v-switch>
                <div class="pt-4 text-color">
                  キャリアコンサルティング制度の有無及びその内容
                </div>
                <v-switch v-model="tempCareerSupport.exists" color="teal" :label="`${ tempCareerSupport.exists ? '有' : '無'}`"></v-switch>
                <v-textarea
                  v-model="tempCareerSupport.content"
                  v-show="tempCareerSupport.exists"
                  label="内容"
                  rows="3"
                  :rules="employmentInfoRules"
                  required
                ></v-textarea>
                <div class="pt-4 text-color">
                  社内検定等の制度の有無及びその内容
                </div>
                <v-switch v-model="tempTestSystem.exists" color="teal" :label="`${ tempTestSystem.exists ? '有' : '無'}`"></v-switch>
                <v-textarea
                  v-model="tempTestSystem.content"
                  v-show="tempTestSystem.exists"
                  label="内容"
                  rows="3"
                  :rules="employmentInfoRules"
                  required
                ></v-textarea>
                <div class="py-4 subheading font-weight-bold text-color">
                  3. 職場への定着の促進に関する取組の実施状況
                </div>
                <v-text-field
                  label="前年度の月平均所定外労働時間"
                  v-model="tempOvertimeWork"
                  type="number"
                  suffix="時間"
                  required
                ></v-text-field>
                <v-text-field
                  label="前年度の有給休暇の平均取得日数"
                  v-model="tempPaidHolidays"
                  type="number"
                  suffix="日"
                  required
                ></v-text-field>
                <v-layout row wrap>
                <v-flex sm5 pt-4 mr-4>
                  <v-text-field
                    label="前年度の育児休業取得者数（男性）"
                    v-model="tempChildcareLeave.man.taken"
                    type="number"
                    suffix="人"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex sm5 pt-4>
                  <v-text-field
                    label="前年度の配偶者の出産者数（男性）"
                    v-model="tempChildcareLeave.man.all"
                    :disabled="tempChildcareLeave.man.taken == null"
                    type="number"
                    suffix="人"
                    :rules="childcareLeaveManRules"
                    required
                  ></v-text-field>
                </v-flex>
                </v-layout>
                <v-layout row wrap>
                <v-flex sm5 pt-4 mr-4>
                  <v-text-field
                    label="前年度の育児休業取得者数（女性）"
                    v-model="tempChildcareLeave.woman.taken"
                    type="number"
                    suffix="人"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex sm5 pt-4>
                  <v-text-field
                    label="前年度の出産者数（女性）"
                    v-model="tempChildcareLeave.woman.all"
                    :disabled="tempChildcareLeave.woman.taken == null"
                    type="number"
                    suffix="人"
                    :rules="childcareLeaveWomanRules"
                    required
                  ></v-text-field>
                </v-flex>
                </v-layout>
                <v-text-field
                  label="役員及び管理的地位にある者に占める女性の割合"
                  v-model="tempFemaleExecutives"
                  type="number"
                  suffix="%"
                  required
                ></v-text-field>
                <div class="mt-3 text-xs-right">
                  <v-btn
                    @click="updateIsEditingEmploymentInfo(false)"
                  >
                    キャンセル
                  </v-btn>
                  <v-btn
                    :disabled="!editEmploymentInfoValid || plan == null"
                    @click="updateEmploymentInfoButtonClicked"
                  >
                    更新
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-flex>
        </div>
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
      title: '企業情報',
      meta: [
        { name: 'robots', content: 'noindex' },
      ],
    }
  },
  data: () => ({
    snackbar: false,
    snackbarText: '',
    isQueried: false,
    windowHeight: 0,
    windowWidth: 0,
    xsWidth: false,
    uploading: false,
    topImageFileSizeValid: true,
    companyImageFileSizeValid: true,
    serviceImageFileSizeValid: true,
    imageFileSizeWarning: '画像を選択してください（3MB以下）',
    selectedTopImageSize: 200,
    selectedTopImage: null,
    topImageFile: null,
    selectedCompanyImageSize: 200,
    selectedCompanyImage: null,
    companyImageFile: null,
    tempCompanyName: '',
    companyNameRules: [
      v => !!v || '企業名を入力してください',
      v => (v && v.length <= 50) || '50文字を超えています'
    ],
    editCompanyNameValid: true,
    addMemberDialog: false,
    addMemberValid: true,
    memberEmail: '',
    emailRules: [
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
    editMissionValid: true,
    tempMission: '',
    missionRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    editVisionValid: true,
    tempVision: '',
    visionRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    editValueValid: true,
    tempValue: '',
    valueRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    editCultureValid: true,
    tempCulture: '',
    cultureRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    editSystemValid: true,
    tempSystem: '',
    systemRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    editWhyValid: true,
    tempWhy: '',
    whyRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    editWhatValid: true,
    tempWhat: '',
    whatRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    editServicesValid: true,
    tempServices: null,
    tempServiceImageUrl: '',
    tempServiceTitle: '',
    tempServiceContent: '',
    tempServiceUrl: '',
    tempServiceImageFile: null,
    serviceTitleRules: [
      v => !!v || 'タイトルを入力してください',
      v => (v && v.length <= 50) || '50字以内で入力してください'
    ],
    serviceContentRules: [
      v => !!v || '説明を入力してください',
      v => (v && v.length <= 200) || '200字以内で入力してください'
    ],
    serviceUrlRules: [
      v => (v.length <= 100) || '100字以内で入力してください',
      v => (v.includes('http://') || v.includes('https://') || v == null || v == '') || '無効なURLです'
    ],
    editWelfareValid: true,
    tempWelfare: '',
    welfareRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    tempLocation: '',
    locationRules: [
      v => (v.length <= 50) || '50字以内で入力してください'
    ],
    tempFoundedDate: null,
    foundedDateMenu: false,
    tempUrl: '',
    urlRules: [
      v => (v.length <= 200) || '200字以内で入力してください',
      v => (!v || v.includes('http://') || v.includes('https://')) || '無効なURLです'
    ],
    tempEmployeesCount: null,
    editCompanyInfoValid: true,
    editEmploymentInfoValid: true,
    employmentInfoRules: [
      v => (v.length <= 500) || '500字以内で入力してください'
    ],
    tempNewGrad: null,
    tempNewGradResignee: null,
    tempAverageYearsOfService: null,
    tempAverageAge: null,
    tempTraining: {
      exists: false,
      content: ''
    },
    tempSelfDevSupport: {
      exists: false,
      content: ''
    },
    tempMentor: {
      exists: false
    },
    tempCareerSupport: {
      exists: false,
      content: ''
    },
    tempTestSystem: {
      exists: false,
      content: ''
    },
    tempOvertimeWork: null,
    tempPaidHolidays: null,
    tempChildcareLeave: {
      man: {
        all: null,
        taken: null,
      },
      woman: {
        all: null,
        taken: null,
      }
    },
    tempFemaleExecutives: null
  }),
  computed: {
    childcareLeaveManRules() {
      return [
        v => (v == null || v == '' || Number(v) >= this.tempChildcareLeave.man.taken) || '育児休業取得者数より大きい値にしてください'
      ]
    },
    childcareLeaveWomanRules() {
      return [
        v => (v == null || v == '' || Number(v) >= this.tempChildcareLeave.woman.taken) || '育児休業取得者数より大きい値にしてください'
      ]
    },
    avatarSize() {
      return (this.breakpoint == 'xs') ? 50 : 60
    },
    imageRatio() {
      switch (this.breakpoint) {
        case 'xs': return '2'
        case 'sm': return '2.5'
        case 'md': return '3.5'
        case 'lg': return '3.5'
        case 'xl': return '3.5'
      }
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    founded() {
      let date = this.foundedDate
      if (date) {
        let year  = date.getFullYear()
        let month = date.getMonth() + 1
        let day  = date.getDate()
        date = `${year}/${month}/${day}`
        return date
      }
    },
    ...mapState({
      uid: state => state.uid,
      isRefreshing: state => state.isRefreshing,
      plan: state => state.profile.plan,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      companyId: state => state.profile.companyId,
      topImageUrl: state => state.companyProfile.topImageUrl,
      isEditingTopImage: state => state.companyProfile.isEditingTopImage,
      companyImageUrl: state => state.companyProfile.companyImageUrl,
      isEditingCompanyImage: state => state.companyProfile.isEditingCompanyImage,
      companyName: state => state.companyProfile.companyName,
      isEditingCompanyName: state => state.companyProfile.isEditingCompanyName,
      members: state => state.companyProfile.members,
      addMemberError: state => state.companyProfile.addMemberError,
      addMemberLoading: state => state.companyProfile.addMemberLoading,
      mission: state => state.companyProfile.mission,
      isEditingMission: state => state.companyProfile.isEditingMission,
      vision: state => state.companyProfile.vision,
      isEditingVision: state => state.companyProfile.isEditingVision,
      value: state => state.companyProfile.value,
      isEditingValue: state => state.companyProfile.isEditingValue,
      culture: state => state.companyProfile.culture,
      isEditingCulture: state => state.companyProfile.isEditingCulture,
      system: state => state.companyProfile.system,
      isEditingSystem: state => state.companyProfile.isEditingSystem,
      why: state => state.companyProfile.why,
      isEditingWhy: state => state.companyProfile.isEditingWhy,
      what: state => state.companyProfile.what,
      isEditingWhat: state => state.companyProfile.isEditingWhat,
      services: state => state.companyProfile.services,
      isServiceImageChanged: state => state.companyProfile.isServiceImageChanged,
      selectedServiceIndex: state => state.companyProfile.selectedServiceIndex,
      isEditingServices: state => state.companyProfile.isEditingServices,
      welfare: state => state.companyProfile.welfare,
      isEditingWelfare: state => state.companyProfile.isEditingWelfare,
      location: state => state.companyProfile.location,
      foundedDate: state => state.companyProfile.foundedDate,
      url: state => state.companyProfile.url,
      employeesCount: state => state.companyProfile.employeesCount,
      isEditingCompanyInfo: state => state.companyProfile.isEditingCompanyInfo,
      newGrad: state => state.companyProfile.newGrad,
      newGradResignee: state => state.companyProfile.newGradResignee,
      averageYearsOfService: state => state.companyProfile.averageYearsOfService,
      averageAge: state => state.companyProfile.averageAge,
      training: state => state.companyProfile.training,
      selfDevSupport: state => state.companyProfile.selfDevSupport,
      mentor: state => state.companyProfile.mentor,
      careerSupport: state => state.companyProfile.careerSupport,
      testSystem: state => state.companyProfile.testSystem,
      overtimeWork: state => state.companyProfile.overtimeWork,
      paidHolidays: state => state.companyProfile.paidHolidays,
      childcareLeave: state => state.companyProfile.childcareLeave,
      femaleExecutives: state => state.companyProfile.femaleExecutives,
      isEditingEmploymentInfo: state => state.companyProfile.isEditingEmploymentInfo,
      isLoading: state => state.companyProfile.isLoading,
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

    if (this.companyId != null && !this.isQueried) {
      this.resetState()
      this.updateIsLoading(true)
      this.queryCompanyDetail(this.companyId)
    }
  },
  watch: {
    companyId(companyId) {
      if (companyId != null && companyId != '') {
        this.isQueried = true
        this.resetState()
        this.updateIsLoading(true)
        this.queryCompanyDetail(companyId)
      }
    },
    windowWidth(width) {
      if (width < 450) {
        this.xsWidth = true
      }
    }
  },
  methods: {
    topImageClicked() {
      this.uploading = false
      this.topImageFileSizeValid = true
      this.updateIsEditingTopImage(true)
      this.selectedTopImage = null
      this.topImageFile = null
    },
    companyImageClicked() {
      this.uploading = false
      this.companyImageFileSizeValid = true
      this.updateIsEditingCompanyImage(true)
      this.selectedCompanyImage = null
      this.companyImageFile = null
    },
    onTopImageFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      // 画像サイズは3MB以下のみ
      if (files[0] != null && files[0].size/1024/1024 <= 3) {
        this.topImageFileSizeValid = true
        this.topImageFile = files[0]
        this.createTopImage(files[0])
      } else {
        this.topImageFileSizeValid = false
        this.selectedTopImage = null
        this.topImageFile = null
      }
    },
    onCompanyImageFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      // 画像サイズは3MB以下のみ
      if (files[0] != null && files[0].size/1024/1024 <= 3) {
        this.companyImageFileSizeValid = true
        this.companyImageFile = files[0]
        this.createCompanyImage(files[0])
      } else {
        this.companyImageFileSizeValid = false
        this.selectedCompanyImage = null
        this.companyImageFile = null
      }
    },
    onServiceImageFileChange(e) {
      let files = e.target.files || e.dataTransfer.files
      // 画像サイズは3MB以下のみ
      if (files[0] != null && files[0].size/1024/1024 <= 3) {
        this.serviceImageFileSizeValid = true
        this.updateIsServiceImageChanged(true)
        this.tempServiceImageFile = files[0]
        this.createServiceImage(files[0])
      } else {
        this.serviceImageFileSizeValid = false
        this.tempServiceImageUrl = ''
        this.tempServiceImageFile = null
      }
    },
    createTopImage(file) {
      // アップロードした画像を表示
      let reader = new FileReader()
      reader.onload = (e) => {
        this.selectedTopImage = e.target.result
      }
      reader.readAsDataURL(file)
    },
    createCompanyImage(file) {
      // アップロードした画像を表示
      let reader = new FileReader()
      reader.onload = (e) => {
        this.selectedCompanyImage = e.target.result
      }
      reader.readAsDataURL(file)
    },
    createServiceImage(file) {
      // アップロードした画像を表示
      let reader = new FileReader()
      reader.onload = (e) => {
        this.tempServiceImageUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },
    editCompanyNameButtonClicked() {
      this.updateIsEditingCompanyName(true)
      this.tempCompanyName = this.companyName
    },
    addMemberButtonClicked() {
      this.addMemberDialog = true
      this.memberEmail = ''
    },
    inviteMember() {
      this.addMember({
        companyId: this.companyId,
        companyName: this.companyName,
        userName: this.lastName + ' ' + this.firstName,
        email: this.memberEmail
      })
      this.snackbar = true
      this.snackbarText = `${this.memberEmail}に招待メールを送信しました！`
      this.addMemberDialog = false
    },
    editMissionButtonClicked() {
      this.tempMission = this.mission
      this.updateIsEditingMission(true)
    },
    editVisionButtonClicked() {
      this.tempVision = this.vision
      this.updateIsEditingVision(true)
    },
    editValueButtonClicked() {
      this.tempValue = this.value
      this.updateIsEditingValue(true)
    },
    editCultureButtonClicked() {
      this.tempCulture = this.culture
      this.updateIsEditingCulture(true)
    },
    editSystemButtonClicked() {
      this.tempSystem = this.system
      this.updateIsEditingSystem(true)
    },
    editWhyButtonClicked() {
      this.tempWhy = this.why
      this.updateIsEditingWhy(true)
    },
    editWhatButtonClicked() {
      this.tempWhat = this.what
      this.updateIsEditingWhat(true)
    },
    editServicesButtonClicked(index) {
      // 初期化
      this.uploading = false
      this.serviceImageFileSizeValid = true
      this.updateIsServiceImageChanged(false)
      this.tempServiceImageFile = null
      this.setSelectedServiceIndex(index)
      this.tempServices = this.services
      if (index != null) {
        this.tempServiceImageUrl = this.services[index].imageUrl
        this.tempServiceTitle = this.services[index].title
        this.tempServiceContent = this.services[index].content
        this.tempServiceUrl = this.services[index].url ? this.services[index].url : ''
      } else {
        this.tempServiceImageUrl = ''
        this.tempServiceTitle = ''
        this.tempServiceContent = ''
        this.tempServiceUrl = ''
      }
      this.updateIsEditingServices(true)
    },
    editWelfareButtonClicked() {
      this.tempWelfare = this.welfare
      this.updateIsEditingWelfare(true)
    },
    editCompanyInfoButtonClicked() {
      if (this.foundedDate) {
        this.tempFoundedDate =
          String(this.foundedDate.getFullYear()) + '-' +
          String(this.foundedDate.getMonth() + 1) + '-' +
          String(this.foundedDate.getDate())
      }

      this.tempLocation = this.location
      this.tempEmployeesCount = this.employeesCount
      this.tempUrl = this.url
      this.updateIsEditingCompanyInfo(true)
    },
    // 雇用情報 編集ボタンが押された時
    editEmploymentInfoButtonClicked() {
      if (this.newGrad) {
        this.tempNewGrad = this.newGrad
      }
      if (this.newGradResignee) {
        this.tempNewGradResignee = this.newGradResignee
      }
      if (this.averageYearsOfService) {
        this.tempAverageYearsOfService = this.averageYearsOfService
      }
      if (this.averageAge) {
        this.tempAverageAge = this.averageAge
      }
      if (this.training) {
        this.tempTraining = this.training
      }
      if (this.selfDevSupport) {
        this.tempSelfDevSupport = this.selfDevSupport
      }
      if (this.mentor) {
        this.tempMentor = this.mentor
      }
      if (this.careerSupport) {
        this.tempCareerSupport = this.careerSupport
      }
      if (this.testSystem) {
        this.tempTestSystem = this.testSystem
      }
      if (this.overtimeWork) {
        this.tempOvertimeWork = this.overtimeWork
      }
      if (this.paidHolidays) {
        this.tempPaidHolidays = this.paidHolidays
      }
      if (this.childcareLeave) {
        this.tempChildcareLeave = this.childcareLeave
      }
      if (this.femaleExecutives) {
        this.tempFemaleExecutives = this.femaleExecutives
      }

      this.updateIsEditingEmploymentInfo(true)
    },
    // 雇用情報 更新ボタンが押された時
    updateEmploymentInfoButtonClicked() {
      let employmentInfo = {
        mentor: this.tempMentor
      }
      if (this.tempTraining.exists) {
        employmentInfo.training = this.tempTraining
      } else {
        employmentInfo.training = {
          exists: false,
          content: ''
        }
      }
      if (this.tempSelfDevSupport.exists) {
        employmentInfo.selfDevSupport = this.tempSelfDevSupport
      } else {
        employmentInfo.selfDevSupport = {
          exists: false,
          content: ''
        }
      }
      if (this.tempCareerSupport.exists) {
        employmentInfo.careerSupport = this.tempCareerSupport
      } else {
        employmentInfo.careerSupport = {
          exists: false,
          content: ''
        }
      }
      if (this.tempTestSystem.exists) {
        employmentInfo.testSystem = this.tempTestSystem
      } else {
        employmentInfo.testSystem = {
          exists: false,
          content: ''
        }
      }
      employmentInfo.newGrad = this.tempNewGrad ? Number(this.tempNewGrad) : null
      employmentInfo.newGradResignee = this.tempNewGradResignee ? Number(this.tempNewGradResignee) : null
      employmentInfo.averageYearsOfService = this.tempAverageYearsOfService ? Number(this.tempAverageYearsOfService) : null
      employmentInfo.averageAge = this.tempAverageAge ? Number(this.tempAverageAge) : null
      employmentInfo.overtimeWork = this.tempOvertimeWork ? Number(this.tempOvertimeWork) : null
      employmentInfo.paidHolidays = this.tempPaidHolidays ? Number(this.tempPaidHolidays) : null
      employmentInfo.femaleExecutives = this.tempFemaleExecutives ? Number(this.tempFemaleExecutives) : null
      employmentInfo.childcareLeave = {
        man: {
          taken: this.tempChildcareLeave.man.taken ? Number(this.tempChildcareLeave.man.taken) : null,
          all: this.tempChildcareLeave.man.all ? Number(this.tempChildcareLeave.man.all) : null
        },
        woman: {
          taken: this.tempChildcareLeave.woman.taken ? Number(this.tempChildcareLeave.woman.taken) : null,
          all: this.tempChildcareLeave.woman.all ? Number(this.tempChildcareLeave.woman.all) : null
        }
      }

      this.updateEmploymentInfo({
        companyId: this.companyId,
        employmentInfo: employmentInfo
      })
    },
    ...mapActions({
      queryCompanyDetail: 'companyProfile/queryCompanyDetail',
      updateIsLoading: 'companyProfile/updateIsLoading',
      resetState: 'companyProfile/resetState',
      updateIsEditingTopImage: 'companyProfile/updateIsEditingTopImage',
      updateTopImage: 'companyProfile/updateTopImage',
      updateIsEditingCompanyImage: 'companyProfile/updateIsEditingCompanyImage',
      updateCompanyImage: 'companyProfile/updateCompanyImage',
      updateIsEditingCompanyName: 'companyProfile/updateIsEditingCompanyName',
      updateCompanyName: 'companyProfile/updateCompanyName',
      resetAddMemberError: 'companyProfile/resetAddMemberError',
      updateAddMemberLoading: 'companyProfile/updateAddMemberLoading',
      addMember: 'companyProfile/addMember',
      updateIsEditingMission: 'companyProfile/updateIsEditingMission',
      updateMission: 'companyProfile/updateMission',
      updateIsEditingVision: 'companyProfile/updateIsEditingVision',
      updateVision: 'companyProfile/updateVision',
      updateIsEditingValue: 'companyProfile/updateIsEditingValue',
      updateValue: 'companyProfile/updateValue',
      updateIsEditingCulture: 'companyProfile/updateIsEditingCulture',
      updateCulture: 'companyProfile/updateCulture',
      updateIsEditingSystem: 'companyProfile/updateIsEditingSystem',
      updateSystem: 'companyProfile/updateSystem',
      updateIsEditingWhy: 'companyProfile/updateIsEditingWhy',
      updateWhy: 'companyProfile/updateWhy',
      updateIsEditingWhat: 'companyProfile/updateIsEditingWhat',
      updateWhat: 'companyProfile/updateWhat',
      updateIsServiceImageChanged: 'companyProfile/updateIsServiceImageChanged',
      setSelectedServiceIndex: 'companyProfile/setSelectedServiceIndex',
      updateIsEditingServices: 'companyProfile/updateIsEditingServices',
      updateServices: 'companyProfile/updateServices',
      deleteService: 'companyProfile/deleteService',
      updateIsEditingWelfare: 'companyProfile/updateIsEditingWelfare',
      updateWelfare: 'companyProfile/updateWelfare',
      updateIsEditingCompanyInfo: 'companyProfile/updateIsEditingCompanyInfo',
      updateCompanyInfo: 'companyProfile/updateCompanyInfo',
      updateIsEditingEmploymentInfo: 'companyProfile/updateIsEditingEmploymentInfo',
      updateEmploymentInfo: 'companyProfile/updateEmploymentInfo',
    }),
  }
}
</script>
