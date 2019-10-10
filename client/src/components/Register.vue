<template>
    <div class="popup popup--register">
        <div class="popup__content">
            <div v-if="error" class="popup__error">
                <h2>Error</h2>
                <p>{{errorMessage}}</p>
            </div>
            <div class="popup__form">
                <form class="login" @submit.prevent="register">
                    <h1>Sign in</h1>
                    <label>Username </label>
                    <input required v-model="username" type="username" placeholder="Username"/>
                    <br>
                    <label>Email </label>
                    <input required v-model="email" type="email" placeholder="Email"/>
                    <br>
                    <label>Password </label>
                    <input required v-model="password" type="password" placeholder="Password"/>
                    <br>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Register',
    data () {
        return {
            username: '',
            email: '',
            password: '',

        }
    },
    methods: {
        register: function() {
            let username = this.username;
            let email = this.email;
            let password = this.password;

            this.$store.dispatch('register', {username, email, password})
            //.then(() => {this.$router.push('/')})
            .catch(err => {console.log(err)});
        }
    }
}
</script>
