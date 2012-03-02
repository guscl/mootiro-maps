#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default
from django.conf.urls.defaults import patterns, url
from komoo_resource.views import Edit


urlpatterns = patterns('komoo_resource.views',
    url(r'^$', 'index', name='resource_index'),
    url(r'^edit/?$', Edit.as_view(), name='resource_edit'),
)
