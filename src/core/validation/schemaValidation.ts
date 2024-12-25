import { z } from "zod";

export const loginValidationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const profileValidationSchema = z.object({
    firstname: z.string().nonempty(),
    lastname: z.string().nonempty(),
    email: z.string().email(),
    contact: z.string().nonempty(),
    overview: z.string().nonempty(),
});

export const editProfileValidationSchema = z.object({
    firstname: z.string().nonempty(),
    email: z.string().email(),
    contact: z.string().nonempty(),
    overview: z.string().nonempty(),
});

export const educationValidationSchema = z.object({
    educationLevel: z.string().nonempty(),
    institution: z.string().nonempty(),
    fieldOfStudy: z.string().nonempty(),
    startMonth: z.string().nonempty(),
    finishMonth: z.string().nonempty(),
});

export const experienceValidationSchema = z.object({
    jobtitle: z.string().nonempty(),
    company: z.string().nonempty(),
    startMonth: z.string().nonempty(),
    finishMonth: z.string().nonempty(),
    overview: z.string().nonempty(),
});

export const overviewValidationSchema = z.object({
    overview: z.string().nonempty(),
});


export const portfolioValidationSchema = z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    urlPortfolio: z.string().nonempty(),
});

export const skillValidationSchema = z.object({
    skillName: z.string().nonempty(),
    level: z.string().nonempty(),
});