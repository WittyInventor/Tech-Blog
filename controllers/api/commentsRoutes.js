const router = require('express').Router();
const { Comments } = require('../../models');
const withAuth = require('../../utils/auth');
// withAuth means its authenticating that the user cannot make a post without being logged in 

router.post('/', withAuth, async (req, res) => {
  console.log("post")
  console.log(req.body)
  // try means it will validate if the code runs correctly
  try {
    const newComment = await Comments.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentsData = await Comments.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!commentsData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comments.update(
      {title:req.body.title, content:req.body.content},  
      {
      where: {
        id: req.params.id
      }
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
