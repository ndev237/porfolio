import logging

from django.conf import settings
from django.contrib import messages
from django.core.mail import EmailMessage
from django.shortcuts import render, redirect, get_object_or_404

from .forms import ContactForm
from .models import Skill, Project, Experience, Education

logger = logging.getLogger(__name__)


def home(request):
    featured_projects = Project.objects.filter(featured=True)[:3]
    skills = Skill.objects.all()
    context = {
        'featured_projects': featured_projects,
        'skills': skills,
    }
    return render(request, 'home.html', context)


def about(request):
    skills = Skill.objects.all()
    experiences = Experience.objects.all()
    educations = Education.objects.all()
    context = {
        'skills': skills,
        'experiences': experiences,
        'educations': educations,
    }
    return render(request, 'about.html', context)


def projects(request):
    all_projects = Project.objects.all()
    all_techs = sorted(set(
        tech.strip()
        for project in all_projects
        for tech in project.technologies.split(',')
        if tech.strip()
    ))
    context = {
        'projects': all_projects,
        'all_techs': all_techs,
    }
    return render(request, 'projects.html', context)


def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    return render(request, 'project_detail.html', {'project': project})


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            msg = form.save()
            _send_contact_email(msg)
            messages.success(
                request,
                "Message envoyé. Je vous réponds dès que possible.",
            )
            return redirect('contact')
    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})


def _send_contact_email(contact_message):
    """Envoie le message du formulaire vers l'adresse du propriétaire.

    Le message est déjà sauvegardé en base avant cet appel : si l'envoi
    SMTP échoue (réseau, mauvais mot de passe...), le visiteur voit
    quand même la confirmation et on garde une trace en base.
    """
    subject = f"[Portfolio] {contact_message.subject}"
    body = (
        f"Nouveau message depuis le portfolio.\n"
        f"\n"
        f"De      : {contact_message.name} <{contact_message.email}>\n"
        f"Sujet   : {contact_message.subject}\n"
        f"Reçu le : {contact_message.created_at:%Y-%m-%d %H:%M}\n"
        f"\n"
        f"---\n"
        f"{contact_message.message}\n"
    )

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_RECIPIENT_EMAIL],
        reply_to=[contact_message.email],
    )

    try:
        email.send(fail_silently=False)
    except Exception:
        logger.exception("Échec de l'envoi de l'email de contact (id=%s)", contact_message.pk)


def custom_404(request, exception=None):
    return render(request, '404.html', status=404)
