<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |

      <span v-if="isLoggedIn">
        <router-link to="/upload">Upload</router-link> | 
        <button @click="logout">Logout</button>
      </span>
      <span v-else>
        <router-link to="/login">Login</router-link> | 
        <router-link to="/register">Register</router-link>
      </span>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
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
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
