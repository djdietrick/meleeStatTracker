<template>
    <div class="popup popup--login">
        <div class="popup__content">
            <div v-if="error" class="popup__error">
                <h2>Error</h2>
                <p>{{errorMessage}}</p>
            </div>
            <div class="popup__form">
                <form class="login" @submit.prevent="login">
                    <h1>Sign in</h1>
                    <label>Username</label>
                    <input required v-model="username" type="username" placeholder="Username"/>
                    <br>
                    <label>Password</label>
                    <input required v-model="password" type="password" placeholder="Password"/>
                    <br>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data () {
        return {
            username: '',
            password: '',
            error: false,
            errorMessage: ''
        }
    },
    methods: {
        login: function() {
            let username = this.username 
            let password = this.password
            this.$store.dispatch('login', { username, password })
            .then(() => this.$router.push('/'))
            .catch(err => {
                this.error = true;
                this.errorMessage = err;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.errorMessage {
    display:inline-block;
    background-color: red;
}
</style>
