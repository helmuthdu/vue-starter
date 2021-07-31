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
                {{ $t('COMMON.ABOUT') }}
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
          &#8220;The fibonacci of 43 is: {{ value }}&#8221;
          <footer>
            <small> <em>&mdash;A web worker result</em> </small>
          </footer>
        </blockquote>
      </div>
      <div class="field">
        <label class="label">Search</label>
        <div class="control">
          <input class="input" type="text" placeholder="search" @input="onInput($event.target.value)" />
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
  import { defineComponent } from 'vue';

  type Feature = { type: string; css: { name: string; url: string }[] };

  export default defineComponent({
    name: 'HomeRoute',
    setup() {
      const features = [
        {
          type: 'Columns',
          css: [
            { name: 'columns', url: 'https://bulma.io/documentation/columns/basics' },
            { name: 'column', url: 'https://bulma.io/documentation/columns/basics' }
          ]
        },
        {
          type: 'Layout',
          css: [
            { name: 'section', url: 'https://bulma.io/documentation/layout/section' },
            { name: 'container', url: 'https://bulma.io/documentation/layout/container' },
            { name: 'footer', url: 'https://bulma.io/documentation/layout/footer' }
          ]
        },
        {
          type: 'Elements',
          css: [
            { name: 'button', url: 'https://bulma.io/documentation/elements/button' },
            { name: 'content', url: 'https://bulma.io/documentation/elements/content' },
            { name: 'title', url: 'https://bulma.io/documentation/elements/title' },
            { name: 'subtitle', url: 'https://bulma.io/documentation/elements/title' }
          ]
        },
        {
          type: 'Form',
          css: [
            { name: 'field', url: 'https://bulma.io/documentation/form/general' },
            { name: 'control', url: 'https://bulma.io/documentation/form/general' }
          ]
        },
        {
          type: 'Helpers',
          css: [
            { name: 'has-text-centered', url: 'https://bulma.io/documentation/modifiers/typography-helpers/' },
            { name: 'has-text-weight-semibold', url: 'https://bulma.io/documentation/modifiers/typography-helpers/' }
          ]
        }
      ];

      const [search$, setSearch$] = useSubject<string>();
      const featuresResult = useObservable<Feature[]>(
        search$.pipe(
          debounceTime(300),
          filter(query => !query || query.length >= 3 || query.length === 0),
          distinctUntilChanged(),
          map(query => query.toLowerCase()),
          tap(query => {
            searchStorage.value.query = query;
          }),
          map(query =>
            features.filter((feat: Feature) => {
              if (!query) return true;
              return (
                feat.type.toLowerCase().includes(query) || feat.css.some(css => css.name.toLowerCase().includes(query))
              );
            })
          ),
          tap(val => {
            searchStorage.value.total = val.length;
          })
        ),
        features
      );

      const searchStorage = useStorage('search', { total: 0, query: '' });

      const resolve = (val: number): number => {
        const fib = (i: number): number => (i <= 1 ? i : fib(i - 1) + fib(i - 2));
        return fib(val);
      };
      const [value, calc] = useWorker('W1', resolve);
      calc(43);

      return { features: featuresResult, onInput: setSearch$, value };
    }
  });
</script>
