const router = require('express').Router();
const { User, Forum, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//Route used to get all posts
router.get('/posts', withAuth, async (req, res) => {
  try {
    const dbPostsData = await Forum.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const posts = dbPostsData.map((post) => post.get({ plain: true }));
    res.render('posts', {
      posts, //use this variable for showing all posts
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Getting a single post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const dbPostsData = await Forum.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_desc',
            'comment_time_stamp',
            'user_id',
            'forum_id',
          ],
        },
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });

    const post = dbPostsData.get({ plain: true });
    res.render('post', { post, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/posts');
    return;
  }
  res.render('login');
});

router.get('/register', async (req, res) => {
  res.render('register');
});
router.get('/allposts', (req, res) => {
  res.render('all-posts');
});
router.get('/post', (req, res) => {
  res.render('post-comment');
});
router.get('/newpost', (req, res) => {
  res.render('new-post');
});
module.exports = router;
