$(document).ready(function(){
    console.log('Jquery ready');
    $('body').on('click', '#postmenu', function(){
        console.log('CLicked');
        var str =
            '<label>Title</label><input id="posttitle" class="form-control">' +
            '<label>Content</label><textarea id="postcontent" class="form-control"></textarea>' +
            '<button class="btn btn-primary" id="postbtn">Post</button>';
            $('.well').html(str);
    });
    $('body').on('click', '#postbtn', function(){
        var title = document.getElementById('posttitle').value;
        var content = document.getElementById('postcontent').value;
        console.log(title);
        console.log(content);
    });
});
