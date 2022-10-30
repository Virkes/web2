const express = require('express');
const router = express.Router();
const { auth, requiresAuth } = require('express-openid-connect');

var games = require('../models/games');
var utakmice = games.utakmice;
var korisnici = require('../models/korisnici');
var users = korisnici.users;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('utakmice', {
        utakmice: utakmice
    })
});

router.get('/dodaj-utakmicu', requiresAuth(), function(req, res){
    const user = req.oidc.user.nickname;
    for(i=0; i<users.length; i++){
        if (users[i]['nickname'] == user) {
            if (users[i]['role'] != 'admin') {
                return res.status(403).json ({
                    message: "Requires admin role"
                })
            }
        }
    }
    res.render('dodaj-utakmicu')
});

router.post('/dodaj-utakmicu', requiresAuth(), function(req, res) {
    const user = req.oidc.user.nickname;
    for(i=0; i<users.length; i++){
        if (users[i]['nickname'] == user) {
            if (users[i]['role'] != 'admin') {
                return res.status(403).json ({
                    message: "Requires admin role"
                })
            }
        }
    }
    const utakmica = {
        id : req.body.id,
        tim1 : req.body.tim1,
        rezultat1 : req.body.rezultat1,
        tim2 : req.body.tim2,
        rezultat2 : req.body.rezultat2,
        tim3 : req.body.tim3,
        rezultat3 : req.body.rezultat3,
        tim4 : req.body.tim4,
        rezultat4 : req.body.rezultat4
    }
    utakmice.push(utakmica);
    res.redirect('/')
});

function checkAdmin() {
    const user = req.oidc.user.nickname;
    for(i=0; i<users.length; i++){
        if (users[i]['nickname'] == user) {
            if (users[i]['role'] != 'admin') {
                return res.status(403).json ({
                    message: "Requires admin role"
                })
            }
            return;
        }
    }
}

module.exports = router;