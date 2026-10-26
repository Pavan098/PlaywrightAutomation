const eventItemSchema = {
    id:             { required: true,  type: 'number', min: 1 },
    title:          { required: true,  type: 'string', minLength: 1 },
    category:       { required: true,  type: 'string' },
    eventDate:      { required: true,  type: 'string' },
    venue:          { required: true,  type: 'string' },
    city:           { required: true,  type: 'string' },
    price:          { required: true,  type: 'string' },
    totalSeats:     { required: true,  type: 'number', min: 1 },
    availableSeats: { required: true,  type: 'number', min: 0 },
    imageUrl:       { required: false, type: 'string', nullable: true },
    isStatic:       { required: true,  type: 'boolean' },
};

const eventsListSchema = {
    data: {
        required: true,
        type: 'array',
        items: eventItemSchema,
    },
    pagination: {
        required: true,
        type: 'object',
        properties: {
            page:       { required: true, type: 'number', min: 1 },
            totalPages: { required: true, type: 'number', min: 1 },
            total:      { required: true, type: 'number', min: 0 },
            limit:      { required: true, type: 'number', min: 1 },
        },
    },
};

module.exports = { eventItemSchema, eventsListSchema };
