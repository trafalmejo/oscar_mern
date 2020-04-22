const express = require('express')
const router = express.Router()

//Project Model
const Project = require('../../models/OscarFile')


// @route GET request api/projects
// @desc GET All projects
// @access Public
router.get('/', (req, res) => {
    Project.find()
        .sort({
            date: -1
        })
        .then(projects => res.json(projects))
})

// @route POST request api/projects
// @desc Create a Project
// @access Public
router.post('/', (req, res) => {
    const newProject = new Project({
        name: req.body.name,
        content: {},
        size: 5
    })
    newProject.save().then(project => res.json(project))
})

// @route DELETE request api/projects/:id
// @desc Delete a Project
// @access Public
router.delete('/:id', (req, res) => {
    Project.findById(req.params.id)
        .then(project => project.remove().then(() => res.json({
            sucess: true
        }))).catch(err => res.status(404).json({
            sucess: false
        }))
})

module.exports = router