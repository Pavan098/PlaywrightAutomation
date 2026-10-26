const orderResponseSchema = {
    orders: {
        required: true,
        type: 'array',
        items: {
            _id:             { required: true,  type: 'string' },
            country:         { required: true,  type: 'string' },
            productOrderedId:{ required: true,  type: 'string' },
        },
    },
    message: { required: false, type: 'string' },
};

const createOrderSchema = {
    orders:  { required: true,  type: 'array' },
    orderid: { required: true,  type: 'string', minLength: 1 },
    message: { required: false, type: 'string' },
};

module.exports = { orderResponseSchema, createOrderSchema };
