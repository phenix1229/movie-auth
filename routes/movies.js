const express = require('express');
const router = express.Router();
const Movie = require('./models/Movies');


//options page
router.get('/', (req, res) => {
    return res.render('index');
});

//get all movies
router.get('/movies', (req, res) => {
    if(req.isAuthenticated()){
        Movie.find({})
        .then((movies) => {
            return res.render('movies', {movies: movies});
        })
        .catch(err => res.status(500).json({message: 'Server error', err}));
    } else {
        return res.render('index');
    }
});

//render findMovie page
router.get('/findMovie', (req, res) => {
    if(req.isAuthenticated()){
        return res.render('findMovie', {movie:null});
    } else {
        return res.redirect('/');
    }
});

//get single movie
router.get('/foundMovie', (req, res) => {
  //find the movie we are searching for based on searchbox query in findMovie.ejs
    if(req.isAuthenticated()){
        Movie.findOne({title:req.query.title})
        .then((movie) => {
            if(movie){
                return res.render('findMovie', {movie});
            } else {
                return res.status(400).json({message:'No movie found'});
            }
        })
        .catch(err => res.status(500).json({message:'Server error', err}));
    } else {
        return res.redirect('/');
    }
});

//adds a movie to the database
router.post('/addMovie', (req, res) => {
  //make sure all fields are filled in
    if(!req.body.title || !req.body.rating || !req.body.synopsis || !req.body.releaseYear || !req.body.genre || !req.body.director || !req.body.boxOffice){
        return res.status(400).json({message:'All fields must be filled'});
    };
    Movie.findOne({title: req.body.title})
    .then(title => {
        //check if movie already exists
        if(title){
            return res.status(500).json({message:'Movie is already in database'});
        }
        //create and save new movie
        const newMovie = new Movie();
        newMovie.title = req.body.title;
        newMovie.rating = req.body.rating;
        newMovie.synopsis = req.body.synopsis;
        newMovie.releaseYear = req.body.releaseYear;
        newMovie.genre = req.body.genre;
        newMovie.director = req.body.director;
        newMovie.boxOffice = req.body.boxOffice;
        newMovie.save()
        .then((title) => {
            return res.redirect('/success')
            // return res.status(200).json({message: 'Movie added', title: title});
        })
        .catch(err => {
            return res.status(500).json({message: 'Movie was not added', err});
        })
    })
    .catch(err => {
            return res.status(500).json({message:'Server error', err});
    })
});

//render the addMovie page
router.get('/addMovie', (req, res) => {
    if(req.isAuthenticated()){
        return res.render('addMovie');
    } else {
        return res.redirect('/');
    }
});

//update movie
router.put('/update/:title', (req, res) => {
  //find movie based on parameters
    Movie.findOne({title:req.params.title})
    .then((movie) => {
        if(movie){
            //set new movie stats
            movie.rating = req.body.rating ? req.body.rating : movie.rating;
            movie.synopsis = req.body.synopsis ? req.body.synopsis : movie.synopsis;
            movie.releaseYear = req.body.releaseYear ? req.body.releaseYear : movie.releaseYear;
            movie.genre = req.body.genre ? req.body.genre : movie.genre;
            movie.director = req.body.director ? req.body.director : movie.director;
            movie.boxOffice = req.body.boxOffice ? req.body.boxOffice : movie.boxOffice;
            movie.save().then(updated => {
                return res.redirect('/success');
            })
            .catch(err => res.status(500).json({message:'Movie not updated', err}));
        } else {
            res.status(400).json({message:'Cannot find movie'});
        }
    })
    .catch(err => res.status(500).json({message:'Server error', err}));
});

router.get('/updateMovie/:title', (req, res) => {
    if(req.isAuthenticated()){
        return res.render('updateMovie', {title:req.params.title});
    } else {
        return res.redirect('/');
    }
})

//delete movie
router.delete('/delete/:title', (req, res) => {
    Movie.findOneAndDelete({title: req.params.title})
    .then(movie => {
        if(movie){
            // return res.status(200).json({message:'Movie deleted'});
            setTimeout(res.render('findMovie'), 2000);
            return res.send('Movie deleted');
            // res.render('findMovie');
        } else {
            return res.status(500).json({message:'No movie to delete'});
        }
    })
    .catch(err => res.status(500).json({message:'Movie not deleted', err: err}));
});

module.exports = router;