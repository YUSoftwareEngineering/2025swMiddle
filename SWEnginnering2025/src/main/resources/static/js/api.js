const authApi = {
    register: async (data) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const error = new Error(errData.message || '회원가입 실패');
            error.status = res.status;
            throw error;
        }

        return res.json();
    },

    login: async (data) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const error = new Error(errData.message || '로그인 실패');
            error.status = res.status;
            throw error;
        }

        return res.json();
    }
};