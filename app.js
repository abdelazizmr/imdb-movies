// Variables

//let egybestUrl = 'https://egy.egybest.bid/movie/The-Godfather-1972/';

let arrayOfMovies = [];

let movies_container = document.querySelector('.movies')

let favMovie = document.getElementById('fav-movie')

// click on the fav movies event
favMovie.addEventListener('click',()=>{
    //console.log('fav-movies-clicked');
    if (arrayOfMovies.length == 0){
        displayError('The favourite movies list is empty')
    }else{
        displayMovies(arrayOfMovies)
        
    }
    
})

//checking the localstorage when the page loaded
window.addEventListener('load',()=>{
    getMovies()
    //console.log('page loaded');
    if (window.localStorage.getItem('movie')){
        arrayOfMovies = JSON.parse(localStorage.getItem('movie'))
        //console.log(arrayOfMovies);
    }
})



//fetching from the imdb api
async function getMovies(){
    let resp = await fetch('https://imdb-api.com/en/API/Top250Movies/k_pp0slmxz');
    let data = await resp.json();
    let arr = data.items
    //console.log(arr);
    if (arr.length === 0){
        return displayError("Sorry, The service is down at this moment😔")
    }
    displayMovies(arr)
}

function addToLocalsStorage(arr){
    window.localStorage.setItem('movie',JSON.stringify(arrayOfMovies))
}

//adds a movie to arrayOfMovies and add it to the LS
function addToarrayOfMovies(movie){
    //for avoiding duplication in the fav movies section
    for (let m of arrayOfMovies){
        if (m.title.trim() == movie.title.trim()){
            //console.log('already exist');
            return false
        }
    }
    arrayOfMovies.push(movie)
    //console.log('new movie added');
    //console.log(arrayOfMovies);
    addToLocalsStorage(arrayOfMovies)
}

//dispaly movies on the page
function displayMovies(arr){
    let order = 1
    movies_container.innerHTML = ''
    for (let movie of arr){
        
        let movie_div = document.createElement('div')
        movie_div.classList = 'movie'
        movie_div.innerHTML = `<div class="movie">
                                    <div class="movie-img">
                                        <img src="${movie.image}" alt="${movie.title}">
                                    </div>

                                    <div class="movie-info">
                                        <a href='#' class="movie-title">
                                        ${order++}- ${movie.title}
                                        </a>
                                        
                                        <div>
                                            <p class="movie-rating">${movie.imDbRating ? movie.imDbRating : '8'}</p>
                                            <span class="trick" >${movie.id}</span>
                            
                                            <button class="add-fav" title="add to favourites">
                                            <i class="fa-solid fa-heart"></i>
                                            </button>
                                        </div>
                                        
                                    </div>
                                </div>`
        movies_container.append(movie_div)

        
    }

    checkRating()
    activateHeartbtn()
    // showing only the movie that was selected by clicking on the title
    let titleclicked = document.querySelectorAll('.movie-title')
    titleclicked.forEach((title)=>{
        title.addEventListener('click',(e)=>{
            let title = e.target
            let id = title.nextElementSibling.children[1].textContent
            //console.log(id);
            displayOneMovie(id)
        })
    })
    //adding the movie the favourite movies list
    let heartbtn = document.querySelectorAll('.add-fav')
    heartbtn.forEach(btn=>{
        btn.addEventListener('click',()=>{
            btn.classList.toggle('active')
            let rating = btn.parentElement.children[0].textContent
            let titlewithNum = btn.parentElement.previousElementSibling.textContent.split("-")
            let title = titlewithNum[1]
            let image = btn.parentElement.parentElement.previousElementSibling.children[0].src
            let id = btn.parentElement.children[1].textContent
            let movie = {'id': id ,'title':title.trim() , 'image':image, 'imDbRating':rating}
            
            if (btn.classList.contains('active')){
                //console.log('active');
                addToarrayOfMovies(movie)
            }else{
                //console.log('not active');
                arrayOfMovies = arrayOfMovies.filter( movie=> movie.title.trim() !== title.trim())
                //console.log(arrayOfMovies);
                addToLocalsStorage(arrayOfMovies)
            }
        })
    })

}

//coloring the ratings
function checkRating(){
    let ratings = document.querySelectorAll('.movie-rating')
    for (let r of ratings){
        if(r.textContent > 9){
            r.style.color = 'rgb(36, 239, 36)'
        }else if(parseFloat(r.textContent) > 8 && parseFloat(r.textContent) <= 9){
            r.style.color = 'yellow'
        }else if(parseFloat(r.textContent) > 7 && parseFloat(r.textContent) <= 8){
            r.style.color = 'skyblue'
        }else {
            r.style.color = 'red'
        }
    }
}

