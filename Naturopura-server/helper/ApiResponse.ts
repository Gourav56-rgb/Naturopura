class ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    responseType: string;

    constructor(success: boolean, message: string, responseType: string, data: T | null = null) {
        this.success = success;
        this.message = message;
        this.responseType = responseType;
        this.data = data;
    }

    static success<T>(message: string, data: T | null = null, responseType: string = 'SUCCESS'): ApiResponse<T> {
        return new ApiResponse<T>(true, message, responseType, data);
    }

    static error<T>(message: string, responseType: string = 'ERROR', data: T | null = null): ApiResponse<T> {
        return new ApiResponse<T>(false, message, responseType, data);
    }
}

export default ApiResponse;
