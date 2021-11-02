const router = require('express').Router()
const { Post, User } = require('../models')

router.get('/', async (req, res) => {
    try{
        const PostData = await Post.findAll({
            include: [{
                model: User,
                attributes: ['name']
            }]
        })

        const post = PostData.map((post) => post.get({ plain:true }))

        res.render('homepage', {
            post, logged_in: req.session.logged_in
        })
    }
    catch (err){
        res.status(500).json(err)
    }
})

router.get('/profile', async (req, res) => {
    if(!req.session.user_id){
        res.redirect('/')
    }
    try{
        const userInfo = await User.findByPk(req.session.user_id, {
            attributes: {exclude: ['password']},
            include: [Post]
        })
        const user = await userInfo.get({ plain: true })

        res.render('profile', {
            ...user, logged_in: true
        })
    } catch (err) {
        console.log(err);
        res.status(418).json(err)
    }
})

router.get('/post/:id', async (req, res) => {
    try{
        const projData = await Post.findByPk(req.params.id, {
            include: [
                {model:User,
                attributes: ['name']}
            ]
        })
        const post = postData.get({ plain: true })

        res.render('post', {
            ...post, logged_in: req.session.logged_in
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.get('/login', (req, res) => {
    if(req.session.logged_in){
        res.redirect('/profile')
    }
    res.render('login')
})
module.exports = router