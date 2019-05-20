<template>
  <!-- メールアドレスの確認が済んでいない場合は確認してもらう -->
  <v-toolbar v-if="uid && !isVerified && type == 'user'" flat fixed app color="white" id="toolbar">
    <v-toolbar-title v-if="(!path.includes('/recruiter') && !path.includes('/users')) || breakpoint == 'xs'">Application</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-layout row wrap align-center class="pl-5">
        <v-flex class="text-xs-center">
          <div class="align-center">
            <div class="text-xs-left">
              <v-menu offset-y offset-x min-width="250">
                <v-avatar
                  slot="activator"
                  :size="avatarSize"
                >
                  <v-icon>person</v-icon>
                </v-avatar>
                <v-list>
                  <v-list-tile @click="signOut">
                    <v-list-tile-title>ログアウト</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-toolbar-items>
    <v-dialog
      :value="true"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      persistent
      width="500"
    >
      <v-card v-if="!recruiterSignUpDialog">
        <v-toolbar flat>
          <span class="textColor font-weight-bold subheading">メールアドレスの確認をお願いします</span>
        </v-toolbar>
        <div class="pa-4">
          <div>
            ログインしました！
          </div>
          <div>
            {{ userEmail }}にメールアドレスの確認メールを送信しました。ご確認ください。
          </div>
        </div>
        <v-divider class="mt-4"></v-divider>
        <div class="text-xs-right">
          <v-btn
            flat
            color="primary"
            @click="signOut"
          >
            <span>ログアウト</span>
          </v-btn>
        </div>
      </v-card>
      <v-card v-else>
        <v-progress-circular
         :size="50"
         color="primary"
         indeterminate
        ></v-progress-circular>
      </v-card>
    </v-dialog>
  </v-toolbar>
  <!-- recruiter -->
  <v-toolbar v-else-if="type == 'recruiter'" flat fixed app color="white" id="toolbar">
    <!-- filter extension -->
    <v-flex xs12 slot="extension" v-if="(usersToolbarExtension || jobsToolbarExtension) && !isJobsLoading">
      <filter-extension></filter-extension>
    </v-flex>
    <v-toolbar-title class="font-weight-bold">
      <no-ssr>
        <nuxt-link
          v-if="breakpoint != 'xs' && !path.includes('/recruiter')　&& !path.includes('/users')"
          to="/"
          class="toolbar-title"
        >
          Home
        </nuxt-link>
        <span v-else-if="breakpoint == 'xs' && path == '/'"　class="toolbar-title">募集</span>
        <span v-else-if="breakpoint == 'xs' && path == '/recruiter/dashboard'"　class="toolbar-title">ダッシュボード</span>
        <span v-else-if="breakpoint == 'xs' && path == '/recruiter/company'"　class="toolbar-title">企業情報</span>
        <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/jobs')"　class="toolbar-title">募集管理</span>
        <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/candidates')"　class="toolbar-title">候補者管理</span>
        <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/messages')"　class="toolbar-title">メッセージ</span>
        <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/feedbacks')"　class="toolbar-title">フィードバック</span>
        <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/reviews')"　class="toolbar-title">レビュー</span>
        <span v-else-if="breakpoint == 'xs' && path == '/recruiter/company_settings'" class="toolbar-title">設定</span>
        <span v-else-if="breakpoint == 'xs' && path == '/user/settings/account'" class="toolbar-title">アカウント設定</span>
        <span v-else-if="breakpoint == 'xs' && path == '/user/settings/notifications'" class="toolbar-title">通知設定</span>
        <span v-else-if="breakpoint == 'xs' && path == '/users'" class="toolbar-title">ユーザー検索</span>
        <span v-else-if="breakpoint == 'xs' && path == '/recruiter/profile'" class="toolbar-title">プロフィール</span>
        <span v-else-if="breakpoint == 'xs' && path == '/recruiter/notifications'" class="toolbar-title">通知</span>
      </no-ssr>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat active-class to="/users" class="hidden-xs-only">
        <span class="font-weight-bold textColor">ユーザー検索</span>
      </v-btn>
      <!-- notifications -->
      <v-menu
        offset-y
        min-width="350"
        max-width="350"
        style="right: 3px;"
        :fullscreen="$vuetify.breakpoint.xsOnly"
      >
        <v-btn
          flat
          active-class
          slot="activator"
          @click="notificationsButtonClicked"
          class="hidden-xs-only"
        >
          <span v-if="!hasNewNotification" class="font-weight-bold textColor">通知</span>
          <v-badge v-else overlap color="red">
            <template v-slot:badge>
              <span></span>
            </template>
            <span class="font-weight-bold textColor">通知</span>
          </v-badge>
        </v-btn>
        <v-card>
          <v-toolbar flat height="48">
            <span class="font-weight-bold subheading">通知</span>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn small flat @click="updateAllIsUnread(uid)">すべて既読にする</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card
            v-if="hasNewMessage"
            flat
            to="/recruiter/messages"
            @click=""
          >
            <v-alert
              :value="true"
              color="warning"
              outline
              class="mt-0"
            >
              新着メッセージがあります
            </v-alert>
          </v-card>
          <v-list v-if="!isNotificationsLoading && notifications && notifications.length != 0" two-line>
            <template v-for="(notification, index) in notifications">
              <v-card
                flat
                :to="notification.url ? notification.url : ''"
                @click="updateIsUnread({uid: uid, notificationId: notification.notificationId})"
              >
                <div class="textColor text-xs-right caption pr-2 pt-2">
                  {{ notification.isUnread ? '未読' : '既読' }}
                </div>
                <div class="textColor return px-3 py-2">{{ notification.content }}</div>
                <div class="textColor text-xs-right caption pr-2 pb-2">
                  {{ notification.timestamp }}
                </div>
              </v-card>
              <v-divider
                v-if="notifications.length != index + 1"
              ></v-divider>
            </template>
          </v-list>
          <div v-if="!isNotificationsLoading && notifications && notifications.length == 0" class="text-xs-center py-4">
            通知はありません
          </div>
          <div v-if="isNotificationsLoading" class="text-xs-center py-4">
            <v-progress-circular
             :size="50"
             color="primary"
             indeterminate
           ></v-progress-circular>
          </div>
          <v-divider v-if="notifications && notifications.length >= 1"></v-divider>
          <div v-if="notifications && notifications.length >= 1" class="text-xs-center py-2">
            <v-btn flat small to="/recruiter/notifications" style="color: #00897B">
              すべて表示する
            </v-btn>
          </div>
        </v-card>
      </v-menu>
      <v-layout row wrap align-center class="pl-3">
        <v-flex class="text-xs-center">
          <div class="text-xs-left">
            <v-menu offset-y offset-x min-width="250">
              <!-- Profile画像 -->
              <v-avatar
                slot="activator"
                :size="avatarSize"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                <v-icon v-else>person</v-icon>
              </v-avatar>
              <v-list>
                <v-list-tile to="/users" class="hidden-sm-and-up">
                  <v-list-tile-title>ユーザー検索</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile to="/recruiter/profile">
                  <v-list-tile-title>プロフィール</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile to="/recruiter/dashboard">
                  <v-list-tile-title>ダッシュボード</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile to="/recruiter/notifications" class="hidden-sm-and-up">
                  <v-list-tile-title>通知</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile to="/user/settings/notifications" class="hidden-xs-only">
                  <v-list-tile-title>設定</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-xs-only"></v-divider>
                <v-list-tile to="/user/settings/account" class="hidden-sm-and-up">
                  <v-list-tile-title>アカウント設定</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile to="/user/settings/notifications" class="hidden-sm-and-up">
                  <v-list-tile-title>通知設定</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile @click="signOut">
                  <v-list-tile-title>ログアウト</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-flex>
      </v-layout>
    </v-toolbar-items>
  </v-toolbar>
  <!-- user & 未ログイン -->
  <v-toolbar v-else-if="path != '/user/menu'" flat color="white" class="toolbar-fixed border-bottom" id="toolbar">
    <v-toolbar-side-icon @click="iconClicked" class="hidden-sm-and-up"></v-toolbar-side-icon>
    <!-- menu (xs) -->
    <div class="text-xs-center hidden-sm-and-up">
      <v-dialog
        v-model="dropdownMenu"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <v-layout row fill-height>
          <v-flex xs12>
            <v-card style="height: 100%;">
              <v-toolbar flat color="white">
                <v-toolbar-side-icon
                  @click="iconClicked"
                  class="ml-2"
                ></v-toolbar-side-icon>
              </v-toolbar>
              <v-list>
                <!-- ホーム -->
                <v-list-tile
                  class="px-3"
                  to="/"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor">ホーム</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- 登録 -->
                <v-list-tile
                  v-if="!uid"
                  class="px-3"
                  @click="signUpButtonClicked"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor">登録する</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- ログイン -->
                <v-list-tile
                  v-if="!uid"
                  class="px-3"
                  @click="signInButtonClicked"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor">ログイン</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- 利用規約 -->
                <v-list-tile
                  class="px-3"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor">利用規約</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- プライバシー -->
                <v-list-tile
                  class="px-3"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor">プライバシー</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- 運営会社 -->
                <v-list-tile
                  class="px-3"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor">運営会社</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- フィードバック -->
                <v-list-tile
                  class="px-3"
                  to="/feedback"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="textColor">フィードバックを送る</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-dialog>
    </div>
    <!-- filter extension -->
    <v-flex xs12 slot="extension" v-if="jobsToolbarExtension && !isJobsLoading">
      <filter-extension></filter-extension>
    </v-flex>
    <v-toolbar-title class="font-weight-bold ml-0">
      <no-ssr>
        <nuxt-link v-if="breakpoint != 'xs'" to="/" class="toolbar-title">Home</nuxt-link>
        <span v-else-if="path == '/'"　class="toolbar-title">募集</span>
        <span v-else-if="routeName == 'jobs-id' || routeName == 'companies-id'"　class="toolbar-title"></span>
        <span v-else-if="routeName == 'companies-id-jobs'"　class="toolbar-title">募集一覧</span>
        <span v-else-if="path.includes('/user/notifications')"　class="toolbar-title">通知</span>
        <span v-else-if="path.includes('/messages')"　class="toolbar-title">メッセージ</span>
        <span v-else-if="path.includes('/passes')" class="toolbar-title">内定パス</span>
        <span v-else-if="path.includes('/career')" class="toolbar-title">キャリア</span>
        <span v-else-if="path.includes('/feedbacks')" class="toolbar-title">フィードバック</span>
        <span v-else-if="path.includes('/reviews')" class="toolbar-title">レビュー</span>
        <span v-else-if="path == '/user/settings/account'" class="toolbar-title">アカウント設定</span>
        <span v-else-if="path == '/user/settings/notifications'" class="toolbar-title">通知設定</span>
        <span v-else class="toolbar-title">Home</span>
      </no-ssr>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <!-- messages -->
      <v-btn
        v-if="uid"
        flat
        to="/messages"
        active-class
        class="pr-4 hidden-xs-only"
      >
        <span v-if="!hasNewMessage" class="font-weight-bold textColor">メッセージ</span>
        <v-badge v-else overlap color="red">
          <template v-slot:badge>
            <span></span>
          </template>
          <span class="font-weight-bold textColor">メッセージ</span>
        </v-badge>
      </v-btn>
      <!-- notifications -->
      <v-menu
        v-if="uid"
        offset-y
        offset-x
        min-width="400"
        max-width="400"
        style="right: 3px;"
        class="hidden-xs-only"
      >
        <v-btn flat slot="activator" @click="notificationsButtonClicked">
          <span v-if="!hasNewNotification" class="font-weight-bold textColor">通知</span>
          <v-badge v-else overlap color="red">
            <template v-slot:badge>
              <span></span>
            </template>
            <span class="font-weight-bold textColor">通知</span>
          </v-badge>
        </v-btn>
        <v-card>
          <v-toolbar flat height="48">
            <span class="font-weight-bold subheading">通知</span>
            <v-spacer></v-spacer>
            <v-toolbar-items class="pr-0">
              <v-btn small flat @click="updateAllIsUnread(uid)">すべて既読にする</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list v-if="!isNotificationsLoading && notifications && notifications.length != 0" two-line>
            <template v-for="(notification, index) in notifications">
              <v-card
                flat
                :to="notification.url ? notification.url : ''"
                @click="updateIsUnread({uid: uid, notificationId: notification.notificationId})"
              >
                <div class="textColor text-xs-right caption pr-2 pt-2">
                  {{ notification.isUnread ? '未読' : '既読' }}
                </div>
                <div class="textColor return px-3 py-2">{{ notification.content }}</div>
                <div class="textColor text-xs-right caption pr-2 pb-2">
                  {{ notification.timestamp }}
                </div>
              </v-card>
              <v-divider
                v-if="notifications.length != index + 1"
              ></v-divider>
            </template>
          </v-list>
          <div v-if="!isNotificationsLoading && notifications && notifications.length == 0" class="text-xs-center py-4">
            通知はありません
          </div>
          <div v-if="isNotificationsLoading" class="text-xs-center py-4">
            <v-progress-circular
             :size="50"
             color="primary"
             indeterminate
           ></v-progress-circular>
          </div>
          <v-divider v-if="notifications && canReadAll"></v-divider>
          <div v-if="notifications && canReadAll" class="text-xs-center py-3">
            <v-btn flat small to="/user/notifications" style="color: #00897B">
              すべて表示する
            </v-btn>
          </div>
        </v-card>
      </v-menu>
      <v-layout row wrap align-center class="pl-4">
        <v-flex class="text-xs-center">
          <!-- ログイン中に表示される -->
          <div v-if="uid" class="align-center">
            <div class="text-xs-left">
              <v-menu offset-y offset-x min-width="250">
                <!-- Profile画像 -->
                <v-avatar
                  slot="activator"
                  :size="avatarSize"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                  <v-icon v-else>person</v-icon>
                </v-avatar>
                <v-list>
                  <v-list-tile v-if="isAdmin" to="/admin/feedbacks">
                    <v-list-tile-title>Admin</v-list-tile-title>
                  </v-list-tile>
                  <v-divider v-if="isAdmin"></v-divider>
                  <v-list-tile to="/user/profile" class="hidden-xs-only">
                    <v-list-tile-title>プロフィール</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-xs-only"></v-divider>
                  <v-list-tile to="/user/menu" class="hidden-sm-and-up">
                    <v-list-tile-title>プロフィール</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-sm-and-up"></v-divider>
                  <v-list-tile to="/user/passes" class="hidden-xs-only">
                    <v-list-tile-title>マイページ</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-xs-only"></v-divider>
                  <v-list-tile to="/user/settings/notifications" class="hidden-xs-only">
                    <v-list-tile-title>設定</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-xs-only"></v-divider>
                  <v-list-tile to="/user/settings/account" class="hidden-sm-and-up">
                    <v-list-tile-title>アカウント設定</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-sm-and-up"></v-divider>
                  <v-list-tile to="/user/settings/notifications" class="hidden-sm-and-up">
                    <v-list-tile-title>通知設定</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-sm-and-up"></v-divider>
                  <v-list-tile @click="signOut">
                    <v-list-tile-title>ログアウト</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </div>
          <!-- ログインしていない場合に表示される -->
          <div v-else class="hidden-xs-only">
            <v-btn flat @click="signUpButtonClicked">
              <span class="font-weight-bold" style="color: #555555">登録する</span>
            </v-btn>
            <v-btn flat @click="signInButtonClicked">
              <span class="font-weight-bold" style="color: #555555">ログイン</span>
            </v-btn>
            <!-- Auth Dialog -->
            <div class="text-xs-center">
              <v-dialog
                v-model="dialog"
                :fullscreen="$vuetify.breakpoint.xsOnly"
                width="500"
              >
                <v-card class="pt-5 pb-3 px-3">
                  <v-toolbar flat color="white hidden-sm-and-up">
                    <v-btn icon @click="dialog=false">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-flex
                    xs12
                    class="text-xs-center"
                    :class="{'px-2': $vuetify.breakpoint.smAndUp, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
                  >
                    <!-- ログインフォーム -->
                    <div v-show="signInDialog">
                      <v-form v-model="signInValid">
                        <v-container>
                          <v-layout
                            column
                            justify-center
                          >
                            <v-flex xs12>
                              <!-- Error Message -->
                              <v-alert
                                :value="authError != null"
                                type="error"
                                class="mb-5"
                                outline
                              >
                                {{ authError }}
                              </v-alert>
                              <!-- メールアドレス -->
                              <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                label="メールアドレス"
                                append-icon="mail_outline"
                                solo
                                required
                              ></v-text-field>
                              <!-- パスワード -->
                              <v-text-field
                                v-model="password"
                                :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                                :rules="passwordRules"
                                :type="passwordShow ? 'text' : 'password'"
                                label="パスワード"
                                solo
                                required
                                @click:append="passwordShow = !passwordShow"
                              ></v-text-field>
                            </v-flex>
                            <!-- ログインボタン -->
                            <v-btn
                              :disabled="!signInValid || loading"
                              class="orange darken-1"
                              @click="signIn"
                            >
                              <span
                                class="font-weight-bold body-1"
                                style="color: #ffffff;"
                              >
                                ログイン
                              </span>
                            </v-btn>
                          </v-layout>
                        </v-container>
                      </v-form>
                    </div>
                    <!-- 登録フォーム -->
                    <div v-show="!signInDialog && signUpForm">
                      <v-form v-model="signUpValid">
                        <v-container>
                          <v-layout
                            column
                            justify-center
                          >
                            <v-flex xs12>
                              <!-- Error Message -->
                              <v-alert
                                :value="authError != null"
                                type="error"
                                class="mb-5"
                                outline
                              >
                                {{ authError }}
                              </v-alert>
                              <!-- メールアドレス -->
                              <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                label="メールアドレス"
                                append-icon="mail_outline"
                                solo
                                required
                              ></v-text-field>
                              <!-- 苗字 -->
                              <v-text-field
                                v-model="lastName"
                                :rules="lastNameRules"
                                label="姓"
                                append-icon="person"
                                solo
                                required
                              ></v-text-field>
                              <!-- 名前 -->
                              <v-text-field
                                v-model="firstName"
                                :rules="firstNameRules"
                                label="名"
                                append-icon="person"
                                solo
                                required
                              ></v-text-field>
                              <!-- 生年月日 -->
                              <v-menu
                                ref="birthDateMenu"
                                v-model="birthDateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="birthDate"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                              >
                                <template v-slot:activator="{ on }">
                                  <v-text-field
                                    v-model="birthDate"
                                    label="生年月日"
                                    append-icon="event"
                                    solo
                                    readonly
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="birthDate" color="teal" locale="ja">
                                  <v-spacer></v-spacer>
                                  <v-btn flat color="teal" @click="birthDateMenu = false">Cancel</v-btn>
                                  <v-btn flat color="teal" @click="$refs.birthDateMenu.save(birthDate)">OK</v-btn>
                                </v-date-picker>
                              </v-menu>
                              <!-- パスワード -->
                              <v-text-field
                                v-model="password"
                                :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                                :rules="passwordRules"
                                :type="passwordShow ? 'text' : 'password'"
                                label="パスワード"
                                solo
                                required
                                @click:append="passwordShow = !passwordShow"
                              ></v-text-field>
                            </v-flex>
                            <!-- 登録ボタン -->
                            <v-btn
                              :disabled="!signUpValid || loading || birthDate == null"
                              class="orange darken-1"
                              @click="signUp"
                            >
                              <span
                                class="font-weight-bold body-1"
                                style="color: #ffffff;"
                              >
                                登録する
                              </span>
                            </v-btn>
                          </v-layout>
                        </v-container>
                      </v-form>
                    </div>
                    <!-- 登録方法 -->
                    <div v-show="!signInDialog && !signUpForm">
                      <!-- メールアドレス登録 -->
                      <v-btn
                        block
                        color="teal"
                        class="my-3 mb-5"
                        style="color: white;"
                        @click="signUpForm=true"
                      >
                        <v-icon>mail_outline</v-icon>
                        <span class="font-weight-bold body-1 ml-2">メールアドレスで登録</span>
                      </v-btn>
                    </div>
                  </v-flex>

                  <v-divider class="mt-4"></v-divider>
                  <!-- アカウントを持っている場合はログイン画面へ -->
                  <v-flex xs12 class="text-xs-center px-2">
                    <div v-show="signInDialog">
                      <span>アカウントをお持ちでない方は</span>
                      <v-btn
                        flat
                        color="teal"
                        @click="signUpButtonClicked"
                      >
                        <span>登録</span>
                      </v-btn>
                    </div>
                    <div v-show="!signInDialog">
                      <span>アカウントをお持ちの方は</span>
                      <v-btn
                        flat
                        color="teal"
                        @click="signInButtonClicked"
                      >
                        <span>ログイン</span>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-toolbar-items>
    <v-dialog
      v-model="recruiterSignUpDialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      width="500"
    >
      <v-card>
        <v-toolbar flat color="white">
          <v-btn class="hidden-sm-and-up" icon @click="recruiterSignUpDialog=false">
            <v-icon>close</v-icon>
          </v-btn>
          <span
            class="pl-3 textColor font-weight-bold"
            :class="{
              'title': $vuetify.breakpoint.smAndUp,
              'subheading': $vuetify.breakpoint.xsOnly
            }"
          >
            サインアップ
          </span>
        </v-toolbar>
        <v-flex
          xs12
          class="text-xs-center"
          py-3
          :class="{'px-4': $vuetify.breakpoint.smAndUp, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
        >
          <!-- 登録フォーム -->
          <div>
            <v-form v-model="recruiterSignUpValid">
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <v-flex xs12>
                    <!-- Error Message -->
                    <v-alert
                      :value="authError != null"
                      type="error"
                      class="mb-5"
                      outline
                    >
                      {{ authError }}
                    </v-alert>
                    <!-- メールアドレス -->
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="メールアドレス"
                      append-icon="mail_outline"
                      solo
                      required
                    ></v-text-field>
                    <!-- 苗字 -->
                    <v-text-field
                      v-model="lastName"
                      :rules="lastNameRules"
                      label="姓"
                      append-icon="person"
                      solo
                      required
                    ></v-text-field>
                    <!-- 名前 -->
                    <v-text-field
                      v-model="firstName"
                      :rules="firstNameRules"
                      label="名"
                      append-icon="person"
                      solo
                      required
                    ></v-text-field>
                    <!-- パスワード -->
                    <v-text-field
                      v-model="password"
                      :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                      :rules="passwordRules"
                      :type="passwordShow ? 'text' : 'password'"
                      label="パスワード"
                      solo
                      required
                      @click:append="passwordShow = !passwordShow"
                    ></v-text-field>
                  </v-flex>
                  <!-- 登録ボタン -->
                  <v-btn
                    :disabled="!recruiterSignUpValid || loading"
                    class="orange darken-1"
                    @click="recruiterSignUpClicked"
                  >
                    <span
                      class="font-weight-bold body-1"
                      style="color: #ffffff;"
                    >
                      登録する
                    </span>
                  </v-btn>
                </v-layout>
              </v-container>
            </v-form>
          </div>
        </v-flex>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
