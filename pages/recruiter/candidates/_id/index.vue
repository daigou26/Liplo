<template>
  <v-layout>
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
    <v-flex xs12 v-else-if="uid && uid != ''">
      <v-layout
        row
        white
        wrap
        :class="{'fill-height': $vuetify.breakpoint.mdAndUp}"
      >
        <!-- snackbar -->
        <v-snackbar
          v-model="snackbar"
          class="px-5"
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
        <!-- user image & name (sm, xs) -->
        <v-flex xs12 hidden-md-and-up>
          <v-card v-if="user" flat>
            <v-list two-line>
              <v-list-tile :to="'/users/' + user.uid">
                <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                  <v-img
                    v-if="user"
                    :src="user.imageUrl"
                  ></v-img>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="text-color font-weight-bold">
                    {{ user.name }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <v-card-actions class="pa-0">
                      <v-rating
                        :value="reviews == null ? 0 : reviews.rating"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                      <span class="pl-3 caption green--text">プロフィールを確認する</span>
                    </v-card-actions>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <!-- candidate summary (md, lg, xl) -->
        <v-flex
          md6
          hidden-sm-and-down
          pb-4
          class="scroll-y"
          :style="{ height: windowHeight + 'px' }"
        >
          <!-- user image & name (md, lg, xl) -->
          <v-card v-if="user" flat>
            <v-list two-line>
              <v-list-tile :to="'/users/' + user.uid">
                <v-list-tile-avatar color="grey darken-3" class="hidden-xs-only">
                  <v-img
                    v-if="user"
                    :src="user.imageUrl"
                  ></v-img>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="text-color font-weight-bold">
                    {{ user.name }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <v-card-actions class="pa-0">
                      <v-rating
                        :value="reviews == null ? 0 : reviews.rating"
                        background-color="teal"
                        color="teal darken-1"
                        small
                        half-increments
                        readonly
                      />
                      <span class="pl-3 caption green--text">プロフィールを確認する</span>
                    </v-card-actions>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <!-- タグ -->
          <div>
            <v-flex class="px-3 pt-3 break text-xs-left">
              <span class="text-color font-weight-bold">
                タグ
              </span>
              <v-tooltip bottom max-width="180px">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" style="font-size: 16px; color: #BDBDBD">info</v-icon>
                </template>
                <span>タグには候補者の職種や役職などを自由に設定できます</span>
              </v-tooltip>
              <v-btn
                v-show="!isEditingTags"
                flat
                small
                @click="editTagsButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </v-flex>
            <v-flex v-show="!isEditingTags" class="px-3 break text-xs-left">
              <v-chip v-if="tags" v-for="tag in tags" :key="tag">{{ tag }}</v-chip>
              <div v-if="tags == null || tags.length == 0" class="text-color">
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
              <div class="text-xs-right">
                <v-btn
                  @click="updateIsEditingTags(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editTagsValid || plan == null"
                  @click="updateTags({params: params, companyId: companyId, tags: tempTags})"
                >
                  更新
                </v-btn>
              </div>
            </v-form>
          </div>
          <!-- pass -->
          <div v-if="pass && status && (status.pass || status.contracted || status.hired || status.rejected)">
            <v-flex class="px-3 pt-5 break text-xs-left">
              <span class="text-color font-weight-bold">
                パス
              </span>
              <v-btn
                v-if="!status.contracted && !status.hired && !status.rejected"
                v-show="!isEditingPass"
                flat
                small
                @click="editPassButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </v-flex>
            <v-flex v-show="!isEditingPass" class="px-3 break text-xs-left text-color">
              <div class="pt-2 pb-3">
                タイプ：　<span class="font-weight-bold light-text-color">{{ passTypeText }}</span>
                <div>
                  <v-btn
                    small
                    flat
                    class="grey--text text--darken-2 px-0 mx-0"
                    @click="passTypesDialog=true"
                  >
                    <v-icon class="mr-1" style="font-size: 16px; color: #BDBDBD">info</v-icon>
                    <span class="caption">パスの種類について</span>
                  </v-btn>
                </div>
              </div>
              <div class="pb-2">
                職種:　{{ passOccupation }}
              </div>
              <div v-if="passType != 'hiring'" class="pb-2">
                入社年度:　{{ joiningYear }}年度
              </div>
              <div>
                有効期限:　{{ passExpirationDate }}
              </div>
            </v-flex>
            <!-- pass編集 -->
            <v-form
              v-if="!status.contracted && !status.hired && !status.rejected"
              v-show="isEditingPass"
              v-model="editPassValid"
              class="pa-3"
            >
              <!-- 職種 -->
              <v-text-field
                label="職種"
                v-model="tempPassOccupation"
                :rules="occupationRules"
                required
              ></v-text-field>
              <!-- 入社年度 -->
              <v-text-field
                v-if="passType != 'hiring'"
                v-model="tempJoiningYear"
                class="pt-3"
                label="入社年度"
                type="number"
                suffix="年度"
                :rules="joiningYearRules"
                required
              ></v-text-field>
              <!-- 有効期限 -->
              <v-menu
                v-model="expirationDateMenu"
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
                    v-model="tempExpirationDate"
                    class="py-3"
                    label="有効期限"
                    append-icon="event"
                    hide-details
                    readonly
                    required
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="tempExpirationDate"
                  @input="expirationDateMenu = false"
                  color="teal"
                  locale="ja"
                ></v-date-picker>
              </v-menu>
              <div
                v-show="passType == 'offer' || passType == 'limited'"
                class=" light-text-color pb-3"
                style="font-size: 13px"
              >
                先着パスおよび内定パスの有効期限は、学生の卒業予定日付近を推奨しています。
                <div class="pt-2">
                  卒業予定日は、学生のプロフィールから確認できます。プロフィールに卒業予定日が設定されていない場合は、学生とのメッセージにてご確認ください。
                </div>
              </div>
              <div v-show="passType == 'hiring'" class="caption light-text-color pb-3">
                入社パスは、卒業後の一定期間の入社を保証するものであるため、有効期限は卒業予定日以降を指定してください。
              </div>
              <div class="text-xs-right">
                <v-btn
                  @click="updateIsEditingPass(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editPassValid || plan == null"
                  @click="updatePassButtonClicked"
                >
                  更新
                </v-btn>
              </div>
            </v-form>
          </div>
          <!-- インターン延長 -->
          <div v-if="status && (status.pass || status.contracted || status.hired || status.rejected)">
            <v-flex class="px-3 pt-5 break text-xs-left">
              <span class="text-color font-weight-bold">
                インターン延長
              </span>
              <v-tooltip bottom max-width="180px">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" style="font-size: 16px; color: #BDBDBD">info</v-icon>
                </template>
                <span>インターン延長は料金がかかりません</span>
              </v-tooltip>
              <v-btn
                v-if="!extendedInternEnd && !status.hired && !status.rejected"
                v-show="!isEditingExtendedIntern"
                flat
                small
                @click="editExtendedInternButtonClicked"
              >
                <v-icon :size="14">edit</v-icon>
                <span class="caption teal-text-color">編集する</span>
              </v-btn>
            </v-flex>
            <v-flex v-show="!isEditingExtendedIntern" class="px-3 break text-xs-left text-color">
              <div v-if="isInternExtended">
                <div v-if="extendedInternEnd" class="pt-2">
                  終了しています
                </div>
                <div v-else>
                  インターン延長中
                  <div class="caption light-text-color pt-2">
                    インターンが終了した場合は、更新してください。
                  </div>
                </div>
              </div>
              <div v-else>
                延長していません
                <div class="caption light-text-color pt-2">
                  パスを発行した後もインターンを継続する場合は、更新してください。
                </div>
              </div>
            </v-flex>
            <!-- 編集 -->
            <v-form
              v-if="isEditingExtendedIntern && !status.hired && !status.rejected"
              v-model="editExtendedInternValid"
              class="pa-3"
            >
              <v-text-field
                v-if="!isInternExtended"
                value="インターンを延長する"
                solo
                readonly
                required
              ></v-text-field>
              <v-text-field
                v-if="isInternExtended && !extendedInternEnd"
                value="インターンを終了する"
                solo
                readonly
                required
              ></v-text-field>
              <div class="text-xs-right">
                <v-btn
                  @click="updateIsEditingExtendedIntern(false)"
                >
                  キャンセル
                </v-btn>
                <v-btn
                  :disabled="!editExtendedInternValid || plan == null"
                  @click="updateExtendedInternButtonClicked"
                >
                  更新
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-flex>
        <v-flex
          md6
          xs12
          style="overflow: hidden;"
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
                    <span class="text-color font-weight-bold">
                      タグ
                    </span>
                    <v-tooltip bottom max-width="180px">
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" style="font-size: 16px; color: #BDBDBD">info</v-icon>
                      </template>
                      <span>タグには候補者の職種や役職などを自由に設定できます</span>
                    </v-tooltip>
                    <v-btn
                      v-show="!isEditingTags"
                      flat
                      small
                      @click="editTagsButtonClicked"
                    >
                      <v-icon :size="14">edit</v-icon>
                      <span class="caption teal-text-color">編集する</span>
                    </v-btn>
                  </v-flex>
                  <v-flex v-show="!isEditingTags" class="px-3 break text-xs-left">
                    <v-chip v-if="tags && tags.length > 0" v-for="tag in tags" :key="tag">{{ tag }}</v-chip>
                    <div v-if="tags == null || tags.length == 0" class="text-color">
                      タグは設定されていません。
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
                    <div class="text-xs-right">
                      <v-btn
                        @click="updateIsEditingTags(false)"
                      >
                        キャンセル
                      </v-btn>
                      <v-btn
                        :disabled="!editTagsValid || plan == null"
                        @click="updateTags({params: params, companyId: companyId, tags: tempTags})"
                      >
                        更新
                      </v-btn>
                    </div>
                  </v-form>
                </div>
                <!-- pass -->
                <div v-if="pass && status && (status.pass || status.contracted || status.hired || status.rejected)">
                  <v-flex class="px-3 pt-5 break text-xs-left">
                    <span class="text-color font-weight-bold">
                      パス
                    </span>
                    <v-btn
                      v-if="!status.contracted && !status.hired && !status.rejected"
                      v-show="!isEditingPass"
                      flat
                      small
                      @click="editPassButtonClicked"
                    >
                      <v-icon :size="14">edit</v-icon>
                      <span class="caption teal-text-color">編集する</span>
                    </v-btn>
                  </v-flex>
                  <v-flex v-show="!isEditingPass" class="px-3 break text-xs-left text-color">
                    <div class="pt-2 pb-3">
                      タイプ：　<span class="font-weight-bold light-text-color">{{ passTypeText }}</span>
                      <div>
                        <v-btn
                          small
                          flat
                          class="grey--text text--darken-2 px-0 mx-0"
                          @click="passTypesDialog=true"
                        >
                          <v-icon class="mr-1" style="font-size: 16px; color: #BDBDBD">info</v-icon>
                          <span class="caption">パスの種類について</span>
                        </v-btn>
                      </div>
                    </div>
                    <div class="pb-2">
                      職種:　{{ passOccupation }}
                    </div>
                    <div v-if="passType != 'hiring'" class="pb-2">
                      入社年度:　{{ joiningYear }}年度
                    </div>
                    <div>
                      有効期限:　{{ passExpirationDate }}
                    </div>
                  </v-flex>
                  <!-- pass編集 -->
                  <v-form
                    v-if="!status.contracted && !status.hired && !status.rejected"
                    v-show="isEditingPass"
                    v-model="editPassValid"
                    class="pa-3"
                  >
                    <!-- 職種 -->
                    <v-text-field
                      label="職種"
                      v-model="tempPassOccupation"
                      :rules="occupationRules"
                      required
                    ></v-text-field>
                    <!-- 入社年度 -->
                    <v-text-field
                      v-if="passType != 'hiring'"
                      v-model="tempJoiningYear"
                      class="pt-3"
                      label="入社年度"
                      type="number"
                      suffix="年度"
                      :rules="joiningYearRules"
                      required
                    ></v-text-field>
                    <!-- 有効期限 -->
                    <v-menu
                      v-model="expirationDateMenu"
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
                          v-model="tempExpirationDate"
                          class="py-3"
                          label="有効期限"
                          append-icon="event"
                          hide-details
                          readonly
                          required
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="tempExpirationDate"
                        @input="expirationDateMenu = false"
                        color="teal"
                        locale="ja"
                      ></v-date-picker>
                    </v-menu>
                    <div
                      v-show="passType == 'offer' || passType == 'limited'"
                      class=" light-text-color pb-3"
                      style="font-size: 13px"
                    >
                      先着パスおよび内定パスの有効期限は、学生の卒業予定日付近を推奨しています。
                      <div class="pt-2">
                        卒業予定日は、学生のプロフィールから確認できます。プロフィールに卒業予定日が設定されていない場合は、学生とのメッセージにてご確認ください。
                      </div>
                    </div>
                    <div v-show="passType == 'hiring'" class="caption light-text-color pb-3">
                      入社パスは、卒業後の一定期間の入社を保証するものであるため、有効期限は卒業予定日以降を指定してください。
                    </div>
                    <div class="text-xs-right">
                      <v-btn
                        @click="updateIsEditingPass(false)"
                      >
                        キャンセル
                      </v-btn>
                      <v-btn
                        :disabled="!editPassValid || plan == null"
                        @click="updatePassButtonClicked"
                      >
                        更新
                      </v-btn>
                    </div>
                  </v-form>
                </div>
                <!-- インターン延長 -->
                <div v-if="status && (status.pass || status.contracted || status.hired || status.rejected)">
                  <v-flex class="px-3 pt-5 break text-xs-left">
                    <span class="text-color font-weight-bold">
                      インターン延長
                    </span>
                    <v-tooltip bottom max-width="180px">
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" style="font-size: 16px; color: #BDBDBD">info</v-icon>
                      </template>
                      <span>インターン延長は料金がかかりません</span>
                    </v-tooltip>
                    <v-btn
                      v-if="!extendedInternEnd && !status.hired && !status.rejected"
                      v-show="!isEditingExtendedIntern"
                      flat
                      small
                      @click="editExtendedInternButtonClicked"
                    >
                      <v-icon :size="14">edit</v-icon>
                      <span class="caption teal-text-color">編集する</span>
                    </v-btn>
                  </v-flex>
                  <v-flex v-show="!isEditingExtendedIntern" class="px-3 break text-xs-left text-color">
                    <div v-if="isInternExtended">
                      <div v-if="extendedInternEnd" class="pt-2">
                        終了しています
                      </div>
                      <div v-else>
                        インターン延長中
                        <div class="caption light-text-color pt-2">
                          インターンが終了した場合は、更新してください。
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      延長していません
                      <div class="caption light-text-color pt-2">
                        パスを発行した後もインターンを継続する場合は、更新してください。
                      </div>
                    </div>
                  </v-flex>
                  <!-- 編集 -->
                  <v-form
                    v-if="isEditingExtendedIntern && !status.hired && !status.rejected"
                    v-model="editExtendedInternValid"
                    class="pa-3"
                  >
                    <v-text-field
                      v-if="!isInternExtended"
                      value="インターンを延長する"
                      solo
                      readonly
                      required
                    ></v-text-field>
                    <v-text-field
                      v-if="isInternExtended && !extendedInternEnd"
                      value="インターンを終了する"
                      solo
                      readonly
                      required
                    ></v-text-field>
                    <div class="text-xs-right">
                      <v-btn
                        @click="updateIsEditingExtendedIntern(false)"
                      >
                        キャンセル
                      </v-btn>
                      <v-btn
                        :disabled="!editExtendedInternValid || plan == null"
                        @click="updateExtendedInternButtonClicked"
                      >
                        更新
                      </v-btn>
                    </div>
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
                <!-- 新しいステータスが不採用の時 -->
                <div v-if="tempStatus == '不採用'">
                  ステータスを変更すると、候補者一覧に表示されなくなります。
                  不採用にする際に候補者にメッセージを送る場合は、
                  ステータス変更前に送信してください。
                </div>
                <!-- ステータスが scouted の時 -->
                <div v-if="status.scouted && tempStatus != '不採用'">
                  メッセージのやりとりが始まり次第、ステータスを
                  <span class="font-weight-bold cyan--text text--lighten-1">選考中</span>
                  に更新してください。
                </div>
                <!-- ステータスが inbox の時 -->
                <div v-if="status.inbox && tempStatus != '不採用'">
                  この応募者を選考する場合は、ステータスを
                  <span class="font-weight-bold cyan--text text--lighten-1">選考中</span>
                  に変えた後、メッセージを送信してください。
                </div>
                <!-- ステータスが inProcess の時 -->
                <div v-if="status.inProcess && tempStatus != '不採用'">
                  この候補者を採用する際は、まずメッセージにてやり取りをして頂き、
                  候補者と雇用契約を結んだ時点で、ステータスを
                  <span class="font-weight-bold orange--text text--darken-1">インターン</span>
                  に変更してください。
                  <div class="pt-3">
                    ステータスを切り替えた翌月に請求書をお送り致します。（無料枠を使い切っている場合）
                  </div>
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
                <!-- ステータスが intern の時 -->
                <div v-if="status.intern && tempStatus != '不採用'">
                  パスを送る場合は<span class="font-weight-bold teal--text text--lighten-1">パス</span>に変更してください。
                </div>
                <!-- pass -->
                <div v-if="status.intern && tempStatus != '不採用'">
                  <div v-if="tempStatus == 'パス'" class="py-3">
                    <div class="pt-3 pb-3 text-color subheading font-weight-bold">
                      パス
                    </div>
                    <div class="pb-3 caption light-text-color">
                      先着パスを発行する場合は、左のメニューからパスを選択し、採用予定人数などを設定してください。
                    </div>
                    <!-- パスの種類 -->
                    <v-select
                      v-model="tempPassType"
                      :items="passTypes"
                      hide-details
                      solo
                    ></v-select>
                    <div class="text-xs-right pt-2 pb-2">
                      <v-btn
                        small
                        flat
                        class="grey--text text--darken-2"
                        @click="passTypesDialog=true"
                      >
                        <v-icon class="mr-1" style="font-size: 18px; color: #BDBDBD">info</v-icon>
                        パスの種類について
                      </v-btn>
                    </div>
                    <v-form v-model="passValid" class="px-2">
                      <!-- 職種 -->
                      <v-text-field
                        label="職種"
                        v-model="passOccupation"
                        :rules="occupationRules"
                        required
                      ></v-text-field>
                      <!-- 入社年度 -->
                      <v-text-field
                        v-if="tempPassType != '入社パス'"
                        v-model="tempJoiningYear"
                        class="pt-3"
                        label="入社年度"
                        type="number"
                        suffix="年度"
                        :rules="joiningYearRules"
                        required
                      ></v-text-field>
                      <!-- 有効期限 -->
                      <v-menu
                        v-model="expirationDateMenu"
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
                            v-model="tempExpirationDate"
                            class="py-3"
                            label="有効期限"
                            append-icon="event"
                            hide-details
                            readonly
                            required
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="tempExpirationDate"
                          @input="expirationDateMenu = false"
                          color="teal"
                          locale="ja"
                        ></v-date-picker>
                      </v-menu>
                      <div v-show="tempPassType == '内定パス' || tempPassType == '先着パス'" class=" light-text-color pb-3" style="font-size: 13px">
                        先着パスおよび内定パスの有効期限は、学生の卒業予定日付近を推奨しています。
                        また、入社年度は、卒業の翌年度を指定してください。（卒業日が2019年3月の場合、入社年度は2019年度）
                        <div class="pt-2">
                          卒業予定日は、学生のプロフィールから確認できます。プロフィールに卒業予定日が設定されていない場合は、学生とのメッセージにてご確認ください。
                        </div>
                      </div>
                      <div v-show="tempPassType == '入社パス'" class="caption light-text-color pb-3">
                        入社パスは、卒業後の一定期間の入社を保証するものであるため、有効期限は卒業予定日以降を指定してください。
                      </div>
                      <!-- メッセージ -->
                      <v-textarea
                        label="メッセージ"
                        v-model="passMessage"
                        :rules="messageRules"
                        required
                      ></v-textarea>
                      <div class="caption-2 font-weight-bold light-text-color py-2">
                        ※ 入社時の労働条件などは、候補者とのメッセージにてお伝えください。
                      </div>
                    </v-form>
                  </div>
                </div>
                <!-- feedback -->
                <div v-if="status.intern" class="py-3">
                  <div class="pt-3 text-color subheading font-weight-bold">
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
                      placeholder="改善点"
                      :rules="feedbackRules"
                      required
                    ></v-textarea>
                  </v-form>
                  <div class="text-color">
                    フィードバックは後からでも入力することが出来ます。
                  </div>
                </div>
                <!-- ステータスが pass の時 -->
                <div v-if="status.pass && tempStatus != '不採用'">
                  <div>
                    契約が完了しましたら、ステータスを
                    <span class="font-weight-bold green--text text--lighten-1">入社予定</span>に変更してください。
                    ステータスを切り替えた翌月に請求書をお送り致します。（無料枠を使い切っている場合）
                  </div>
                  <div class="pt-3 light-text-color">
                    <div>
                      ※ パスの有効期限が切れた場合でも、自動的に無効にならないため、有効期限を編集することで延長が可能です。
                    </div>
                    <div>
                      有効期限が切れた後、パスを無効にする場合は、ステータスを
                      <span class="font-weight-bold grey--text">不採用</span>にしてください。
                    </div>
                  </div>
                </div>
                <!-- ステータスが contracted の時 -->
                <div v-if="status.contracted && tempStatus != '不採用'">
                  候補者と雇用契約を結び次第、ステータスを<span class="font-weight-bold green--text text--lighten-1">入社</span>に変更してください。
                  ステータスを変更すると、候補者一覧に表示されなくなります。
                </div>
                <div v-if="error && error != ''" class="pt-3 red--text">
                  {{ error }}
                </div>
                <div v-if="tempStatus == 'インターン' || tempStatus == '入社予定'" class="text-xs-right">
                  <v-btn
                    :disabled="updateStatusButtonDisabled"
                    @click="statusDialog = true"
                  >
                    更新
                  </v-btn>
                </div>
                <div v-else-if="!status.hired && !status.rejected" class="text-xs-right">
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
                <div class="pl-3 pt-3 light-text-color">
                  このレビューは候補者には表示されません。
                </div>
                <v-form v-model="reviewValid" class="pa-3">
                  <v-rating
                    v-model="rating"
                    hover
                    background-color="teal"
                    color="teal darken-1"
                    half-increments
                  />
                  <v-textarea
                    label="コメント"
                    v-model="review"
                    rows="3"
                    :rules="messageRules"
                    required
                    :disabled="plan == null"
                  ></v-textarea>
                  <div class="text-xs-right">
                    <v-btn
                      :disabled="!reviewValid || rating == 0 || plan == null"
                      color="teal"
                      class="white--text"
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
                            <v-list-tile-title class="text-color font-weight-bold">
                              {{ comment.pic.name }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              <v-rating
                                :value="comment.rating == null ? 0 : comment.rating"
                                background-color="teal"
                                color="teal darken-1"
                                small
                                half-increments
                                readonly
                              />
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                      <div class="pb-3 text-color" style="padding-left: 72px">
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
                <div v-if="isMessagesLoading" class="pt-5 text-xs-center">
                  Now Loading...
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
                            :class="{ 'offset-xs2 text-xs-right pr-2': message.pic != null }"
                          >
                            <v-card-actions class="pa-0" style="align-items: start">
                              <!-- ユーザーのプロフィール画像 -->
                              <div>
                                <v-avatar
                                  v-if="message.user != null"
                                  class="grey lighten-3 mx-2"
                                  :size="40"
                                >
                                  <img v-if="message.user.imageUrl" :src="message.user.imageUrl">
                                </v-avatar>
                              </div>
                              <!-- message -->
                              <div
                                :class="{ 'message-right': message.pic != null }"
                              >
                                <div v-if="message.user != null" class="light-text-color">
                                  {{ message.user.name }}
                                </div>
                                <div
                                  class="px-3 py-2 white message-border-radius return text-xs-left"
                                  style="display: inline-block;"
                                >{{ message.message }}</div>
                                <div class="text-xs-right pt-1 pr-2 caption light-text-color return">{{ message.timestamp }}</div>
                              </div>
                            </v-card-actions>
                          </v-flex>
                        </v-layout>
                      </template>
                    </v-flex>
                    <!-- userInput -->
                    <v-flex xs12 pl-2 pr-3 class="border-top">
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
                    </v-flex>
                  </v-layout>
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
        <!-- ステータス変更の確認 -->
        <v-dialog
          v-model="statusDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="600"
        >
          <v-card>
            <v-card-title class="title font-weight-bold text-color">ステータス更新の確認</v-card-title>
            <v-card-text>
              ステータスをインターンまたは採用予定に変更すると料金が発生します。
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey"
                flat="flat"
                @click="statusDialog = false"
              >
                キャンセル
              </v-btn>

              <v-btn
                color="teal"
                flat="flat"
                @click="updateStatusButtonClicked"
              >
                更新
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- パスの種類の説明 -->
        <v-dialog
          v-model="passTypesDialog"
          :fullscreen="$vuetify.breakpoint.xsOnly"
          width="600"
        >
          <v-card>
            <v-toolbar flat color="white">
              <v-btn class="hidden-sm-and-up" icon @click="passTypesDialog=false">
                <v-icon>close</v-icon>
              </v-btn>
              <span
                class="pl-3 text-color font-weight-bold"
                :class="{
                  'title': $vuetify.breakpoint.smAndUp,
                  'subheading': $vuetify.breakpoint.xsOnly
                }"
              >
                パスの種類
              </span>
            </v-toolbar>
            <v-flex
              xs12
              py-3
              class="light-text-color"
              :class="{'px-4': $vuetify.breakpoint.smAndUp, 'px-4 mt-4': $vuetify.breakpoint.xsOnly}"
            >
              <!-- 入社パス -->
              <div class="pb-3">
                <div class="subheading font-weight-bold">
                  1. 入社パス
                </div>
                <div class="pt-2">
                  卒業後の一定期間、いつでも入社できる権利を与えるパスです。
                  卒業後、どれくらい有効かは企業が決めることができます。
                  このパスを多く発行すると、採用予定人数を上回ってしまう可能性があるため、対象者を厳選して発行することを推奨しています。
                </div>
                <div class="pt-3 subheading font-weight-bold">
                  2. 内定パス
                </div>
                <div class="pt-2">
                  企業が定めた期間内であれば、いつでも内定を取得できる権利を与えるパスです。
                  有効期間や入社年度は企業が設定します。
                  このパスも入社パス同様、多く発行すると採用予定人数を上回ってしまう可能性があるため、対象者を厳選して発行することを推奨しています。
                </div>
                <div class="pt-3 subheading font-weight-bold">
                  3. 先着パス
                </div>
                <div class="pt-2">
                  企業が定めた期間内であり、採用枠にあまりがある場合に限り、内定を取得できる権利を与えるパスです。
                  有効期間、入社年度および採用予定人数は企業が設定することが出来ます。
                  入社パスや内定パスは性質上、パスを使う人数が予想しにくいため、あまり発行することが出来ませんが、
                  先着パスは上限を自由に設定することが出来るため、数を気にせず発行することができます。
                </div>
              </div>
            </v-flex>
          </v-card>
        </v-dialog>
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

export default {
  middleware: 'auth',
  data: () => ({
    isQueried: false,
    windowHeight: 0,
    statusDialog: false,
    snackbar: false,
    snackbarText: '',
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
      v => (v && v.length <= 2000) || '2000字以内で入力してください'
    ],
    passType: null,
    joiningYear: null,
    expirationDate: null,
    expirationDateMenu: false,
    passOccupation: '',
    occupationRules: [
      v => !!v || '職種を入力してください',
      v => (v && v.length <= 20) || '20字以内で入力してください'
    ],
    goodPoint: '',
    advice: '',
    feedbackRules: [
      v => (v.length <= 2000) || '2000字以内で入力してください'
    ],
    tempTags: [],
    tagRules: [
      v => (v && !(/\s/.test(v))) || 'スペースを含めないでください',
      v => (v && v.length <= 10) || '10字以内で入力してください'
    ],
    editTagsValid: true,
    passTypesDialog: false,
    passTypes: [
      '先着パス',
      '内定パス',
      '入社パス',
    ],
    tempPassType: '先着パス',
    tempJoiningYear: null,
    tempExpirationDate: null,
    tempPassOccupation: '',
    editPassValid: true,
    tempIsInternExtended: false,
    editExtendedInternValid: true,
    reviewValid: true,
    rating: 0,
    review: '',
    sendReviewButtonText: 'レビュー送信',
    message: '',
    isShowMessage: false,
    updateStatusValid: true,
  }),
  computed: {
    joiningYearRules() {
      const year = new Date()
      return [
        v => (String(v).length == 4) || '4桁で指定してください',
        v => (v >= year.getFullYear() - 1) || `${year.getFullYear() - 1}以上で指定してください`,
      ]
    },
    passTypeText() {
      if (this.passType == 'hiring') {
        return '入社パス'
      } else if (this.passType == 'offer') {
        return '内定パス'
      } else if (this.passType == 'limited') {
        return '先着パス'
      }
    },
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
      if (this.reviews) {
        for (const comment of this.reviews.comments) {
          if (comment.pic.uid == this.uid) {
            return true
          }
        }
        return false
      } else {
        return false
      }
    },
    updateStatusButtonDisabled() {
      // 企業が未契約の場合
      if (this.plan == null) {
        return true
      }

      if (!this.updateStatusValid) {
        return true
      }

      let currentStatus
      if (this.status.scouted == true) {
        currentStatus = 'スカウト'
      } else if (this.status.inbox == true) {
        currentStatus = '応募'
      } else if (this.status.inProcess == true) {
        currentStatus = '選考中'
      } else if (this.status.intern == true) {
        currentStatus = 'インターン'
      } else if (this.status.pass == true) {
        currentStatus = 'パス'
      } else if (this.status.contracted == true) {
        currentStatus = '入社予定'
      }

      if (currentStatus == this.tempStatus) {
        return true
      }
      if (this.status.inProcess && this.tempStatus == 'インターン') {
        return !this.internValid
      } else if (this.status.intern && this.tempStatus == 'パス') {
        return !this.feedbackValid || !this.passValid || this.tempExpirationDate == null
      } else if (this.status.intern && this.tempStatus != 'パス') {
        return !this.feedbackValid
      } else if (!this.status.intern && this.tempStatus == 'パス') {
        return !this.passValid || this.tempExpirationDate == null
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
          'パス',
          '不採用'
        ]
      } else if (this.status.pass == true) {
        items = [
          'パス',
          '入社予定',
          '不採用'
        ]
      } else if (this.status.contracted == true) {
        items = [
          '入社予定',
          '入社',
          '不採用'
        ]
      } else if (this.status.hired == true) {
        items = [
          '入社',
        ]
      } else if (this.status.rejected == true) {
        items = [
          '不採用',
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
      isRefreshing: state => state.isRefreshing,
      plan: state => state.profile.plan,
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
      isInternExtended: state => state.candidate.isInternExtended,
      extendedInternEnd: state => state.candidate.extendedInternEnd,
      isLoading: state => state.candidate.isLoading,
      isEditingTags: state => state.candidate.isEditingTags,
      isEditingPass: state => state.candidate.isEditingPass,
      isEditingExtendedIntern: state => state.candidate.isEditingExtendedIntern,
      messages: state => state.candidate.messages,
      isMessagesLoading: state => state.candidate.isMessagesLoading,
      allMessagesQueried: state => state.candidate.allMessagesQueried,
      unsubscribe: state => state.candidate.unsubscribe,
      isNewMessage: state => state.candidate.isNewMessage,
      error: state => state.candidate.error,
    }),
  },
  mounted() {
    let toolbarHeight
    if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
      toolbarHeight = 48
    } else {
      toolbarHeight = 64
    }
    this.windowHeight = window.innerHeight - toolbarHeight
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
      this.updateIsLoading(true)
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
      if (companyId != null && companyId != '') {
        this.resetState()
        this.updateIsLoading(true)
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
        } else if (status.pass == true) {
          this.tempStatus = 'パス'
        } else if (status.contracted == true) {
          this.tempStatus = '入社予定'
        } else if (status.hired == true) {
          this.tempStatus = '入社'
        } else if (status.rejected == true) {
          this.tempStatus = '不採用'
        }
      }
    },
    // 入社年度に現在の年を設定
    tempStatus(status) {
      if (status) {
        if (status == 'パス') {
          this.tempJoiningYear = new Date().getFullYear()
        }
      }
    },
    uid(uid) {
      if (uid != null && uid != '' && this.reviews) {
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
      if (reviews && this.uid != null && this.uid != '') {
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
        this.passType = pass.type
        this.expirationDate = pass.expirationDate
        this.passOccupation = pass.occupation

        if (pass.type == 'offer' || pass.type == 'limited') {
          this.joiningYear = pass.joiningYear
        }
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
    },
    error(error) {
      this.updateStatusValid = true
      if (error == null) {
        this.snackbarText = '更新しました！'
        this.snackbar = true
      }
    },
  },
  methods: {
    editTagsButtonClicked() {
      this.tempTags = this.tags
      this.updateIsEditingTags(true)
    },
    editPassButtonClicked() {
      // パスの種類
      switch (this.passType) {
        case 'hiring': this.tempPassType = '入社パス'; break
        case 'offer': this.tempPassType = '内定パス'; break
        case 'limited': this.tempPassType = '先着パス'; break
      }
      // 入社年度（内定パス、先着パス）
      if (this.passType != 'hiring') {
        this.tempJoiningYear = this.joiningYear
      }
      // 有効期間
      this.tempExpirationDate =
        String(this.expirationDate.getFullYear()) + '-' +
        String(this.expirationDate.getMonth() + 1) + '-' +
        String(this.expirationDate.getDate())
      // 職種
      this.tempPassOccupation = this.passOccupation
      this.updateIsEditingPass(true)
    },
    editExtendedInternButtonClicked() {
      this.tempIsInternExtended = this.isInternExtended
      this.updateIsEditingExtendedIntern(true)
    },
    updateExtendedInternButtonClicked() {
      if (!this.isInternExtended) {
        this.updateExtendedIntern({params: this.params, companyId: this.companyId, extendIntern: true})
      } else {
        this.updateExtendedIntern({params: this.params, companyId: this.companyId, extendIntern: false})
      }
    },
    removeSkill(item) {
      this.tempTags.splice(this.tempTags.indexOf(item), 1)
      this.tempTags = [...this.tempTags]
    },
    updateStatusButtonClicked() {
      this.resetError()
      // 更新中はボタンを押せないようにする
      // this.updateStatusValid = false

      let newStatus = {
        scouted: false,
        inbox: false,
        inProcess: false,
        intern: false,
        pass: false,
        contracted: false,
        hired: false,
        rejected: false
      }
      switch (this.tempStatus) {
        case 'スカウト': newStatus.scouted = true; break
        case '応募': newStatus.inbox = true; break
        case '選考中': newStatus.inProcess = true; break
        case 'インターン': newStatus.intern = true; break
        case 'パス': newStatus.pass = true; break
        case '入社予定': newStatus.contracted = true; break
        case '入社': newStatus.hired = true; break
        case '不採用': newStatus.rejected = true; break
      }

      let candidateData = {
        router: this.$router,
        params: this.params,
        companyId: this.companyId,
        newStatus: newStatus
      }

      if (this.tempStatus == 'インターン') {
        candidateData.occupation = this.internOccupation
        candidateData.plan = this.plan
      }

      if (this.tempStatus == 'パス') {
        var expirationDateArr = this.tempExpirationDate.split('-')
        var passType
        switch (this.tempPassType) {
          case '入社パス': passType = 'hiring'; break
          case '内定パス': passType = 'offer'; break
          case '先着パス': passType = 'limited'; break
        }

        let pass = {
          type: passType,
          expirationDate: new Date(expirationDateArr[0], expirationDateArr[1] - 1, expirationDateArr[2]),
          message: this.passMessage,
          occupation: this.passOccupation,
          pic: {
            uid: this.uid,
            name: this.lastName + ' ' + this.firstName
          }
        }
        if (this.imageUrl) {
          pass.pic.imageUrl = this.imageUrl
        }
        if (this.tempPassType != '入社パス') {
          pass.joiningYear = Number(this.tempJoiningYear)
        }

        candidateData.pass = pass
      }

      // 現在のステータスがインターンでフィードバックが記入されている場合
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
      this.statusDialog = false
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

      this.snackbarText = 'レビューを送信しました！'
      this.snackbar = true

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
    // パスの更新
    updatePassButtonClicked() {
      var expirationDateArr = this.tempExpirationDate.split('-')
      var expirationDate = new Date(expirationDateArr[0], expirationDateArr[1] - 1, expirationDateArr[2])

      if (this.passType == 'hiring') {
        this.updatePass({
          params: this.params,
          companyId: this.companyId,
          joiningYear: null,
          expirationDate: expirationDate,
          occupation: this.tempPassOccupation
        })
      } else {
        const joiningYear = Number(this.tempJoiningYear)
        this.updatePass({
          params: this.params,
          companyId: this.companyId,
          joiningYear: joiningYear,
          expirationDate: expirationDate,
          occupation: this.tempPassOccupation
        })
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
      updateIsLoading: 'candidate/updateIsLoading',
      updateIsEditingTags: 'candidate/updateIsEditingTags',
      updateTags: 'candidate/updateTags',
      updateIsEditingPass: 'candidate/updateIsEditingPass',
      updatePass: 'candidate/updatePass',
      updateIsEditingExtendedIntern: 'candidate/updateIsEditingExtendedIntern',
      updateExtendedIntern: 'candidate/updateExtendedIntern',
      updateStatus: 'candidate/updateStatus',
      sendReview: 'candidate/sendReview',
      queryMessages: 'candidate/queryMessages',
      resetUnsubscribe: 'candidate/resetUnsubscribe',
      updateIsMessagesLoading: 'candidate/updateIsMessagesLoading',
      updateIsNewMessage: 'candidate/updateIsNewMessage',
      postMessageFromPic: 'message/postMessageFromPic',
      resetState: 'candidate/resetState',
      resetError: 'candidate/resetError',
    }),
  }
}
</script>
