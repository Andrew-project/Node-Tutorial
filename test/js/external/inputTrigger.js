/**
 * Created by lixu on 16/10/12.
 */
//表单触发
$('.triggerInputWarp').on('click','.triggerInput' ,function(){
    console.log('triggerInput');
    $(this).find('input').focus();
    console.log( '$(this).find(nput)');
    console.log( $(this).find('input'));
});
