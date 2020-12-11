const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize, (request, response) => {

    if (request.body.text == null){
        response.status(400);
        response.send("Someting went wrong");
    }else{
        request.body.userId = request.currentUser.id;
        PostModel.create(request.body, ()=>{})
        response.send("Post saved");
    }


});


router.put('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to like a post

    let userID = request.currentUser.id;
    let postID = request.params.postId;

    PostModel.like(userID,postID,()=>{
        response.json({
            ok: true
        })
    });
});

router.delete('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to unlike a post
    
    let userID = request.currentUser.id;
    let postID = request.params.postId;

    PostModel.unlike(userID,postID,()=>{
        response.json({
            ok: true
        })
    });
});

module.exports = router;
