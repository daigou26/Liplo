<template>
  <v-layout
    white
    row
    wrap
  >
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
    <v-flex xs12 v-else>
      <!-- snackbar -->
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
      <v-flex>
        <v-img
          :src="imageUrl"
          :aspect-ratio="imageRatio"
        ></v-img>
      </v-flex>
      <v-flex
        xs10
        offset-xs1
        class="break py-3"
        :class="{
          'px-5': $vuetify.breakpoint.mdAndUp,
          'px-3': $vuetify.breakpoint.smOnly,
        }"
      >
        <!-- createdAt -->
        <div class="light-text-color font-weight-bold">
          {{ createdAt }}
        </div>
        <!-- title -->
        <div
          class="pt-1 font-weight-bold text-color"
          :class="{
            'job-title': $vuetify.breakpoint.mdAndUp,
            'headline': $vuetify.breakpoint.smOnly,
            'title': $vuetify.breakpoint.xsOnly
          }"
        >
          {{ title }}
        </div>
        <!-- タグ -->
        <div
          class="pt-3 text-xs-left caption text-color font-weight-bold"
        >
          <v-chip outline small color="teal">{{ occupationText(occupation) }}</v-chip>
          <template v-if="value" v-for="(value, feature, index) in features">
            <v-chip outline small>{{ featuresText(feature) }}</v-chip>
          </template>
        </div>
      </v-flex>
      <v-flex xs10 offset-xs1 class="break">
        <v-layout
          white
          row
          wrap
        >
          <v-flex
            xs12
            lg8
            :class="{
              'pa-5': $vuetify.breakpoint.mdAndUp,
              'pa-3': $vuetify.breakpoint.smOnly,
              'py-3': $vuetify.breakpoint.xsOnly,
            }"
          >

            <!-- mission -->
            <div v-if="mission" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Mission
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ mission }}</p>
              </div>
            </div>
            <!-- vision -->
            <div v-if="vision" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Vision
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ vision }}</p>
              </div>
            </div>
            <!-- value -->
            <div v-if="value" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Value
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ value }}</p>
              </div>
            </div>
            <!-- culture -->
            <div v-if="culture" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                Culture
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ culture }}</p>
              </div>
            </div>
            <!-- system -->
            <div v-if="system" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                社内制度
              </p>
              <div>
                <p class="body-text return">{{ system }}</p>
              </div>
            </div>
            <!-- what -->
            <div v-if="what" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                何をやっているか
              </p>
              <div class="pt-3">
                <div class="body-text return">{{ what }}</div>
                <!-- サービス一覧 -->
                <v-list v-if="services">
                  <template v-for="(service, index) in services">
                      <div v-if="!xsWidth" class="d-flex pt-4">
                        <v-flex xs4 sm3 lg2>
                          <v-img :src="service.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                        </v-flex>
                        <v-flex xs8 sm9 lg10 class="pl-4 break">
                          <div class="font-weight-bold body-text">{{ service.title }}</div>
                          <p　class="text-color return">{{ service.content }}</p>
                          <a :href="service.url" target="_blank">{{ service.url }}</a>
                        </v-flex>
                      </div>
                      <div v-else class="pt-4">
                        <v-img :src="service.imageUrl" aspect-ratio="1.5" max-height="100" max-width="160"></v-img>
                        <div class="font-weight-bold body-text">{{ service.title }}</div>
                        <div　class="text-color return pb-2">{{ service.content }}</div>
                        <a :href="service.url" target="_blank">{{ service.url }}</a>
                      </div>
                  </template>
                </v-list>
              </div>
            </div>
            <!-- why -->
            <div v-if="why" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                なぜやっているか
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ why }}</p>
              </div>
            </div>
            <!-- 福利厚生 -->
            <div v-if="welfare" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                福利厚生
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ welfare }}</p>
              </div>
            </div>
            <!-- 仕事について -->
            <div class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                仕事について
              </p>
              <div v-if="description" class="py-3">
                <p class="body-text return">{{ description }}</p>
              </div>
              <!-- 期間 -->
              <div v-if="period" class="py-3">
                <p class="job-sub-title font-weight-bold text-color">
                  パスを出すまでのインターン期間
                </p>
                <div>
                  <p class="body-text return">{{ period }}ヶ月</p>
                </div>
              </div>
              <!-- シフト -->
              <div v-if="workweek || workday != null || worktime" class="py-3">
                <p class="job-sub-title font-weight-bold text-color">
                  シフト
                </p>
                <div v-if="workweek" class="body-text">
                  週{{ workweekDays(workweek.days) }}日以上、
                  <span v-if="workweek.hours != 0">週合計{{ workweek.hours }}時間以上</span>
                  <span v-if="workday != null" class="body-text">
                    ({{ workdayText(workday) }})
                  </span>
                </div>
                <div v-if="worktime" class="body-text pt-2">
                  勤務可能時間：{{ worktimeText(worktime) }}
                </div>
              </div>
              <!-- 給与 -->
              <div v-if="wage" class="py-3">
                <p class="job-sub-title font-weight-bold text-color">
                  インターンの給料
                </p>
                <div>
                  <p class="body-text return">{{ wage }}</p>
                </div>
              </div>
              <!-- 必要スキル -->
              <div v-if="requiredSkills" class="py-3">
                <p class="job-sub-title font-weight-bold text-color">
                  必要なスキル・経験
                </p>
                <div>
                  <p class="body-text return">{{ requiredSkills }}</p>
                </div>
              </div>
              <!-- あると望ましいスキル -->
              <div v-if="idealSkills" class="py-3">
                <p class="job-sub-title font-weight-bold text-color">
                  あると望ましいスキル
                </p>
                <div>
                  <p class="body-text return">{{ idealSkills }}</p>
                </div>
              </div>
              <!-- 開発環境 -->
              <div v-if="environment" class="py-3">
                <p class="job-sub-title font-weight-bold text-color">
                  開発環境
                </p>
                <div>
                  <p class="body-text return">{{ environment }}</p>
                </div>
              </div>
            </div>
            <!-- 求める人物像 -->
            <div v-if="idealCandidate" class="py-4">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                求める人物像
              </p>
              <div class="pt-3">
                <p class="body-text return">{{ idealCandidate }}</p>
              </div>
            </div>
            <!-- review -->
            <div class="py-4 hidden-lg-and-up">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                レビュー
              </p>
              <div v-if="!uid" class="pt-3">
                レビューを見るには、ログインする必要があります。
              </div>
              <div v-if="uid && uid != '' && reviews" class="pt-3">
                <!-- chart (xs) -->
                <v-flex xs12 hidden-sm-and-up>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" ontouchstart="">
                        <radar-chart
                          v-if="showChart && reviewsChartData"
                          :data="reviewsChartData"
                          :options="reviewsChartOptions"
                        />
                      </div>
                    </template>
                    <div>
                      <div>
                        仕事内容：
                      </div>
                      <div>
                        募集に書かれていた内容と合っていたかどうか
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        裁量度：
                      </div>
                      <div>
                        インターン生にも裁量が与えられていたかどうか
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        労働環境：
                      </div>
                      <div>
                        働きやすい環境かどうか（休憩などが自由にできるか、質問がしやすい環境かなど）
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        労働時間：
                      </div>
                      <div>
                        勤務時間帯を柔軟に決められるか、休暇を取りやすい環境か
                      </div>
                    </div>
                    <div class="pt-3">
                      <div>
                        雰囲気：
                      </div>
                      <div>
                        社内の雰囲気、人間関係などが良好かどうか
                      </div>
                    </div>
                  </v-tooltip>
                </v-flex>
                <div class="d-flex">
                  <!-- comments -->
                  <v-flex
                    md8
                    sm6
                    xs12
                    :class="{
                      'pr-4': $vuetify.breakpoint.mdOnly,
                      'pt-4': $vuetify.breakpoint.xsOnly,
                    }"
                  >
                    <v-list>
                      <template v-for="(item, index) in reviews.comments">
                        <v-hover>
                          <div
                            slot-scope="{ hover }"
                            ontouchstart=""
                            class="pt-2"
                            :class="{
                              'pt-3': $vuetify.breakpoint.xsOnly
                            }"
                          >
                            <div class="font-weight-bold body-text">
                              <v-avatar
                                class="grey lighten-3"
                                :size="25"
                              >
                                <v-icon style="font-size: 18px">person</v-icon>
                              </v-avatar>
                              {{ item.occupation }}
                            </div>
                            <div class="pt-3 pl-2 body-text return">{{ item.content }}</div>
                            <div
                              class="hidden-xs-only"
                              :style="{ visibility: hover ? 'visible' : 'hidden' }"
                            >
                              <v-btn
                                small
                                flat
                                class="caption teal--text text--lighten-1 mx-0"
                                style="text-decoration: none;"
                                @click="userReviewsButtonClicked(item.uid)"
                              >
                                この人が書いた他のレビューを見る
                              </v-btn>
                            </div>
                            <v-btn
                              small
                              flat
                              class="hidden-sm-and-up caption teal--text text--lighten-1 mt-0 mx-0"
                              style="text-decoration: none;"
                              @click="userReviewsButtonClicked(item.uid)"
                            >
                              この人が書いた他のレビューを見る
                            </v-btn>
                          </div>
                        </v-hover>
                      </template>
                    </v-list>
                    <div
                      v-if="reviews.rating.count > 3"
                      class="d-inline-flex teal--text font-weight-bold clickable"
                      :class="{
                        'pt-2': $vuetify.breakpoint.xsOnly
                      }"
                      @click="reviewsButtonClicked"
                    >
                      レビューをすべて見る
                    </div>
                  </v-flex>
                  <!-- chart (xl, lg, md, sm) -->
                  <v-flex md4 sm6 pl-4 hidden-xs-only>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div v-on="on" ontouchstart="">
                          <radar-chart
                            v-if="showChart && reviewsChartData"
                            :data="reviewsChartData"
                            :options="reviewsChartOptions"
                          />
                        </div>
                      </template>
                      <div>
                        <div>
                          仕事内容：
                        </div>
                        <div>
                          募集に書かれていた内容と合っていたかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          裁量度：
                        </div>
                        <div>
                          インターン生にも裁量が与えられていたかどうか
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          労働環境：
                        </div>
                        <div>
                          働きやすい環境かどうか（休憩などが自由にできるか、質問がしやすい環境かなど）
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          労働時間：
                        </div>
                        <div>
                          勤務時間帯を柔軟に決められるか、休暇を取りやすい環境か
                        </div>
                      </div>
                      <div class="pt-3">
                        <div>
                          雰囲気：
                        </div>
                        <div>
                          社内の雰囲気、人間関係などが良好かどうか
                        </div>
                      </div>
                    </v-tooltip>
                  </v-flex>
                </div>
              </div>
              <div v-if="uid && uid != '' && (reviews == null || reviews.length == 0)" class="pt-2">
                まだレビューがありません
              </div>
            </div>
            <!-- 企業情報 -->
            <div class="py-4 hidden-lg-and-up">
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                企業情報
              </p>
              <div v-if="nearestStation || url || foundedDate || location || employeesCount" class="pt-3">
                <div v-if="url" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">link</v-icon>
                    <a :href="url" target="_blank" class="pl-2">{{ url }}</a>
                  </v-card-actions>
                </div>
                <div v-if="foundedDate" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">flag</v-icon>
                    <span class="pl-2">{{ foundedDate }}に設立</span>
                  </v-card-actions>
                </div>
                <div v-if="location" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">place</v-icon>
                    <span class="pl-2">{{ location }}</span>
                  </v-card-actions>
                </div>
                <div v-if="nearestStation" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">place</v-icon>
                    <span class="pl-2">{{ nearestStation }}</span>
                  </v-card-actions>
                </div>
                <div v-if="employeesCount" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">group</v-icon>
                    <span class="pl-2">{{ employeesCount }}人のメンバー</span>
                  </v-card-actions>
                </div>
              </div>
              <div v-else>
                企業情報がありません
              </div>
            </div>
            <!-- 雇用情報 -->
            <div
              v-if="
                newGrad ||
                newGradResignee ||
                averageYearsOfService ||
                averageAge ||
                training ||
                selfDevSupport ||
                mentor ||
                careerSupport ||
                testSystem ||
                overtimeWork ||
                paidHolidays ||
                (childcareLeave &&
                ((childcareLeave.man && childcareLeave.man.taken) ||
                (childcareLeave.woman && childcareLeave.woman.taken))) ||
                femaleExecutives
              "
              class="py-4"
            >
              <p
                class="font-weight-bold text-color"
                :class="{
                  'headline': $vuetify.breakpoint.smAndUp,
                  'title': $vuetify.breakpoint.xsOnly
                }"
              >
                企業の詳細情報（雇用情報）
              </p>
              <div>
                <div
                  v-if="newGrad || newGradResignee || averageYearsOfService || averageAge"
                  class="py-4 subheading font-weight-bold text-color"
                >
                  社員について
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
                <div v-if="femaleExecutives" class="pb-2 text-color">
                  <span>女性管理職の割合:</span>
                  <span class="pl-2">{{ femaleExecutives }} %</span>
                </div>
                <div
                  v-if="
                    overtimeWork ||
                    paidHolidays ||
                    (childcareLeave &&
                    ((childcareLeave.man && childcareLeave.man.taken) ||
                    (childcareLeave.woman && childcareLeave.woman.taken)))
                  "
                  class="py-4 subheading font-weight-bold text-color"
                >
                  休暇について
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
                <div
                  v-if="training || selfDevSupport || mentor || careerSupport || testSystem"
                  class="py-4 subheading font-weight-bold text-color"
                >
                  社内制度について
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
              </div>
            </div>
          </v-flex>
          <!-- right section -->
          <v-flex xs4 pa-5 hidden-md-and-down>
            <!-- 企業情報 -->
            <div class="py-4">
              <p class="title font-weight-bold text-color">
                企業情報
              </p>
              <div v-if="nearestStation || url || foundedDate || location || employeesCount" class="pt-3">
                <div v-if="url" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">link</v-icon>
                    <a :href="url" target="_blank" class="pl-2">{{ url }}</a>
                  </v-card-actions>
                </div>
                <div v-if="foundedDate" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">flag</v-icon>
                    <span class="pl-2">{{ foundedDate }}に設立</span>
                  </v-card-actions>
                </div>
                <div v-if="location" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">place</v-icon>
                    <span class="pl-2">{{ location }}</span>
                  </v-card-actions>
                </div>
                <div v-if="nearestStation" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">place</v-icon>
                    <span class="pl-2">{{ nearestStation }}</span>
                  </v-card-actions>
                </div>
                <div v-if="employeesCount" class="pb-2">
                  <v-card-actions class="pa-0">
                    <v-icon style="font-size: 18px">group</v-icon>
                    <span class="pl-2">{{ employeesCount }}人のメンバー</span>
                  </v-card-actions>
                </div>
              </div>
              <div v-else>
                企業情報がありません
              </div>
            </div>
            <!-- review -->
            <div class="py-5">
              <p class="title font-weight-bold text-color">
                レビュー
              </p>
              <div v-if="!uid">
                レビューを見るには、ログインが必要です。
              </div>
              <div v-if="uid && uid != '' && reviews">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <radar-chart
                        v-if="showChart && reviewsChartData"
                        :data="reviewsChartData"
                        :options="reviewsChartOptions"
                      />
                    </div>
                  </template>
                  <div>
                    <div>
                      仕事内容：
                    </div>
                    <div>
                      募集に書かれていた内容と合っていたかどうか
                    </div>
                  </div>
                  <div class="pt-3">
                    <div>
                      裁量度：
                    </div>
                    <div>
                      インターン生にも裁量が与えられていたかどうか
                    </div>
                  </div>
                  <div class="pt-3">
                    <div>
                      労働環境：
                    </div>
                    <div>
                      働きやすい環境かどうか（休憩などが自由にできるか、質問がしやすい環境かなど）
                    </div>
                  </div>
                  <div class="pt-3">
                    <div>
                      労働時間：
                    </div>
                    <div>
                      勤務時間を柔軟に決められるか、休暇を取りやすい環境か
                    </div>
                  </div>
                  <div class="pt-3">
                    <div>
                      雰囲気：
                    </div>
                    <div>
                      社内の雰囲気、人間関係などが良好かどうか
                    </div>
                  </div>
                </v-tooltip>
                <v-list class="pl-3 pt-4">
                  <template v-for="(item, index) in reviews.comments">
                    <v-hover>
                      <div slot-scope="{ hover }" ontouchstart="" class="pt-2">
                        <div class="font-weight-bold body-text">
                          <v-avatar
                            class="grey lighten-3"
                            :size="25"
                          >
                            <v-icon style="font-size: 18px">person</v-icon>
                          </v-avatar>
                          {{ item.occupation }}
                        </div>
                        <div class="pt-3 body-text return">{{ item.content }}</div>
                        <div
                          :style="{ visibility: hover ? 'visible' : 'hidden' }"
                        >
                          <v-btn
                            small
                            flat
                            class="caption teal--text text--lighten-1 mx-0"
                            style="text-decoration: none;"
                            @click="userReviewsButtonClicked(item.uid)"
                          >
                            この人が書いた他のレビューを見る
                          </v-btn>
                        </div>
                      </div>
                    </v-hover>
                  </template>
                </v-list>
                <div
                  v-if="reviews.rating.count > 3"
                  class="pl-3 teal--text font-weight-bold clickable text-xs-center"
                  @click="reviewsButtonClicked"
                >
                  すべて見る
                </div>
              </div>
              <div v-if="uid && uid != '' && (reviews == null || reviews.length == 0)" class="pt-2">
                まだレビューがありません
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- footer -->
      <v-footer
        fixed
        app
        color="white"
        height="70"
        class="shadow-top"
      >
        <v-layout
          align-center
        >
          <!-- Company Name && Rating -->
          <v-flex
            xs6
            sm7
            md8
            text-xs-left
            class="break pl-2"
            :class="{
              'pl-4': $vuetify.breakpoint.mdAndUp,
            }"
          >
            <v-card v-if="companyId" flat :to="'../companies/' + companyId" id="company-info-footer">
              <v-card-actions style="display: block;">
                <v-list-tile class="px-0">
                  <v-list-tile-avatar class="hidden-xs-only">
                    <v-img
                      v-if="companyImageUrl"
                      :src="companyImageUrl"
                      class="avatar-border"
                    ></v-img>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color font-weight-bold">
                      <span v-if="xsWidth" style="font-size:12px">{{ companyName }}</span>
                      <span v-else>{{ companyName }}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-if="reviews">
                      <v-card-actions class="pa-0">
                        <v-rating
                          v-model="reviews.rating.all"
                          background-color="#FF5A5F"
                          color="#FF5A5F"
                          small
                          half-increments
                          readonly
                        />
                        <span class="pl-1 text-color">{{ reviews.rating.count }}</span>
                      </v-card-actions>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex
            v-if="type != 'recruiter'"
            xs5
            md4
            offset
            text-xs-right
            :class="{
              'pr-5': $vuetify.breakpoint.mdAndUp,
              'pr-3': $vuetify.breakpoint.smOnly,
              'pr-1': $vuetify.breakpoint.xsOnly
            }"
          >
            <v-btn
              v-if="uid && uid != ''"
              large
              :disabled="isCandidate"
              class="white--text"
              color="#FF5A5F"
              id="job-apply"
              @click="applyButtonClicked"
            >
              <span v-if="isCandidate" class="font-weight-bold">
                応募済み
              </span>
              <span v-else class="font-weight-bold">
                応募する
              </span>
            </v-btn>
            <span v-else>
              <span v-if="xsWidth" class="caption">
                <div>
                  応募するには
                </div>
                <div>
                  ログインが必要です
                </div>
              </span>
              <span v-else>応募するにはログインが必要です</span>
            </span>
          </v-flex>
        </v-layout>
      </v-footer>
      <div v-if="reviews" class="text-xs-center">
        <v-dialog
          :value="reviewsDialog || userReviewsDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          persistent
          width="500"
        >
          <!-- レビュー -->
          <v-card v-show="!userReviewsDialog">
            <v-toolbar class="dialog-toolbar" flat color="white">
              <v-toolbar-side-icon
                @click="reviewsDialog=false"
                class="ma-0"
              >
                <v-icon style="font-size: 20px">close</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title class="font-weight-bold ml-0">
                <span
                  :class="{
                    'toolbar-title': $vuetify.breakpoint.smAndUp,
                    'toolbar-title-small': $vuetify.breakpoint.xsOnly
                  }"
                >レビュー{{ reviews.rating.count }}件</span>
              </v-toolbar-title>
            </v-toolbar>
            <v-flex
              xs12
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xsOnly}"
            >
              <v-container py-0>
                <v-layout
                  column
                  justify-center
                >
                  <div>
                    <v-list class="px-2">
                      <template v-for="(item, index) in allReviews">
                        <v-hover>
                          <div slot-scope="{ hover }" ontouchstart="" class="pt-3">
                            <div class="font-weight-bold body-text">
                              <v-avatar
                                class="grey lighten-3"
                                :size="25"
                              >
                                <v-icon style="font-size: 18px">person</v-icon>
                              </v-avatar>
                              {{ item.occupation }}
                            </div>
                            <v-rating
                              v-model="item.all"
                              background-color="#FF5A5F"
                              color="#FF5A5F"
                              small
                              half-increments
                              readonly
                              class="pt-3 pl-2"
                            />
                            <div class="pt-3 pl-2 body-text return">{{ item.content }}</div>
                            <div
                              class="hidden-xs-only"
                              :style="{ visibility: hover ? 'visible' : 'hidden' }"
                            >
                              <v-btn
                                small
                                flat
                                class="caption teal--text text--lighten-1 mx-0"
                                style="text-decoration: none;"
                                @click="userReviewsButtonClicked(item.uid)"
                              >
                                この人が書いた他のレビューを見る
                              </v-btn>
                            </div>
                            <v-btn
                              small
                              flat
                              class="hidden-sm-and-up caption teal--text text--lighten-1 mt-0 mx-0"
                              style="text-decoration: none;"
                              @click="userReviewsButtonClicked(item.uid)"
                            >
                              この人が書いた他のレビューを見る
                            </v-btn>
                          </div>
                        </v-hover>
                        <v-divider v-if="allReviews.length != index + 1"></v-divider>
                      </template>
                    </v-list>
                    <infinite-loading
                      v-if="showInfiniteLoading && allReviews && allReviews.length >= 10 && !isReviewsLoading"
                      :distance="50"
                      spinner="waveDots"
                      @infinite="infiniteHandler">
                      <div slot="no-results"></div>
                    </infinite-loading>
                  </div>
                </v-layout>
              </v-container>
            </v-flex>
          </v-card>
          <v-card v-show="userReviewsDialog">
            <v-toolbar class="dialog-toolbar" flat color="white">
              <v-toolbar-side-icon
                @click="userReviewsDialog=false"
                class="ma-0"
              >
                <v-icon v-show="reviewsDialog" style="font-size: 20px">arrow_back</v-icon>
                <v-icon v-show="!reviewsDialog" style="font-size: 20px">close</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title class="font-weight-bold ml-0 toolbar-title-small">
                このユーザーが記入したレビュー
              </v-toolbar-title>
            </v-toolbar>
            <v-flex
              xs12
              :class="{'px-2': $vuetify.breakpoint.smAndUp, 'mt-3': $vuetify.breakpoint.xsOnly}"
            >
              <v-container py-0>
                <v-layout
                  column
                  justify-center
                >
                  <div>
                    <v-list class="px-2">
                      <template v-for="(item, index) in userReviews">
                        <div class="pt-3">
                          <v-card
                            flat
                            class="font-weight-bold body-text"
                            :to="'/companies/' + item.companyId"
                          >
                            <v-avatar
                              class="avatar-border"
                              :size="25"
                            >
                              <v-img
                                v-if="item.companyImageUrl"
                                :src="item.companyImageUrl"
                              ></v-img>
                            </v-avatar>
                            {{ item.companyName }}
                          </v-card>
                          <v-rating
                            v-model="item.all"
                            background-color="#FF5A5F"
                            color="#FF5A5F"
                            small
                            half-increments
                            readonly
                            class="pt-3"
                          />
                          <p class="pt-3 caption text-color">
                            職種：　{{ item.occupation }}
                          </p>
                          <div class="pb-3 body-text return">{{ item.content }}</div>
                        </div>
                        <v-divider v-if="userReviews.length != index + 1"></v-divider>
                      </template>
                    </v-list>
                    <infinite-loading
                      v-if="showInfiniteLoading && userReviews && userReviews.length >= 10 && !isUserReviewsLoading"
                      :distance="50"
                      spinner="waveDots"
                      @infinite="infiniteUserReviewsHandler">
                      <div slot="no-results"></div>
                    </infinite-loading>
                  </div>
                </v-layout>
              </v-container>
            </v-flex>
          </v-card>
        </v-dialog>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
