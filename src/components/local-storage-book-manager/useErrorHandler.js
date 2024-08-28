import { useState, useCallback } from 'react';

const useErrorHandler = () => {
    const [error, setError] = useState('');

    const clearError = useCallback(() => setError(''), []);

    return { error, setError, clearError };
};

export default useErrorHandler;