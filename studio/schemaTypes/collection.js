export default {
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Collection Name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (R) => R.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'string',
      description: 'Direct image URL for the collection banner/card.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
}
