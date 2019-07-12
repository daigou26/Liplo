<template>
  <v-layout
    white
    row
    wrap
  >
    <!-- loading -->
    <v-flex v-if="isRefreshing == null || isRefreshing" xs12 py-5>
      <v-layout justify-center>
        Now Loading...
      </v-layout>
    </v-flex>
    <v-flex
      v-else
      sm8
      xs12
      offset-sm2
      :class="{'pa-3': $vuetify.breakpoint.xsOnly}"
    >
      <div class="display-1 font-weight-bold text-color py-4 hidden-xs-only">
        プライバシーポリシー
      </div>
      <div class="text-color">
        当社は、当社が提供する全てのサービス（以下「本サービス」といいます）において、
        お客様の情報を以下の通り取り扱います。お客様が本サービスをご利用になるためには、
        プライバシーポリシーを熟読していただき、すべての内容に同意していただく必要があります。
        プライバシーポリシーに同意しないお客様は、本サービスの利用を中止してください。
        <div class="subheading font-weight-bold text-color pt-5">
          1. 取得する情報
        </div>
        <div class="text-color pt-3">
          当社は、お客様が本サービスを利用する際に、以下の情報を取得および利用することがあります。
          <ol>
            <li class="pt-3 pl-2">
              プロフィール情報： お客様が本サービスのアカウントを作成しご利用いただく際に、
              当社は、氏名、年齢、性別、住所、電話番号、プロフィール写真、勤務先、肩書、
              職歴、学歴、資格、メールアドレス等のプロフィール情報を取得いたします。
            </li>
            <li class="pt-1 pl-2">
              第三者サービス登録情報： お客様が本サービスのアカウントを第三者サービス
              （Facebook、Twitter、Google+、LinkedIn、GitHub、はてなブックマーク等）
              のアカウントと連携および接続する場合、当社は、連携した第三者サービスのID、
              プロフィール情報等を取得いたします。
            </li>
            <li class="pt-1 pl-2">
              連絡先情報： お客様が連絡先情報追加機能をご利用の場合、当社は、
              お客様の端末の連絡先情報（氏名、電話番号、メールアドレス、写真等）を取得いたします。
            </li>
            <li class="pt-1 pl-2">
              利用状況に関する情報： 当社は、お客様の本サービスのご利用に際して、
              お客様の端末から自動的に送信される利用環境や利用状況に関する情報
              （端末識別子、広告ID、IPアドレス、OSの種類、ブラウザの種類、ブラウザの言語、
              ランディングページ、ページ閲覧数、クリック数、閲覧順序、閲覧時間、検索ワード等）
              を取得する場合がございます。
            </li>
            <li class="pt-1 pl-2">
              問い合わせ情報： 当社は、お問い合わせフォーム等でのお客様とのやりとり等を通じて、
              お客様に関する情報（本人確認情報等）を取得する場合がございます。
            </li>
          </ol>
        </div>
        <div class="subheading font-weight-bold text-color pt-5">
          2. 利用目的
        </div>
        <div class="text-color pt-3">
          当社は、取得したお客様の情報を、以下の目的で利用いたします。
          <ol>
            <li class="pt-3 pl-2">
              本サービスを円滑に提供するため
            </li>
            <li class="pt-1 pl-2">
              本サービスの利用状況等を調査および分析し、本サービスの改善、
              開発またはお客様ごとの最適化を行うため
            </li>
            <li class="pt-1 pl-2">
              本サービスに関してお客様と連絡を取るため
            </li>
            <li class="pt-1 pl-2">
              お客様からのお問い合わせに対応するため
            </li>
            <li class="pt-1 pl-2">
              本サービスの安全性を確保するため
            </li>
            <li class="pt-1 pl-2">
              不正アクセス行為、スパム行為等の不正利用を防止するため
            </li>
            <li class="pt-1 pl-2">
              当社または第三者の商品・サービスに関する広告
              （パーソナライズされたものを含む）を提供するため
            </li>
            <li class="pt-1 pl-2">
              本サービス利用に関する統計データを作成するため
            </li>
          </ol>
        </div>
        <div class="subheading font-weight-bold text-color pt-5">
          3. 取得した情報の第三者への開示
        </div>
        <div class="text-color pt-3">
          当社は、以下に定める場合および法令により許容される場合を除き、
          取得した情報をお客様の同意なく第三者に開示することはありません。
          当社は、最適な広告配信を目的として、お客様に関する個人を識別できない情報
          （端末識別子、広告ID等）やそれを元に作成した統計情報を、
          当社のビジネスパートナーに提供することがあります。
          <ol>
            <li class="pt-3 pl-2">
              求職者が募集ページの「応募」ボタンを押した場合、
              当社は、当該募集主に対し、ボタンを押したユーザーのアカウント情報を開示します。
            </li>
            <li class="pt-1 pl-2">
              掲載企業の採用担当者がお客様のプロフィールページやユーザー検索ページを閲覧した場合、
              当社は、掲載企業の採用担当者に対し、
              お客様のプロフィールページの閲覧情報を開示することがあります。
            </li>
            <li class="pt-1 pl-2">
              お客様が、応募やスカウトを通して、掲載企業の候補者になっている場合、
              当社は、掲載企業の採用担当者に対し、
              お客様のプロフィールページの閲覧情報を開示することがあります。
            </li>
          </ol>
        </div>
        <div class="subheading font-weight-bold text-color pt-5">
          4. Cookie等の使用について
        </div>
        <div class="text-color pt-3">
          当社は、クッキー及びIPアドレス等から嗜好情報・履歴情報及びその他のお客様のプライバシーに係る情報を、
          個人が特定されない形で収集する場合があります。
          <div class="pt-3">
            お客様は、ブラウザの設定でクッキー等を無効にすることにより、
            当社のクッキー等の使用を拒否することができます。
          </div>
        </div>
        <div class="subheading font-weight-bold text-color pt-5">
          5. Google Analyticsについて
        </div>
        <div class="text-color pt-3">
          本サービスでは、アクセス解析ツールとして、Google Analytics を使用しています。
          Google Analytics における情報収集、解析の仕組みについては、
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank">こちら</a>
          をご確認ください。
        </div>
        <div class="subheading font-weight-bold text-color pt-5">
          6. 確認・訂正等
        </div>
        <div class="text-color pt-3">
          お客様は、当社が法令上義務を負わない場合を除き、
          当社に提供した個人情報の開示請求をすることができます。
          <div class="pt-3">
            当社が保有する個人情報の内容が事実と異なる場合、お客様は、
            当社が法令上義務を負わない場合を除き、個人情報の訂正、追加、
            利用停止または削除を請求することができます。
          </div>
        </div>
        <div class="subheading font-weight-bold text-color pt-5">
          7. 改定
        </div>
        <div class="text-color pt-3">
        当社は、必要に応じて、利用者の同意なく、
        プライバシーポリシーを改定することができるものとします。
        お客様は、本サービスをご利用される場合には、必ず最新のプライバシーポリシーをご確認ください。
        お客様が、本サービスをご利用された場合は、最新のプライバシーポリシーに同意されたものとします。
        </div>
        <div class="subheading font-weight-bold text-color pt-5">
          8. 情報の取扱に関するお問い合わせ
        </div>
        <div class="text-color pt-3">
          本サービスでの情報の取り扱いに関するご質問・ご相談などがある場合、
          本サービスのお問い合わせよりご連絡ください。
        </div>
      </div>
      <div class="text-color pt-5">
        最終改定日：2019年6月29日
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  head () {
    return {
      title: 'プライバシーポリシー',
      meta: [
        { hid: 'description', name: 'description', content: null },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: 'プライバシーポリシー' + ' - Liplo' },
        { hid: 'og:description', property: 'og:description', content: null },
        { hid: 'og:url', property: 'og:url', content: 'https://liplo.jp' + this.$route.path },
      ],
    }
  },
  computed: {
    ...mapState({
      isRefreshing: state => state.isRefreshing,
    })
  },
}
</script>
