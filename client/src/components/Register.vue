<template>
    <div class="popup" id="register">
        <div class="popup__content">
            <a href="#" class="popup__close">&times;</a>
            <div v-if="error" class="popup__error">
                <h2>Error</h2>
                <p>{{errorMessage}}</p>
            </div>
            <div class="popup__form">
                <form class="login" @submit.prevent="register">
                    <h3 class="heading-tertiary">Register</h3>
                    <div class="input-row"> 
                        <label>Username</label>
                        <input required v-model="username" type="username" placeholder="Username"/>
                    </div>
                    <div class="input-row">
                        <label>Email</label>
                        <input required v-model="email" type="email" placeholder="Email"/>
                    </div>
                    <div class="input-row">
                        <label>Password</label>
                        <input required v-model="password" type="password" placeholder="Password"/>
                    </div>
                    <button type="submit" class="btn btn--white">Register</button>
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
            error:false,
            errorMessage:''
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
