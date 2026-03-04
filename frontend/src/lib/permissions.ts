// Centralizado Roles & Permissions para o SaaS FuturAgenda

export type PlanType = 'start' | 'pro' | 'elite';

export const PERMISSIONS = {
    start: {
        maxProfessionals: 2,
        canUseWaitlist: false,
        canBlockTime: false,
        canSeeFullReports: false,
    },
    pro: {
        maxProfessionals: 10,
        canUseWaitlist: true,
        canBlockTime: true,
        canSeeFullReports: true,
    },
    elite: {
        maxProfessionals: 9999, // Ilimitado na prática
        canUseWaitlist: true,
        canBlockTime: true,
        canSeeFullReports: true,
    }
};

export const hasPermission = (plan: string, feature: keyof typeof PERMISSIONS['start']): boolean | number => {
    // Fallback de segurança: se o plano não existir ou for inválido, tratar como 'start'
    const safePlan = (PERMISSIONS[plan as PlanType] ? plan : 'start') as PlanType;
    return PERMISSIONS[safePlan][feature];
};

export const canAddProfessional = (plan: string, currentCount: number): boolean => {
    const safePlan = (PERMISSIONS[plan as PlanType] ? plan : 'start') as PlanType;
    return currentCount < PERMISSIONS[safePlan].maxProfessionals;
};
