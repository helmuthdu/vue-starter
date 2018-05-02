<template>
    <div class="container">
        <div class="ui menu green inverted bottom attached">
            <div class="header item">
                Demo
            </div>
            <div class="link item active">
                <router-link to="/">Home</router-link>
            </div>
            <div class="link item">
                <router-link to="/about">About</router-link>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
    @import '~semantic-ui-css/semantic.min.css';
</style>
