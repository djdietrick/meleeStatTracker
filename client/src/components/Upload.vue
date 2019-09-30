<template>
    <div class="main">
        <div id="vueForm" class="container">
            <!--<form @submit="onSubmit" enctype="multipart/form-data">-->
                Select files: <input type="file" name="myFiles" @change="onChange" multiple>

                <div class="player-info">
                    Your Port: <input type="text" id="playerOne" v-model="player.port">
                    Your Tag: <input type="text" id="playerOne" v-model="player.tag">
                </div>
                <hr>
                <div class="player-info">
                    Opponent Username: <input type="text" id="playerTwo" v-model="opponent.userName">
                    Opponent Port: <input type="text" id="playerTwo" v-model="opponent.port">
                    Opponent Tag: <input type="text" id="playerTwo" v-model="opponent.tag">
                </div>
                <button @click="submit">Upload Games</button>
            <!--</form>-->
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Upload',
    data () {
        return {
            files: '' ,
            player: {
                port: 0,
                tag: '',
            },
            opponent: {
                username: '',
                playerId: '',
                port: 0,
                tag: '',
            }
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
                playerId: this.$store.getters[playerId],
                port: this.player.port,
                tag: this.player.tag
            });
            players.push({
                username: this.opponent.username,
                playerId: this.opponent.playerId,
                port: this.opponent.port,
                tag: this.opponent.tag
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
}
</script>
