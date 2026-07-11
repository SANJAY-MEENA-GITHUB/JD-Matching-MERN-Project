import "./LoadingPage.css";

const Loading = ({
    title = "Loading...",
    message = "Please wait..."
}) => {
    return (
        <div className="loading-container">
            <div className="loading-card">
                <div className="loading-spinner"></div>

                <h2 className="loading-title">
                    {title}
                </h2>

                <p className="loading-text">
                    {message}
                </p>

                <p className="loading-note">
                    This may take a few seconds...
                </p>
            </div>
        </div>
    );
};

export default Loading;