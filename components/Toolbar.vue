<template>
  <!-- メールアドレスの確認が済んでいない場合は確認してもらう -->
  <v-toolbar v-if="uid && uid != '' && !isVerified && type == 'user'" flat fixed app color="white" id="toolbar">
    <v-toolbar-title v-if="(!path.includes('/recruiter') && !path.includes('/users'))">
      <span style="color: #FF5A5F">Liplo</span>
    </v-toolbar-title>
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
          <span class="text-color font-weight-bold subheading">メールアドレスの確認をお願いします</span>
        </v-toolbar>
        <div class="pa-4">
          {{ userEmail }}にメールアドレスの確認メールを送信しました。
          <div>
            メールに記載してあるURLにアクセスすることで、ログインが完了します。
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
  <v-toolbar v-else-if="uid && uid != '' && type == 'recruiter'" flat fixed app color="white" id="toolbar">
    <v-toolbar-side-icon
      v-if="
        this.routeName == 'users-id' ||
        this.routeName == 'recruiter-jobs-new' ||
        this.routeName == 'recruiter-jobs-id-edit' ||
        this.routeName == 'recruiter-candidates-id' ||
        this.routeName == 'recruiter-passes-id' ||
        this.routeName == 'recruiter-messages-id' ||
        this.routeName == 'recruiter-reviews-id' ||
        (this.path != '/recruiter/feedbacks' &&
        this.path.includes('/recruiter/feedbacks')) ||
        (this.path != '/recruiter/help' &&
        this.path.includes('/recruiter/help'))
      "
      @click="iconClicked"
      class="toolbar-side-icon hidden-sm-and-up"
    >
      <v-icon style="font-size: 20px">
        arrow_back
      </v-icon>
    </v-toolbar-side-icon>
    <!-- filter extension -->
    <v-flex
      xs12
      slot="extension"
      v-if="
        (usersToolbarExtension || jobsToolbarExtension) &&
        !isJobsLoading &&
        (path == '/' || path == '/users')
      "
    >
      <filter-extension></filter-extension>
    </v-flex>
    <v-toolbar-title class="font-weight-bold">
      <no-ssr>
        <nuxt-link
          v-if="!path.includes('/recruiter')　&& !path.includes('/users')"
          to=""
          @click.native="homeButtonClicked"
          class="toolbar-title hidden-xs-only"
        >
          <v-card-actions>
            <img class="mr-2" src="/icon.png" width="34" height="34"/>
            <span style="color: #FF5A5F">Liplo</span>
          </v-card-actions>
        </nuxt-link>
        <div class="hidden-sm-and-up">
          <span v-if="breakpoint == 'xs' && path == '/'"　class="toolbar-title" style="color: #FF5A5F">Liplo</span>
          <span v-else-if="breakpoint == 'xs' && path == '/recruiter/dashboard'"　class="toolbar-title-small">ダッシュボード</span>
          <span v-else-if="breakpoint == 'xs' && path == '/recruiter/company'"　class="toolbar-title-small">企業情報</span>
          <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/jobs')"　class="toolbar-title-small">募集管理</span>
          <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/candidates')"　class="toolbar-title-small">候補者管理</span>
          <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/messages')"　class="toolbar-title-small">メッセージ</span>
          <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/feedbacks')"　class="toolbar-title-small">フィードバック</span>
          <span v-else-if="breakpoint == 'xs' && path.includes('/recruiter/reviews')"　class="toolbar-title-small">レビュー</span>
          <span v-else-if="breakpoint == 'xs' && path == '/recruiter/company_settings'" class="toolbar-title-small">設定</span>
          <span v-else-if="breakpoint == 'xs' && path == '/user/settings/account'" class="toolbar-title-small">アカウント設定</span>
          <span v-else-if="breakpoint == 'xs' && path == '/user/settings/notifications'" class="toolbar-title-small">通知設定</span>
          <span v-else-if="breakpoint == 'xs' && path == '/users'" class="toolbar-title-small">ユーザー検索</span>
          <span v-else-if="breakpoint == 'xs' && path == '/recruiter/profile'" class="toolbar-title-small">プロフィール</span>
          <span v-else-if="breakpoint == 'xs' && path == '/recruiter/notifications'" class="toolbar-title-small">通知</span>
          <span v-else-if="breakpoint == 'xs' && path == '/recruiter/help'" class="toolbar-title-small">ヘルプ</span>
        </div>
      </no-ssr>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat active-class @click.native="searchUsersButtonClicked" class="hidden-xs-only">
        <span class="font-weight-bold text-color">ユーザー検索</span>
      </v-btn>
      <v-btn flat active-class to="/recruiter/dashboard" class="ml-3 hidden-xs-only">
        <span class="font-weight-bold text-color">ダッシュボード</span>
      </v-btn>
      <!-- notifications -->
      <v-btn flat class="text-color hidden-xs-only" @click="notificationsButtonClicked">
        <span v-if="!hasNewNotification && !hasNewMessage" class="font-weight-bold text-color">通知</span>
        <v-badge v-else overlap color="red">
          <template v-slot:badge>
            <span></span>
          </template>
          <span class="font-weight-bold text-color">通知</span>
        </v-badge>
      </v-btn>
      <v-menu
        v-model="notificationsMenu"
        :position-x="9000"
        :position-y="70"
        min-width="400"
        max-width="400"
        class="hidden-xs-only"
      >
        <v-card>
          <v-toolbar flat height="48">
            <span class="text-color font-weight-bold subheading">通知</span>
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
              color="teal"
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
                <div class="text-color text-xs-right caption pr-2 pt-2">
                  {{ notification.isUnread ? '未読' : '既読' }}
                </div>
                <div class="text-color return px-3 py-2">{{ notification.content }}</div>
                <div class="text-color text-xs-right caption pr-2 pb-2">
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
      <!-- help -->
      <v-btn　v-if="uid && uid != ''" flat active-class to="/recruiter/help" class="hidden-xs-only">
        <span class="font-weight-bold text-color">ヘルプ</span>
      </v-btn>
      <!-- Profile画像 -->
      <v-layout row wrap align-center class="pl-3">
        <v-flex class="text-xs-center">
          <div class="text-xs-left">
            <v-menu offset-y offset-x min-width="250">
              <v-avatar
                slot="activator"
                :size="avatarSize"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                <v-icon v-else>person</v-icon>
              </v-avatar>
              <v-list>
                <v-list-tile @click.native="searchUsersButtonClicked" class="hidden-sm-and-up">
                  <v-list-tile-title class="text-color">ユーザー検索</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile to="/recruiter/profile">
                  <v-list-tile-title class="text-color">プロフィール</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile to="/recruiter/dashboard">
                  <v-list-tile-title class="text-color">ダッシュボード</v-list-tile-title>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile to="/recruiter/notifications" class="hidden-sm-and-up">
                  <v-list-tile-title class="text-color">通知</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile to="/user/settings/notifications" class="hidden-xs-only">
                  <v-list-tile-title class="text-color">設定</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-xs-only"></v-divider>
                <v-list-tile to="/user/settings/account" class="hidden-sm-and-up">
                  <v-list-tile-title class="text-color">アカウント設定</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile to="/user/settings/notifications" class="hidden-sm-and-up">
                  <v-list-tile-title class="text-color">通知設定</v-list-tile-title>
                </v-list-tile>
                <v-divider class="hidden-sm-and-up"></v-divider>
                <v-list-tile @click="signOut">
                  <v-list-tile-title class="text-color">ログアウト</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-flex>
      </v-layout>
    </v-toolbar-items>
  </v-toolbar>
  <!-- user & 未ログイン -->
  <v-toolbar v-else-if="path != '/user/menu' && path != '/user/menu/'" flat color="white" class="toolbar-fixed border-bottom" id="toolbar">
    <v-toolbar-side-icon
      v-if="
        this.routeName != null &&
        this.path != '/' &&
        this.path != '/user/notifications' &&
        this.path != '/user/notifications/' &&
        this.path != '/messages' &&
        this.path != '/messages/' &&
        this.path != '/user/menu' &&
        this.path != '/user/menu/'
      "
      @click="iconClicked"
      class="toolbar-side-icon hidden-sm-and-up"
    >
      <v-icon style="font-size: 20px">
        arrow_back
      </v-icon>
    </v-toolbar-side-icon>
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
                <v-toolbar-title class="font-weight-bold ml-0">
                  <no-ssr>
                    <nuxt-link to="/" @click.native="iconClicked" class="toolbar-title hidden-sm-and-up">
                      <v-card-actions class="px-0">
                        <span style="color: #FF5A5F">Liplo</span>
                        <v-icon v-if="uid == null"  style="font-size: 16px; color: #555555;">expand_less</v-icon>
                      </v-card-actions>
                    </nuxt-link>
                  </no-ssr>
                </v-toolbar-title>
              </v-toolbar>
              <v-list class="py-0">
                <!-- ホーム -->
                <v-list-tile
                  class="px-3"
                  @click="homeButtonClicked; dropdownMenu = false;"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">ホーム</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider class="my-1 mx-4"></v-divider>
                <!-- 登録 -->
                <v-list-tile
                  v-if="!uid"
                  class="px-3"
                  @click="signUpButtonClicked"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">登録する</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- ログイン -->
                <v-list-tile
                  v-if="!uid"
                  class="px-3"
                  @click="signInButtonClicked"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">ログイン</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="!uid" class="my-1 mx-4"></v-divider>
                <!-- サービスの使い方 -->
                <v-list-tile
                  class="px-3"
                  to="/how_to_use"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">サービスの使い方</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- 利用規約 -->
                <v-list-tile
                  class="px-3"
                  to="/terms"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">利用規約</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- プライバシー -->
                <v-list-tile
                  class="px-3"
                  to="/privacy_policy"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">プライバシー</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- 運営会社 -->
                <v-list-tile
                  class="px-3"
                  href="https://hp.liplo.jp"
                  target="_blank"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">運営会社</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- 採用担当者向けお問い合わせ -->
                <v-list-tile
                  class="px-3"
                  to="/inquiry_for_recruiter"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">採用担当者様はこちら</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- お問い合わせ -->
                <v-list-tile
                  class="px-3"
                  to="/contact"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">お問い合わせ</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- フィードバック -->
                <v-list-tile
                  class="px-3"
                  to="/feedback"
                  @click="dropdownMenu=false"
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="text-color">フィードバックを送る</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-dialog>
    </div>
    <!-- filter extension -->
    <v-flex xs12 slot="extension" v-if="jobsToolbarExtension && !isJobsLoading && path == '/'">
      <filter-extension></filter-extension>
    </v-flex>
    <v-toolbar-title class="font-weight-bold ml-0">
      <no-ssr>
        <nuxt-link to='' @click.native="homeButtonClicked" class="toolbar-title hidden-xs-only">
          <v-card-actions>
            <img class="mr-2" src="/icon.png" width="34" height="34"/>
            <span style="color: #FF5A5F">Liplo</span>
          </v-card-actions>
        </nuxt-link>
        <nuxt-link v-if="uid && uid != '' && path == '/'" to='' @click.native="homeButtonClicked" class="toolbar-title hidden-sm-and-up">
          <v-card-actions class="px-0">
            <span style="color: #FF5A5F">Liplo</span>
          </v-card-actions>
        </nuxt-link>
        <!-- 未ログイン -->
        <nuxt-link v-if="uid == null && path == '/'" to="/" @click.native="iconClicked" class="toolbar-title hidden-sm-and-up">
          <v-card-actions class="px-0">
            <span style="color: #FF5A5F">Liplo</span>
            <v-icon v-if="uid == null"  style="font-size: 16px; color: #555555;">expand_more</v-icon>
          </v-card-actions>
        </nuxt-link>
        <div class="hidden-sm-and-up">
          <span v-if="path == '/'"　class="toolbar-title" style="color: #FF5A5F"></span>
          <span v-else-if="routeName == 'jobs-id' || routeName == 'companies-id'"　class="toolbar-title-small"></span>
          <span v-else-if="routeName == 'companies-id-jobs'"　class="toolbar-title-small">募集一覧</span>
          <span v-else-if="routeName == 'user-profile'" class="toolbar-title-small">プロフィール</span>
          <span v-else-if="path.includes('/user/notifications')"　class="toolbar-title-small">通知</span>
          <span v-else-if="path.includes('/messages')"　class="toolbar-title-small">メッセージ</span>
          <span v-else-if="path.includes('/passes')" class="toolbar-title-small">パス</span>
          <span v-else-if="routeName == 'user-career-id-edit'" class="toolbar-title-small">キャリア編集</span>
          <span v-else-if="path.includes('/career')" class="toolbar-title-small">キャリア</span>
          <span v-else-if="path.includes('/feedbacks')" class="toolbar-title-small">フィードバック</span>
          <span v-else-if="path.includes('/reviews')" class="toolbar-title-small">レビュー</span>
          <span v-else-if="routeName == 'user-settings-account'" class="toolbar-title-small">アカウント設定</span>
          <span v-else-if="routeName == 'user-settings-notifications'" class="toolbar-title-small">通知設定</span>
          <span v-else-if="routeName == 'contact'" class="toolbar-title-small">お問い合わせ</span>
          <span v-else-if="routeName == 'inquiry_for_recruiter'" class="toolbar-title-small">資料請求</span>
          <span v-else-if="routeName == 'feedback'" class="toolbar-title-small">フィードバックを送る</span>
          <span v-else-if="routeName == 'how_to_use'" class="toolbar-title-small">サービスの使い方</span>
          <span v-else-if="routeName == 'terms'" class="toolbar-title-small">利用規約</span>
          <span v-else-if="routeName == 'privacy_policy'" class="toolbar-title-small">プライバシーポリシー</span>
          <span v-else class="toolbar-title" style="color: #FF5A5F">Liplo</span>
        </div>
      </no-ssr>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <!-- messages -->
      <v-btn
        v-if="uid && uid != ''"
        flat
        to="/messages"
        active-class
        class="pr-4 hidden-xs-only"
      >
        <span v-if="!hasNewMessage" class="font-weight-bold text-color">メッセージ</span>
        <v-badge v-else overlap color="red">
          <template v-slot:badge>
            <span></span>
          </template>
          <span class="font-weight-bold text-color">メッセージ</span>
        </v-badge>
      </v-btn>
      <!-- notifications -->
      <v-btn v-if="uid && uid != ''" flat class="hidden-xs-only" @click="notificationsButtonClicked">
        <span v-if="!hasNewNotification" class="font-weight-bold text-color">通知</span>
        <v-badge v-else overlap color="red">
          <template v-slot:badge>
            <span></span>
          </template>
          <span class="font-weight-bold text-color">通知</span>
        </v-badge>
      </v-btn>
      <v-menu
        v-if="uid && uid != ''"
        v-model="notificationsMenu"
        :position-x="9000"
        :position-y="70"
        min-width="400"
        max-width="400"
        class="hidden-xs-only"
      >
        <v-card>
          <v-toolbar flat height="48">
            <span class="text-color font-weight-bold subheading">通知</span>
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
                <div class="text-color text-xs-right caption pr-2 pt-2">
                  {{ notification.isUnread ? '未読' : '既読' }}
                </div>
                <div class="text-color return px-3 py-2">{{ notification.content }}</div>
                <div class="text-color text-xs-right caption pr-2 pb-2">
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
      <!-- help -->
      <v-btn v-if="uid && uid != ''" flat class="hidden-xs-only" @click="helpMenu = true">
        <span class="font-weight-bold text-color">ヘルプ</span>
      </v-btn>
      <v-menu
        v-model="helpMenu"
        :close-on-content-click="false"
        :position-x="9000"
        :position-y="0"
        min-width="400"
        max-width="450"
        max-height="95%"
        class="hidden-xs-only scroll-y"
      >
        <v-card class="pb-3">
          <v-toolbar flat color="white" height="60">
            <span class="text-color font-weight-bold subheading">サービスの使い方</span>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat icon @click="helpMenu = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-timeline
            align-top
            dense
            class="mt-3 ml-3 mr-4"
          >
            <v-timeline-item
              color="blue"
              small
            >
              <v-layout pt-3>
                <v-flex>
                  <strong class="text-color">1. プロフィール</strong>
                  <div class="pt-2 caption-2 light-text-color">
                    まず始めにプロフィールを完成させましょう！
                    プロフィール完成度が高いとスカウトされやすくなります。
                    （完成度が50%を超えていないと、検索に表示されず、スカウトされないのでご注意ください）
                  </div>
                </v-flex>
              </v-layout>
            </v-timeline-item>
            <!-- インターン -->
            <v-timeline-item
              color="teal"
              small
            >
              <v-layout pt-3>
                <v-flex>
                  <strong class="text-color">2. インターン</strong>
                  <div class="pt-2 caption-2 light-text-color">
                    気になる企業に応募して、インターンに行きましょう！
                    インターンに採用されると、ユーザーのスコアが上がり、
                    スカウトされやすくなります。
                    <div class="pt-2 font-weight-bold">
                      ※ 募集に記載されていた期間が終わると、基本的にはインターンは終了になりますが、
                      企業の合意が得られれば、インターンを続行することが出来ます。インターンを延長したい場合は、
                      担当者の方と連絡をとってください。
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-timeline-item>
            <!-- レビュー -->
            <v-timeline-item
              color="orange"
              small
            >
              <v-layout pt-3>
                <v-flex>
                  <strong class="text-color">3. レビュー</strong>
                  <div class="pt-2 caption-2 light-text-color">
                    インターンを終えたら、企業のレビューをしてください！
                    レビューをすると、ユーザーのスコアが上がります。
                    また、インターン後、企業からフィードバックが届くことがあります。
                  </div>
                </v-flex>
              </v-layout>
            </v-timeline-item>
            <!-- パス -->
            <v-timeline-item
              color="red"
              small
            >
              <v-layout pt-3>
                <v-flex>
                  <strong class="text-color">4. パス</strong>
                  <div class="pt-2 caption-2 light-text-color">
                    インターン後、企業が採用したいと思った学生にパスを送ります。
                    パスには、入社パス、内定パス、先着パスの３種類があり、
                    有効期間内であればいつでも入社できる権利や内定を受けられる権利などが与えられます。
                    そのため、いくつか気になる企業がある場合でも、
                    実際にインターンとして働いてから比較することができます。
                    入社する企業を決めたら、パスを使用しましょう！
                    <div>
                      労働条件など、入社に際して知りたいことがある場合は、
                      パスを使用する前に、担当者とのメッセージなどでご確認をお願いします。
                    </div>
                    <span v-if="uid && uid != '' && type == 'user'">
                      パスについては
                      <no-ssr>
                        <nuxt-link
                          color="teal"
                          to="/user/passes"
                          @click.native="helpMenu = false"
                        >
                          マイページ
                        </nuxt-link>
                      </no-ssr>
                      から確認できます。
                    </span>
                    <div class="pt-2 font-weight-bold">
                      ※ 本サービス外で提示されたパスは、保証されない可能性があるのでご注意ください。
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-timeline-item>
            <!-- 契約 -->
            <v-timeline-item
              color="pink"
              small
            >
              <v-layout pt-3>
                <v-flex>
                  <strong class="text-color">5. 契約、入社</strong>
                  <div class="pt-2 caption-2 light-text-color">
                    パスを使用したら、企業の採用担当者から連絡が来ます。
                    （来ない場合は、メッセージにて連絡を取ってください）
                    <div>
                      労働条件や入社日などを確認し、雇用契約を結んでください。
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-menu>
      <!-- 未ログイン時に表示 -->
      <v-btn
        v-if="uid == null"
        flat
        @click="signUpButtonClicked"
        :class="{
          'small-button': $vuetify.breakpoint.xsOnly
        }"
      >
        <span class="font-weight-bold" style="color: #555555">登録する</span>
      </v-btn>
      <v-btn
        v-if="uid == null"
        flat
        @click="signInButtonClicked"
        :class="{
          'small-button': $vuetify.breakpoint.xsOnly
        }"
      >
        <span class="font-weight-bold" style="color: #555555">ログイン</span>
      </v-btn>
      <!-- Profile画像 -->
      <v-layout v-if="uid && uid != ''" row wrap align-center ml-3>
        <v-flex class="text-xs-center">
          <!-- ログイン中に表示される -->
          <div class="align-center">
            <div class="text-xs-left">
              <v-menu offset-y offset-x min-width="250">
                <v-avatar
                  class="clickable"
                  slot="activator"
                  :size="avatarSize"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar">
                  <v-icon v-else>person</v-icon>
                </v-avatar>
                <v-list>
                  <v-list-tile v-if="isAdmin" to="/admin/companies">
                    <v-list-tile-title class="text-color">Admin</v-list-tile-title>
                  </v-list-tile>
                  <v-divider v-if="isAdmin"></v-divider>
                  <v-list-tile to="/user/profile" class="hidden-xs-only">
                    <v-list-tile-title class="text-color">プロフィール</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-xs-only"></v-divider>
                  <v-list-tile to="/user/menu" class="hidden-sm-and-up">
                    <v-list-tile-title class="text-color">プロフィール</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-sm-and-up"></v-divider>
                  <v-list-tile to="/user/passes" class="hidden-xs-only">
                    <v-list-tile-title class="text-color">マイページ</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-xs-only"></v-divider>
                  <v-list-tile to="/user/settings/notifications" class="hidden-xs-only">
                    <v-list-tile-title class="text-color">設定</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-xs-only"></v-divider>
                  <v-list-tile to="/user/settings/account" class="hidden-sm-and-up">
                    <v-list-tile-title class="text-color">アカウント設定</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-sm-and-up"></v-divider>
                  <v-list-tile to="/user/settings/notifications" class="hidden-sm-and-up">
                    <v-list-tile-title class="text-color">通知設定</v-list-tile-title>
                  </v-list-tile>
                  <v-divider class="hidden-sm-and-up"></v-divider>
                  <v-list-tile @click="signOut">
                    <v-list-tile-title class="text-color">ログアウト</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-toolbar-items>
    <!-- Auth Dialog -->
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      width="500"
    >
      <v-card :class="{'pt-5 pb-3 px-3': !(signUpDialog && signUpForm)}">
        <v-toolbar flat color="white hidden-sm-and-up">
          <v-btn icon @click="dialog=false">
            <v-icon>close</v-icon>
          </v-btn>
          <span class="font-weight-bold text-color">サインアップ</span>
        </v-toolbar>
        <v-flex
          xs12
          class="text-xs-center"
          :class="{'px-2': $vuetify.breakpoint.smAndUp && !signUpForm, 'px-3 mt-4': $vuetify.breakpoint.xsOnly}"
        >
          <!-- ログインフォーム -->
          <div v-show="signInDialog">
            <v-form v-model="signInValid" @submit.prevent="">
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <v-flex xs12>
                    <!-- Error Message -->
                    <v-alert
                      :value="authError && authError != ''"
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
                    class="teal"
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
            <v-stepper v-model="signUpStepper">
              <v-stepper-header>
                <v-stepper-step color="#FF5A5F" :complete="signUpStepper > 1" step="1">サインアップ情報</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step color="#FF5A5F" :complete="signUpStepper > 2" step="2">ユーザー情報</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-form v-model="signUpValid" @submit.prevent="">
                    <v-container>
                      <v-layout
                        column
                        justify-center
                      >
                        <v-flex xs12>
                          <!-- Error Message -->
                          <v-alert
                            :value="authError && authError != ''"
                            type="error"
                            class="mb-5"
                            outline
                          >
                            {{ authError }}
                          </v-alert>
                          <!-- メールアドレス -->
                          <v-text-field
                            v-model="email"
                            color="teal"
                            :rules="emailRules"
                            label="メールアドレス"
                            append-icon="mail_outline"
                            required
                          ></v-text-field>
                          <!-- パスワード -->
                          <v-text-field
                            v-model="password"
                            color="teal"
                            :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                            :rules="passwordRules"
                            :type="passwordShow ? 'text' : 'password'"
                            label="パスワード"
                            required
                            @click:append="passwordShow = !passwordShow"
                          ></v-text-field>
                          <div class="text-xs-right mt-5">
                            <v-btn flat @click="dialog = false" class="grey--text text--darken-2">キャンセル</v-btn>
                            <v-btn
                              color="teal"
                              flat
                              class="font-weight-bold"
                              :disabled="!signUpValid"
                              @click.native="signUpStepper = 2"
                            >
                              次へ
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-form v-model="signUpValid" @submit.prevent="">
                    <v-container>
                      <v-layout
                        column
                        justify-center
                      >
                        <v-flex xs12>
                          <!-- 苗字 -->
                          <v-text-field
                            v-model="lastName"
                            color="teal"
                            :rules="lastNameRules"
                            label="姓"
                            append-icon="person"
                            required
                          ></v-text-field>
                          <!-- 名前 -->
                          <v-text-field
                            v-model="firstName"
                            color="teal"
                            :rules="firstNameRules"
                            label="名"
                            append-icon="person"
                            required
                          ></v-text-field>
                          <!-- 大学 -->
                          <v-text-field
                            v-model="university"
                            color="teal"
                            :rules="universityRules"
                            label="大学・大学院名"
                            append-icon="school"
                            required
                          ></v-text-field>
                          <!-- 学年 -->
                          <v-select
                            v-model="grade"
                            color="teal"
                            class="pb-4"
                            :items="gradeItems"
                            hide-details
                            label="学年"
                          ></v-select>
                          <!-- 生年月日 -->
                          <v-menu
                            v-model="birthDateMenu"
                            :close-on-content-click="false"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="birthDate"
                                color="teal"
                                label="生年月日"
                                append-icon="event"
                                readonly
                                required
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="birthDate"
                              color="teal"
                              locale="ja"
                              @input="birthDateMenu = false"
                            ></v-date-picker>
                          </v-menu>
                          <!-- 利用規約 -->
                          <div class="caption text-color py-3 text-xs-left">
                            登録前に
                            <a class="hidden-xs-only" href="/terms" target="_blank">利用規約</a>
                            <nuxt-link to="/terms" @click.native="dialog = false" class="hidden-sm-and-up">
                              利用規約
                            </nuxt-link>
                            をご確認ください。
                            <div>
                              登録すると利用規約に同意したことになります。
                            </div>
                          </div>
                          <div class="text-xs-right mt-3">
                            <v-divider class="my-3"></v-divider>
                            <v-btn flat @click.native="signUpStepper = 1" class="grey--text text--darken-2">戻る</v-btn>
                            <!-- 登録ボタン -->
                            <v-btn
                              :disabled="!signUpValid || loading || birthDate == null"
                              color="teal"
                              flat
                              class="font-weight-bold"
                              @click="signUp"
                            >
                              登録する
                            </v-btn>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-form>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </div>
          <!-- 登録方法 -->
          <div v-show="!signInDialog && !signUpForm">
            <!-- メールアドレス登録 -->
            <v-btn
              block
              color="teal"
              :class="{'my-3': $vuetify.breakpoint.smAndUp, 'my-5': $vuetify.breakpoint.xsOnly}"
              style="color: white;"
              @click="signUpForm=true"
            >
              <v-icon>mail_outline</v-icon>
              <span class="font-weight-bold body-1 ml-2">メールアドレスで登録</span>
            </v-btn>
          </div>
        </v-flex>

        <v-divider class="mt-4" v-show="!signUpDialog || !signUpForm"></v-divider>
        <!-- アカウントを持っている場合はログイン画面へ -->
        <v-flex xs12 class="text-xs-center px-2" :class="{'py-3': $vuetify.breakpoint.xsOnly}">
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
          <div v-show="signUpDialog && !signUpForm">
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
            class="pl-3 text-color font-weight-bold"
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
            <v-form v-model="recruiterSignUpValid" @submit.prevent="">
              <v-container>
                <v-layout
                  column
                  justify-center
                >
                  <v-flex xs12>
                    <!-- Error Message -->
                    <v-alert
                      :value="authError && authError != ''"
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
                    class="teal"
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
import { auth } from '@/plugins/firebase'
import { mapActions, mapState, mapGetters } from 'vuex'
import FilterExtension from '~/components/FilterExtension'

