

$('.submit').on('click', function (e) {
    e.preventDefault();

    const form = $('.form');
    const what = form.find('[name="what"]');
    const where = form.find('[name="where"]');
    const to = form.find('[name="to"]');

    [what, where].forEach(field => {
        field.removeClass('input-error');
        if (field.val().trim() == "") {
            field.addClass('input-error');
        }
    });

    const errorFields = form.find('.input-error');

    if (errorFields.length == 0) {
        $.ajax({
            url: 'https://webdev-api.loftschool.com/sendmail',
            method: 'post',
            data: {
                what: what.val(),
                where: where.val(),
                to: to.val()
            }
        });

        $.fancybox.open({
            src: '#modal',
            type: 'inline'
        });
    }



    // $.fancybox.open({
    //     src: '#modal',
    //     type: 'inline'
    // });
});

// $('.js-submit-close').on('click', function (e) {
//     e.preventDefault();

//     $.fancybox.close();
// })