//display the selected movie 
async function displayOneMovie(id){
    movies_container.innerHTML = ''
   
    arrayofimdbmovies = []
    let resp = await fetch(`https://imdb-api.com/en/API/Title/k_pp0slmxz/${id}/FullCast,Images,Trailer,ratings`);
    let data = await resp.json();
    if (data.id === null){
        return displayError("Sorry, try again later 🤕")
    }

    let movieData = {'id':data.id , 'title':data.title, 'fullTitle':data.fullTitle, 'image':data.image,'plot':data.plot, 'director':data.directors , 'actorList':data.actorList.slice(0,4),'imDbRating':data.imDbRating , 'imDbRatingCount':data.imDbRatingVotes , 'duration':data.runtimeStr , 'trailerUrl':data.trailer.link}

    arrayofimdbmovies.push(movieData)
    
    //console.log(arrayofimdbmovies);
    for (movie of arrayofimdbmovies){
        let m = document.createElement('div')
            m.classList = 'one-movie'
            m.innerHTML = `
                <div class="movie-header">
  
                            <img src="${movie.image}" alt="">
   

                    <div class="movie-description">
                        <div>
                            <p>${movie.imDbRating}</p>
                        
                        <span class="rating-count">voted by <br>${movie.imDbRatingCount}</span>
                        
                        </div>
                        <h3>${movie.fullTitle}</h3>
                        <span class="duration"><strong>Duration : </strong><br>${movie.duration}</span>
                        
                    </div>
                </div>

                <div class="movie-body">
                    <p>${movie.plot}</p>
                </div>

                <div class="crew">
                    <h5>Cast</h5>
                    <span class="my-2">- Directed by <strong>${arrayofimdbmovies[0].director}</strong></span>
                    <ul>
                        <li>
                            <img  class="actor-image"  src="${movie.actorList[0].image}"/>
                            <span class="actor-name" >${movie.actorList[0].name}</span>
                        </li>
                        <li>
                            <img  class="actor-image"  src="${movie.actorList[1].image}"/>
                            <span class="actor-name" >${movie.actorList[1].name}</span>
                        </li>
                        <li>
                            <img  class="actor-image"  src="${movie.actorList[2].image}"/>
                            <span class="actor-name" >${movie.actorList[2].name}</span>
                        </li>
       
                    </ul>
                </div>

                <div class="watch">
                    <button class="btn btn-primary" id="watchTrailer">Watch trailer</button>
                </div>

                <div class="watch mb-1">
                    <button class="btn btn-primary" id="watchNow">Watch movie</button>
                </div>
`
        movies_container.append(m)
    }

    

    let watchBtn = document.getElementById('watchNow')
    watchBtn.addEventListener('click',()=>{
        //console.log(arrayofimdbmovies[0].fullTitle);
        watchMovie(arrayofimdbmovies[0].fullTitle)
    })

    let tarilerBtn = document.getElementById('watchTrailer')
    tarilerBtn.addEventListener('click',()=>{
        watchTrailer(arrayofimdbmovies[0].trailerUrl)
    })
}

//watch the selected movie on egybest
function watchMovie(title){
    // a regular ecpression to be a valid url
    let fullTitle = title.split(/[\s()]/)
    let newarr = fullTitle.filter(i=> i!=='')
    let newTitle = newarr.join("-")
    window.open(`https://egy.egybest.bid/movie/${newTitle}/`, "_blank");
}

//watch trailer on imdb
function watchTrailer(url){
    window.open(url,'__blank')
}

// to activate heartButtons to the favourite movies when page loaded
function activateHeartbtn(){
    let heartsbtns = document.querySelectorAll('.add-fav')
    //onsole.log(heartsbtns);
    heartsbtns.forEach(btn=>{
        let titlewithNum = btn.parentElement.previousElementSibling.textContent.split("-")
        let title = titlewithNum[1]
        for (movie of arrayOfMovies){
            if (title.trim() == movie.title.trim()){
                btn.classList.toggle('active')
                //console.log('found');
            }
        }
    })
}

// search movie form
// let form = document.getElementById('form')
// form.addEventListener('submit',(e)=>{
//     e.preventDefault()
//     let input = document.getElementById('searchinp').value 
//     SearchMovie(input)
//     input = ''
// })
let searchBtn = document.getElementById('basic-addon2')
searchBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    let input = document.getElementById('searchinp').value 
    SearchMovie(input)
    input = ''
})


//search a movie by expression
async function SearchMovie(exp){
    let url = `https://imdb-api.com/en/API/SearchMovie/k_pp0slmxz/${exp}`
    let searchapi = await fetch(url)
    let data = await searchapi.json()
    displayError('Searching ..')
    if (data.results === null){
        return displayError("Movie not found")
    }
    let foundMovies = data.results
    //console.log(foundMovies);
    if (foundMovies.length == 0){
        displayError('Movie not found')
    }else{
        displayMovies(foundMovies)
    }
    
}

//displaying not found a movie
function displayError(msg){
        movies_container.innerHTML = ''
        let p = document.createElement('p')
        p.classList = 'movie-error'
        p.innerHTML = msg
        movies_container.append(p)
}

