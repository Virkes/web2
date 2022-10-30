const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const router = express.Router();

var comments = require('../models/comments');
var korisnici = require('../models/korisnici');
var komentari = comments.komentari;
var users = korisnici.users;

router.get('/', function(req, res) {
    res.render('komentari',{
        komentari: komentari
    })
});

router.get('/dodaj-komentar', requiresAuth(), function(req, res) {
    res.render('dodaj-komentar')
});

router.post('/dodaj-komentar', requiresAuth(), function(req, res) {
    const user = req.oidc.user.nickname;
    const id = komentari.length;
    const komentar = req.body.komentar;
    const noviKomentar = {
        komentator: user,
        id: id,
        komentar: komentar
    }
    komentari.push(noviKomentar);
    res.redirect('/')
});

router.get('/uredi-komentar/', requiresAuth(), function(req, res) {
    const komentarId = req.body.komentar;
    const user = req.oidc.user.nickname;
    checkPerm(komentarId, user);
    const perm = checkPerm(komentarId, user);
    if (perm != undefined){
        return res.status(403).json({
            perm
        });
    }
    res.render('uredi-komentar', {
        komentarId : komentarId
    })
});

router.put('/uredi-komentar', requiresAuth(), function(req, res) {
    const komentarId = req.body.komentarId;
    const user = req.oidc.user.nickname;
    const perm = checkPerm(komentarId, user);
    if (perm != undefined){
        return res.status(403).json({
            message: perm
        });
    }
    const komentar = req.body.komentar;
    for ( i=0; i<komentari.length; i++){
        if (komentari[i]['id'] == komentarId) {
            komentari[i]['komentar'] = komentar;
            break;
        }
    }
    res.redirect('/');
});

router.delete('/delete', requiresAuth(), function(res, req){
    const komentarId = req.body.komentar;
    const user = req.oidc.user.nickname;
    checkPerm(komentarId, user);
    for ( i=0; i<komentari.length; i++){
        if (komentari[i]['id'] == komentarId) {
            komentari.splice(i,1);
            break
        }
    }
    res.redirect('/');
});

function checkPerm(komentarId, user) {
    for(i=0; i<users.length; i++){
        if (users[i]['nickname'] == user) {
            if (users[i]['role'] == 'admin') {
                return;
            }
        }
        for (j=0; j<komentari.length; j++){
            if (komentari[j]['id'] == komentarId) {
                if (komentari[j][komentator] == user) {
                    return;
                }
            }
        }
    }
    return {
        message: "You do not have permision to access this comment!"
    }
}

module.exports = router;