/**
 * Created by dongsj on 2016/10/11.
 */
function resizeTextarea(a,row){
    var agt = navigator.userAgent.toLowerCase();
    var is_op = (agt.indexOf("opera") != -1);
    var is_ie = (agt.indexOf("msie") != -1) && document.all && !is_op;
    if(!a){return;}
    if(!row)
        row=1;
    var b=a.value.split("\n");
    var c=is_ie?1:0;
    c+=b.length;
    var d=a.cols;
    if(d<=20){d=40;}
    for(var e=0;e<b.length;e++){
        if(b[e].length>=d){
            c+=Math.ceil(b[e].length/d);
        }
    }
    c=Math.max(c,row)+1;
    console.log(c);
    if(c!=a.rows){
        a.rows=c-1;
    }
}