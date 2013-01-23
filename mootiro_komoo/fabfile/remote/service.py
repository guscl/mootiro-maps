# -*- coding:utf-8 -*-
from fabric.api import *
from .base import remote_virtualenv
from fabric.colors import yellow


__all__ = ('up', 'down', 'restart')


def up():
    '''Start remote application server.'''
    # TODO: ensure supervisord is running!
    with remote_virtualenv():
        run('supervisorctl -c supervisor/supervisord.conf start {}' \
            .format(env.komoo_env))
    print yellow('Success, but it may take 1 minute to the server to go up.')


def down():
    '''Stop remote application server.'''
    # TODO: ensure supervisord is running!
    with remote_virtualenv():
        run('supervisorctl -c supervisor/supervisord.conf stop {}' \
            .format(env.komoo_env))


def restart():
    '''Restart remote application server.'''
    # TODO: ensure supervisord is running!
    with remote_virtualenv():
        run('supervisorctl -c supervisor/supervisord.conf restart {}' \
            .format(env.komoo_env))