export default {
  components: {
    FilterExtension
  },
  data: () => ({
    dialog: false,
    windowHeight: 0,
    signUpDialog: false,
    signUpStepper: 0,
    signUpForm: false,
    signInDialog: false,
    helpMenu: false,
    notificationsMenu: false,
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
    university: '',
    universityRules: [
      v => !!v || '入力されていません',
      v => (v && v.length <= 50) || '50文字を超えています'
    ],
    grade: '大学１年',
    gradeItems: [
      '大学１年',
      '大学２年',
      '大学３年',
      '大学４年',
      '修士１年',
      '修士２年',
      'その他'
    ],
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
      isNotificationsLoading: state => state.notifications.isLatestNotificationsLoading,
      canReadAll: state => state.notifications.canReadAll,
      hasNewNotification: state => state.notifications.hasNewNotification,
      hasNewMessage: state => state.chats.hasNewMessage,
      isJobsLoading: state => state.jobs.isLoading,
    })
  },
  mounted() {
    this.windowHeight = window.innerHeight

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
        university: this.university,
        grade: this.grade,
        companyId: this.query.id,
        position: this.position,
      })
    })
  },
  destroyed () {
    // listenerがあればデタッチ
    this.resetNotificationsListener()
    this.resetMessagesListener()
    this.resetCompaniesListener()
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
    authError(authError) {
      if (authError && authError != '') {
        this.signInValid = true
        this.signUpValid = true
        this.recruiterSignUpValid = true
        this.signUpStepper = 1
      } else if (authError == '') {
        this.dropdownMenu = false
        this.dialog = false
        this.signUpDialog = false
        this.signInDialog = false
        this.recruiterSignUpDialog = false
      }
    }
  },
  methods: {
    iconClicked() {
      if (this.$vuetify.breakpoint.name == 'xs') {
        if (this.path == '/') {
          this.dropdownMenu = !this.dropdownMenu
        } else if (
          this.routeName != null &&
          this.routeName != 'user-notifications' &&
          this.routeName != 'messages' &&
          this.routeName != 'user-menu'
        ) {
          this.$router.back()
        }
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
      this.$store.dispatch('signUp', {email: this.email, password: this.password, grade: this.grade, university: this.university})
      this.signUpValid = false
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
      this.recruiterSignUpValid = false
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
      this.signInValid = false
    },
    signOut() {
      this.$store.dispatch('signOut')
    },
    notificationsButtonClicked() {
      if (this.notificationsMenu) {
        this.notificationsMenu = false
      } else {
        this.notificationsMenu = true
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
      this.birthDate = null
      this.university = ''
      this.grade = '大学１年'
    },
    homeButtonClicked() {
      if (this.$route.name != 'index') {
        this.resetJobsState()
        this.$router.push('/')
      }
    },
    searchUsersButtonClicked() {
      if (this.$route.name != 'users') {
        this.resetUsersState()
        this.$router.push('/users')
      }
    },
    ...mapActions({
      recruiterSignUp: 'recruiterSignUp',
      setLoading: 'setLoading',
      resetAuthError: 'resetAuthError',
      resetMessagesListener: 'chats/resetMessagesListener',
      resetNotificationsListener: 'notifications/resetNotificationsListener',
      resetCompaniesListener: 'profile/resetCompaniesListener',
      updateIsUnread: 'notifications/updateIsUnread',
      updateAllIsUnread: 'notifications/updateAllIsUnread',
      queryLatestNotifications: 'notifications/queryLatestNotifications',
      updateIsNotificationsLoading: 'notifications/updateIsLatestNotificationsLoading',
      resetNotificationsState: 'notifications/resetLatestNotificationsState',
      setAuthInfo: 'setAuthInfo',
      updateIsRefreshed: 'updateIsRefreshed',
      resetState: 'resetState',
      resetJobsState: 'jobs/resetState',
      resetUsersState: 'users/resetState'
    }),
  }
}
</script>
<style>
.small-button.v-btn {
  font-size: 13px;
  min-width: 0;
  padding: 0 8px;
}
.toolbar-side-icon.v-btn {
  min-width: 0;
  width: 20px;
  font-size: 14px !important;
}
</style>
