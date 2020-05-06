const express = require("express");
const router = express.Router();
var BSON = require("bson");
const auth = require("../../middleware/auth");
const authget = require("../../middleware/authget");

//Project Model
const OscarFile = require("../../models/OscarFile");
const User = require("../../models/User");

// @route POST request api/projects/all
// @desc POST All projects of the user logged in
// @access Public
router.get("/all", authget, (req, res) => {
  console.log("ONE");
  let projects = [];
  let projectsIds = [];
  console.log("user in all/");
  console.log(req.user);
  User.findOne({ _id: req.user.id }).then((user) => {
    if (user) {
      //user exists
      projectsIds = user.projects;
      //Obtain projects
      OscarFile.find({ _id: { $in: projectsIds } }).then((file) => {
        if (file) {
          //file exists
          projects = file;
          //send data
          res.json(projects);
        }
      });
    }
  });
  //////
  // OscarFile.find().then((file) => {
  //   console.log(file);
  //   //User exists
  //   //res.send(400);
  //   res.send(file);
  // });
});
// @route POST request api/projects/name
// @route post one project in order to load
router.post("/:name", auth, function (req, res) {
  //console.log("requesting one project");
  //console.log(req.params.name);
  OscarFile.findOne({ name: req.params.name }).then((file) => {
    if (file) {
      console.log(file);
      //User exists
      //res.send(400);
      res.send(file.content);
    }
  });
});

// @route POST request api/projects
// @desc Create a Project / Save a Project
// @access Private
router.post("/", (req, res) => {
  const name = req.body.name;
  let overwrite = req.body.overwrite;
  const content = req.body;
  const size = BSON.calculateObjectSize(content);
  const visibility = req.body.visibility;
  const author = req.body.author;

  User.findOne({ _id: author })
    .populate({
      //populates the projects schema with the project id that matches that name
      path: "projects",
      match: {
        name: name,
      },
    })
    .exec(function (err, user) {
      if (err) {
        return res.json({ error: err });
      }
      //Projects are not empty. User has at least one project that matches that name
      if (user.projects.length > 0) {
        //File with the same name exists
        if (overwrite) {
          //File with the same name exists and you want to overwrite
          let oscarnewfile = {};
          oscarnewfile.name = name;
          oscarnewfile.content = content;
          oscarnewfile.size = size;
          oscarnewfile.author = user.email;
          oscarnewfile.visibility = visibility;
          //console.log('id of project to be changed: ', name)
          let query = { name: name, author: user.email };
          OscarFile.update(query, oscarnewfile, function (err) {
            if (err) {
              if (err) return res.json({ error: err });
            } else {
              res.json({ msg: "Saved sucessfully" });
            }
          });
        } else {
          //File with the same name exists and you don't want to overwrite
          res.json({
            confirm:
              "There is a file with the same name, Do you want to overwrite?",
          });
        }
      } else {
        //User does not have any project that matches that name
        //File does not exists and you will create
        const newFile = new OscarFile({
          name,
          content,
          size,
          visibility,
          author: user.email,
        });
        newFile.save(function (err, file) {
          if (err) return res.json({ error: err });
          user.projects.push(file._id);
          user.save(function (err) {
            if (err) return res.json({ error: err });
            res.json({ msg: "Saved sucessfully" });
          });
        });
      }
    });
});

// @route DELETE request api/projects/:id
// @desc Delete a Project
// @access Private
router.delete("/:id", (req, res) => {
  console.log("requesting server to delete");
  console.log(req.params.id);

  OscarFile.findById(req.params.id)
    .then((project) => {
      console.log(project.author);
      console.log(User);
      //
      User.updateOne(
        { email: project.author },
        {
          $pull: { projects: project._id },
        },
        function (err) {
          if (err) {
            console.log("Error: ", err);
            res.json({
              error: "Project couldn't be removed",
            });
          }
        }
      );
      project.remove();
      res.json({
        msg: "Project deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        sucess: false,
      });
    });
});

module.exports = router;
