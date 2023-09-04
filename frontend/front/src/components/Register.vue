<template>
    <div class="row">

        <div class="col-6 mx-auto mt-5">
            <div v-if="error" class="alert alert-danger" role="alert">
                <div class="alert alert-danger" role="alert">
                    <h3>Invalid data or name occupied</h3>
                </div>
            </div>
            <form @submit.prevent="login">
                <!-- Email input -->
                <div class="form-outline mb-4">
                    <input  type="text" id="form2Example1" class="form-control" name="name" />
                    <label class="form-label" for="form2Example1">login</label>
                </div>

                <!-- Password input -->
                <div class="form-outline mb-4">
                    <input type="password" id="form2Example2" class="form-control" name="password" />
                    <label class="form-label" for="form2Example2">Password</label>
                </div>

                <!-- Submit button -->
                <button type="submit" class="btn btn-primary btn-block mb-4">Register</button>

                <!-- Register buttons -->
                <div class="text-center">
                    <p>Currently a member? <button @click="goToLogin">Login</button></p>
                </div>

            </form>


        </div>

    </div>
</template>


<script type="module">

import axios from 'axios';
import {ref} from 'vue'

export default {
    setup(){
        return {
            error: ref(false),
            status: null,
            formData: {
                name: ref(''),
                password: ref(''),
            }
        }
    },
    methods: {
        async login(submitEvent) {
            try {
                // Send a POST request to the login endpoint
                this.formData.name = submitEvent.target.elements.name.value
                this.formData.password = submitEvent.target.elements.password.value

                console.error("data sended: "+this.formData.password+' '+this.formData.name);

                var requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        "withCredentials": "true"
                    },
                    withCredentials:true,
                    body: JSON.stringify({ name:this.formData.name,password: this.formData.password })
                };

                fetch('http://localhost:3000/register', requestOptions)
                    .then(async response => {
                        const data = await response.json();

                       if (data.error && data.error===true)
                       {
                           this.error=true
                       }else
                       {
                           this.error=false
                           this.$emit("userName",data.userName);
                           this.$emit("confirm", 'login');

                       }

                    })
                    .catch(error => {
                        this.error=true
                        console.error('There was an error!', error);
                    });
                // const response = await axios.post('http://localhost:3000/login', this.formData)
                // Check the response status and handle success or error accordingly
                // if (response.status === 200) {
                //     // Successful login
                //     this.error = false;
                //     alert('Login successful!');
                //     // Redirect to a different page or perform other actions as needed
                // } else {
                //     // Handle other status codes (e.g., 401 for unauthorized)
                //     this.error = true;
                // }
            } catch (error) {
                // Handle network errors or other issues
                console.error("error from server: "+error);
                this.error = true;
            }
        },
        goToLogin()
        {
            this.$emit("confirm", 'login');
        },


    },
};
</script>
