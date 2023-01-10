const router = require('express').Router();
const { Post, User, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comments,
          attributes: ['content'],
        },
      ],
    });
    
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    // this code above means to input the blog information where it will convert to plain text

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/addcomment/:id', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findByPk(req.params.id,{
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comments,
          attributes: ['content'],
        },
      ],
    });
    // console.log(postData)
    // Serialize data so the template can read it
    const post = postData.get({ plain: true });
    // this code above means to input the blog information where it will convert to plain text

    // Pass serialized data and session flag into template
    res.render('addcomment', { 
      ...post, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// below the user requests the dashboard 
router.get('/dashboard', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize function data so the template can read it is this code below =  .map((post) => post.get({ plain: true }));

    const posts = postData.filter((post) => {
      return post.user_id==req.session.user_id
      // the code is returning the filter of the post that is matching the user id

    }).map((post) => post.get({ plain: true }));
    

    // Pass serialized data and session flag into template
    res.render('dashboard', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/editpost/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('editpost', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profilenewpost', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('profilenewpost', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/newpost', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (!req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('newpost');
});

router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});

module.exports = router;
