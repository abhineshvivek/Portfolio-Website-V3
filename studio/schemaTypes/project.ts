import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'priority',
            title: 'Priority',
            type: 'number',
            description: '1 is highest priority (shows first). Use 2, 3, 4 etc. to order projects.',
            initialValue: 99,
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured',
            type: 'boolean',
            description: 'If turned on, this project gets a Featured badge and appears on the homepage.',
            initialValue: false,
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
            description: 'A short, impactful thesis statement for the hero.',
        }),
        defineField({
            name: 'impactStatement',
            title: 'Impact Statement',
            type: 'text',
            validation: (Rule) => Rule.max(200).warning('Keep it under 200 characters for the homepage card.'),
            description: 'A 2-sentence executive summary of the business value and ROI driven by this project, used for the homepage cards to hook hiring managers.',
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'bentoStats',
            title: 'Bento Stats',
            type: 'object',
            fields: [
                defineField({ name: 'role', title: 'Role', type: 'string' }),
                defineField({ name: 'timeline', title: 'Timeline', type: 'string' }),
                defineField({ name: 'platform', title: 'Platform & Deliverables', type: 'string' }),
                defineField({ name: 'coreImpact', title: 'Core Impact', type: 'string' }),
            ],
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Strong', value: 'strong' },
                            { title: 'Emphasis', value: 'em' },
                            { title: 'Code', value: 'code' },
                        ],
                    },
                },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                        }),
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'string',
                        }),
                    ],
                },
                {
                    type: 'object',
                    name: 'designSystem',
                    title: 'Design System',
                    fields: [
                        defineField({
                            name: 'colorSwatches',
                            title: 'Color Swatches',
                            type: 'array',
                            of: [{ type: 'string' }],
                            description: 'Hex color codes (e.g., #B200FF)',
                        }),
                        defineField({
                            name: 'typography',
                            title: 'Typography',
                            type: 'array',
                            of: [{ type: 'string' }],
                            description: 'Font family names (e.g., Inter, Outfit)',
                        }),
                    ],
                    preview: {
                        prepare() {
                            return { title: 'Design System Block' }
                        },
                    },
                },
                {
                    type: 'object',
                    name: 'featureBlock',
                    title: 'Feature Block',
                    fields: [
                        defineField({
                            name: 'heading',
                            title: 'Heading',
                            type: 'string',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'text',
                        }),
                        defineField({
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'imageLeft',
                            title: 'Image on Left?',
                            type: 'boolean',
                            initialValue: false,
                        }),
                    ],
                    preview: {
                        select: { title: 'heading' },
                        prepare({ title }) {
                            return { title: title || 'Feature Block' }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'takeaways',
            title: 'Takeaways',
            type: 'text',
            description: 'Project reflections and key learnings.',
            rows: 6,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'heroImage',
        },
    },
})
