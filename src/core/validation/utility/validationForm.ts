import { z } from "zod";

export const validateForm = (schema: z.ZodSchema, data: any) => {
    const validationResponse = schema.safeParse(data);

    if (!validationResponse.success) {
        const errorArr = validationResponse.error.errors.map((error) => ({
            for: error.path[0],
            message: error.message,
        }));

        return {
            success: false,
            errors: errorArr,
        };
    }

    return {
        success: true,
        errors: [],
    };
};
