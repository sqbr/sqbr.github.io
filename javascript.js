///// General functions

//I never used this but it could come in handy
function randomElement(l){
    // returns a random element of the array l 
    var randomNumber = Math.floor(Math.random()*(l.length));
    return l[randomNumber]

}

function nameSection(choice_name){
    //string of html to nicely display the string choice_name, where choice_name is one of "Media", "Mood" etc
    return "<br><b>"+choice_name+":</b> "
}

function formatLine(title,tag){
    //formatted line for displaying the value of tag within title
    if (title[tag] ==""){
        return ""
    } else{
        return nameSection(tag)+ title[tag]

    }
}

function sanitiseText(t){
    return t.replace(/'/g,"&#92;'")
 }

 function createOutputLine(name){
    return "<br>    " + name + ": '" + sanitiseText(document.getElementById(name).value) + "',"
}

function prettyButton(style, id, name){
    //make a pretty button 
    return '<div class="btn-group-toggle" data-toggle="buttons"><label class="btn '+ style+ '"><input type="checkbox" id='+ id+'></input>'+name+'</label></div>'
}

function checkSectionStyled(choice_name, choice_list, choice_style){
    //string of html for a nicely formatted grid of check boxes based on choice_list, of type choice_name, in style choice_style
    // eg checkSectionStyled("Media"", mediaList, "btn-success") creates a grid of checkboxes labelled "fanfic", "comic/manga" etc in green
    // "btn-success" = green, "btn-danger" = red
    form_string ="<br><div class='grid-container'>"
    for (i = 0; i < choice_list.length; i++) {
        c=choice_list[i]
        tempID= "'"+c+choice_name+"Box'"
        form_string+= '<div class="grid-item">' + prettyButton(choice_style, tempID, c) + '</div>'
    }
    form_string+="</div>"  
    return form_string
}

function findTitles(name, XList, current_list){
    //filter all games from current_list that don't match Xlist, of type name

    Xbox = name+"Box"
    temp_filter = []

    for (t of XList){
        tempID = t+Xbox
        if (document.getElementById(tempID).checked == true){
            temp_filter.push(t)
        }
    }

    new_list = []
    for (b of current_list){
        keep = true
        for (t of temp_filter){
            keep = keep && (b[name].includes(t)) 
        }
        if (keep==true){
            new_list.push(b)
        }
    }

    return new_list
}


function excludeTitles(name, XList, current_list){
    //filter out all games from current_list that match Xlist, of type name
    
    Xbox = name+"Box"
    
    temp_filter = []

    for (t of XList){ //create a list of every checked box
        tempID = t+"Exclude"+ Xbox
        if (document.getElementById(tempID).checked == true){
            temp_filter.push(t)
        }
    }
    new_list = []
    for (b of current_list){ 
        keep = true
        for (t of temp_filter){
            keep = keep && !(b[name].includes(t)) 
        }
        if (keep==true){
            new_list.push(b)
        }
    }
    return new_list
}

function addAnyRow(content1, content2){
    //create row for database, with 2 columns containing content1 and content2
    s= '<div class="row"><div class="col-1">'
    s+= content1
    s+= '</div><div class="col-11">'
    s+= content2
    s+= '</div></div>'
    return s

}

function addInputRow(name){
    //create row for database for text input of type 'name'
    return addAnyRow(name + ':', '<input id="'+ name + '">')
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

var moodList = ["happy",'fluff', "sad","scary","dark","bittersweet", "mysterious","cute","gentle"]

var mediaList= ["podcast", "fanfic", "comic/manga", "book", "movie", "tv: cartoon", "tv: anime", "tv: liveaction", "game: Visual Novel", "game: exploration", "game: puzzle", "game: fighting", "other"]

var tagList = ["beautiful", "childrens","low plot", 'short',"cheesy","f/f","m/m","nb", "polyamory", "female protag","rewatch","unseen","to buy","subtitled live", 'finish it']

var genreList = ["romance", "comedy","slice of life", "action", "adventure", "mystery", "horror","speculative", "non-fiction",'collection']

var typesList = [
    ["Media",mediaList],
    ["Mood",moodList],
    ["Genre",genreList],
    ["Tags",tagList],
]

//// FUNCTIONS

// Functions used by "Choose New Work"

function makeChoices(){
    //Create the html for the "Choose New Work" choices

    form_string = ""
    form_string += "<h3  >What do you want?</h3>" 
    for (t of typesList){
        form_string+= nameSection(t[0])
        form_string+= checkSectionStyled(t[0], t[1],"btn-success")

    }

    form_string += "<hr><h3>What <i>don't</i> you want?</h3>" 

    for (t of typesList){
        if (t[0]!="Platform"){
            form_string+= nameSection("EXCLUDE "+ t[0])
            form_string+= checkSectionStyled("Exclude"+t[0], t[1],"btn-danger")
        }
    }
    form_string += '<hr><button type="button" class="btn btn-info" onclick = "newTitle()">Submit</button>'
    document.getElementById('choiceDisplay').innerHTML = form_string
}

function formatTitle(t){
    //return a nicely formatted string for a given work
    title_string = "<h4>" +t.Title + "</h4>"

    if (t.Link[0] =="Other"){
        if (t.Link[1] !=""){
            title_string+="<b>Link</b>: "
            title_string+="<a href=\""+t.Link[1]+"\">" +t.Link[1] +"</a>"
        }
    }else{
        title_string+="<b>Link</b>: "
        title_string+="<a href='"+t.Link[1]+"'>" +t.Link[0] +"</a>"
    }
    title_string += formatLine(t,"Rating")
    title_string += formatLine(t,"Media")
    title_string += formatLine(t,"Mood")
    title_string+=nameSection("Tags") +t.Tags.join(", ")
    
    title_string += formatLine(t,"Notes")
    return title_string
}



// Used to sort the works in descending order of rating
function higherRating(a,b){
    return (b.Rating - a.Rating)
}

function chooseTitles(){
    //return the list of titles matching the criteria chosen by the user, in descending order of rating

    current_list=bookshelf

    for (t of typesList){
        current_list = findTitles(t[0], t[1], current_list)
    }

    for (t of typesList){
        current_list = excludeTitles(t[0], t[1], current_list)
    }

    current_list.sort(higherRating) //sort by rating

    return current_list
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

    //Create the html to add a work

    form_string = ""
    form_string +='<div class="container">'
    form_string += addInputRow("Title")
    form_string += addInputRow("Rating")
    form_string += addInputRow("Notes")
    form_string +='</div>'

    form_string+= nameSection("Link")
    form_string+= checkSectionStyled("", short_siteList,"btn-success")
    form_string+= "<br>"
    form_string +='<div class="container">'
    form_string += addInputRow("Other")
    form_string +='</div>'

    for (t of typesList){
        form_string+= nameSection(t[0])
        form_string+= checkSectionStyled(t[0], t[1],"btn-success")
    }
    form_string += '<br><div><button type="button" class="btn btn-info" onclick = "addTitle()">Submit</button></div><br>'

    document.getElementById('choiceDisplay').innerHTML = form_string
}


function addLink(){
    //Create a string for the "link" section for a newly added work
    
    for (s of siteList){
        tempID = s[0]+"Box"
        checkM = document.getElementById(tempID)
        if (checkM.checked == true){
            return "['"+s[0]+"','"+s[1]+"']," // User selected an existing site checkbox
        }
    }
    // User did not select an existing site checkbox
    
    return "['Other','"+document.getElementById("Other").value+"']," 

}

function addTitle(){
    //Creates the title description string for an added work

    title_string = "<pre>{"
    
    title_string += createOutputLine("Title")
    r = document.getElementById('Rating').value
    if (r==''){ r=2}
    title_string += "<br>    Rating: "+ r+","

    title_string += "<br>    Link: "+addLink()
    for (t of typesList){
        title_string += "<br>    "+t[0]+": " + addChecked(t[0], t[1])
    }
    title_string += createOutputLine('Notes')
    title_string += "<br>},</pre>"

    document.getElementById('titleDisplay').innerHTML = title_string

}

///// WHAT TO PLAY code


// the lists of possible values for the link, mood, tags etc

var gameplayListGame= ["sandbox","crafting", "survival", "farming", 'simulation', "exploration","visual novel", "point and click", "puzzle", "hidden object", "combat","rpg", "platformer"]

var genreListGames = ['word game',"logic", "narrative", "romance", "comedy","slice of life", "action", "adventure", "mystery", "horror","fantasy", "science fiction","historical"]

var moodListGame= ["happy", "sad","dark","bittersweet", "mysterious","cute","gentle"]

var issuesList= ['cheesy',"death",'violence',"scary","non-consent",'sex/nudity', "problematic","dexterity/timing","difficult","unplayed",'gacha']

var tagListGame = ['designer',"beautiful", "low plot", 'short','m/f',"f/f","m/m","non-binary", 'binary trans','aromantic/asexual',"polyamory", "queer","female protag","gender choice", "free","rj bundle"]

var siteListGame = ["Steam", "GOG", "Itchio", "Other"]

var platformListGame = ["Mac","Windows","Linux","Switch","Playstation","Xbox",'iOS',"Android","Browser"]

var typesListGame = [
    ["Gameplay",gameplayListGame],
    ["Platform",platformListGame], 
    ["Genre",genreListGames],
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
    title_string+=formatLine(t,"Review")

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
        title_string+=nameSection("Post")+ '<a href="'+ t.Post +'">'+ t.Post + '</a>'
    }
    return title_string
}

function chooseTitlesGame(){
    //return the list of titles matching the criteria chosen by the user, in descending order of rating

    temp_games=gameshelf
    for (t of typesListGame){
        temp_games = findTitles(t[0], t[1], temp_games)
    }

    for (t of [
    ["Gameplay",gameplayListGame],
    ["Genre",genreListGames],
    ["Mood",moodListGame],
    ["Issues",issuesList],
    ["Tags",tagListGame]]){
        temp_games = excludeTitles(t[0], t[1], temp_games)
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
    form_string +='<div class="container-sm">'
    form_string += addInputRow("Title")
    form_string += addInputRow("Rating")
    form_string += addInputRow("Review")
    form_string += addInputRow("Post")
    form_string +='</div>'

    form_string+= nameSection("Links")
    form_string +='<div class="container-sm">'
    for (s of siteListGame){
        tempID=s
        form_string += addInputRow(s)
    }
    form_string +='</div>'

    for (t of typesListGame){
        form_string+= nameSection(t[0])
        form_string+= checkSectionStyled(t[0], t[1],"btn-success")
    }
    form_string += '<br><div><button type="button" class="btn btn-info" onclick  = "addTitleGame()">Submit</button></div><br>'
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

    title_string = "<pre>{"
    
    title_string += createOutputLine("Title")
    r = document.getElementById('Rating').value
    if (r==''){ r=2}
    title_string += createOutputLine("Review")
    title_string += createOutputLine("Post")
    title_string += "<br>    Rating: "+ r+","
    title_string += "<br>    Link: "+addLinkGame()
    
    for (t of typesListGame){
        title_string += "<br>    "+t[0]+": " + addChecked(t[0], t[1])
    }
    
    title_string += "<br>},</pre>"

    document.getElementById('titleDisplay').innerHTML = title_string

}



