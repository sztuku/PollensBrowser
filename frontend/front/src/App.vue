<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Check from './components/Check.vue'
import Picker from './components/Picker.vue'
</script>

<template>

    <Login v-if='route ==="login"' @confirm="(n) =>route=n" @userName="(name)=>userName=name"/>
    <Register v-if='route ==="register"' @confirm="(n) =>route=n" @userName="(name)=>userName=name"/>
    <Check v-if='route ==="check"' @confirm="(n) =>route=n" @userName="(name)=>userName=name"/>
    <Picker :name="userName" v-if='route ==="picker"' @confirm="(n) =>route=n" @userName="(name)=>userName=name" />

</template>

<script type="module">
import {ref} from 'vue'

export default {
    data() {
        return {
            logged: false,
            route: 'login',
            userName:''
        }
    },
    methods: {
        setRoute(msg) {
            this.route = msg;
        },
        setLogin(msg) {
            this.logged = msg;
        }
    }
}
</script>




