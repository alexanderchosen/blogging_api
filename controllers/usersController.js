const express = require('express')
const usersModel = require('../models/users')
const blogsModel = require('../models/blogs')

// the user route is activated when a user clicks on the profile
// this get route is for the authenticated user to get all his drafted and published blogs, have a MY BLOGS button
// in a div card showing basic info such as title, description, state, tags  
exports.getMyBlogs = async (req, res)=>{
    
    // filter by state query and paginate 5 per pages
    // onclick event on each list to show the full body
    const id = req.params.id
    const author = req.body
    const page = req.query.p || 1
    const blogsPerPage = 5
    let blogs =[]
    
    const confirmUser = await usersModel.findById(id)

    try{ 
        const user = await confirmUser.populate({
        path: 'blogs',
        match: {author: {$eq: author}},
        select: 'author'
    })
    .skip((page-1) * blogsPerPage)
    .limit(blogsPerPage)
    .forEach((blog) => {
      blogs =  blogs.push(blog)
      return blogs 
    })
    .then(blogs => {
        res.status(200).json({
            status: true,
            Blogs: blogs.map(blog =>{
                return {
                    title: blog.title,
                    description: blog.description,
                    tags: blog.tags,
                    author: blog.author,
                    timestamp: blog.timestamp,
                    state: blog.state,
                    read_count: blog.read_count,
                    reading_time: blog.reading_time,
                    body: blog.body
                }
            })
        })
    })
}catch{err =>{
    console.log(err)
    res.send(err)}}
}


exports.getProfile = async (req, res)=>{
    const id= req.params.id
    const userId = req.user.id

    // const userId = req.user.id
// this author params should be gotten from the sign in details after auth
    const userConfirmed = await usersModel.findById(id)

    if(id == userId){
        return res.status(200).json({
            status: true,
            message: req.user
    })
}
}
    
    