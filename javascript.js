//// DATA STRUCTURES

///// General functions

//I never used this but it could come in handy
function randomElement(l){
    // returns a random element of the array l 
    var randomNumber = Math.floor(Math.random()*(l.length));
    return l[randomNumber]

}

function sanitiseText(t){
    return t.replace(/'/g,"&#92;'")
 }

 var moodList = ["happy",'fluff', "sad","scary","dark","bittersweet", "mysterious","cute","gentle"]

function checkSectionStyled(choice_name, choice_list, choice_style){
    //string of html for a nicely formatted grid of check boxes based on choice_list, of type choice_name
    // eg checkSection("Media"", mediaList) creates a grid of checkboxes labelled "fanfic", "comic/manga" etc
    form_string ="<br><div class='grid-container'>"
    for (i = 0; i < choice_list.length; i++) {
        c=choice_list[i]
        tempID= "'"+c+choice_name+"Box'"
        form_string+= '<div class="grid-item"><div class="btn-group-toggle" data-toggle="buttons"><label class="btn '+ choice_style+ '"><input type="checkbox" id='+ tempID+'></input>'+c+'</label></div></div>'
    }
    form_string+="</div>"  
    return form_string
}


/////WHAT TO WATCH code

// the lists of possible values for the link, mood, tags etc

var siteList = [
    ["Disney Plus","https://www.disneyplus.com/watchlist"], 
    ["AnimeLab","https://www.animelab.com/shows/mine"],
    ["Crunchyroll",'https://www.crunchyroll.com/home/queue'],
    ["Netflix","https://www.netflix.com/browse/my-list"],
]

// Just the names of the sites
short_siteList=[]
for (s of siteList){
    short_siteList.push(s[0])
}

var mediaList= ["podcast", "fanfic", "comic/manga", "book", "movie", "tv: cartoon", "tv: anime", "tv: liveaction", "game: Visual Novel", "game: exploration", "game: puzzle", "game: fighting", "other"]

var tagList = ["romance", "horror", "action", "adventure", "mystery", "comedy","beautiful", "childrens","speculative","low plot", 'short',"cheesy","f/f","m/m","nb", "polyamory", "female protag","seen","unseen","to buy","subtitled live", 'finish it']

//// FUNCTIONS

function nameSection(choice_name){
    //string of html to nicely display the string choice_name, where choice_name is one of "Media", "Mood" etc
    return "<div><br><b>"+choice_name+":</b> "
}

function checkSection(choice_name, choice_list){
    //string of html for a nicely formatted grid of check boxes based on choice_list, of type choice_name
    // eg checkSection("Media"", mediaList) creates a grid of checkboxes labelled "fanfic", "comic/manga" etc
    form_string ="<br><div class='grid-container'>"
    for (i = 0; i < choice_list.length; i++) {
        c=choice_list[i]
        tempID= "'"+c+choice_name+"Box'"
        form_string+= "<div class='grid-item'>"+ c +":<input type='checkbox' id="+ tempID+" /></div>"
        //form_string+= '<div class="grid-item"><div class="btn-group-toggle" data-toggle="buttons"><label class="btn btn-secondary active"><input type="checkbox" id='+ tempID+'></input>'+c+'</label></div></div>'
    }
    form_string+="</div>"  
    return form_string
}

//This works the same as checkSection because I couldn't get radio buttons to work :(
function radioSection(choice_name, choice_list){
    //make a list of radio buttons choices based on choice_list
    form_string = "<form>"
    for (i = 0; i < choice_list.length; i++) {
        c=choice_list[i]
        cName="'"+c+choice_name+"Box'"
        form_string+= "<input type='radio' id="+cName+" name="+cName+" value="+cName+">"
        form_string+= "<label for="+cName+">"+c+"</label><br>"
    }
    form_string +="</form>"
    return checkSection(choice_name,choice_list)
}

// Functions used by "Choose New Work"

function makeChoices(){
    //Create the html for the "Choose New Work" choices

    form_string = ""
    form_string+= nameSection("Any of this media")
    form_string += "Choose all: <input type='checkbox' id='anyMediaBox' /></div>"
    form_string+= checkSection("Media", mediaList)
    form_string+= nameSection("All of these moods")
    form_string += "Choose all: <input type='checkbox' id='anyMoodBox' /></div>"
    form_string+= checkSection("Mood", moodList)
    form_string+= nameSection("All of these tags")
    form_string += "Choose all: <input type='checkbox' id='anyTagsBox' /></div>"
    form_string+= checkSection("Tags", tagList)
    form_string+= nameSection("None of these moods")
    form_string+= checkSection("ExcludeMood", moodList)
    form_string+= nameSection("None of these tags")
    form_string+= checkSection("ExcludeTags", tagList)
    form_string += "<div><button onclick = 'newTitle()'>Submit</button></div>"
    document.getElementById('choiceDisplay').innerHTML = form_string
}

function formatTitle(t){
    //return a nicely formatted string for a given work
    title_string = "Title: " +t.title + "<br>Rating: "+ t.Rating
    if (t.link[0] =="Other"){
        if (t.link[1] !=""){
            title_string+="<br>Link: <a href=\""+t.link[1]+"\">" +t.link[1] +"</a>"
        }
    }else{
        title_string+="<br>Link: <a href='"+t.link[1]+"'>" +t.link[0] +"</a>"
    }

    title_string+="<br>Media: " +t.media+"<br>Mood: " +t.mood+"<br>Tags: " +t.tags.join(", ") 
    
    if (t.notes !=""){
        title_string+="<br>Post: " +t.notes 
    }  
    return title_string
}

// Used to sort the works in descending order of rating
function higherRating(a,b){
    return (b.Rating - a.Rating)
}

function chooseTitles(){
    //return the list of titles matching the criteria chosen by the user, in descending order of rating

    //Media
    if (document.getElementById('anyMediaBox').checked == true){ //user has selected Media: Any
        temp_books=bookshelf
    } else{ //user has not selected Media: Any

        temp_filter = [] //list of selected media

        for (m of mediaList){
            tempID = m+"MediaBox"
            checkM = document.getElementById(tempID)
            if (checkM.checked == true){
                temp_filter.push(m)
            }
        }

        temp_books= [] // list of filtered works
        for (b of bookshelf){
            if (temp_filter.includes(b.media)){
                temp_books.push(b)
            }
        }
    }

    //Mood
    if (document.getElementById('anyMoodBox').checked != true){ //user has seleceted Mood: Any

        temp_filter = []

        for (t of moodList){
            tempID = t+"MoodBox"
            if (document.getElementById(tempID).checked == true){
                temp_filter.push(t)
            }
        }

        temp_books2= temp_books
        temp_books = []
        for (b of temp_books2){
            keep = true
            for (t of temp_filter){
                keep = keep && (b.mood.includes(t)) 
            }
            if (keep==true){
                temp_books.push(b)
            }
        }
    }
    //Tags
    if (document.getElementById('anyTagsBox').checked != true){ //user has not seleceted Tags: Any

        temp_filter = []

        for (t of tagList){
            tempID = t+"TagsBox"
            if (document.getElementById(tempID).checked == true){
                temp_filter.push(t)
            }
        }

        temp_books2= temp_books
        temp_books = []
        for (b of temp_books2){
            keep = true
            for (t of temp_filter){
                keep = keep && (b.tags.includes(t)) 
            }
            if (keep==true){
                temp_books.push(b)
            }
        }
    }

    //Excluded Moods

    temp_filter = []

    for (t of moodList){
        tempID = t+"ExcludeMoodBox"
        if (document.getElementById(tempID).checked == true){
            temp_filter.push(t)
        }
    }

    temp_books2= temp_books
    temp_books = []
    for (b of temp_books2){
        keep = true
        for (t of temp_filter){
            keep = keep && !(b.mood.includes(t)) 
        }
        if (keep==true){
            temp_books.push(b)
        }
    }
    //Excluded Tags

    temp_filter = []

    for (t of tagList){
        tempID = t+"ExcludeTagsBox"
        if (document.getElementById(tempID).checked == true){
            temp_filter.push(t)
        }
    }

    temp_books2= temp_books
    temp_books = []
    for (b of temp_books2){
        keep = true
        for (t of temp_filter){
            keep = keep && !(b.tags.includes(t)) 
        }
        if (keep==true){
            temp_books.push(b)
        }
    }

    temp_books.sort(higherRating) //sort by rating

    return temp_books
}

function newTitle(){
    //Creates a nicely formatted string of all the works that fit the user's criteria, and displays it in index.html

    title_list =chooseTitles()

    title_string = ""

    if (title_list.length ==0){
        title_string += "<br>No results, sorry!"
    } else{

        for (t of title_list){
            title_string +="<br><br>"+formatTitle(t)
        }
    }

    document.getElementById('titleDisplay').innerHTML = title_string
}

// Functions used by "Add new work"

function addWork(){
    //Create the html to add a work

    form_string = ""
    form_string+= "Title: <input id='title'>"
    form_string+= "<br>Rating: <input id='rating'>"
    form_string+= nameSection("Link")
    form_string+= radioSection("Link", short_siteList)
    form_string+= "<br>Other (Link): <input id='siteOther'>"
    form_string+= "<br>Post: <input id='notes'>"
    form_string += '<br><div><button type="button" class="btn btn-info" onclick = "addTitle()">Submit</button></div><br>'
    form_string+= nameSection("Media")
    form_string+= radioSection("Media", mediaList)
    form_string+= nameSection("Mood")
    form_string+= checkSection("Mood", moodList)
    form_string+= nameSection("Tags")
    form_string+= checkSection("Tags", tagList)
    document.getElementById('choiceDisplay').innerHTML = form_string
}

function addChecked(choice_name, choice_list){
    //make a string of a list of all the elements of choice_list which gave been checked 
    title_string="["
    
    for (m of choice_list){
        tempID = m+choice_name+"Box"
        checkM = document.getElementById(tempID)
        if (checkM.checked == true){
            title_string +="'"+m +"', "
        }
    }

    title_string += "],"
    return title_string

}

function addRadioed(choice_name, choice_list){
    //make a string of the first element of choice_list which has been checked 
    
    for (m of choice_list){
        tempID = m+choice_name+"Box"
        checkM = document.getElementById(tempID)
        if (checkM.checked == true){
            return "'"+m +"', "
        }
    }
    return "'',"

}

function addLink(){
    //Create a string for the "link" section for a newly added work
    
    for (s of siteList){
        tempID = s[0]+"LinkBox"
        checkM = document.getElementById(tempID)
        if (checkM.checked == true){
            return "['"+s[0]+"','"+s[1]+"']," // User selected an existing site checkbox
        }
    }
    // User did not select an existing site checkbox
    return "['Other','"+document.getElementById('siteOther').value+"'],"

}

function addTitle(){
    //Creates the title description string for an added work

    title_string = "<pre>{<br>    title: '"+ document.getElementById('title').value+"',"
    r = document.getElementById('rating').value
    if (r==''){ r=2}
    title_string += "<br>    Rating: "+ r+","
    title_string += "<br>    link: "+addLink()
    title_string += "<br>    media: " + addRadioed("Media", mediaList)
    title_string += "<br>    mood: "+ addChecked("Mood", moodList)
    title_string += "<br>    tags: "+ addChecked("Tags", tagList)
    title_string += "<br>    notes: '"+ document.getElementById('notes').value+"',"
    title_string += "<br>},</pre>"

    document.getElementById('titleDisplay').innerHTML = title_string

}

///// WHAT TO PLAY code


// the lists of possible values for the link, mood, tags etc

var gameplayListGame= ["sandbox","crafting", "survival", "farming", 'simulation', "exploration","visual novel", "point and click", "puzzle", "hidden object", "combat","rpg", "platformer"]

var genreList = ['word game',"logic", "narrative", "romance", "comedy","slice of life", "action", "adventure", "mystery", "horror","fantasy", "science fiction","historical"]

var moodListGame= ["happy", "sad","dark","bittersweet", "mysterious","cute","gentle"]

var issuesList= ['cheesy',"death",'violence',"scary","non-consent",'sex/nudity', "problematic","dexterity/timing","difficult","unplayed",'gacha']

var tagListGame = ['designer',"beautiful", "low plot", 'short','m/f',"f/f","m/m","non-binary", 'binary trans','aromantic/asexual',"polyamory", "queer","female protag","gender choice", "free","rj bundle"]

var siteListGame = ["Steam", "GOG", "Itchio", "Other"]

var platformListGame = ["Mac","Windows","Linux","Switch","Playstation","Xbox",'iOS',"Android","Browser"]

var typesListGame = [
    ["Gameplay",gameplayListGame],
    ["Platform",platformListGame], 
    ["Genre",genreList],
    ["Mood",moodListGame],
    ["Issues",issuesList],
    ["Tags",tagListGame],
]

//// FUNCTIONS

// Functions used by "Choose New Work"

function makeChoicesGame(){
    //Create the html for the "Choose New Work" choices

    form_string = ""

    form_string += "<h3  >What do you want?</h3>" 
    for (t of typesListGame){
        form_string+= nameSection(t[0])
        form_string+= checkSectionStyled(t[0], t[1],"btn-success")

    }

    form_string += "<hr><h3>What <i>don't</i> you want?</h3>" 

    for (t of typesListGame){
        if (t[0]!="Platform"){
            form_string+= nameSection("EXCLUDE "+ t[0])
            form_string+= checkSectionStyled("Exclude"+t[0], t[1],"btn-danger")
        }
    }

    
    form_string +='<hr><button type="button" class="btn btn-info" onclick = "newTitleGame()">Get recs!</button>' 
    document.getElementById('choiceDisplay').innerHTML = form_string
}

function formatTitleGame(t){
    //return a nicely formatted string for a given work
    title_string = "<h4>" +t.Title + "</h4><b>Rating</b>: "+ t.Rating
    if (t.Review !=""){
        title_string+="<br><b>Review</b>: " +t.Review 
    }  

    if (t.Link!=[]){
        title_string+="<br><b>Links</b>: "
        for (l of t.Link){
            if (l[1].charAt(0)=="h"){
                title_string+="<a href='"+l[1]+"'>" +l[0] +"</a> "
            } else{
                title_string+=l[0]+" "
            }
            
    
        }
    }

    for (l of typesListGame){
        temp=t[l[0]].join(", ") 
        if (temp!=""){ 
            title_string+="<br><b>"+l[0]+ "</b>: "+temp
        }
        
    }
    
    if (t.Post !=""){
        title_string+="<br><a href='"+t.Post+"'>Post</a> "
    }  
    return title_string
}

function findTitlesGame(name, XList, temp_games){
    //filter all games from temp_games that don't match Xlist, of type name

    games = temp_games    
    Xbox = name+"Box"
    temp_filter = []

    for (t of XList){
        tempID = t+Xbox
        if (document.getElementById(tempID).checked == true){
            temp_filter.push(t)
        }
    }

    temp_games2= temp_games
    games = []
    for (b of temp_games2){
        keep = true
        for (t of temp_filter){
            keep = keep && (b[name].includes(t)) 
        }
        if (keep==true){
            games.push(b)
        }
    }

    return games
}

function excludeTitlesGame(name, XList, temp_games){
    //filter out all games from temp_games that match Xlist, of type name
    
    Xbox = name+"Box"
    
    temp_filter = []

    for (t of XList){ //create a list of every checked box
        tempID = t+"Exclude"+ Xbox
        if (document.getElementById(tempID).checked == true){
            temp_filter.push(t)
        }
    }
    games = []
    for (b of temp_games){ 
        keep = true
        for (t of temp_filter){
            keep = keep && !(b[name].includes(t)) 
        }
        if (keep==true){
            games.push(b)
        }
    }
    return games
}

function chooseTitlesGame(){
    //return the list of titles matching the criteria chosen by the user, in descending order of rating

    temp_games=gameshelf
    for (t of typesListGame){
        temp_games = findTitlesGame(t[0], t[1], temp_games)
    }

    for (t of [
    ["Gameplay",gameplayListGame],
    ["Genre",genreList],
    ["Mood",moodListGame],
    ["Issues",issuesList],
    ["Tags",tagListGame]]){
        temp_games = excludeTitlesGame(t[0], t[1], temp_games)
    }

    temp_games.sort(higherRating) //sort by rating

    return temp_games
}

function newTitleGame(){
    //Creates a nicely formatted string of all the works that fit the user's criteria, and displays it in index.html

    title_list =chooseTitlesGame()

    title_string = "<h3>Game recs</h3>"

    if (title_list.length ==0){
        title_string += "<br>No results, sorry!"
    } else{

        for (t of title_list){
            title_string +="<br><br>"+formatTitleGame(t)
        }
    }

    document.getElementById('titleDisplay').innerHTML = title_string
}

// Functions used by "Add new work"

function addGame(){
    //Create the html to add a work

    form_string = ""
    form_string+= "Title: <input id='title'>"
    form_string+= "<br>Rating: <input id='rating'>"
    form_string+= "<br>Review: <input id='review'>"
    form_string+= "<br>Post: <input id='post'>"
    form_string+= nameSection("Links")
    for (s of siteListGame){
        tempID=s
        form_string+= "<br>"+ s+": <input id='"+tempID+"'>"
    }
    for (t of typesListGame){
        form_string+= nameSection(t[0])
        form_string+= radioSection(t[0], t[1])
    }
    form_string += "<br><div><button onclick = 'addTitleGame()'>Submit</button></div><br>"
    document.getElementById('choiceDisplay').innerHTML = form_string
}

function addLinkGame(){
    //Create a string for the "link" section for a newly added work
    t="["
    
    for (s of siteListGame){
        temp = document.getElementById(s).value
        if (temp !=""){
            t+= "['"+s+"','"+temp+"'],"
        }
    }
    return t+"],"

}

function addTitleGame(){
    //Creates the title description string for an added work

    title_string = "<pre>{<br>    Title: '"+ sanitiseText(document.getElementById('title').value)+"',"
    r = document.getElementById('rating').value
    if (r==''){ r=2}
    title_string += "<br>    Review: '"+ sanitiseText(document.getElementById('review').value)+"',"
    title_string += "<br>    Post: '"+ sanitiseText(document.getElementById('post').value)+"',"
    title_string += "<br>    Rating: "+ r+","
    title_string += "<br>    Link: "+addLinkGame()
    for (t of typesListGame){
        title_string += "<br>    "+t[0]+": " + addChecked(t[0], t[1])
    }
    
    title_string += "<br>},</pre>"

    document.getElementById('titleDisplay').innerHTML = title_string

}



