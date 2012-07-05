# -*- coding: utf-8 -*-
from django.test import TestCase
from django.contrib.contenttypes.models import ContentType
from functools import wraps

from django.contrib.auth.models import User


A_POLYGON_GEOMETRY = '{"type":"GeometryCollection","geometries":[{"type":"Polygon","coordinates":[[[0,0],[1,1],[2,2],[0,0]]]}]}'


def logged_and_unlogged(test_method):
    @wraps(test_method)
    def test_wrapper(self):
        try:
            self.login_user()
            test_method(self)
        except AssertionError as err:
            err.args = (err.args[0] + "\n\nLogged run failed",) + err.args[1:]
            raise
        try:
            self.client.logout()
            test_method(self)
        except Exception as err:
            err.args = (err.args[0] + "\n\nUnlogged run failed",) + err.args[1:]
            raise
    return test_wrapper


class KomooTestCase(TestCase):

    fixtures = ['contenttypes_fixtures.json', 'users.json']

    @classmethod
    def setUpClass(cls):
        """Called before all tests of a class"""
        # In conjunction with contenttypes_fixtures.json the command below
        # fixes content types.
        ContentType.objects.all().delete()

    def login_user(self, username="tester"):
        """Logs a user in assuming its password is 'testpass'. The
        test_fixtures defines two users: 'tester' and 'noobzin'."""
        self.client.login(username=username, password="testpass")
        return User.objects.get(username=username)

    def _assert_status(self, url, status, ajax=False):
        params = {}
        if ajax:
            params['HTTP_X_REQUESTED_WITH'] = 'XMLHttpRequest'
        http_resp = self.client.get(url, **params)
        self.assertEqual(http_resp.status_code, status)
        return http_resp

    def assert_200(self, url, **kw):
        return self._assert_status(url, 200, **kw)

    def assert_404(self, url, **kw):
        return self._assert_status(url, 404, **kw)


class MainViewsTestCase(KomooTestCase):

    fixtures = KomooTestCase.fixtures + ['resources.json']

    def test_homepage_is_up(self):
        self.assert_200('/')

    def test_frontpage_is_up(self):
        self.assert_200('/frontpage')  # TODO: exchange url with the map

    def test_tags_filter(self):
        from komoo_resource.models import Resource
        from utils import filtered_query

        query_set = Resource.objects

        original_count = query_set.count()
        assert original_count > 0

        # Mock a request
        req = type('MockHttpRequest', (object,), {})

        # Test simple tag filtering with single result
        req.GET = {'filters': 'tags', 'tags': 'esporte'}
        new_query_set = filtered_query(query_set, req)
        self.assertEquals(new_query_set.count(), 1)

        # Test simple tag filtering with more than 1 result
        req.GET = {'filters': 'tags', 'tags': u'Educação'}
        new_query_set = filtered_query(query_set, req)
        self.assertEquals(new_query_set.count(), 2)

        # Test multiple (& clause) tag filtering
        req.GET = {'filters': 'tags', 'tags': u'Educação,leitura'}
        new_query_set = filtered_query(query_set, req)
        self.assertEquals(new_query_set.count(), 1)
        self.assertEquals(new_query_set[0].name, u'Biblioteca comunitária')
