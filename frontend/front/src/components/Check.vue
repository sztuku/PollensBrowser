<template>
    <div v-if="error" class="alert alert-danger" role="alert">
        <h3>Invalid data passed</h3>
    </div>
    <div class="row" style="height: 100px;">
        <div class="col align-self-center">
            <form @submit.prevent="check">
                <div class="form-group row">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Enter your City Name" aria-describedby="button-addon2" name="cityName">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Check Pollens</button>
                        </div>
                        <a type="button" class="btn btn-warning"  @click="logOut">LOGOUT</a>
                        <button type="button" class="btn btn-info" @click="goToPicker">pick pollens</button>
                    </div>
                </div>
            </form>

        </div>
    </div>


    <h1 v-if='cityName'>
        Pollens for: {{cityName}}
    </h1>

    <ul v-if="trees.length>0" style="list-style-type: none;">
        <h2>Tree Pollens level:</h2>
        <li  v-for="value in trees">
            {{ value[0] }}:  {{ value[1] }}
        </li>
    </ul>

    <ul v-if="weeds.length>0" style="list-style-type: none;">
        <h2>Weeds Pollens level:</h2>
        <li  v-for="value in weeds">
            {{ value[0] }}:  {{ value[1] }}
        </li>
    </ul>

    <ul v-if="grass.length>0" style="list-style-type: none;">
        <h2>Grass Pollens level:</h2>
        <li  v-for="value in grass">
            {{ value[0] }}:  {{ value[1] }}
        </li>
    </ul>


</template>


<script type="module">

import axios from 'axios';
import {ref,reactive} from 'vue'

export default {
    setup(){
        return {
            error: ref(false),
            status: null,
            userName:'',
            cityName:ref(''),
            trees:ref([]),
            weeds:ref([]),
            grass:ref([])
        }
    },
    methods: {
        async check(submitEvent)
        {

            var requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cityName:submitEvent.target.elements.cityName.value})
            };
            fetch('http://localhost:3000/check', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (data.cityName && data.cityName.length>0)
                    {
                        // console.log(data.cityName)
                        // console.log(data.trees)
                        this.cityName=data.cityName
                        this.trees=data.trees
                        this.weeds=data.weeds
                        this.grass=data.grass
                        this.error=false
                    }else
                    {
                        this.error=true
                    }



                })
                .catch(error => {
                    this.errorMessage = error;
                    this.error=true
                    console.error('There was an error!', error);
                });
        },
        goToPicker()
        {
            this.$emit("confirm", 'picker');
        },
        logOut()
        {
            this.$emit("confirm", 'login');
            this.$emit("userName", '');

        },
    },
};
</script>
