import { useState } from 'react';

const ADMIN_PIN = '1234'; // Simple PIN for demo

export default function AdminAuth({ onAuthenticated }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === ADMIN_PIN) {
            sessionStorage.setItem('adminAuth', 'true');
            onAuthenticated();
        } else {
            setError('Invalid PIN');
            setPin('');
        }
    };

    return (
        <div className="auth-gate">
            <h2 className="auth-gate__title">Admin Access</h2>
            <form className="auth-gate__form" onSubmit={handleSubmit}>
                <input
                    type="password"
                    className="auth-gate__input"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => {
                        setPin(e.target.value);
                        setError('');
                    }}
                    maxLength={4}
                    autoFocus
                />
                <button type="submit" className="btn btn--primary">
                    Enter
                </button>
            </form>
            {error && <p className="auth-gate__error">{error}</p>}
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                Default PIN: 1234
            </p>
        </div>
    );
}
