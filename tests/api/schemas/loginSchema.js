const loginResponseSchema = {
    token: { required: true, type: 'string', minLength: 10 },
    userId: { required: true, type: 'string', minLength: 1 },
    message: { required: false, type: 'string' },
};

module.exports = { loginResponseSchema };
