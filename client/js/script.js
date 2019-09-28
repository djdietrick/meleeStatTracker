//import Vue from 'vue';

// $('form').submit(function() {
//     return false;
// })

new Vue({
    el: '#vueForm',
    data () {
        return {
            playerOne: {
                userName: '',
                port: 0,
                tag: ''
            },
            playerTwo: {
                userName: '',
                port: 0,
                tag: ''
            },
            files: '',
            user: {}
        }
    },
    methods: {
        submit() {
            const formData = new FormData();

            for(var i = 0; i < this.files.length; i++) {
                let file = this.files[i];
                formData.append('files[' + i + ']', file);
            }
            let players = [];
            players.push({
                userName: this.playerOne.userName,
                port: this.playerOne.port,
                tag: this.playerOne.tag
            });
            players.push({
                userName: this.playerTwo.userName,
                port: this.playerTwo.port,
                tag: this.playerTwo.tag
            })

            formData.set('players', JSON.stringify(players));

            axios.post('http://localhost:3000/games/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                console.log(res);
            });
        },
        onChange(e) {
            console.log(e);
            console.log(this.$refs);
            const files = e.target.files;
            this.files = files;
        },
        onSubmit() {
            preventDefault();
            return false;
        }
    }
});