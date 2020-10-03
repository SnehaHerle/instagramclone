const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.post('/createpost', requireLogin,(req,res) => {
    const {title,body,pic} = req.body
    //console.log(title,body.pic)
    if(!title || !body ||!pic){
        return res.status(422).json({error: "Please add all the fields"})
    }

    //we should not store passwords in another schema unnecessarily.
    req.user.password = undefined

    const post = new Post({
        title: title,
        body: body,
        photo: pic,
        postedBy: req.user
    })

    post.save()
        .then(result => {
            res.json({post: result})
        })
        .catch(err => {
            console.log(err)
        })
    
})

router.get('/allpost', requireLogin, (req,res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/mypost', requireLogin, (req,res) => {
    Post.find({postedBy: req.user._id})
        .populate("postedBy", "_id name pic")
        .then( mypost => {
            res.json({mypost})
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    },{
        new: true
    })
    .populate("postedBy", "_id name pic")
    .exec( (err,result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    },{
        new: true
    }).populate("postedBy", "_id name pic")
    .exec( (err,result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req,res) => {

    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    },{
        new: true
    }).populate("comments.postedBy", "_id name pic")  //to populate arrays inside.
    .populate("postedBy", "_id name pic")
    .exec( (err,result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        else{
            res.json(result)
        }
    })
})

//receiving the parameter from URL
router.delete('/deletepost/:postId', requireLogin, (req,res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

//take 2 parameters to delete a comment posted by you.
router.delete('/deletecomment/:postId/:commentId', requireLogin, (req,res) => {
    const comment = {_id : req.params.commentId}    //comment is an object having an _id
    Post.findByIdAndUpdate(
        req.params.postId,
        {
            $pull: {comments : comment}      //firts we find the post by postid, then we pull the comment with the commentid provided in the params.
        },
        {
            new: true
        }
    ).populate("postId")
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({ error: err })
        }
        else{
            res.json(result)
        }
    })
})

router.get('/getsubpost', requireLogin, (req,res) => {

    //if postedBy is present in following list then only return posts.
    Post.find({postedBy: {$in: req.user.following}})
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})


module.exports = router