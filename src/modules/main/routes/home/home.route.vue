<template>
  <div class="columns">
    <div class="column is-8-desktop is-offset-2-desktop">
      <div class="content">
        <h3>What's included</h3>
        <p>The <code>npm</code> dependencies included in <code>package.json</code> are:</p>
        <ul>
          <li>
            <code>
              <router-link :to="{ name: 'about' }">
                {{ t.about }}
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
      <div class="field">
        <label class="label">Search</label>
        <div class="control">
          <input class="input" placeholder="search" type="text" @input="onInput($event)" />
        </div>
      </div>
      <table class="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th>Type</th>
            <th>CSS class</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="feature in features" :key="feature.type">
            <th>{{ feature.type }}</th>
            <td>
              <code v-for="css in feature.css" :key="css.name">
                <a :href="css.url">{{ css.name }}</a>
              </code>
            </td>
          </tr>
        </tbody>
      </table>
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
</template>

<script lang="ts">
  import { useObservable, useSubject } from '@/hooks/observer.hook';
  import { useStorage } from '@/hooks/storage.hook';
  import { useWorker } from '@/hooks/worker.hook';
  import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
  import { defineComponent, ref } from 'vue';
  import { getTranslations, useI18n } from '@/locales';
  import { featuresApi } from '@/modules/main/api/features.api';

  const translations = getTranslations('home');

  export default defineComponent({
    name: 'HomeRoute',
    setup() {
      const features = ref();

      const { subject: search$, setSubject: setSearch$ } = useSubject<string | null>();

      featuresApi.get().then(res => {
        useObservable(
          search$.pipe(
            debounceTime(300),
            filter(query => !query || query.length >= 3 || query.length === 0),
            distinctUntilChanged(),
            map(query => query?.toLowerCase()),
            tap(query => {
              searchStorage.value.query = query ?? '';
            }),
            map(query =>
              res.filter(feat => {
                if (!query) return true;
                return (
                  feat.type.toLowerCase().includes(query) ||
                  feat.css.some(css => css.name.toLowerCase().includes(query))
                );
              })
            ),
            tap(val => {
              searchStorage.value.total = val.length;
            })
          ),
          res,
          features
        );
      });

      const searchStorage = useStorage('search', { total: 0, query: '' });

      const resolve = (val: number): number => {
        const fib = (i: number): number => (i <= 1 ? i : fib(i - 1) + fib(i - 2));
        return fib(val);
      };
      const { message, post } = useWorker('W1', resolve);
      post(43);

      const t = useI18n(translations);

      return {
        features,
        onInput(evt: any) {
          setSearch$(evt.target.value);
        },
        message,
        t
      };
    }
  });
</script>
