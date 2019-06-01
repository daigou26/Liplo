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
      <v-card :flat="$vuetify.breakpoint.xsOnly">
        <v-toolbar flat color="white" class="hidden-xs-only">
          <span class="font-weight-bold subheading">サービスの使い方</span>
          <v-spacer></v-spacer>
        </v-toolbar>
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
                  <div class="pt-2 caption light-text-color">
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
                  <div class="pt-2 caption light-text-color">
                    気になる企業に応募して、インターンに行きましょう！
                    インターンに採用されると、ユーザーのスコアが上がります。
                    スコアが上がるとスカウトされやすくなります。
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
                  <div class="pt-2 caption light-text-color">
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
                  <div class="pt-2 caption light-text-color">
                    インターン後、企業が採用したいと思った学生にパスを送ります。
                    パスには、入社パス、内定パス、先着パスの３種類があり、有効期間内であればいつでも入社できる権利や
                    内定を受けられる権利などが与えられます。そのため、いくつか気になる企業がある場合でも、
                    実際にインターンとして働いてから比較することができます。入社する企業を決めたら、パスを使用しましょう！
                    <span v-if="uid && uid != ''">
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
                  <strong class="text-color">5. 契約</strong>
                  <div class="pt-2 caption light-text-color">
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
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint.name
    },
    ...mapState({
      isRefreshing: state => state.isRefreshing,
      uid: state => state.uid,
    })
  },
}
</script>
