#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default
import logging

from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.forms import model_to_dict

from annoying.functions import get_object_or_None
from annoying.decorators import render_to
from ajaxforms import ajax_form

from community.models import Community
from need.models import Need
from proposal.models import Proposal
from proposal.forms import ProposalForm

logger = logging.getLogger(__name__)


def prepare_proposal_objects(community_slug="", need_slug="", proposal_number=""):
    """Retrieves a tuple (proposal, need, community). According to given
    parameters may raise an 404. Creates a new proposal if proposal_number is
    evaluated as false."""
    community = get_object_or_None(Community, slug=community_slug)
    filters = dict(slug=need_slug)
    if community:
        filters["community"] = community
    need = get_object_or_404(Need, **filters)
    if proposal_number:
        proposal = get_object_or_404(Proposal, number=proposal_number, need=need)
    else:
        proposal = Proposal(need=need)
    return proposal, need, community


# @render_to('proposal/edit.html')
# @login_required
# def edit(request, community_slug="", need_slug="", proposal_number=""):
#     logger.debug('acessing proposal > edit')
#     proposal, need, community = prepare_proposal_objects(community_slug,
#         need_slug, proposal_number)
#     if request.POST:
#         form = ProposalForm(request.POST, instance=proposal)
#         if form.is_valid():
#             proposal = form.save(commit=False)
#             if not proposal.id:  # was never saved
#                 proposal.creator = request.user
#             proposal.save()

#             kw = dict(need_slug=proposal.need.slug, proposal_number=proposal.number)
#             if proposal.need.community:
#                 kw["community_slug"] = proposal.need.community.slug
#             return redirect('view_proposal', **kw)
#         else:
#             return dict(form=form, need=need, community=community)
#     else:
#         return dict(form=ProposalForm(instance=proposal), community=community)


@login_required
@ajax_form('proposal/edit.html', ProposalForm)
def edit(request, community_slug="", need_slug="", proposal_number=""):
    logger.debug('acessing proposal > edit')
    proposal, need, community = prepare_proposal_objects(community_slug,
        need_slug, proposal_number)

    def on_get(request, form):
        return ProposalForm(instance=proposal)

    def on_before_validation(request, form):
        if form.instance:
            form.instance.need = proposal.need
            if proposal.number:
                form.instance.number = proposal.number
        return form

    def on_after_save(request, proposal):
        kw = dict(need_slug=proposal.need.slug, proposal_number=proposal.number)
        if proposal.need.community:
            kw["community_slug"] = proposal.need.community.slug
        return {'redirect': reverse('view_proposal', kwargs=kw)}

    return {'on_get': on_get, 'on_before_validation': on_before_validation,
            'on_after_save': on_after_save, 'community': community,
            'need': need}


@render_to('proposal/view.html')
def view(request, community_slug="", need_slug="", proposal_number=""):
    logger.debug('accessing proposal > view')

    community = get_object_or_None(Community, slug=community_slug)
    filters = dict(slug=need_slug)
    if community:
        filters["community"] = community
    need = get_object_or_404(Need, **filters)
    proposal = get_object_or_404(Proposal, number=proposal_number, need=need)
    return dict(proposal=proposal, community=community)
