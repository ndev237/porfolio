from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    """Formulaire de contact.

    Les styles sont gérés dans static/css/style.css via la classe
    `term-input` — pas de classes utilitaires inline dans les widgets.
    """

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'term-input',
                'placeholder': 'votre nom',
                'autocomplete': 'name',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'term-input',
                'placeholder': 'vous@exemple.com',
                'autocomplete': 'email',
            }),
            'subject': forms.TextInput(attrs={
                'class': 'term-input',
                'placeholder': 'objet du message',
            }),
            'message': forms.Textarea(attrs={
                'class': 'term-input',
                'placeholder': 'votre message...',
                'rows': 7,
            }),
        }
