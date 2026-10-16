export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'price',
      title: 'Price (₦)',
      type: 'number',
      validation: (R) => R.required().min(0),
    },
    {
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: "e.g. 'New', 'Sale', 'Limited'",
    },
    {
      name: 'image',
      title: 'Main Image',
      type: 'string',
      description: 'Direct image URL (Cloudinary, Unsplash, or other hosted image).',
    },
    {
      name: 'hoverImage',
      title: 'Hover Image',
      type: 'string',
      description: 'Hover image URL for product cards and gallery previews.',
    },
    {
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{type: 'collection'}],
      description: 'Select the collection this product belongs to.',
    },
    {
      name: 'category',
      title: 'Legacy Category',
      type: 'string',
      description:
        'Only used for older records. New products should use the collection field above.',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 4.5,
      validation: (R) => R.min(0).max(5),
    },
    {
      name: 'reviews',
      title: 'Review Count',
      type: 'number',
      initialValue: 0,
      validation: (R) => R.min(0),
    },
    {
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    },
    {
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    },

    // 🔑 Migration bridge — old Mongo ObjectId, kept so old carts/links keep working
    {
      name: 'legacyMongoId',
      title: 'Legacy Mongo ID',
      type: 'string',
      readOnly: true,
      hidden: ({document}) => !document?.legacyMongoId,
      description: 'Set during migration. Do not edit.',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
}
