import {extend} from 'flarum/extend';
import app from 'flarum/app';
import GlobalSearchState from 'flarum/states/GlobalSearchState';
import DiscussionListState from 'flarum/states/DiscussionListState';
import IndexPage from 'flarum/components/IndexPage';
import LinkButton from 'flarum/components/LinkButton';

/* global m */

export default function () {
    app.routes.bookmarks = {
        path: '/bookmarks',
        component: IndexPage,
    };

    extend(IndexPage.prototype, 'navItems', function (items) {
        if (!app.session.user) {
            return;
        }

        items.add('bookmarks', LinkButton.component({
            href: app.route('bookmarks', app.search.stickyParams()),
            icon: 'fas fa-bookmark',
        }, app.translator.trans('clarkwinkelmann-bookmarks.forum.page.link')));
    });

    extend(IndexPage.prototype, 'setTitle', function () {
        if (app.current.get('routeName') === 'bookmarks') {
            app.setTitle(app.translator.trans('clarkwinkelmann-bookmarks.forum.page.title'));
        }
    });

    // This code differs from the Subscription extension because it fixes https://github.com/flarum/core/issues/2516
    extend(GlobalSearchState.prototype, 'params', function (params) {
        params.bookmarked = app.current.get('routeName') === 'bookmarks';
    })

    extend(DiscussionListState.prototype, 'requestParams', function (params) {
        if (this.params.bookmarked) {
            params.filter.q = (params.filter.q || '') + ' is:bookmarked';
        }
    });
}
