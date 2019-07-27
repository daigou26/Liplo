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
    <v-flex v-else xs10 offset-xs1>
      <div
        class="pt-5 pb-3 title font-weight-bold text-color"
        :class="{'px-5': $vuetify.breakpoint.smAndUp}"
      >
        サービスの使い方
      </div>
      <div :class="{'mx-5 pb-4': $vuetify.breakpoint.smAndUp}">
        <v-timeline
          align-top
          dense
          class="my-3 mx-3"
        >
          <v-timeline-item
            color="blue"
            small
          >
            <v-layout pt-3>
              <v-flex>
                <strong class="text-color">1. プロフィール</strong>
                <div class="pt-2 light-text-color">
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
                <div class="pt-2 light-text-color">
                  気になる企業に応募して、インターンに行きましょう！
                  インターンに採用されると、ユーザーのスコアが上がります。
                  スコアが上がるとスカウトされやすくなります。
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
                <div class="pt-2 light-text-color">
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
                <div class="pt-2 light-text-color">
                  インターン後、企業が採用したいと思った学生にパスを送ります。
                  パスには、入社パス、内定パス、先着パスの３種類があり、
                  有効期間内であればいつでも入社できる権利や内定を取得出来る権利などが与えられます。
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
                <div class="pt-2 light-text-color">
                  パスを使用したら、企業の採用担当者から連絡が来ます。
                  （来ない場合は、メッセージにて連絡を取ってください）
                  <div>
                    労働条件や入社日などを確認し、内定契約などを結んでください。
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-timeline-item>
        </v-timeline>
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
      title: 'サービスの使い方',
      meta: [
        { hid: 'description', name: 'description', content: 'サービスの使い方' },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: 'サービスの使い方' + ' - Liplo' },
        { hid: 'og:description', property: 'og:description', content: 'サービスの使い方' },
        { hid: 'og:url', property: 'og:url', content: baseUrl + this.$route.path },
        { hid: 'twitter:title', name: 'twitter:title', content: 'サービスの使い方' + ' - Liplo' },
        { hid: 'twitter:description', name: 'twitter:description', content: 'サービスの使い方' },
      ],
    }
  },
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
      type: state => state.profile.type,
    })
  },
}
</script>
