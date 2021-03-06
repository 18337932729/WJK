var curPage = 1; //当前页码
var total,pageSize,totalPage;
//获取数据
function getData(page){
    $.ajax({
        type: 'POST',
        url: 'page.php',
        data: {'pageNum':page-1},
        dataType:'json',
        beforeSend:function(){
            $("#tablelist ").append("<h3>loading...</h3>");
        },
        success:function(json){
            $("#tablelist").empty();
            total = json.total; //总记录数
            pageSize = json.pageSize; //每页显示条数
            curPage = page; //当前页
            totalPage = json.totalPage; //总页数
            var table_html = "";
            table_html += "<table class=\"table table-hover\"><tr><th width=\"*\">新闻标题</th><th width=\"100\">发布者</th><th width=\"190\">发布日期</th><th width=\"100\">操作</th></tr>";
            var list = json.list;
            $.each(list,function(index,array){ //遍历json数据列
                if(array['title'].length > 28){
                 var title_sub = array['title'].substring(0,20); // 获取子字符串。
                }
                else var title_sub = array['title'];
                table_html += "<tr><td>"+title_sub+"</td><td>admin</td><td>"+array['date']+"</td><td><a class=\"button border-blue button-little\" href=\"#\">修改</a> <a class=\"button border-yellow button-little\" href=\"#\" onclick=\"{if(confirm('确认删除?')){window.location.href='delete_news.php?news_id="+array['id']+"';}else return false;}\">删除</a></td><tr>";            
            });
            table_html += "</table>";
            $("#tablelist").append(table_html);
        },
        complete:function(){ //生成分页条
            getPageBar();
        },
        error:function(){
            alert("数据加载失败");
        }
    });
}

//获取分页条
function getPageBar(){
    //页码大于最大页数
    if(curPage>totalPage) curPage=totalPage;
    //页码小于1
    if(curPage<1) curPage=1;
    pageStr = "<span class=\"button_span_page gray\">共"+total+"条"+curPage+"/"+totalPage+"</span>";

    //如果是第一页
    if(curPage==1){
        pageStr += "<span class=\"button_span blue\">首页</span><span class=\"button_span blue\">上一页</span>";
    }else{
        pageStr += "<span class=\"button_span green\"><a href='javascript:void(0)' rel='1'>首页</a></span><span class=\"button_span green\"><a href='javascript:void(0)' rel='"+(curPage-1)+"'>上一页</a></span>";
    }

    //如果是最后页
    if(curPage>=totalPage){
        pageStr += "<span class=\"button_span blue\">下一页</span><span class=\"button_span blue\">尾页</span>";
    }else{
        pageStr += "<span class=\"button_span green\"><a href='javascript:void(0)' rel='"+(parseInt(curPage)+1)+"'>下一页</a>&nbsp;</span><span class=\"button_span green\"><a href='javascript:void(0)' rel='"+totalPage+"'>尾页</a></span>";
    }

    $("#pagecount").html(pageStr);
}

$(function(){
    getData(1);
    $("#pagecount span a").live('click',function(){
        var rel = $(this).attr("rel");
        if(rel){
            getData(rel);
        }
    });
}); 