// models are a table of information and the routes are what the user is requesting. The routes cannot work without the models code done first. 

// NOTE: this code below is for the user to navigate the login and log out with password info and userdata, and the registration of making a new user account.

const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    console.log(userData);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  console.log("login")
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log(userData)
    // ("login") - this means a string which is console logging the word in the code above.
    // the (userData) -text is blue inside means that its console logging an expression NOT a string. 

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await 
    userData.checkPassword(req.body.password);
    console.log(validPassword)
    console.log(req.body)
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
