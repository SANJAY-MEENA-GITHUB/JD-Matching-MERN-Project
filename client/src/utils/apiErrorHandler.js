export const getErrorMessage = (err) => {

    if (err.code === "ECONNABORTED")
        return "Request timed out. Please try again.";

    if (!err.response)
        return "Cannot connect to server.";

    switch (err.response.status) {

        case 400:
            return err.response.data.error || "Bad Request.";

        case 401:
            return "Session expired. Please login again.";

        case 403:
            return "Access denied.";

        case 404:
            return "Requested resource not found.";

        case 429:
            return "Too many requests. Please wait.";

        case 500:
            return err.response.data.error || "Internal server error.";

        default:
            return "Something went wrong.";
    }

};