<template>
  <div class="home">
    <div class="home__text-box">
      <h1 class="heading-primary">
        <span class="heading-primary--main">Melee Stat Tracker</span>
        <span class="heading-primary--sub">Analyze your game</span>
      </h1>
    </div>
    <div class="home__nav">
        <a href="#login" class="btn btn--white">Login</a>
        <a href="#register" class="btn btn--white">Register</a>
    </div>
    <Login/>
    <Register/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Login from '../components/Login';
import Register from '../components/Register';

export default {
  name: 'home',
  computed: {
    ...mapGetters([
        'isLoggedIn'
    ])
  },
  methods: {
    logout: function() {
      this.$store.dispatch('logout')
      .then(() => this.$router.push('/'))
      .catch(err => console.log(err));
    }
  },
  components: {
    Login,
    Register
  }
}
</script>
