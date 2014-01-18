if (fakewaffle === undefined) {
    var fakewaffle = {};
}

fakewaffle.responsiveTabs = function (collapseDisplayed) {
    "use strict";
    fakewaffle.currentPosition = 'tabs';

    var tabGroups = $('.nav-tabs.responsive'),
        hidden    = '',
        visible   = '';

    if (collapseDisplayed === undefined) {
        collapseDisplayed = ['phone', 'tablet'];
    }

    $.each(collapseDisplayed, function () {
        hidden  += ' hidden-' + this;
        visible += ' visible-' + this;
    });

    $.each(tabGroups, function () {
        var $tabGroup   = $(this),
            tabs        = $tabGroup.find('li a'),
            collapseDiv = $("<div></div>", {
                "class" : "accordion responsive" + visible,
                "id"    : 'collapse-' + $tabGroup.attr('id')
            });

        $.each(tabs, function () {
            var $this    = $(this),
                oldClass = $this.attr('class') === undefined ? '' : $this.attr('class'),
                newClass = 'accordion-toggle',
                active   = '';

            if (oldClass.length > 0) {
                newClass += ' ' + oldClass;
            };

            if ($this.parent().hasClass('active')) {
                active = ' in';
            }

            collapseDiv.append(
                $('<div>').attr('class', 'accordion-group').html(
                    $('<div>').attr('class', 'accordion-heading').html(
                        $('<a>', {
                            'class' : newClass,
                            'data-toggle': 'collapse',
                            'data-parent' : '#collapse-' + $tabGroup.attr('id'),
                            'href' : '#collapse-' + $this.attr('href').replace(/#/g, ''),
                            'html': $this.html()
                        })
                    )
                ).append(
                    $('<div>', {
                        'id' : 'collapse-' + $this.attr('href').replace(/#/g, ''),
                        'class' : 'accordion-body collapse' + active
                    }).html(
                        $('<div>').attr('class', 'accordion-inner').html('')
                    )
                )
            );
        });

        $tabGroup.next().after(collapseDiv);
        $tabGroup.addClass(hidden);
        $('.tab-content.responsive').addClass(hidden);
    });

    fakewaffle.checkResize();
    fakewaffle.bindTabToCollapse();
};

fakewaffle.checkResize = function () {
    "use strict";
    if ($(".accordion.responsive").is(":visible") === true && fakewaffle.currentPosition === 'tabs') {
        fakewaffle.toggleResponsiveTabContent();
        fakewaffle.currentPosition = 'panel';
    } else if ($(".accordion.responsive").is(":visible") === false && fakewaffle.currentPosition === 'panel') {
        fakewaffle.toggleResponsiveTabContent();
        fakewaffle.currentPosition = 'tabs';
    }

};

fakewaffle.toggleResponsiveTabContent = function () {
    "use strict";
    var tabGroups = $('.nav-tabs.responsive');

    $.each(tabGroups, function () {
        var tabs = $(this).find('li a');

        $.each(tabs, function () {
            var href         = $(this).attr('href').replace(/#/g, ''),
                tabId        = "#" + href,
                panelId      = "#collapse-" + href,
                tabContent   = $(tabId).html(),
                panelContent = $(panelId + " div:first-child").html();

            $(tabId).html(panelContent);
            $(panelId + " div:first-child").html(tabContent);
        });

    });
};

fakewaffle.bindTabToCollapse = function () {
    "use strict";
    var tabs     = $('.nav-tabs.responsive').find('li a'),
        collapse = $(".accordion.responsive").find('.accordion-body');

    tabs.on('shown', function (e) {
        var $current  = $($(e.target)[0].hash.replace(/#/, '#collapse-')),
            $previous = $($(e.relatedTarget)[0].hash.replace(/#/, '#collapse-'));

        if (!$current.hasClass('in')) {
            $current.addClass('in').height('auto');
            $previous.removeClass('in').height('0px');
        }
    });

    collapse.on('shown', function (e) {
        var current = $(e.target).context.id.replace(/collapse-/g, '#');

        console.log('collapse shown');
        $('a[href="' + current + '"]').tab('show');
    });
}

$(window).resize(function () {
    "use strict";
    fakewaffle.checkResize();
});
