import axios from 'axios';

for(let i = 0; i < 10000; i++) {
    axios.get('http://localhost:3000/api/v1')
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
}