from django.contrib import admin
from django.utils.html import format_html

from .models import Skill, Project, Experience, Education, ContactMessage

# ------------------------------------------------------------------
# Branding global du dashboard
# ------------------------------------------------------------------
admin.site.site_header = "Ndawa Mohammed — Dashboard"
admin.site.site_title = "NM // Admin"
admin.site.index_title = "// administration"


# ------------------------------------------------------------------
# Skill
# ------------------------------------------------------------------
@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_badge', 'level_bar', 'order']
    list_filter = ['category']
    list_editable = ['order']
    search_fields = ['name']
    ordering = ['category', 'order']

    @admin.display(description='Catégorie', ordering='category')
    def category_badge(self, obj):
        return format_html(
            '<span class="nm-badge nm-cat-{0}">{1}</span>',
            obj.category, obj.get_category_display()
        )

    @admin.display(description='Niveau', ordering='level')
    def level_bar(self, obj):
        return format_html(
            '<div class="nm-bar"><div class="nm-bar-fill" style="width:{0}%"></div>'
            '<span class="nm-bar-label">{0}%</span></div>',
            obj.level,
        )


# ------------------------------------------------------------------
# Project
# ------------------------------------------------------------------
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'featured_flag', 'tech_preview', 'order', 'created_at']
    list_filter = ['featured', 'created_at']
    list_editable = ['order']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'description', 'technologies']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('// identité', {
            'fields': ('title', 'slug', 'short_description'),
        }),
        ('// contenu', {
            'fields': ('description', 'technologies', 'image'),
        }),
        ('// liens', {
            'fields': ('github_url', 'live_url'),
        }),
        ('// publication', {
            'fields': ('featured', 'order'),
        }),
    )

    @admin.display(description='⭐', ordering='featured', boolean=True)
    def featured_flag(self, obj):
        return obj.featured

    @admin.display(description='Stack')
    def tech_preview(self, obj):
        items = obj.tech_list()[:3]
        extra = len(obj.tech_list()) - 3
        html = ''.join(f'<span class="nm-tag">{t}</span>' for t in items)
        if extra > 0:
            html += f'<span class="nm-tag dim">+{extra}</span>'
        return format_html(html)


# ------------------------------------------------------------------
# Experience
# ------------------------------------------------------------------
@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['position', 'company', 'date_range', 'is_current', 'order']
    list_filter = ['is_current']
    list_editable = ['order']
    search_fields = ['position', 'company']

    @admin.display(description='Période')
    def date_range(self, obj):
        end = 'présent' if obj.is_current else (obj.end_date.strftime('%b %Y') if obj.end_date else '—')
        return format_html(
            '<span class="nm-mono">{0} → {1}</span>',
            obj.start_date.strftime('%b %Y'), end,
        )


# ------------------------------------------------------------------
# Education
# ------------------------------------------------------------------
@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['degree', 'school', 'date_range', 'is_current', 'order']
    list_filter = ['is_current']
    list_editable = ['order']
    search_fields = ['degree', 'school']

    @admin.display(description='Période')
    def date_range(self, obj):
        end = 'présent' if obj.is_current else (obj.end_date.strftime('%Y') if obj.end_date else '—')
        return format_html(
            '<span class="nm-mono">{0} → {1}</span>',
            obj.start_date.strftime('%Y'), end,
        )


# ------------------------------------------------------------------
# ContactMessage
# ------------------------------------------------------------------
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['read_dot', 'name', 'email', 'subject', 'created_at']
    list_filter = ['is_read', 'created_at']
    list_editable = []
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('// expéditeur', {'fields': ('name', 'email', 'created_at')}),
        ('// contenu',    {'fields': ('subject', 'message')}),
        ('// statut',     {'fields': ('is_read',)}),
    )

    actions = ['mark_read', 'mark_unread']

    @admin.display(description='', ordering='is_read')
    def read_dot(self, obj):
        css = 'read' if obj.is_read else 'unread'
        return format_html('<span class="nm-dot nm-dot-{0}" title="{1}"></span>',
                           css, 'lu' if obj.is_read else 'non lu')

    @admin.action(description='Marquer comme lus')
    def mark_read(self, request, queryset):
        n = queryset.update(is_read=True)
        self.message_user(request, f"{n} message(s) marqué(s) comme lus.")

    @admin.action(description='Marquer comme non lus')
    def mark_unread(self, request, queryset):
        n = queryset.update(is_read=False)
        self.message_user(request, f"{n} message(s) marqué(s) comme non lus.")
