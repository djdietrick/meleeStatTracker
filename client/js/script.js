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
            files: ''
        }
    },
    methods: {
        submit() {
            console.log(this.files);
            const formData = new FormData();

            for(var i = 0; i < this.files.length; i++) {
                let file = this.files[i];
                formData.append('files[' + i + ']', file);
            }
            formData.set('playerOneName', this.playerOne.userName);
            formData.set('playerTwoName', this.playerTwo.userName);
            formData.set('playerOnePort', this.playerOne.port);
            formData.set('playerTwoPort', this.playerTwo.port);
            formData.set('playerOneTag', this.playerOne.tag);
            formData.set('playerTwoTag', this.playerTwo.tag);

            axios.post('http://localhost:3000/games/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(formData);
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