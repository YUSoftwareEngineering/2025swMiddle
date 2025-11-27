// 목표 관련 API
const goalsApi = {
    // 목표 목록 조회
    getGoals: async () => {
        return await api.get('/goals');
    },

    // 목표 상세 조회
    getGoal: async (goalId) => {
        return await api.get(`/goals/${goalId}`);
    },

    // 목표 생성
    createGoal: async (goalData) => {
        return await api.post('/goals', goalData);
    },

    // 목표 수정
    updateGoal: async (goalId, goalData) => {
        return await api.put(`/goals/${goalId}`, goalData);
    },

    // 목표 삭제
    deleteGoal: async (goalId) => {
        return await api.delete(`/goals/${goalId}`);
    },

    // 목표 상태 변경
    updateGoalStatus: async (goalId, status) => {
        return await api.patch(`/goals/${goalId}/status`, { status });
    },

    // 목표 일괄 업데이트
    bulkUpdateGoals: async (goals) => {
        return await api.put('/goals/bulk', { goals });
    },
};

window.goalsApi = goalsApi;

