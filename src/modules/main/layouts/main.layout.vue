<template>
  <div>
    <section class="hero is-medium is-primary">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column is-8-desktop is-offset-2-desktop">
              <h1 class="title is-2 is-spaced">Hello Bulma!</h1>
              <h2 class="subtitle is-4">
                Congratulations! You're running the <strong>Bulma start</strong> project.
                <br />
                It includes everything you need to <strong>build your own website</strong> with Bulma.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <router-view />
      </div>
    </section>
    <footer class="footer has-text-centered">
      <div class="container">
        <div class="columns">
          <div class="column is-8-desktop is-offset-2-desktop">
            <p>
              <strong class="has-text-weight-semibold">
                <a href="https://www.npmjs.com/package/bulma-start">bulma-start@0.0.3</a>
              </strong>
            </p>
            <p>
              <small> Source code licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a> </small>
            </p>
            <p style="margin-top: 1rem">
              <a href="http://bulma.io">
                <img src="made-with-bulma.png" alt="Made with Bulma" width="128" height="24" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'MainLayout'
  });
</script>

<style lang="scss"></style>
