import "./ErrorMessage.css";

const ErrorMessage = ({
    title = "Something went wrong",
    message = "An unexpected error occurred.",
    onRetry
}) => {
    return (
        <div className="error-container">

            <div className="error-card">

                <div className="error-icon">
                    ❌
                </div>

                <h2>{title}</h2>

                <p>{message}</p>

                {
                    onRetry &&
                    <button
                        className="retry-btn"
                        onClick={onRetry}
                    >
                        Try Again
                    </button>
                }

            </div>

        </div>
    );
};

export default ErrorMessage;