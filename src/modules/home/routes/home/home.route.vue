<template>
  <div class="columns">
    <div class="column is-8-desktop is-offset-2-desktop">
      <div class="content">
        <h3>What's included</h3>
        <p>The <code>npm</code> dependencies included in <code>package.json</code> are:</p>
        <ul>
          <li>
            <code><router-link to="/about">About</router-link></code>
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
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <small> <em>&mdash;John Johnson</em> </small>
          </footer>
        </blockquote>
      </div>
      <table class="table is-bordered is-fullwidth">
        <thead>
          <tr>
            <th>Type</th>
            <th>CSS class</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Columns</th>
            <td>
              <code><a href="http://bulma.io/documentation/columns/basics">columns</a></code>
              <code><a href="http://bulma.io/documentation/columns/basics">column</a></code>
            </td>
          </tr>
          <tr>
            <th>Layout</th>
            <td>
              <code><a href="http://bulma.io/documentation/layout/section">section</a></code>
              <code><a href="http://bulma.io/documentation/layout/container">container</a></code>
              <code><a href="http://bulma.io/documentation/layout/footer">footer</a></code>
            </td>
          </tr>
          <tr>
            <th>Elements</th>
            <td>
              <code><a href="http://bulma.io/documentation/elements/button">button</a></code>
              <code><a href="http://bulma.io/documentation/elements/content">content</a></code>
              <code><a href="http://bulma.io/documentation/elements/title">title</a></code>
              <code><a href="http://bulma.io/documentation/elements/title">subtitle</a></code>
            </td>
          </tr>
          <tr>
            <th>Form</th>
            <td>
              <code><a href="http://bulma.io/documentation/form/general">field</a></code>
              <code><a href="http://bulma.io/documentation/form/general">control</a></code>
            </td>
          </tr>
          <tr>
            <th>Helpers</th>
            <td>
              <code><a href="http://bulma.io/documentation/modifiers/typography-helpers/">has-text-centered</a></code>
              <code
                ><a href="http://bulma.io/documentation/modifiers/typography-helpers/"
                  >has-text-weight-semibold</a
                ></code
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div class="content">
        <p>If you want to <strong>learn more</strong>, follow these links:</p>
      </div>
      <div class="field is-grouped">
        <p class="control">
          <a class="button is-medium is-primary" href="http://bulma.io">
            <strong class="has-text-weight-semibold">Bulma homepage</strong>
          </a>
        </p>
        <p class="control">
          <a class="button is-medium is-link" href="http://bulma.io/documentation/overview/start/">
            <strong class="has-text-weight-semibold">Documentation</strong>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeRoute'
});
</script>
