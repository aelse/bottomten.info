var rdtCmts = {
  receiveComments : function(data){
    id = data[0].data.children[0].data.name.substr(3);
    html = $('<div class="rdtCmts"/>');
    html.append(rdtCmts.renderComments(data[1].data));
    html.append('<a class="rdtCmtsJoin" href="http://www.reddit.com/comments/'+id+'">Join the discussion at reddit.com!</a>');
    $("[data-rdtid='"+id+"']").html(html);
  },
  renderComments : function(data){
    var ul = $("<ul/>");
    for(var i in data.children){
      ul.append(rdtCmts.renderComment(data.children[i].data));
    }
    return ul;
  },
  renderComment : function(data){
    var li = $("<li/>");
    li.append($('<small class="rdtCmtsMeta"><a class="rdtCmtsAuthor" href="http://reddit.com/u/'+data.author+'">'+data.author+'</a> '+ (data.ups - data.downs) +' points</small>'));
    li.append($('<p class="rdtCmtsBody"/>').html(data.body_html).text());
    if(data.replies && data.replies !== "") li.append(rdtCmts.renderComments(data.replies.data));
    return li;
  }
};

var rdtPosts = {
  receivePosts : function(data){
    console.log('receivePosts callback');
    subreddit = data.data.children[0].data.subreddit;
    console.log(subreddit);
    html = $('<div class="rdtPosts"/>');
    html.append('<h2>Latest posts from /r/'+subreddit+'</h2>');
    html.append(rdtPosts.renderPosts(data.data));
    html.append('<a class="rdtPostsJoin" href="http://www.reddit.com/r/'+subreddit+'">Join the discussion at reddit.com!</a>');
    $("[data-rdtsubreddit='"+subreddit+"']").html(html);
  },
  renderPosts : function(data){
    var ul = $("<ul/>");
    for(var i in data.children){
      // hack
      if(i > 10) break;
      ul.append(rdtPosts.renderPost(data.children[i].data));
    }
    return ul;
  },
  renderPost : function(data){
    var li = $("<li/>");
    li.append($('<small class="rdtPostsMeta"><a class="rdtPostsAuthor" href="http://reddit.com/u/'+data.author+'">'+data.author+'</a> '+ (data.ups - data.downs) +' points</small>'));
    //li.append($('<small class="rdtPostsMeta"><a class="rdtPostsTitle" href="http://reddit.com/'+data.permalink+'">'+data.title+'</a> '+ (data.ups - data.downs) +' points, posted by <a class="rdtPostsAuthor" href="http://reddit.com/u/'+data.author+'">'+data.author+'</a></small>'));
    li.append($('<p class="rdtPostsBody"/>').html(data.title));
    if(data.replies && data.replies !== "") li.append(rdtPosts.renderComments(data.replies.data));
    return li;
  }
};
$.fn.rdtcmts = function(id) {
  this.attr("data-rdtid", id);
  $.ajax({
    url: "http://www.reddit.com/comments/"+id+"/.json",
    dataType: "jsonp",
    jsonp : "jsonp",
    jsonpCallback: "rdtCmts.receiveComments"
  });
};

$.fn.rdtposts = function(subreddit) {
  this.attr("data-rdtsubreddit", subreddit);
  this.html('<div class="rdtPosts"><h2>Loading posts from /r/'+subreddit+' ...</h2></div>');
  $.ajax({
    url: "http://www.reddit.com/r/"+subreddit+"/.json?sort=new",
    dataType: "jsonp",
    jsonp : "jsonp",
    jsonpCallback: "rdtPosts.receivePosts"
  });
};

/*

Sample Usage
------------

$(function(){
$("#comments").rdtcmts("1jblag");
});

*/