const baseUrl = process.env.BASE_URL || 'https://liplo.jp'

export default {
  head () {
    return {
      title: this.title && this.companyName ? this.title + ' - ' + this.companyName : '',
      meta: [
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: this.title + ' - ' + this.companyName + ' - Liplo' },
        { hid: 'og:description', property: 'og:description', content: this.description },
        { hid: 'og:url', property: 'og:url', content: baseUrl + this.$route.path },
        { hid: 'og:image', property: 'og:image', content: this.imageUrl },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:image', name: 'twitter:image', content: this.imageUrl },
        { hid: 'twitter:title', name: 'twitter:title', content: this.title + ' - ' + this.companyName + ' - Liplo' },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description },
      ],
    }
  },
  data: () => ({
    reviewsQueryCount: 0,
    userReviewsQueryCount: 0,
    isQueried: false,
    snackbar: false,
    snackbarText: '',
    showInfiniteLoading: false,
    reviewsDialog: false,
    userReviewsDialog: false,
    reviewsChartOptions: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false
      },
      scale: {
        ticks: {
            min: 1,
            max: 5,
        }
      }
    },
    showChart: false,
    windowHeight: 0,
    windowWidth: 0,
    xsWidth: false,
    // user のレビュー一覧をクエリする時に使用
    selectedUserId: '',
  }),
  computed: {
    worktimeText: function() {
      return function(worktime) {
        if (worktime) {
          var begin =
            String(worktime.begin).substr(0,2)
            + ':'
            + String(worktime.begin).substr(2,2)
          var end =
            String(worktime.end).substr(0,2)
            + ':'
            + String(worktime.end).substr(2,2)
          return begin + '〜' + end
        }
      }
    },
    workdayText: function() {
      return function(workday) {
        if (workday == 0) {
          return '平日のみ'
        } else if (workday == 1) {
          return '土曜可'
        } else if (workday == 2) {
          return '日曜可'
        } else if (workday == 3) {
          return '土日可'
        }
      }
    },
    workweekDays: function() {
      return function(days) {
        if (days) {
          if (days.one) {
            return 1
          } else if (days.two) {
            return 2
          } else if (days.three) {
            return 3
          } else if (days.four) {
            return 4
          } else if (days.five) {
            return 5
          }
        }
      }
    },
    occupationIcon: function() {
      return function(occupation) {
        if (occupation) {
          if (occupation.engineer == true) {
            return 'fas fa-code'
          } else if (occupation.designer == true) {
            return 'fas fa-palette'
          } else if (occupation.sales == true) {
            return 'fas fa-user-tie'
          } else if (occupation.marketer == true) {
            return 'fas fa-poll-h'
          } else if (occupation.planner == true) {
            return 'fas fa-lightbulb'
          } else if (occupation.writer == true) {
            return 'fas fa-pen-fancy'
          } else if (occupation.others == true) {
            return ''
          }
        }
      }
    },
    featuresText: function() {
      return function(feature) {
        if (feature == 'experience') {
          return '未経験OK'
        } else if (feature == 'media') {
          return 'メディア掲載実績あり'
        } else if (feature == 'funding') {
          return '資金調達済み'
        } else if (feature == 'overseas') {
          return '海外進出中'
        } else if (feature == 'friend') {
          return '友人と応募OK'
        } else if (feature == 'weekend') {
          return '土日OK'
        } else if (feature == 'shift') {
          return 'シフト自由'
        } else if (feature == 'average20s') {
          return '平均年齢が20代'
        } else if (feature == 'worktime') {
          return '19時以降勤務可能'
        }
      }
    },
    occupationText: function() {
      return function(occupation) {
        if (occupation) {
          if (occupation.engineer == true) {
            return 'エンジニア'
          } else if (occupation.designer == true) {
            return 'デザイナー'
          } else if (occupation.sales == true) {
            return '営業'
          } else if (occupation.marketer == true) {
            return 'マーケター'
          } else if (occupation.planner == true) {
            return '企画'
          } else if (occupation.writer == true) {
            return 'ライター'
          } else if (occupation.others == true) {
            return 'その他'
          }
        }
      }
    },
    imageRatio() {
      switch (this.$vuetify.breakpoint.name) {
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
      isRefreshed: state => state.isRefreshed,
      isRefreshing: state => state.isRefreshing,
      type: state => state.profile.type,
      profileImageUrl: state => state.profile.imageUrl,
      firstName: state => state.profile.firstName,
      lastName: state => state.profile.lastName,
      uid: state => state.uid,
      imageUrl: state => state.job.imageUrl,
      title: state => state.job.title,
      companyId: state => state.job.companyId,
      companyName: state => state.job.companyName,
      companyImageUrl: state => state.job.companyImageUrl,
      mission: state => state.job.mission,
      vision: state => state.job.vision,
      value: state => state.job.value,
      culture: state => state.job.culture,
      system: state => state.job.system,
      why: state => state.job.why,
      what: state => state.job.what,
      services: state => state.job.services,
      description: state => state.job.description,
      wage: state => state.job.wage,
      requiredSkills: state => state.job.requiredSkills,
      idealSkills: state => state.job.idealSkills,
      environment: state => state.job.environment,
      welfare: state => state.job.welfare,
      workweek: state => state.job.workweek,
      period: state => state.job.period,
      workday: state => state.job.workday,
      worktime: state => state.job.worktime,
      idealCandidate: state => state.job.idealCandidate,
      occupation: state => state.job.occupation,
      features: state => state.job.features,
      createdAt: state => state.job.createdAt,
      nearestStation: state => state.job.nearestStation,
      url: state => state.job.url,
      location: state => state.job.location,
      foundedDate: state => state.job.foundedDate,
      employeesCount: state => state.job.employeesCount,
      newGrad: state => state.job.newGrad,
      newGradResignee: state => state.job.newGradResignee,
      averageYearsOfService: state => state.job.averageYearsOfService,
      averageAge: state => state.job.averageAge,
      training: state => state.job.training,
      selfDevSupport: state => state.job.selfDevSupport,
      mentor: state => state.job.mentor,
      careerSupport: state => state.job.careerSupport,
      testSystem: state => state.job.testSystem,
      overtimeWork: state => state.job.overtimeWork,
      paidHolidays: state => state.job.paidHolidays,
      childcareLeave: state => state.job.childcareLeave,
      femaleExecutives: state => state.job.femaleExecutives,
      feedback: state => state.job.feedback,
      applicants: state => state.job.applicants,
      reviews: state => state.job.reviews,
      reviewsChartData: state => state.job.reviewsChartData,
      isLoading: state => state.job.isLoading,
      isCandidate: state => state.job.isCandidate,
      allReviews: state => state.reviews.jobReviews,
      isReviewsLoading: state => state.reviews.isJobReviewsLoading,
      allReviewsQueried: state => state.reviews.allJobReviewsQueried,
      userReviews: state => state.reviews.userReviews,
      isUserReviewsLoading: state => state.reviews.isUserReviewsLoading,
      allUserReviewsQueried: state => state.reviews.allUserReviewsQueried,
    }),
  },
  mounted() {
    this.showChart = true
    this.showInfiniteLoading = true

    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight - 30
    this.windowWidth = window.innerWidth
  },
  async fetch(context) {
    const store = context.store
    await store.dispatch('reviews/resetJobReviewsState')
    await store.dispatch('reviews/resetUserReviewsState')
    await store.dispatch('job/resetState')
    await store.dispatch('job/updateIsLoading', true)
    // query job
    await store.dispatch('job/queryJobDetail', {nuxt: context, params: context.params, uid: store.state.uid})
  },
  watch: {
    uid(uid) {
      this.resetReviewsState()
      this.resetUserReviewsState()
      this.resetJobState()
      this.updateIsLoading(true)
      if (uid && uid != '') {
        this.queryJobDetail({nuxt: this.$nuxt, params: this.$route.params, uid: uid})
      } else {
        this.queryJobDetail({nuxt: this.$nuxt, params: this.$route.params, uid: null})
      }
    },
    windowWidth(width) {
      if (width < 450) {
        this.xsWidth = true
      }
    }
  },
  methods: {
    // 企業に対するレビュー一覧
    infiniteHandler($state) {
      if (!this.allReviewsQueried) {
        if (!this.isReviewsLoading) {
          this.reviewsQueryCount += 1
          this.updateIsReviewsLoading(true)
          this.queryJobReviews(this.companyId)
          if (this.reviewsQueryCount > 50) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }
      } else {
        $state.complete()
      }
    },
    // 特定のユーザーのレビュー一覧
    infiniteUserReviewsHandler($state) {
      if (!this.allUserReviewsQueried) {
        if (!this.isUserReviewsLoading) {
          this.userReviewsQueryCount += 1
          this.updateIsUserReviewsLoading(true)
          this.queryUserReviews(this.selectedUserId)
          if (this.userReviewsQueryCount > 20) {
            $state.complete()
          } else {
            $state.loaded()
          }
        }
      } else {
        $state.complete()
      }
    },
    reviewsButtonClicked() {
      this.reviewsDialog = true
      if (!this.allReviews || this.allReviews.length == 0) {
        this.resetReviewsState()
        this.updateIsReviewsLoading(true)
        this.queryJobReviews(this.companyId)
      }
    },
    userReviewsButtonClicked(uid) {
      if (uid && uid != '') {
        this.selectedUserId = uid
        this.userReviewsDialog = true
        if (this.userReviews.length == 0) {
          this.resetUserReviewsState()
          this.updateIsUserReviewsLoading(true)
          this.queryUserReviews(this.selectedUserId)
        }
      }
    },
    applyButtonClicked() {
      let user = {
        uid: this.uid,
        name: this.lastName + ' ' + this.firstName
      }
      if (this.profileImageUrl) {
        user.imageUrl = this.profileImageUrl
      }

      this.apply({
        params: this.$route.params,
        user: user,
        companyId: this.companyId
      })

      this.snackbarText = '応募しました！'
      this.snackbar = true
    },
    ...mapActions({
      queryJobDetail: 'job/queryJobDetail',
      apply: 'job/apply',
      updateIsLoading: 'job/updateIsLoading',
      resetJobState: 'job/resetState',
      queryJobReviews: 'reviews/queryJobReviews',
      updateIsReviewsLoading: 'reviews/updateIsJobReviewsLoading',
      resetReviewsState: 'reviews/resetJobReviewsState',
      queryUserReviews: 'reviews/queryUserReviews',
      updateIsUserReviewsLoading: 'reviews/updateIsUserReviewsLoading',
      resetUserReviewsState: 'reviews/resetUserReviewsState',
    }),
  }
}
</script>
<style>
.dialog-toolbar {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 10;
}
#company-info-footer div.v-list__tile {
  padding: 0px
}
#company-info-footer div.v-card__actions {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
