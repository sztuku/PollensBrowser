<template>
    <div id="main" >
        <div class="row">
            <div class="col-6 mx-auto mt-5">
                <div v-if="error" class="alert alert-danger" role="alert">
                    <h3>Invalid login or password</h3>
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
                    <button type="submit" class="btn btn-primary btn-block mb-4">Log in</button>

                    <!-- Register buttons -->
                    <div class="text-center">
                        <p>Not a member? <button @click="register">Register</button></p>
                    </div>
                    STATUS: {{status}}
                </form>
                <button @click="check">CHECK</button>

            </div>
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
                    },
                    body: JSON.stringify({ name:this.formData.name,password: this.formData.password })
                };

                fetch('http://localhost:3000/login', requestOptions)
                    .then(async response => {
                        const data = await response.json();
                        console.log(data.status)
                        if (data.status === 'logged')
                        {
                            this.$emit("confirm", 'check');
                            this.$emit("userName",this.formData.name);
                            this.error=false

                        }else
                        {
                            this.$emit("confirm", 'login');
                            this.error=true
                        }
                        // this.$emit("login");
                        // check for error response
                        // if (!response.ok) {
                        //     // get error message from body or default to response status
                        //     const error = (data && data.message) || response.status;
                        //     this.error=true
                        //     return Promise.reject(error);
                        // }
                        //
                        // this.status = data.id;
                        // if (data.id===200)
                        // {
                        //     this.error=false
                        //
                        // }

                    })
                    .catch(error => {
                        this.errorMessage = error;
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
        async check()
        {

            var requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cityName:'szczercow'})
            };
            fetch('http://localhost:3000/check', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log(data.cityName)
                    // this.$emit("confirm", 'check');
                    // this.$emit("login");
                    // check for error response
                    // if (!response.ok) {
                    //     // get error message from body or default to response status
                    //     const error = (data && data.message) || response.status;
                    //     this.error=true
                    //     return Promise.reject(error);
                    // }
                    //
                    // this.status = data.id;
                    // if (data.id===200)
                    // {
                    //     this.error=false
                    //
                    // }

                })
                .catch(error => {
                    this.errorMessage = error;
                    this.error=true
                    console.error('There was an error!', error);
                });
        },
        register()
        {
            this.$emit("confirm", 'register');
        },


    },
};
</script>
