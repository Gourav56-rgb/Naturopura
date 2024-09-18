export type ResponseInfo = {
    message: string;
    code: string;
};

export const ResponseDefinitions: Record<string, ResponseInfo> = {
    // Error Responses
    InvalidInput: {
        message: 'Invalid input provided.',
        code: 'INVALID_INPUT'
    },
    NotFound: {
        message: 'Resource not found.',
        code: 'NOT_FOUND'
    },
    Unauthorized: {
        message: 'User is not authorized.',
        code: 'UNAUTHORIZED'
    },
    // Success Responses
    OperationSuccessful: {
        message: 'Operation completed successfully.',
        code: 'SUCCESS'
    },
    DataSaved: {
        message: 'Data has been saved successfully.',
        code: 'DATA_SAVED'
    },
    // Add other response definitions here
};
