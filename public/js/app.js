$("#btn-scrape").on('click', function () {
    $.getJSON("/scrape", function (data) {
        if (!data) {
            alert("error");
        } else {
            $('#myModal').modal('show');
            $("#scrape-info").html(data.length+ ' Articles Scraped');
            afterScrape(data);
            
        }
    })
})

function afterScrape(data) {
    $('#scraped-items').empty();
    for (var index = 0; index < data.length; index++) {
        newDiv = $('<div>');
        newDiv.html('<div class="container-fluid article-container"><div class="panel panel-default"><div class="panel-heading"><h3><a class="article-link" target="_blank" href="'+data[index].link+'" >'+data[index].title+'</a><button class="btn btn-success save btn-save-article"  data-link="'+data[index].link+'" data-title="'+data[index].title+'" data-summary="'+data[index].summary+'">Save Article</button></h3></div><div class="panel-body">'+data[index].summary+'</div></div></div>');
        // newDiv.html('<div class="container btnfont"><div class="row"><div class="col-lg-12"><div class="panel panel-default"><div class="panel-heading"><div class="row"><div class="col-md-10">'+data[index].title+'</div><div class="col-md-2"> <button type="button" class="btn btn-primary btn-save-article " id="" data-link="'+data[index].link+'" data-title="'+data[index].title+'">SAVE ARTICLE</button></div><div class="col-md-2"></div></div></div><div class="panel-body" id="showList">'+data[index].link +'</div></div></div></div>');
        $('#scraped-items').append(newDiv);
    
    }
}

$(document).on('click','.btn-save-article', function () {

$.ajax({

    // method: "GET",
    // url: "/articles/" + thisId
    type: "POST",
    url: "/articles/",
    data: {
        link: $(this).attr('data-link'),
        title: $(this).attr('data-title'),
        summary: $(this).attr('data-summary')
    },
    success: function(d) {
        alert('Saved');
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //Something bad happened
        alert("Error");
    }
});
    // alert("link: "+link +" title: "+title);
});

$('#show-saved').on('click', function (e) {
    e.preventDefault();
    showSaved();

});

$(document).on('click','.btn-delete-article', function (e) {
    e.preventDefault();
    var id= $(this).attr('data-id');
    $.get("/delete/"+id, function (data) {
        if(data){
            showSaved();
        }
});
});

function showSaved() {
    
    $.get("/articles", function (data) {
        if (data.length>0) {
            $('#scraped-items').empty();
            for (var index = 0; index < data.length; index++) {
                var newDiv = $('<div>');
                newDiv.html('<div class="panel panel-default"><div class="panel-heading"><h3><a class="article-link" target="_blank" href="'+data[index].link+'">'+data[index].title+'</a><a class="btn btn-danger delete btn-delete-article" id="" data-id ="'+data[index]._id+'">Delete From Saved</a><a class="btn btn-info notes btn-save-note"  id="" data-id ="'+data[index]._id+'">Article Notes</a></h3></div><div class="panel-body">'+data[index].summary+'</div></div>');
                // newDiv.html('<div class="container btnfont"><div class="row"><div class="col-lg-12"><div class="panel panel-default"><div class="panel-heading"><div class="row"><div class="col-md-8">'+data[index].title+'</div><div class="col-md-2"> <button type="button" class="btn btn-primary btn-save-article " id="" data-id ="'+data[index]._id+'">SAVE ARTICLE</button></div><div class="col-md-1"> <button type="button" class="btn btn-danger btn-delete-article " id="" data-id ="'+data[index]._id+'">DELETE ARTICLE</button></div><div class="col-md-2"></div></div></div><div class="panel-body" id="showList">'+data[index].link +'</div></div></div></div>');
                $('#scraped-items').append(newDiv);
                
            }
        } else {
            //no records found
            $('#scraped-items').empty();
            var newDiv = $('<div>');
            newDiv.html('<div class="panel panel-default"><div class="panel-heading"><h3> No Articles Available.</h3></div><div class="panel-body"></div></div>');
            $('#scraped-items').append(newDiv);
        }
        
    });


}
$(document).on('click', '.btn-save-note', function () {
    var id = $(this).attr('data-id');
    showNoteModal(id);
});
function showNoteModal(id) {

    $('#myModal2').modal('show');
    
    $("#article-id").text('NOTE FOR ARTICLE ID: '+id);
    $('#save-note').attr('value', id);
    $.get("/notes/"+id, function (data) {
        console.log(data);
    if(data){
        $("#haveNote").html(data.body+'<a class="btn btn-danger delete btn-delete-note" id="" data-id ="'+data.noteid+'">X</a>');
        $("#noteType").text("Update this Note");
    }
    else{
        $("#haveNote").text('YOU HAVE NO NOTE FOR THIS ARTICLE');
        $("#noteType").text("Add New Note");
    }
    })
}

$('#save-note').on('click', function (e) {
    e.preventDefault();
    var id =  $(this).attr('value');
    var note = $('#comment').val().trim();
    if (note==='') {
        console.log("empty");
    } else {
        console.log(note);
        $('#comment').val('');
        $.ajax({
                type: "POST",
                url: "/notes/",
                data: {
                    noteid: id,
                    body: note 
                   
                },
                success: function() {
                    alert('Note Added');
                     $('#myModal2').modal('hide');
                    
                    // showNoteModal(id);
                    // alert("Saved");
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    //Something bad happened
                    alert("Error Saving note");
                }
            })
}
})

$(document).on('click', '.btn-delete-note', function (e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
    $.get("/deletenote/"+id, function (isdelete) {
        if (isdelete) {
            showNoteModal(id);

        } else {
            
            alert('Error Deleting');
        }
        

})
})