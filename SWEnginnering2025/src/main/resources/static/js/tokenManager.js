const tokenManager = {
    save(token) {
        localStorage.setItem('jwtToken', token);
    },
    get() {
        return localStorage.getItem('jwtToken');
    },
    clear() {
        localStorage.removeItem('jwtToken');
    }
};