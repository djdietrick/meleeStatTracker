<template>
    <div class="popup" id="login">
        <div class="popup__content">
            <a href="#" class="popup__close">&times;</a>
            <div v-if="error" class="popup__error">
                <h2>Error</h2>
                <p>{{errorMessage}}</p>
            </div>
            <div class="popup__form">
                <form class="login" @submit.prevent="login">
                    <h1>Sign in</h1>
                    <div class="input-row"> 
                        <label>Username</label>
                        <input required v-model="username" type="username" placeholder="Username"/>
                    </div>
                    <div class="input-row">
                        <label>Password</label>
                        <input required v-model="password" type="password" placeholder="Password"/>
                    </div>
                    <button type="submit" class="btn btn--white">Login</button>
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
