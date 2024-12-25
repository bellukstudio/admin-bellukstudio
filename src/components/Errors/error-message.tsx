import React from "react";

interface Error {
    for: string;
    message: string;
}

interface ErrorMessageProps {
    errors: Error[];
    field: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ errors, field }) => {
    const error = errors.find((err) => err.for === field);

    return (
        error && (
            <div className="mt-1 text-xs text-red-500">
                {error.message}
            </div>
        )
    );
};

export default ErrorMessage;
