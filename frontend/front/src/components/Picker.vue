<template>
    <div class="row">
        <div class="col align-self-center">
            <a type="button" class="btn btn-warning" @click="goToCheck">BACK</a>
        </div>
        <div class="col-6 mx-auto mt-5">
            <form @submit.prevent='updatePollen'>
                <h2>TREES:</h2>
                <div v-for="treeItem in trees" :key="treeItem">
                    <input   type="checkbox" :id="treeItem" :value="treeItem"  v-model="clientTree">
                    <label class="form-check-label" :for="treeItem">{{ treeItem }}</label>
                </div>

                <h2>GRASS:</h2>
                <div v-for="grassItem in grass" :key="grassItem">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :id="grassItem"
                            name="pollen"
                            :value="grassItem"
                            v-model="clientGrass"
                        />
                        <label class="form-check-label" :for="grassItem">{{ grassItem }}</label>
                </div>

                <h2>WEEDS:</h2>
                <div v-for="weedItem in weeds" :key="weedItem">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :id="weedItem"
                            name="pollen"
                            :value="weedItem"
                            v-model="clientWeed"
                            checked
                        />
                        <label class="form-check-label" :for="weedItem">{{ weedItem }}</label>
                </div>

                <button type="submit" class="btn btn-primary btn-block mb-4">UPDATE POLLENS</button>
            </form>
        </div>
    </div>


</template>


<script type="module">

import axios from 'axios';
import {ref,reactive} from 'vue'
export default {
    props: ['name'],
    setup(){
        return {
            error: ref(false),
            status: null,
            selected:ref(true),
            userName:'',
            cityName:ref(''),
            trees:ref([]),
            weeds:ref([]),
            grass:ref([]),
            clientGrass: ref([]),
            clientTree: ref([]),
            clientWeed:ref([]),
            selectedPollens: []
        }
    },
    methods: {
        goToCheck()
        {
            this.$emit("confirm", 'check');
        },
        updatePollen() {
            console.log("selected elements:")
            var listOfPollens=JSON.parse(JSON.stringify(this.clientTree)).concat(JSON.parse(JSON.stringify(this.clientGrass)));
            listOfPollens=listOfPollens.concat(JSON.parse(JSON.stringify(this.clientWeed)));
            console.log(listOfPollens)

            var requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name:this.name, pollen:listOfPollens})
            };

            fetch('http://localhost:3000/picker', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log(data.status)
                    if (data.status === 'ok')
                    {
                        this.$emit("confirm", 'check');
                        this.$emit("userName",this.name);
                    }else
                    {
                        this.$emit("confirm", 'picker');
                    }
                })
                .catch(error => {
                    this.errorMessage = error;
                    console.error('There was an error!', error);
                });

        },
    },
    async beforeMount() {
        console.log("pobieranie..."+this.name)
        const {data} = await axios.get("http://localhost:3000/picker?name="+this.name);
        console.log("koniec...")


        if (data.clientGrass ) {
            this.trees=data.tree
            this.weeds=data.weed
            this.grass=data.grass
            this.clientGrass=data.clientGrass
            this.clientTree=data.clientTree
            this.clientWeed=data.clientWeed


        } else {
            this.error = true
            console.log("i donno")
        }


    },

};
</script>
