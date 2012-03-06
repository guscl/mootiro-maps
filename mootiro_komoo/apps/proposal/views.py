#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default
import logging

from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from annoying.decorators import render_to

from community.models import Community
from need.models import Need
from proposal.models import Proposal
from proposal.forms import ProposalForm

logger = logging.getLogger(__name__)


@render_to('proposal/edit.html')
@login_required
def edit(request, community_slug="", need_slug="", proposal_number=""):
    logger.debug('acessing proposal > edit')
    # always receives all identifiers or none of them
    community = get_object_or_404(Community, slug=community_slug)
    need = get_object_or_404(Need, slug=need_slug, community=community)

    if proposal_number:
        proposal = get_object_or_404(Proposal, number=proposal_number, need=need)
    else:
        proposal = Proposal(need=need)
    if request.POST:
        form = ProposalForm(request.POST, instance=proposal)
        if form.is_valid():
            proposal = form.save()
            return redirect('view_proposal',
                    community_slug=proposal.need.community.slug,
                    need_slug=proposal.need.slug, proposal_number=proposal.number)
        else:
            return dict(form=form, need=need)
    else:
        return dict(form=ProposalForm(instance=proposal), community=community)


@render_to('proposal/view.html')
def view(request, community_slug="", need_slug="", proposal_number=""):
    logger.debug('accessing proposal > view')

    community = get_object_or_404(Community, slug=community_slug)
    need = get_object_or_404(Need, slug=need_slug, community=community)
    proposal = get_object_or_404(Proposal, number=proposal_number, need=need)
    return dict(proposal=proposal, community=community)
