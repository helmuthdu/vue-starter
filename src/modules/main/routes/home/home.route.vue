<template>
  <suspense>
    <div class="columns">
      <div class="column is-8-desktop is-offset-2-desktop">
        <div class="content">
          <h3>What's included</h3>
          <p>The <code>npm</code> dependencies included in <code>package.json</code> are:</p>
          <ul>
            <li>
              <code>
                <router-link :to="{ name: 'about' }">
                  {{ t('COMMON.ABOUT') }}
                </router-link>
              </code>
            </li>
            <li>
              <code><a href="https://github.com/jgthms/bulma">bulma</a></code>
            </li>
            <li>
              <code><a href="https://github.com/sass/node-sass">node-sass</a></code> to compile your own Sass file
            </li>
            <li>
              <code><a href="https://github.com/postcss/postcss-cli">postcss-cli</a></code> and
              <code><a href="https://github.com/postcss/autoprefixer">autoprefixer</a></code> to add support for older
              browsers
            </li>
            <li>
              <code><a href="https://babeljs.io/docs/usage/cli/">babel-cli</a></code
              >,
              <code><a href="https://github.com/babel/babel-preset-env">babel-preset-env</a></code>
              and
              <code><a href="https://github.com/jmcriffey/babel-preset-es2015-ie">babel-preset-es2015-ie</a></code>
              for compiling ES6 JavaScript files
            </li>
          </ul>
          <blockquote class="blockquote">
            &#8220;The fibonacci of 43 is: {{ message }}&#8221;
            <footer>
              <small> <em>&mdash;A web worker result</em> </small>
            </footer>
          </blockquote>
        </div>
        <feature-list />
        <div class="content">
          <p>If you want to <strong>learn more</strong>, follow these links:</p>
        </div>
        <div class="field is-grouped">
          <p class="control">
            <a class="button is-medium is-primary" href="https://bulma.io">
              <strong class="has-text-weight-semibold">Bulma homepage</strong>
            </a>
          </p>
          <p class="control">
            <a class="button is-medium is-link" href="https://bulma.io/documentation/overview/start/">
              <strong class="has-text-weight-semibold">Documentation</strong>
            </a>
          </p>
        </div>
      </div>
    </div>
  </suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWorker } from '@/hooks/worker.hook';
import FeatureList from '@/modules/main/components/feature-list/feature-list.vue';

export default defineComponent({
  name: 'HomeRoute',
  components: { FeatureList },
  setup() {
    const { t } = useI18n();

    const resolve = (val: number): number => {
      const fib = (i: number): number => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

      return fib(val);
    };
    const { message, post } = useWorker('W1', resolve);

    post(43);

    return {
      message,
      t,
    };
  },
});
</script>