import { firestore, auth } from '@/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
import FilterExtension from '~/components/FilterExtension'

export default {
  components: {
    FilterExtension
  },
  data: () => ({
    isInitialNotificationQueried: false,
    dialog: false,
    signUpDialog: false,
    signUpForm: false,
    signInDialog: false,
    dropdownMenu: false,
    signInValid: true,
    signUpValid: true,
    recruiterSignUpDialog: false,
    recruiterSignUpValid: true,
    firstName: '',
    lastName: '',
    firstNameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    lastNameRules: [
      v => !!v || '苗字を入力してください',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    email: '',
    emailRules: [
      v => !!v || 'メールアドレスを入力してください',
      v => /.+@.+/.test(v) || '無効なメールアドレスです'
    ],
    birthDate: null,
    birthDateMenu: false,
    passwordShow: false,
    password: '',
    passwordRules: [
      v => !!v || 'パスワードを入力してください',
      v => (v && v.length >= 8) || '最低8文字必要です'
    ],
    position: '',
    positionRules: [
      v => !!v || '入力されていません',
      v => (v && v.length <= 30) || '30文字を超えています'
    ],
    companyName: '',
    companyEmail: '',
    companyInvoiceEmail: '',
  }),
  computed: {
    avatarSize() {
      if (this.breakpoint == 'xs' || this.breakpoint == 'sm') {
        return 30
      } else {
        return 40
      }
    },
    userType() {
      return this.query.type != null ? 'recruiter' : 'user'
    },
    query() {
      return this.$route.query
    },
    path() {
      return this.$route.path
    },
    routeName() {
      return this.$route.name
    },
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      uid: state => state.uid,
      isRecruiterSignedIn: state => state.isRecruiterSignedIn,
      isVerified: state => state.isVerified,
      userEmail: state => state.profile.email,
      isAdmin: state => state.profile.isAdmin,
      type: state => state.profile.type,
      authError: state => state.authError,
      loading: state => state.loading,
      imageUrl: state => state.profile.imageUrl,
      jobsToolbarExtension: state => state.jobs.toolbarExtension,
      usersToolbarExtension: state => state.users.toolbarExtension,
      notifications: state => state.notifications.latestNotifications,
      isNotificationsLoading: state => state.notifications.isLoading,
      canReadAll: state => state.notifications.canReadAll,
      hasNewNotification: state => state.notifications.hasNewNotification,
      hasNewMessage: state => state.chats.hasNewMessage,
      isJobsLoading: state => state.jobs.isLoading,
    })
  },
  mounted() {
    this.recruiterSignUpDialog = this.query.type != null ? true : false
    this.updateIsRefreshed(true)
    // ログイン時、dbにuser(recruiter)情報保存
    auth.onAuthStateChanged((user) => {
      this.setAuthInfo({
        url: window.location.origin,
        route: this.$route,
        router: this.$router,
        user: user,
        type: this.userType,
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        companyId: this.query.id,
        position: this.position,
      })
    })
  },
  destroyed () {
    // listenerがあればデタッチ
    this.resetNotificationsListener()
  },
  watch: {
    isRecruiterSignedIn(isSignedIn) {
      if (isSignedIn == true) {
        this.recruiterSignUpDialog = false
      }
    },
    uid(uid) {
      if (uid == null) {
        this.resetData()
      }
    },
  },
  methods: {
    iconClicked() {
      if (this.$vuetify.breakpoint.name == 'xs') {
        this.dropdownMenu = !this.dropdownMenu
      }
    },
    signUpButtonClicked() {
      this.dialog = true
      this.signUpDialog = true
      this.signInDialog = false
      this.$store.dispatch('resetAuthError')
    },
    signUp() {
      this.$store.dispatch('setLoading')
      this.$store.dispatch('resetAuthError')
      this.$store.dispatch('signUp', {email: this.email, password: this.password})
      this.dropdownMenu = false
    },
    recruiterSignUpClicked() {
      this.setLoading()
      this.resetAuthError()
      this.recruiterSignUp({
        recruiterType: this.query.type,
        companyId: this.query.id,
        email: this.email,
        password: this.password
      })
    },
    signInButtonClicked() {
      this.dialog = true
      this.signInDialog = true
      this.signUpDialog = false
      this.$store.dispatch('resetAuthError')
    },
    signIn() {
      this.$store.dispatch('setLoading')
      this.$store.dispatch('resetAuthError')
      this.$store.dispatch('signIn', {email: this.email, password: this.password})
      this.dropdownMenu = false
    },
    signOut() {
      this.$store.dispatch('signOut')
    },
    notificationsButtonClicked() {
      if (!this.isInitialNotificationQueried){
        this.isInitialNotificationQueried = true
        this.resetNotificationsState()
        this.updateIsNotificationsLoading(true)
        this.queryLatestNotifications(this.uid)
      }
    },
    resetData() {
      this.dialog = false
      this.signUpDialog = false
      this.signUpForm = false
      this.signInDialog = false
      this.dropdownMenu = false
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.password = ''
    },
    ...mapActions({
      recruiterSignUp: 'recruiterSignUp',
      setLoading: 'setLoading',
      resetAuthError: 'resetAuthError',
      resetMessagesListener: 'chats/resetMessagesListener',
      resetHasNewMessage: 'chats/resetHasNewMessage',
      resetNotificationsListener: 'notifications/resetNotificationsListener',
      resetHasNewNotification: 'notifications/resetHasNewNotification',
      updateIsUnread: 'notifications/updateIsUnread',
      updateAllIsUnread: 'notifications/updateAllIsUnread',
      queryLatestNotifications: 'notifications/queryLatestNotifications',
      updateIsNotificationsLoading: 'notifications/updateIsLatestNotificationsLoading',
      resetNotificationsState: 'notifications/resetLatestNotificationsState',
      setAuthInfo: 'setAuthInfo',
      updateIsRefreshed: 'updateIsRefreshed',
      resetCareerState: 'career/resetState',
      resetChatState: 'chat/resetState',
      resetChatsState: 'chats/resetState',
      resetFeedbackState: 'feedback/resetState',
      resetFeedbacksState: 'feedbacks/resetState',
      resetState: 'resetState',
      resetMessagesState: 'messages/resetState',
      resetProfileState: 'profile/resetState',
      resetReviewState: 'review/resetState',
      resetReviewsState: 'reviews/resetState',
      resetPassState: 'pass/resetState',
      resetPassesState: 'passes/resetState',
      resetCompanyProfileState: 'companyProfile/resetState',
    }),
  }
}
</script>
