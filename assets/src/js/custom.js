$(document).ready(function() {
    $('.po-social__rocket').hide();

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.po-social__rocket').show(500);
        } else {
            $('.po-social__rocket').hide(100);
        }
    });
    $('.po-social__rocket').on('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
    });
});

$.getJSON('data/data.json', function(data) {
    $.each(data, function(i, items) {
        $('.po-head').attr("id", items.empId);
        $('.po-head__main-heading').html(items.designation);
        $('.po-head__main-company').html(items.company);
        $('.po-head__main-email').html(items.email);
        $('.po-hero__name').html(items.username);
        $('.po-hero__desc').html(items.description);
        $('.po-head__main-dp-image').attr("src", items.dp);
        $.each(items.technologyList, function(a, b) {
            $('.po-tech__main').append('<li class="po-tech__main-item ' + b.srName + '"><h3>' + b.projectName + '</h3><p>' + b.projectCount + ' Projects</p></li>');
        });
        $.each(items.otherTechnologyList, function(a, b) {
            $('.po-other__main').append('<li class="po-other__main-item">' + b.name + '</li>');
        });
        $.each(items.hireList, function(a, b) {
            $('.po-hire__main').append('<li class="po-hire__main-item">' + b.quality + '</li>');
        });
        $.each(items.shareList, function(a, b) {
            $('.po-social__main').append('<a href="'+b.link+'" class="po-social__main-item" target="_blank"><img src="'+b.src+'" alt="'+b.alt+'"></a>');
        });
    });
});